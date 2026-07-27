/** Cloudflare Worker entry point for Rank Builder SEO. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { legacyGuideTarget } from "../app/content/legacy-guide-redirects";
import { applyResponsePolicies } from "./response-policy";
import { handleToolApi, type ToolEnv } from "./tool-api";

const canonicalHost = "rankbuilderseo.com";
const productionPagesHost = "rankbuilderseo.pages.dev";
const toolPagePaths = new Set([
  "/tools/indexability-inspector",
  "/tools/redirect-chain-visualizer",
]);

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env extends ToolEnv {
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
      return applyResponsePolicies(request, Response.redirect(url, 301));
    };

    const guideMatch = url.pathname.match(/^\/guides\/([^/]+)\/?$/);
    if (url.pathname === "/guides" || url.pathname === "/guides/") {
      return redirectToCanonical("/articles");
    }
    const historicalGuideTarget = guideMatch ? legacyGuideTarget(guideMatch[1]) : undefined;
    if (historicalGuideTarget) {
      return redirectToCanonical(historicalGuideTarget);
    }

    const canonicalToolPath = url.pathname.endsWith("/")
      && toolPagePaths.has(url.pathname.slice(0, -1))
      ? url.pathname.slice(0, -1)
      : url.pathname;

    if (url.hostname === "www.rankbuilderseo.com" || url.hostname === productionPagesHost) {
      return redirectToCanonical(canonicalToolPath);
    }

    if (canonicalToolPath !== url.pathname) {
      return redirectToCanonical(canonicalToolPath);
    }

    const toolResponse = await handleToolApi(request, env);
    if (toolResponse) return applyResponsePolicies(request, toolResponse, {
      isPreviewDeployment: isPagesDeploymentHost,
    });

    // Pages advanced mode sends every request through this worker. Serve the
    // immutable client build from the ASSETS binding before the app router so
    // stylesheets and hydration bundles do not fall through to a Vinext 404.
    if (url.pathname.startsWith("/assets/") || url.pathname === "/og.png") {
      return applyResponsePolicies(request, await env.ASSETS.fetch(request), {
        isPreviewDeployment: isPagesDeploymentHost,
      });
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
      return applyResponsePolicies(request, response, {
        isPreviewDeployment: isPagesDeploymentHost,
      });
    }

    return applyResponsePolicies(
      request,
      await handler.fetch(request, env, ctx),
      {
        noindexHtml: isPagesDeploymentHost,
        isPreviewDeployment: isPagesDeploymentHost,
      },
    );
  },
};

export default worker;
