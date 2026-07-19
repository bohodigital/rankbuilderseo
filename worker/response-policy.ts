const reportOnlyCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "frame-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "media-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://analytics.bohodigitalservices.com",
  "connect-src 'self' https://analytics.bohodigitalservices.com",
].join("; ");

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy-Report-Only": reportOnlyCsp,
} as const;

export const cachePolicies = {
  htmlAndRsc: "public, max-age=0, must-revalidate",
  immutableAsset: "public, max-age=31536000, immutable",
  durableStaticAsset: "public, max-age=3600, stale-while-revalidate=86400",
  preview: "private, no-store",
} as const;

const durableStaticPaths = new Set([
  "/og.png",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/site.webmanifest",
]);

const discoveryPaths = new Set(["/robots.txt", "/sitemap.xml", "/feed.xml"]);

export function cachePolicyForResponse(request: Request, response: Response, isPreviewDeployment: boolean): string | undefined {
  if (isPreviewDeployment) return cachePolicies.preview;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/assets/")) return cachePolicies.immutableAsset;
  if (durableStaticPaths.has(url.pathname)) return cachePolicies.durableStaticAsset;
  if (discoveryPaths.has(url.pathname)) return cachePolicies.htmlAndRsc;

  const contentType = response.headers.get("Content-Type")?.toLowerCase() ?? "";
  if (
    url.pathname.endsWith(".rsc")
    || url.searchParams.has("_rsc")
    || request.headers.get("RSC") === "1"
    || contentType.startsWith("text/x-component")
    || contentType.startsWith("text/html")
  ) {
    return cachePolicies.htmlAndRsc;
  }

  return undefined;
}

export function applyResponsePolicies(
  request: Request,
  response: Response,
  options: { noindexHtml?: boolean; isPreviewDeployment?: boolean } = {},
): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);

  const cachePolicy = cachePolicyForResponse(request, response, options.isPreviewDeployment ?? false);
  if (cachePolicy) headers.set("Cache-Control", cachePolicy);

  if (options.noindexHtml && headers.get("Content-Type")?.toLowerCase().startsWith("text/html")) {
    headers.set("X-Robots-Tag", "noindex");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
