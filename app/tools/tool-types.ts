export type ReportWarning = {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type IndexabilityClassification =
  | "potentially-indexable"
  | "indexing-prohibited"
  | "crawling-blocked"
  | "unavailable"
  | "redirecting-url"
  | "indeterminate";

export type IndexabilityReport = {
  requestedUrl: string;
  finalUrl?: string;
  classification: IndexabilityClassification;
  summary: string;
  fetchedAt: string;
  redirectCount: number;
  finalResponse?: {
    status: number;
    contentType: string | null;
    elapsedMs: number;
  };
  robotsTxt?: {
    url: string;
    fetchStatus: number | null;
    allowed: boolean | null;
    matchedUserAgent: string | null;
    matchedRule: string | null;
    warning: string | null;
  };
  directives: {
    robotsMeta: string[];
    googlebotMeta: string[];
    xRobotsTag: string[];
    effectiveNoindex: boolean;
  };
  canonicals: {
    html: string[];
    httpHeader: string[];
    resolved: string[];
  };
  document: {
    title: string | null;
    h1Count: number | null;
    hasMeaningfulText: boolean | null;
    sampleBytes: number;
  };
  warnings: ReportWarning[];
};

export type RedirectKind = "permanent" | "temporary" | "other-http" | "not-redirect" | "failed";

export type RedirectHop = {
  sequence: number;
  url: string;
  status: number | null;
  locationRaw: string | null;
  locationResolved: string | null;
  elapsedMs: number;
  contentType: string | null;
  changes: {
    protocol: boolean;
    hostname: boolean;
    port: boolean;
    path: boolean;
    query: boolean;
    fragmentRemoved: boolean;
  };
  redirectKind: RedirectKind;
  warnings: string[];
};

export type RedirectTraceClassification =
  | "direct-response"
  | "clean-single-redirect"
  | "redirect-chain"
  | "redirect-loop"
  | "broken-destination"
  | "hop-limit-exceeded"
  | "indeterminate";

export type RedirectTraceReport = {
  requestedUrl: string;
  finalUrl?: string;
  classification: RedirectTraceClassification;
  summary: string;
  tracedAt: string;
  hops: RedirectHop[];
  detectedRefresh?: {
    type: "http-refresh" | "meta-refresh";
    delaySeconds: number | null;
    target: string | null;
  };
  finalCanonical?: string[];
};

export const indexabilitySummaries: Record<IndexabilityClassification, string> = {
  "potentially-indexable": "The inspected response does not show an obvious crawl block, noindex directive, or non-success status. This means the page appears technically eligible under the signals this tool can observe. It does not prove that Google has indexed the URL.",
  "indexing-prohibited": "The final response contains a noindex rule in HTML or an X-Robots-Tag header. A crawler that can access the page may use that rule to keep the resource out of search results.",
  "crawling-blocked": "The robots.txt evaluation indicates that Googlebot is disallowed from fetching the final URL. Because the crawler cannot reliably read the page, this tool cannot treat page-level noindex or canonical signals as fully observable to Google.",
  unavailable: "The final URL did not return a normal successful HTML response. Review the status, redirect chain, access controls, and server behavior before evaluating page-level indexing signals.",
  "redirecting-url": "The requested URL redirects. Search systems normally process the destination rather than indexing the redirecting response as a standalone content page. Review the final URL and the full chain.",
  indeterminate: "The response could not be classified reliably within the tool's bounded fetch and parsing limits. Review the detailed fields and test the URL with an owner-authorized search-engine inspection tool.",
};

export const redirectSummaries: Record<RedirectTraceClassification, string> = {
  "direct-response": "The submitted URL returned a non-redirect response without an HTTP redirect hop.",
  "clean-single-redirect": "The source redirects directly to the final destination in one HTTP hop.",
  "redirect-chain": "The URL passes through multiple HTTP redirects before reaching the final response. Replace avoidable intermediate hops with a direct redirect where practical.",
  "redirect-loop": "A URL repeated within the trace. The chain cannot reach a stable final destination until the loop is repaired.",
  "broken-destination": "The chain ends at an error, blocked request, malformed Location value, or response that could not be fetched.",
  "hop-limit-exceeded": "The trace reached the ten-hop safety limit before a final response. Long chains are fragile for users and crawlers and should be reduced.",
  indeterminate: "The chain could not be classified reliably within the tool's bounded fetch and security limits.",
};

export type ToolApiError = {
  error: string;
  code: string;
};
