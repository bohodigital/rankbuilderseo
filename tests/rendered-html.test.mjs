import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function request(
  path,
  accept = "text/html",
  origin = "https://rankbuilderseo.com",
  assetFetch = async () => new Response("Not found", { status: 404 }),
) {
  return worker.fetch(
    new Request(new URL(path, origin), {
      headers: { accept },
    }),
    {
      ASSETS: {
        fetch: assetFetch,
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("serves compiled client assets through the Pages binding", async () => {
  const requested = [];
  const response = await request(
    "/assets/index-test.css",
    "text/css",
    "https://rankbuilderseo.com",
    async (assetRequest) => {
      requested.push(assetRequest.url);
      return new Response("body { color: rebeccapurple; }", {
        headers: { "content-type": "text/css; charset=utf-8" },
      });
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/css; charset=utf-8");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(requested, [
    "https://rankbuilderseo.com/assets/index-test.css",
  ]);
  assert.match(await response.text(), /rebeccapurple/);
});

test("renders the production homepage with metadata and analytics", async () => {
  const response = await request("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(
    response.headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    response.headers.get("permissions-policy"),
    "camera=(), microphone=(), geolocation=()",
  );

  const html = await response.text();
  assert.match(html, /<title>Rank Builder SEO/i);
  assert.match(html, /Clear SEO answers/i);
  assert.match(html, /analytics\.bohodigitalservices\.com\/script\.js/i);
  assert.match(html, /data-website-id="297e47a1-fd92-42f1-a34d-5a7698e8a58f"/i);
  const layoutSource = await readFile(new URL("app/layout.tsx", root), "utf8");
  assert.equal(
    (
      layoutSource.match(
        /analytics\.bohodigitalservices\.com\/script\.js/gi,
      ) ?? []
    ).length,
    1,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|noindex/i);
});

test("redirects www to the apex while preserving the request path", async () => {
  const response = await request(
    "/articles?source=www",
    "text/html",
    "https://www.rankbuilderseo.com",
  );
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://rankbuilderseo.com/articles?source=www",
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("serves the representative route matrix and a real 404", async () => {
  const expected = [
    "/about",
    "/articles",
    "/articles/how-to-read-an-seo-audit",
    "/glossary",
    "/guides",
    "/guides/how-to-read-an-seo-audit",
    "/lab",
    "/method",
    "/privacy",
  ];

  for (const path of expected) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
  }

  const missing = await request("/definitely-missing");
  assert.equal(missing.status, 404);
});

test("publishes crawler endpoints for the production origin", async () => {
  const robots = await request("/robots.txt", "text/plain");
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /User-Agent:\s*\*/i);
  assert.match(robotsText, /Sitemap:\s*https:\/\/rankbuilderseo\.com\/sitemap\.xml/i);

  const sitemap = await request("/sitemap.xml", "application/xml");
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/articles\/how-to-read-an-seo-audit/i);
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/privacy/i);
});

test("emits the Cloudflare Pages deployment artifacts", async () => {
  await Promise.all([
    access(new URL("dist/server/index.js", root)),
    access(new URL("dist/client/_worker.js", root)),
    access(new URL("dist/client/_headers", root)),
    access(new URL("dist/client/_redirects", root)),
  ]);

  const wrangler = await readFile(new URL("wrangler.jsonc", root), "utf8");
  assert.match(wrangler, /"name":\s*"rankbuilderseo"/);
  assert.match(wrangler, /"pages_build_output_dir":\s*"\.\/dist\/client"/);
});
