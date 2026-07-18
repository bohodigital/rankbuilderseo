/** Cloudflare Worker entry point for Rank Builder SEO. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { publications } from "../app/content/publications";

const canonicalHost = "rankbuilderseo.com";
const productionPagesHost = "rankbuilderseo.pages.dev";
const retiredGuideSlugs = new Set(publications.map((publication) => publication.slug));
const reportOnlyCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://analytics.bohodigitalservices.com",
  "connect-src 'self' https://analytics.bohodigitalservices.com",
].join("; ");

interface Env {
  ASSETS: Fetcher;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

function withSecurityHeaders(response: Response, noindexHtml = false): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "0");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  headers.set("Content-Security-Policy-Report-Only", reportOnlyCsp);
  if (noindexHtml && headers.get("Content-Type")?.toLowerCase().startsWith("text/html")) {
    headers.set("X-Robots-Tag", "noindex");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const isPagesDeploymentHost = url.hostname.endsWith(`.${productionPagesHost}`);

    const redirectToCanonical = (pathname: string) => {
      url.protocol = "https:";
      url.hostname = canonicalHost;
      url.port = "";
      url.pathname = pathname;
      return withSecurityHeaders(Response.redirect(url, 301));
    };

    const guideMatch = url.pathname.match(/^\/guides\/([^/]+)\/?$/);
    if (url.pathname === "/guides" || url.pathname === "/guides/") {
      return redirectToCanonical("/articles");
    }
    if (guideMatch && retiredGuideSlugs.has(guideMatch[1])) {
      return redirectToCanonical(`/articles/${guideMatch[1]}`);
    }

    if (url.hostname === "www.rankbuilderseo.com" || url.hostname === productionPagesHost) {
      return redirectToCanonical(url.pathname);
    }

    // Pages advanced mode sends every request through this worker. Serve the
    // immutable client build from the ASSETS binding before the app router so
    // stylesheets and hydration bundles do not fall through to a Vinext 404.
    if (url.pathname.startsWith("/assets/") || url.pathname === "/og.png") {
      return withSecurityHeaders(await env.ASSETS.fetch(request));
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(response);
    }

    return withSecurityHeaders(
      await handler.fetch(request, env, ctx),
      isPagesDeploymentHost,
    );
  },
};

export default worker;
