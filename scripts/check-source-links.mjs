import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { pathToFileURL } from "node:url";

import { checkContent } from "./content-check.mjs";

const DEFAULT_MAX_SOURCES = 25;
const MAX_SOURCES = 200;
const MAX_CONCURRENCY = 3;
const MAX_REDIRECTS = 5;
const MAX_BODY_BYTES = 1_000_000;
const TIMEOUT_MS = 8_000;
const IPV4_BLOCKS = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];
const IPV6_BLOCKS = [
  ["2001::", 32],
  ["2001:2::", 48],
  ["2001:10::", 28],
  ["2001:20::", 28],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["3fff::", 20],
];

function pageTitle(html) {
  const match = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
  return match?.[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function normalizedSourceTitle(value, publisher = "") {
  let normalized = value
    .replace(/&(?:amp|#38);/gi, "&")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
  if (publisher.trim()) {
    const escaped = publisher.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(new RegExp(`\\s*(?:[-|:\\u2013\\u2014]\\s*)${escaped}\\s*$`, "i"), "").trim();
  }
  return normalized.toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

async function boundedResponseText(response) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) throw new Error(`source response exceeds ${MAX_BODY_BYTES} bytes`);
  if (typeof response.arrayBuffer === "function") {
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > MAX_BODY_BYTES) throw new Error(`source response exceeds ${MAX_BODY_BYTES} bytes`);
    return bytes.toString("utf8");
  }
  const body = await response.text();
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error(`source response exceeds ${MAX_BODY_BYTES} bytes`);
  return body;
}

function ipv4Number(address) {
  const octets = address.split(".");
  if (octets.length !== 4 || octets.some((octet) => !/^\d{1,3}$/.test(octet) || Number(octet) > 255)) return undefined;
  return octets.reduce((value, octet) => ((value << 8) | Number(octet)) >>> 0, 0);
}

function ipv4InCidr(address, base, prefix) {
  const value = ipv4Number(address);
  const network = ipv4Number(base);
  if (value === undefined || network === undefined) return false;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return ((value & mask) >>> 0) === ((network & mask) >>> 0);
}

function ipv6Number(address) {
  let normalized = address.toLowerCase().split("%")[0];
  if (normalized.includes(".")) {
    const lastColon = normalized.lastIndexOf(":");
    const ipv4 = ipv4Number(normalized.slice(lastColon + 1));
    if (ipv4 === undefined) return undefined;
    normalized = `${normalized.slice(0, lastColon)}:${(ipv4 >>> 16).toString(16)}:${(ipv4 & 0xffff).toString(16)}`;
  }
  const halves = normalized.split("::");
  if (halves.length > 2) return undefined;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const omitted = halves.length === 2 ? 8 - left.length - right.length : 0;
  if (omitted < 0 || (halves.length === 1 && left.length !== 8)) return undefined;
  const groups = [...left, ...Array(omitted).fill("0"), ...right];
  if (groups.length !== 8 || groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return undefined;
  return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}

function ipv6InCidr(address, base, prefix) {
  const value = ipv6Number(address);
  const network = ipv6Number(base);
  if (value === undefined || network === undefined) return false;
  const shift = BigInt(128 - prefix);
  return (value >> shift) === (network >> shift);
}

export function isPublicAddress(rawAddress) {
  const address = rawAddress.replace(/^\[|\]$/g, "");
  const family = isIP(address);
  if (family === 4) return !IPV4_BLOCKS.some(([base, prefix]) => ipv4InCidr(address, base, prefix));
  if (family !== 6 || !ipv6InCidr(address, "2000::", 3)) return false;
  return !IPV6_BLOCKS.some(([base, prefix]) => ipv6InCidr(address, base, prefix));
}

async function defaultResolveHost(hostname) {
  return lookup(hostname, { all: true, verbatim: true });
}

function localhostLike(hostname) {
  const host = hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  return host === "localhost"
    || host.endsWith(".localhost")
    || host.endsWith(".local")
    || host.endsWith(".internal")
    || host.endsWith(".lan")
    || host.endsWith(".home")
    || host.endsWith(".home.arpa")
    || host.endsWith(".invalid")
    || host.endsWith(".test")
    || host.endsWith(".example")
    || (!isIP(host) && !host.includes("."));
}

export async function resolvePublicTarget(raw, resolveHost = defaultResolveHost) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`unsafe source target: malformed URL ${raw}`);
  }
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("unsafe source target: HTTPS without URL credentials is required");
  }
  if (url.port && url.port !== "443") throw new Error("unsafe source target: only the default HTTPS port is allowed");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (localhostLike(hostname)) throw new Error(`unsafe source target: localhost-like hostname ${url.hostname}`);

  const literalFamily = isIP(hostname);
  const answers = literalFamily
    ? [{ address: hostname, family: literalFamily }]
    : await resolveHost(hostname);
  if (!Array.isArray(answers) || answers.length === 0) throw new Error(`unsafe source target: ${hostname} returned no DNS addresses`);
  const normalized = answers.map((answer) => typeof answer === "string"
    ? { address: answer, family: isIP(answer) }
    : { address: answer.address, family: isIP(answer.address) });
  const unsafe = normalized.find(({ address, family }) => !family || !isPublicAddress(address));
  if (unsafe) throw new Error(`unsafe source target: ${hostname} resolves to non-public address ${unsafe.address}`);
  return { url: url.href, hostname, ...normalized[0] };
}

function pinnedHttpsRequest(target, options) {
  return new Promise((resolve, reject) => {
    const request = httpsRequest(target.url, {
      ...options,
      lookup(_hostname, lookupOptions, callback) {
        if (lookupOptions?.all) callback(null, [{ address: target.address, family: target.family }]);
        else callback(null, target.address, target.family);
      },
      servername: isIP(target.hostname) ? undefined : target.hostname,
    }, (response) => {
      const chunks = [];
      let size = 0;
      response.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
          request.destroy(new Error(`source response exceeds ${MAX_BODY_BYTES} bytes`));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => {
        const status = response.statusCode ?? 0;
        resolve({
          status,
          ok: status >= 200 && status < 300,
          headers: {
            get(name) {
              const value = response.headers[name.toLowerCase()];
              return Array.isArray(value) ? value.join(", ") : value ?? null;
            },
          },
          async text() {
            return Buffer.concat(chunks).toString("utf8");
          },
        });
      });
    });
    request.setTimeout(TIMEOUT_MS, () => request.destroy(new Error(`source request timed out after ${TIMEOUT_MS}ms`)));
    request.on("error", reject);
    request.end();
  });
}

export async function inspectSource(source, { fetchImpl, resolveHost = defaultResolveHost, requestImpl = pinnedHttpsRequest } = {}) {
  let current = source.url;
  const redirects = [];
  for (let step = 0; step <= MAX_REDIRECTS; step += 1) {
    const target = await resolvePublicTarget(current, resolveHost);
    const requestOptions = {
      headers: { "user-agent": "RankBuilderSEO-SourceReview/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    };
    const response = fetchImpl
      ? await fetchImpl(target.url, requestOptions)
      : await requestImpl(target, requestOptions);
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { ...source, status: response.status, category: "redirect-error", finalUrl: target.url, redirects, issue: "redirect has no Location header" };
      const next = new URL(location, target.url).href;
      redirects.push(next);
      current = next;
      continue;
    }
    if (!response.ok) return { ...source, status: response.status, category: "http-error", finalUrl: target.url, redirects, issue: `HTTP ${response.status}` };
    const contentType = response.headers.get("content-type") ?? "";
    const title = contentType.includes("text/html") ? pageTitle(await boundedResponseText(response)) : undefined;
    const expectedTitle = normalizedSourceTitle(source.title, source.publisher);
    const observedTitle = title ? normalizedSourceTitle(title, source.publisher) : undefined;
    const titleChanged = observedTitle && !observedTitle.includes(expectedTitle) && !expectedTitle.includes(observedTitle);
    return {
      ...source,
      status: response.status,
      category: titleChanged ? "title-review" : "ok",
      finalUrl: target.url,
      redirects,
      observedTitle: title,
      issue: titleChanged
        ? "source title changed or needs editorial review"
        : undefined,
    };
  }
  return { ...source, status: 0, category: "redirect-error", finalUrl: current, redirects, issue: `more than ${MAX_REDIRECTS} redirects` };
}

function failureCategory(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/timed out|timeout|abort/i.test(message) || error?.name === "AbortError" || error?.name === "TimeoutError") return "timeout";
  if (/unsafe source target/i.test(message)) return "unsafe-target";
  if (/exceeds .* bytes/i.test(message)) return "oversized-response";
  return "network-error";
}

async function mapConcurrent(values, concurrency, operation) {
  const output = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await operation(values[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return output;
}

export async function runSourceLinkCheck({
  fetchImpl,
  resolveHost = defaultResolveHost,
  requestImpl = pinnedHttpsRequest,
  maxSources = DEFAULT_MAX_SOURCES,
  batch = 1,
  concurrency = 1,
  sources,
} = {}) {
  if (!Number.isInteger(maxSources) || maxSources < 1 || maxSources > MAX_SOURCES) throw new Error(`--max-sources must be an integer from 1 to ${MAX_SOURCES}`);
  if (!Number.isInteger(batch) || batch < 1) throw new Error("--batch must be a positive integer");
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_CONCURRENCY) throw new Error(`--concurrency must be an integer from 1 to ${MAX_CONCURRENCY}`);
  let citations = sources;
  if (!citations) {
    const registry = await checkContent();
    citations = [
      ...registry.publications.flatMap((publication) => publication.citations),
      ...registry.glossary.flatMap((entry) => entry.citations),
    ];
  }
  const unique = [...new Map(citations.map((source) => [source.url, source])).values()]
    .sort((left, right) => left.url.localeCompare(right.url) || left.id.localeCompare(right.id));
  const start = (batch - 1) * maxSources;
  const selected = unique.slice(start, start + maxSources);
  const results = await mapConcurrent(selected, concurrency, async (source) => {
    try {
      return await inspectSource(source, { fetchImpl, resolveHost, requestImpl });
    } catch (error) {
      return {
        ...source,
        status: 0,
        category: failureCategory(error),
        finalUrl: source.url,
        redirects: [],
        issue: error instanceof Error ? error.message : String(error),
      };
    }
  });
  return {
    results,
    total: unique.length,
    batch,
    maxSources,
    concurrency,
    checkedStart: selected.length ? start + 1 : 0,
    checkedEnd: start + selected.length,
    remaining: Math.max(0, unique.length - start - selected.length),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const valueFor = (name, fallback) => {
    const index = args.indexOf(name);
    if (index < 0) return fallback;
    if (!args[index + 1] || args[index + 1].startsWith("--")) throw new Error(`${name} requires a value`);
    return Number(args[index + 1]);
  };
  const known = new Set(["--strict", "--json", "--max-sources", "--batch", "--concurrency"]);
  for (let index = 0; index < args.length; index += 1) {
    if (!args[index].startsWith("--")) continue;
    if (!known.has(args[index])) throw new Error(`unknown option: ${args[index]}`);
    if (["--max-sources", "--batch", "--concurrency"].includes(args[index])) index += 1;
  }
  const report = await runSourceLinkCheck({
    maxSources: valueFor("--max-sources", DEFAULT_MAX_SOURCES),
    batch: valueFor("--batch", 1),
    concurrency: valueFor("--concurrency", 1),
  });
  if (args.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else for (const result of report.results) {
    const notes = [
      result.redirects.length ? `redirects: ${result.redirects.join(" -> ")}` : "",
      result.issue ?? "",
    ].filter(Boolean).join("; ");
    console.log(`${result.issue ? "REVIEW" : "OK"} [${result.category}] ${result.url}${notes ? ` (${notes})` : ""}`);
  }
  const issues = report.results.filter((result) => result.issue);
  if (!args.includes("--json")) console.log(`Checked ${report.results.length} source URLs (${report.checkedStart}-${report.checkedEnd} of ${report.total}); ${issues.length} need review; ${report.remaining} remain. This periodic check is advisory.`);
  if (args.includes("--strict") && issues.length > 0) process.exitCode = 1;
}
