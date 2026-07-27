import {
  indexabilitySummaries,
  redirectSummaries,
  type IndexabilityClassification,
  type IndexabilityReport,
  type RedirectHop,
  type RedirectTraceClassification,
  type RedirectTraceReport,
  type ReportWarning,
  type ToolApiError,
} from "../app/tools/tool-types.ts";
import {
  ToolBoundaryError,
  boundaryError,
  cleanRemoteText,
  evaluateRobots,
  isProhibitedIp,
  parseHtmlSignals,
  parseLinkCanonicals,
  redirectKind,
  toolLimits,
  urlChanges,
  validatePublicUrl,
} from "./tool-core.ts";

type RateLimitBinding = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type ToolEnv = {
  TOOL_RATE_LIMITER?: RateLimitBinding;
};

export type ToolFetchDependencies = {
  fetcher: typeof fetch;
  resolver: (hostname: string, signal: AbortSignal) => Promise<string[]>;
  now: () => number;
};

type TraceOutcome = {
  hops: RedirectHop[];
  finalUrl?: string;
  redirectCount: number;
  finalStatus?: number;
  finalContentType?: string | null;
  finalElapsedMs?: number;
  finalHeaders?: Headers;
  body: string;
  bytes: number;
  loop: boolean;
  hopLimit: boolean;
  failed: boolean;
  failureCode?: string;
};

const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const rateWindows = new Map<string, number[]>();

export function resetMemoryRateLimits(): void {
  rateWindows.clear();
}

export function checkMemoryRateLimit(key: string, now = Date.now()): boolean {
  const dayAgo = now - 86_400_000;
  const tenMinutesAgo = now - 600_000;
  const timestamps = (rateWindows.get(key) ?? []).filter((timestamp) => timestamp > dayAgo);
  if (timestamps.length >= 100 || timestamps.filter((timestamp) => timestamp > tenMinutesAgo).length >= 10) {
    rateWindows.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  rateWindows.set(key, timestamps);
  return true;
}

function apiHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex",
  };
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status, headers: apiHeaders() });
}

function errorResponse(error: ToolBoundaryError): Response {
  const status = error.code === "unsafe-destination" ? 403
    : error.code === "response-too-large" ? 413
      : error.code === "timeout" ? 408
        : error.code === "hop-limit" ? 422
          : error.code === "fetch-failed" ? 502
            : 400;
  return jsonResponse({ error: error.message, code: error.code } satisfies ToolApiError, status);
}

function isIpLiteral(hostname: string): boolean {
  return /^[\d.]+$/.test(hostname) || hostname.includes(":");
}

export async function dohResolver(hostname: string, signal: AbortSignal): Promise<string[]> {
  const query = async (type: "A" | "AAAA") => {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=${type}&edns_client_subnet=0.0.0.0/0`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!response.ok) throw boundaryError("fetch-failed");
    const payload = await response.json() as {
      Status?: number;
      Answer?: Array<{ type?: number; data?: string }>;
    };
    if (payload.Status !== 0 && payload.Status !== 3) throw boundaryError("fetch-failed");
    return (payload.Answer ?? [])
      .filter((answer) => answer.type === (type === "A" ? 1 : 28) && typeof answer.data === "string")
      .map((answer) => answer.data as string);
  };
  const [ipv4, ipv6] = await Promise.all([query("A"), query("AAAA")]);
  const addresses = [...ipv4, ...ipv6];
  if (addresses.length === 0) throw boundaryError("fetch-failed");
  return addresses;
}

const productionDependencies: ToolFetchDependencies = {
  fetcher: (input, init) => fetch(input, init),
  resolver: dohResolver,
  now: Date.now,
};

async function validateResolvedTarget(url: URL, dependencies: ToolFetchDependencies, deadline: number): Promise<void> {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (isIpLiteral(hostname)) {
    if (isProhibitedIp(hostname)) throw boundaryError("unsafe-destination");
    return;
  }
  const remaining = Math.min(toolLimits.perHopMs, deadline - dependencies.now());
  if (remaining <= 0) throw boundaryError("timeout");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), remaining);
  let addresses: string[];
  try {
    addresses = await dependencies.resolver(hostname, controller.signal);
  } finally {
    clearTimeout(timer);
  }
  if (addresses.length === 0) throw boundaryError("fetch-failed");
  if (addresses.some(isProhibitedIp)) throw boundaryError("unsafe-destination");
}

async function readBoundedBody(response: Response, remainingTotal: number): Promise<{ text: string; bytes: number }> {
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const maximum = Math.min(toolLimits.perHopBytes, remainingTotal);
  if (contentLength > maximum) {
    void response.body?.cancel();
    throw boundaryError("response-too-large");
  }
  if (!response.body) return { text: "", bytes: 0 };
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    bytes += result.value.byteLength;
    if (bytes > maximum) {
      void reader.cancel();
      throw boundaryError("response-too-large");
    }
    chunks.push(result.value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { text: new TextDecoder("utf-8", { fatal: false }).decode(body), bytes };
}

function hopWarnings(current: URL, next: URL | null, status: number): string[] {
  const warnings: string[] = [];
  if (current.protocol === "https:" && next?.protocol === "http:") warnings.push("HTTPS downgrade");
  if (next && current.hostname !== next.hostname) warnings.push("Hostname changed");
  if (next && current.search && !next.search) warnings.push("Query string removed");
  if (redirectKind(status) === "temporary") warnings.push("Temporary redirect");
  return warnings;
}

async function performTrace(
  raw: string,
  dependencies: ToolFetchDependencies,
  initialBytes = 0,
  requestDeadline?: number,
): Promise<TraceOutcome> {
  const deadline = requestDeadline ?? dependencies.now() + toolLimits.totalMs;
  let current = validatePublicUrl(raw);
  let bytes = initialBytes;
  let redirects = 0;
  const visited = new Set<string>();
  const hops: RedirectHop[] = [];

  while (true) {
    const normalized = current.href;
    if (visited.has(normalized)) {
      return { hops, redirectCount: redirects, finalUrl: normalized, body: "", bytes, loop: true, hopLimit: false, failed: false };
    }
    visited.add(normalized);
    await validateResolvedTarget(current, dependencies, deadline);
    const remaining = Math.min(toolLimits.perHopMs, deadline - dependencies.now());
    if (remaining <= 0) throw boundaryError("timeout");
    const started = dependencies.now();
    let response: Response;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), remaining);
    try {
      response = await dependencies.fetcher(current.href, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.2",
        },
      });
    } catch (error) {
      if (error instanceof ToolBoundaryError) throw error;
      if (
        error instanceof DOMException
        && (error.name === "AbortError" || error.name === "TimeoutError")
      ) {
        throw boundaryError("timeout");
      }
      throw boundaryError("fetch-failed");
    } finally {
      clearTimeout(timer);
    }
    const elapsedMs = Math.max(0, dependencies.now() - started);
    const rawLocation = cleanRemoteText(response.headers.get("location"));
    const kind = redirectKind(response.status);
    let next: URL | null = null;
    let malformed = false;
    if (redirectStatuses.has(response.status)) {
      if (!rawLocation) malformed = true;
      else {
        try {
          next = validatePublicUrl(new URL(rawLocation, current).href);
        } catch (error) {
          if (error instanceof ToolBoundaryError && error.code === "unsafe-destination") {
            void response.body?.cancel();
            const hop: RedirectHop = {
              sequence: hops.length + 1,
              url: cleanRemoteText(current.href) ?? current.href,
              status: response.status,
              locationRaw: rawLocation,
              locationResolved: cleanRemoteText(new URL(rawLocation, current).href),
              elapsedMs,
              contentType: cleanRemoteText(response.headers.get("content-type")),
              changes: urlChanges(current, null),
              redirectKind: kind,
              warnings: ["Unsafe redirect target"],
            };
            return { hops: [...hops, hop], redirectCount: redirects, body: "", bytes, loop: false, hopLimit: false, failed: true, failureCode: error.code };
          }
          malformed = true;
        }
      }
    }
    const warnings = hopWarnings(current, next, response.status);
    if (malformed) warnings.push(rawLocation ? "Malformed Location" : "Missing Location");
    const hop: RedirectHop = {
      sequence: hops.length + 1,
      url: cleanRemoteText(current.href) ?? current.href,
      status: response.status,
      locationRaw: rawLocation,
      locationResolved: cleanRemoteText(next?.href),
      elapsedMs,
      contentType: cleanRemoteText(response.headers.get("content-type")),
      changes: urlChanges(current, next),
      redirectKind: kind,
      warnings,
    };
    hops.push(hop);

    if (redirectStatuses.has(response.status)) {
      void response.body?.cancel();
      if (!next || malformed) {
        return { hops, redirectCount: redirects, body: "", bytes, loop: false, hopLimit: false, failed: true };
      }
      if (visited.has(next.href)) {
        return { hops, redirectCount: redirects + 1, finalUrl: next.href, body: "", bytes, loop: true, hopLimit: false, failed: false };
      }
      if (redirects >= toolLimits.maxRedirects) {
        return { hops, redirectCount: redirects, finalUrl: current.href, body: "", bytes, loop: false, hopLimit: true, failed: false };
      }
      redirects += 1;
      current = next;
      continue;
    }

    const contentType = cleanRemoteText(response.headers.get("content-type"));
    const normalizedContentType = contentType?.toLowerCase() ?? "";
    const shouldRead = normalizedContentType.includes("html")
      || normalizedContentType.startsWith("text/plain");
    const bodyResult = shouldRead
      ? await readBoundedBody(response, toolLimits.totalBytes - bytes)
      : (void response.body?.cancel(), { text: "", bytes: 0 });
    bytes += bodyResult.bytes;
    return {
      hops,
      finalUrl: current.href,
      redirectCount: redirects,
      finalStatus: response.status,
      finalContentType: contentType,
      finalElapsedMs: elapsedMs,
      finalHeaders: response.headers,
      body: bodyResult.text,
      bytes,
      loop: false,
      hopLimit: false,
      failed: false,
    };
  }
}

function classifyTrace(outcome: TraceOutcome): RedirectTraceClassification {
  if (outcome.loop) return "redirect-loop";
  if (outcome.hopLimit) return "hop-limit-exceeded";
  if (outcome.failed || outcome.finalStatus == null || outcome.finalStatus >= 400) return "broken-destination";
  if (outcome.redirectCount === 0) return "direct-response";
  if (outcome.redirectCount === 1) return "clean-single-redirect";
  return "redirect-chain";
}

function detectedRefresh(outcome: TraceOutcome): RedirectTraceReport["detectedRefresh"] {
  const header = cleanRemoteText(outcome.finalHeaders?.get("refresh"));
  if (header) {
    const parts = header.split(";");
    const delay = Number.parseFloat(parts[0]);
    return {
      type: "http-refresh",
      delaySeconds: Number.isFinite(delay) ? delay : null,
      target: cleanRemoteText(
        parts.slice(1).join(";").trim().replace(/^url\s*=\s*/i, ""),
      ),
    };
  }
  const meta = outcome.body ? parseHtmlSignals(outcome.body).metaRefresh : null;
  return meta?.delaySeconds === 0 ? { type: "meta-refresh", ...meta } : undefined;
}

export async function createRedirectTrace(
  raw: string,
  dependencies: ToolFetchDependencies = productionDependencies,
): Promise<RedirectTraceReport> {
  const requested = validatePublicUrl(raw).href;
  const outcome = await performTrace(requested, dependencies);
  const classification = classifyTrace(outcome);
  const redirectKinds = new Set(outcome.hops.filter((hop) => hop.redirectKind === "permanent" || hop.redirectKind === "temporary").map((hop) => hop.redirectKind));
  if (outcome.redirectCount > 1) outcome.hops[0]?.warnings.push("Multiple redirect hops");
  if (redirectKinds.size > 1) outcome.hops[0]?.warnings.push("Mixed permanent and temporary redirects");
  if (outcome.hops.length > 5) outcome.hops[0]?.warnings.push("More than five responses");
  const html = outcome.body ? parseHtmlSignals(outcome.body) : null;
  const finalCanonical = html?.htmlCanonicals.flatMap((canonical) => {
    try {
      return [new URL(canonical, outcome.finalUrl).href];
    } catch {
      return [];
    }
  });
  return {
    requestedUrl: requested,
    ...(outcome.finalUrl ? { finalUrl: outcome.finalUrl } : {}),
    classification,
    summary: redirectSummaries[classification],
    tracedAt: new Date(dependencies.now()).toISOString(),
    hops: outcome.hops,
    ...(detectedRefresh(outcome) ? { detectedRefresh: detectedRefresh(outcome) } : {}),
    ...(finalCanonical?.length ? { finalCanonical } : {}),
  };
}

function warning(code: string, severity: ReportWarning["severity"], message: string): ReportWarning {
  return { code, severity, message };
}

function hasNoindex(values: readonly string[]): boolean {
  return values.some((value) => /(?:^|[:,\s])(?:noindex|none)(?:$|[,\s])/i.test(value));
}

async function robotsResult(
  finalUrl: URL,
  dependencies: ToolFetchDependencies,
  usedBytes: number,
  requestDeadline: number,
): Promise<NonNullable<IndexabilityReport["robotsTxt"]>> {
  const robotsUrl = new URL("/robots.txt", finalUrl);
  try {
    const outcome = await performTrace(
      robotsUrl.href,
      dependencies,
      usedBytes,
      requestDeadline,
    );
    if (outcome.finalStatus && outcome.finalStatus >= 200 && outcome.finalStatus < 300) {
      const evaluation = evaluateRobots(outcome.body, finalUrl);
      return {
        url: robotsUrl.href,
        fetchStatus: outcome.finalStatus,
        allowed: evaluation.allowed,
        matchedUserAgent: evaluation.matchedUserAgent,
        matchedRule: evaluation.matchedRule,
        warning: null,
      };
    }
    return {
      url: robotsUrl.href,
      fetchStatus: outcome.finalStatus ?? null,
      allowed: null,
      matchedUserAgent: null,
      matchedRule: null,
      warning: "Robots.txt did not return a successful response; no disallow rule was inferred.",
    };
  } catch {
    return {
      url: robotsUrl.href,
      fetchStatus: null,
      allowed: null,
      matchedUserAgent: null,
      matchedRule: null,
      warning: "Robots.txt could not be retrieved within the inspection limits.",
    };
  }
}

export async function createIndexabilityReport(
  raw: string,
  dependencies: ToolFetchDependencies = productionDependencies,
): Promise<IndexabilityReport> {
  const requested = validatePublicUrl(raw).href;
  const requestDeadline = dependencies.now() + toolLimits.totalMs;
  const outcome = await performTrace(requested, dependencies, 0, requestDeadline);
  if (outcome.failed || outcome.finalStatus == null || !outcome.finalUrl) throw boundaryError("fetch-failed");
  const finalUrl = new URL(outcome.finalUrl);
  const html = outcome.finalContentType?.toLowerCase().includes("html") ? parseHtmlSignals(outcome.body) : null;
  const robots = await robotsResult(
    finalUrl,
    dependencies,
    outcome.bytes,
    requestDeadline,
  );
  const xRobotsTag = [cleanRemoteText(outcome.finalHeaders?.get("x-robots-tag"))].filter((value): value is string => Boolean(value));
  const robotsMeta = html?.robotsMeta ?? [];
  const googlebotMeta = html?.googlebotMeta ?? [];
  const effectiveNoindex = hasNoindex([...robotsMeta, ...googlebotMeta, ...xRobotsTag]);
  const httpHeader = parseLinkCanonicals(outcome.finalHeaders?.get("link") ?? null);
  const htmlCanonicals = html?.htmlCanonicals ?? [];
  const resolved: string[] = [];
  const warnings: ReportWarning[] = [];
  for (const canonical of [...htmlCanonicals, ...httpHeader]) {
    try {
      const target = new URL(canonical, finalUrl);
      resolved.push(target.href);
      if (target.hostname !== finalUrl.hostname) warnings.push(warning("cross-host-canonical", "warning", "A canonical points to another hostname."));
      if (finalUrl.protocol === "https:" && target.protocol === "http:") warnings.push(warning("http-canonical-downgrade", "error", "A canonical downgrades from HTTPS to HTTP."));
    } catch {
      warnings.push(warning("canonical-malformed", "error", "A canonical declaration could not be resolved."));
    }
  }
  if (outcome.redirectCount > 0) warnings.push(warning("redirected-request", "info", "The submitted URL redirected before the final response."));
  if (robots.warning) warnings.push(warning("robots-unavailable", "warning", robots.warning));
  if (robots.allowed === false && effectiveNoindex) warnings.push(warning("robots-block-with-noindex", "warning", "Robots.txt blocks the crawler expected to observe the noindex directive."));
  if (htmlCanonicals.length > 1) warnings.push(warning("multiple-html-canonicals", "error", "Multiple HTML canonical declarations were found."));
  if (htmlCanonicals.length && httpHeader.length && new Set(resolved).size > 1) warnings.push(warning("canonical-header-conflict", "error", "HTML and HTTP canonical declarations disagree."));
  if (!html) warnings.push(warning("non-html-response", "warning", "The final response is not declared as HTML."));
  if (outcome.finalStatus === 200 && html && !html.hasMeaningfulText) warnings.push(warning("empty-success-response", "error", "The successful HTML response has no meaningful returned text."));
  if (html && html.h1Count > 1) warnings.push(warning("multiple-h1", "warning", "The returned HTML contains multiple H1 headings."));
  if (html && !html.title) warnings.push(warning("missing-title", "warning", "The returned HTML has no document title."));
  warnings.push(warning("javascript-not-rendered", "info", "This inspection does not execute JavaScript."));

  let classification: IndexabilityClassification;
  if (outcome.finalStatus < 200 || outcome.finalStatus >= 300) classification = "unavailable";
  else if (outcome.redirectCount > 0 && !html) classification = "redirecting-url";
  else if (robots.allowed === false) classification = "crawling-blocked";
  else if (effectiveNoindex) classification = "indexing-prohibited";
  else if (outcome.finalStatus === 200 && html?.hasMeaningfulText) classification = "potentially-indexable";
  else classification = "indeterminate";

  return {
    requestedUrl: requested,
    finalUrl: finalUrl.href,
    classification,
    summary: indexabilitySummaries[classification],
    fetchedAt: new Date(dependencies.now()).toISOString(),
    redirectCount: outcome.redirectCount,
    finalResponse: {
      status: outcome.finalStatus,
      contentType: outcome.finalContentType ?? null,
      elapsedMs: outcome.finalElapsedMs ?? 0,
    },
    robotsTxt: robots,
    directives: {
      robotsMeta,
      googlebotMeta,
      xRobotsTag,
      effectiveNoindex,
    },
    canonicals: {
      html: htmlCanonicals,
      httpHeader,
      resolved: [...new Set(resolved)],
    },
    document: {
      title: html?.title ?? null,
      h1Count: html?.h1Count ?? null,
      hasMeaningfulText: html?.hasMeaningfulText ?? null,
      sampleBytes: outcome.bytes,
    },
    warnings,
  };
}

async function enforceRateLimit(request: Request, env: ToolEnv): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!checkMemoryRateLimit(ip)) return false;
  if (env.TOOL_RATE_LIMITER) {
    const result = await env.TOOL_RATE_LIMITER.limit({ key: `${ip}:rankbuilder-tools` });
    if (!result.success) return false;
  }
  return true;
}

function validSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function handleToolApi(request: Request, env: ToolEnv): Promise<Response | null> {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "");
  const tool = pathname === "/api/tools/indexability-inspector" ? "indexability"
    : pathname === "/api/tools/redirect-chain-visualizer" ? "redirects"
      : null;
  if (!tool) return null;
  if (request.method !== "POST") return jsonResponse({ error: "POST JSON is required.", code: "method-not-allowed" }, 405);
  if (!validSameOrigin(request)) return jsonResponse({ error: "Same-origin requests are required.", code: "origin-rejected" }, 403);
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "A JSON request body is required.", code: "content-type" }, 415);
  }
  if (!await enforceRateLimit(request, env)) {
    return jsonResponse({ error: "Too many inspection requests. Wait before trying again.", code: "rate-limited" }, 429);
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 4_096) return jsonResponse({ error: "The request body is too large.", code: "request-too-large" }, 413);
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "A valid JSON request body is required.", code: "invalid-json" }, 400);
  }
  const submittedUrl = typeof input === "object" && input !== null && "url" in input
    ? (input as { url?: unknown }).url
    : undefined;
  if (typeof submittedUrl !== "string") return errorResponse(boundaryError("unsupported-url"));
  try {
    return jsonResponse(tool === "indexability"
      ? await createIndexabilityReport(submittedUrl)
      : await createRedirectTrace(submittedUrl));
  } catch (error) {
    return errorResponse(error instanceof ToolBoundaryError ? error : boundaryError("fetch-failed"));
  }
}
