import type { RedirectHop, RedirectKind } from "../app/tools/tool-types.ts";
export { escapeCsvCell, redirectReportCsv } from "../app/tools/export.ts";

export const toolLimits = {
  inputBytes: 2_048,
  perHopMs: 5_000,
  totalMs: 15_000,
  perHopBytes: 512 * 1_024,
  totalBytes: 1_572_864,
  maxRedirects: 10,
  displayValue: 2_048,
} as const;

export class ToolBoundaryError extends Error {
  readonly code: "unsupported-url" | "unsafe-destination" | "fetch-failed" | "response-too-large" | "timeout" | "hop-limit";

  constructor(
    code: "unsupported-url" | "unsafe-destination" | "fetch-failed" | "response-too-large" | "timeout" | "hop-limit",
    message: string,
  ) {
    super(message);
    this.code = code;
  }
}

const errorCopy = {
  "unsupported-url": "Enter a complete public http or https URL using a standard web port.",
  "unsafe-destination": "This destination is not eligible for public inspection.",
  "fetch-failed": "The public response could not be retrieved within the tool's limits.",
  "response-too-large": "The response exceeded the maximum inspection size.",
  timeout: "The destination did not respond within the inspection time limit.",
  "hop-limit": "The trace reached the ten-hop safety limit before a final response.",
} as const;

export function boundaryError(code: keyof typeof errorCopy): ToolBoundaryError {
  return new ToolBoundaryError(code, errorCopy[code]);
}

export function cleanRemoteText(value: string | null | undefined, limit: number = toolLimits.displayValue): string | null {
  if (value == null) return null;
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, limit);
}

function ipv4Number(value: string): number | null {
  const parts = value.split(".");
  if (parts.length !== 4 || parts.some((part) => !/^(?:0|[1-9]\d{0,2})$/.test(part))) return null;
  const octets = parts.map(Number);
  if (octets.some((part) => part > 255)) return null;
  return (((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]) >>> 0;
}

function ipv4InCidr(value: number, base: string, bits: number): boolean {
  const baseNumber = ipv4Number(base);
  if (baseNumber == null) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (value & mask) === (baseNumber & mask);
}

function expandIpv6(value: string): number[] | null {
  let source = value.toLowerCase().replace(/^\[|\]$/g, "").split("%")[0];
  const mapped = source.match(/^(.*:)(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    const ipv4 = ipv4Number(mapped[2]);
    if (ipv4 == null) return null;
    source = `${mapped[1]}${((ipv4 >>> 16) & 0xffff).toString(16)}:${(ipv4 & 0xffff).toString(16)}`;
  }
  const halves = source.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - left.length - right.length : 0;
  const parts = [...left, ...Array(Math.max(0, fill)).fill("0"), ...right];
  if (parts.length !== 8 || parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;
  return parts.map((part) => Number.parseInt(part, 16));
}

export function isProhibitedIp(value: string): boolean {
  const ipv4 = ipv4Number(value);
  if (ipv4 != null) {
    return [
      ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
      ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
      ["192.88.99.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
      ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
    ].some(([base, bits]) => ipv4InCidr(ipv4, base as string, bits as number));
  }
  const ipv6 = expandIpv6(value);
  if (!ipv6) return false;
  const isAllZero = ipv6.every((part) => part === 0);
  const isLoopback = ipv6.slice(0, 7).every((part) => part === 0) && ipv6[7] === 1;
  const isMapped = ipv6.slice(0, 5).every((part) => part === 0) && ipv6[5] === 0xffff;
  if (isMapped) {
    const mappedV4 = `${ipv6[6] >>> 8}.${ipv6[6] & 255}.${ipv6[7] >>> 8}.${ipv6[7] & 255}`;
    return isProhibitedIp(mappedV4);
  }
  return isAllZero
    || isLoopback
    || (ipv6[0] & 0xfe00) === 0xfc00
    || (ipv6[0] & 0xffc0) === 0xfe80
    || (ipv6[0] & 0xff00) === 0xff00
    || (ipv6[0] === 0x2001 && ipv6[1] === 0x0db8)
    || (ipv6[0] === 0x2001 && (ipv6[1] & 0xfff0) === 0x0010);
}

export function validatePublicUrl(raw: string): URL {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > toolLimits.inputBytes) throw boundaryError("unsupported-url");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw boundaryError("unsupported-url");
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.hash) throw boundaryError("unsupported-url");
  if ((url.protocol === "http:" && url.port && url.port !== "80") || (url.protocol === "https:" && url.port && url.port !== "443")) {
    throw boundaryError("unsupported-url");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase().replace(/\.$/, "");
  if (
    !hostname
    || hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname.endsWith(".local")
    || hostname.endsWith(".internal")
    || hostname === "metadata.google.internal"
    || isProhibitedIp(hostname)
  ) {
    throw boundaryError("unsafe-destination");
  }
  return url;
}

type HtmlSignals = {
  robotsMeta: string[];
  googlebotMeta: string[];
  htmlCanonicals: string[];
  title: string | null;
  h1Count: number;
  hasMeaningfulText: boolean;
  metaRefresh: { delaySeconds: number | null; target: string | null } | null;
};

function parseAttributes(source: string): Map<string, string> {
  const attributes = new Map<string, string>();
  let index = 0;
  while (index < source.length && !/\s/.test(source[index])) index += 1;
  while (index < source.length) {
    while (index < source.length && /\s/.test(source[index])) index += 1;
    if (index >= source.length || source[index] === "/" || source[index] === ">") break;
    const start = index;
    while (index < source.length && !/[\s=/>]/.test(source[index])) index += 1;
    const name = source.slice(start, index).toLowerCase();
    while (index < source.length && /\s/.test(source[index])) index += 1;
    let value = "";
    if (source[index] === "=") {
      index += 1;
      while (index < source.length && /\s/.test(source[index])) index += 1;
      const quote = source[index] === "'" || source[index] === '"' ? source[index++] : null;
      const valueStart = index;
      if (quote) {
        while (index < source.length && source[index] !== quote) index += 1;
        value = source.slice(valueStart, index);
        if (source[index] === quote) index += 1;
      } else {
        while (index < source.length && !/[\s>]/.test(source[index])) index += 1;
        value = source.slice(valueStart, index);
      }
    }
    if (name && !attributes.has(name)) attributes.set(name, value);
  }
  return attributes;
}

function tagEnd(source: string, start: number): number {
  let quote: string | null = null;
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === "'" || char === '"') quote = char;
    else if (char === ">") return index;
  }
  return source.length - 1;
}

function parseRefresh(value: string): { delaySeconds: number | null; target: string | null } {
  const parts = value.split(";");
  const delay = Number.parseFloat(parts[0].trim());
  const targetPart = parts.slice(1).join(";").trim().replace(/^url\s*=\s*/i, "").replace(/^['"]|['"]$/g, "");
  return {
    delaySeconds: Number.isFinite(delay) ? delay : null,
    target: cleanRemoteText(targetPart || null),
  };
}

export function parseHtmlSignals(source: string): HtmlSignals {
  const signals: HtmlSignals = {
    robotsMeta: [],
    googlebotMeta: [],
    htmlCanonicals: [],
    title: null,
    h1Count: 0,
    hasMeaningfulText: false,
    metaRefresh: null,
  };
  const hidden = new Set(["script", "style", "template", "svg", "noscript"]);
  const stack: string[] = [];
  let text = "";
  let titleText = "";
  let inTitle = false;
  let index = 0;
  while (index < source.length) {
    if (source.startsWith("<!--", index)) {
      const end = source.indexOf("-->", index + 4);
      index = end < 0 ? source.length : end + 3;
      continue;
    }
    if (source[index] !== "<") {
      const end = source.indexOf("<", index);
      const chunk = source.slice(index, end < 0 ? source.length : end);
      if (inTitle) titleText += chunk;
      if (stack.length === 0) text += ` ${chunk}`;
      index = end < 0 ? source.length : end;
      continue;
    }
    const end = tagEnd(source, index);
    const raw = source.slice(index + 1, end).trim();
    index = end + 1;
    if (!raw || raw.startsWith("!") || raw.startsWith("?")) continue;
    const closing = raw.startsWith("/");
    const name = raw.replace(/^\//, "").split(/[\s/>]/, 1)[0].toLowerCase();
    const activeHidden = stack.at(-1);
    if (activeHidden) {
      if (closing && name === activeHidden) stack.pop();
      continue;
    }
    if (closing) {
      if (name === "title") inTitle = false;
      const stackIndex = stack.lastIndexOf(name);
      if (stackIndex >= 0) stack.splice(stackIndex, 1);
      continue;
    }
    const attributes = parseAttributes(raw);
    if (name === "title") inTitle = true;
    if (name === "h1") signals.h1Count += 1;
    if (name === "meta") {
      const metaName = attributes.get("name")?.toLowerCase();
      const httpEquiv = attributes.get("http-equiv")?.toLowerCase();
      const content = cleanRemoteText(attributes.get("content"));
      if (content && metaName === "robots") signals.robotsMeta.push(content);
      if (content && metaName === "googlebot") signals.googlebotMeta.push(content);
      if (content && httpEquiv === "refresh") signals.metaRefresh = parseRefresh(content);
    }
    if (name === "link") {
      const rel = (attributes.get("rel") ?? "").toLowerCase().split(/\s+/);
      const href = cleanRemoteText(attributes.get("href"));
      if (href && rel.includes("canonical")) signals.htmlCanonicals.push(href);
    }
    if (hidden.has(name) && !raw.endsWith("/")) stack.push(name);
  }
  signals.title = cleanRemoteText(titleText.replace(/\s+/g, " "), 512);
  signals.hasMeaningfulText = text.replace(/&[a-z0-9#]+;/gi, " ").replace(/\s+/g, " ").trim().length >= 20;
  return signals;
}

export function parseLinkCanonicals(value: string | null): string[] {
  if (!value) return [];
  const segments: string[] = [];
  let start = 0;
  let quoted = false;
  let angled = false;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '"') quoted = !quoted;
    else if (!quoted && value[index] === "<") angled = true;
    else if (!quoted && value[index] === ">") angled = false;
    else if (!quoted && !angled && value[index] === ",") {
      segments.push(value.slice(start, index));
      start = index + 1;
    }
  }
  segments.push(value.slice(start));
  return segments.flatMap((segment) => {
    const targetStart = segment.indexOf("<");
    const targetEnd = segment.indexOf(">", targetStart + 1);
    if (targetStart < 0 || targetEnd < 0) return [];
    const params = segment.slice(targetEnd + 1).split(";").map((part) => part.trim());
    const rel = params.find((part) => part.toLowerCase().startsWith("rel="))?.slice(4).replace(/^['"]|['"]$/g, "");
    return rel?.toLowerCase().split(/\s+/).includes("canonical")
      ? [cleanRemoteText(segment.slice(targetStart + 1, targetEnd))].filter((item): item is string => Boolean(item))
      : [];
  });
}

export function directiveTokens(values: readonly string[]): string[] {
  return values.flatMap((value) => value.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

type RobotsRule = { allow: boolean; path: string; raw: string };
type RobotsGroup = { agents: string[]; rules: RobotsRule[] };

export function parseRobots(source: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let sawRule = false;
  for (const input of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = input.split("#", 1)[0].trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === "user-agent") {
      if (!current || sawRule) {
        current = { agents: [], rules: [] };
        groups.push(current);
        sawRule = false;
      }
      if (value) current.agents.push(value.toLowerCase());
    } else if ((field === "allow" || field === "disallow") && current) {
      sawRule = true;
      if (value) current.rules.push({ allow: field === "allow", path: value, raw: `${field[0].toUpperCase()}${field.slice(1)}: ${value}` });
    }
  }
  return groups;
}

function normalizedOctets(value: string): string {
  return value.replace(/%[0-9a-f]{2}/gi, (encoded) => {
    const code = Number.parseInt(encoded.slice(1), 16);
    const char = String.fromCharCode(code);
    return /[A-Za-z0-9._~-]/.test(char) ? char : encoded.toUpperCase();
  });
}

function ruleMatchLength(pattern: string, path: string): number {
  const anchored = pattern.endsWith("$");
  const core = normalizedOctets(anchored ? pattern.slice(0, -1) : pattern);
  let expression = "^";
  for (const char of core) expression += char === "*" ? ".*" : char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (anchored) expression += "$";
  return new RegExp(expression).test(normalizedOctets(path)) ? core.replace(/\*/g, "").length : -1;
}

export function evaluateRobots(source: string, target: URL): {
  allowed: boolean;
  matchedUserAgent: string;
  matchedRule: string | null;
} {
  if (target.pathname === "/robots.txt") return { allowed: true, matchedUserAgent: "Googlebot", matchedRule: null };
  const groups = parseRobots(source);
  const exact = groups.filter((group) => group.agents.includes("googlebot"));
  const selected = exact.length ? exact : groups.filter((group) => group.agents.includes("*"));
  const path = `${target.pathname}${target.search}`;
  const matches = selected.flatMap((group) => group.rules.map((rule) => ({ rule, length: ruleMatchLength(rule.path, path) })))
    .filter((item) => item.length >= 0)
    .sort((a, b) => b.length - a.length || Number(b.rule.allow) - Number(a.rule.allow));
  return {
    allowed: matches[0]?.rule.allow ?? true,
    matchedUserAgent: exact.length ? "Googlebot" : "*",
    matchedRule: cleanRemoteText(matches[0]?.rule.raw ?? null),
  };
}

export function redirectKind(status: number): RedirectKind {
  if (status === 301 || status === 308) return "permanent";
  if (status === 302 || status === 303 || status === 307) return "temporary";
  if (status >= 300 && status < 400) return "other-http";
  return "not-redirect";
}

export function urlChanges(current: URL, next: URL | null): RedirectHop["changes"] {
  return {
    protocol: Boolean(next && current.protocol !== next.protocol),
    hostname: Boolean(next && current.hostname !== next.hostname),
    port: Boolean(next && current.port !== next.port),
    path: Boolean(next && current.pathname !== next.pathname),
    query: Boolean(next && current.search !== next.search),
    fragmentRemoved: Boolean(current.hash),
  };
}
