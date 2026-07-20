import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildAtomFeed } from "../app/content/feed.ts";
import { applyResponsePolicies, cachePolicies, cachePolicyForResponse, securityHeaders } from "../worker/response-policy.ts";

const root = new URL("../", import.meta.url);

function globalStaticHeaders(source) {
  const headers = {};
  for (const line of source.split("\n").slice(1)) {
    if (line.trim() === "") break;
    const trimmed = line.trim();
    const separator = trimmed.indexOf(":");
    if (separator < 1) continue;
    headers[trimmed.slice(0, separator)] = trimmed.slice(separator + 1).trim();
  }
  return headers;
}

test("static and Worker security headers stay in exact report-only parity", async () => {
  const staticHeaders = globalStaticHeaders(await readFile(new URL("public/_headers", root), "utf8"));
  const { "Cache-Control": defaultCache, ...staticSecurityHeaders } = staticHeaders;
  assert.equal(defaultCache, cachePolicies.htmlAndRsc);
  assert.deepEqual(staticSecurityHeaders, securityHeaders);
  assert.equal("Content-Security-Policy" in staticHeaders, false);
  assert.match(staticHeaders["Content-Security-Policy-Report-Only"], /form-action 'self'/);
  assert.match(staticHeaders["Content-Security-Policy-Report-Only"], /frame-src 'none'/);
  assert.match(staticHeaders["Content-Security-Policy-Report-Only"], /manifest-src 'self'/);
  assert.equal(/report-uri|report-to/.test(staticHeaders["Content-Security-Policy-Report-Only"]), false);
});

test("cache policy distinguishes HTML, RSC, immutable assets, durable icons, discovery, and previews", () => {
  const html = new Response("<!doctype html>", { headers: { "Content-Type": "text/html; charset=utf-8" } });
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/articles"), html, false), cachePolicies.htmlAndRsc);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/articles.rsc?_rsc=abc"), new Response("rsc"), false), cachePolicies.htmlAndRsc);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/assets/app-a1b2.js"), new Response("js"), false), cachePolicies.immutableAsset);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/media/diagram.abcdef12.svg"), new Response("svg"), false), cachePolicies.fingerprintedMedia);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/media/diagram.svg"), new Response("svg"), false), cachePolicies.articleMedia);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/og.png"), new Response("png"), false), cachePolicies.durableStaticAsset);
  assert.equal(cachePolicyForResponse(new Request("https://rankbuilderseo.com/feed.xml"), new Response("xml"), false), cachePolicies.htmlAndRsc);
  assert.equal(cachePolicyForResponse(new Request("https://preview.rankbuilderseo.pages.dev/assets/app.js"), new Response("js"), true), cachePolicies.preview);
  assert.equal(cachePolicyForResponse(new Request("https://preview.rankbuilderseo.pages.dev/media/diagram.svg"), new Response("svg"), true), cachePolicies.preview);
});

test("preview HTML is no-store and noindex while CSP remains report-only", () => {
  const response = applyResponsePolicies(
    new Request("https://preview.rankbuilderseo.pages.dev/articles"),
    new Response("<!doctype html>", { headers: { "Content-Type": "text/html" } }),
    { noindexHtml: true, isPreviewDeployment: true },
  );
  assert.equal(response.headers.get("Cache-Control"), cachePolicies.preview);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex");
  assert.ok(response.headers.get("Content-Security-Policy-Report-Only"));
  assert.equal(response.headers.has("Content-Security-Policy"), false);
});

test("Atom feed emits canonical escaped records with publication and revision dates", () => {
  const fixture = {
    slug: "escaped-record",
    title: "A & <B>",
    description: 'Summary "quoted" & bounded',
    publishedAt: "2026-07-01",
    revisedAt: "2026-07-03",
    author: { name: "Research & Review" },
  };
  const feed = buildAtomFeed([fixture]);
  assert.match(feed, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(feed, /xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/);
  assert.match(feed, /<title>A &amp; &lt;B&gt;<\/title>/);
  assert.match(feed, /<id>https:\/\/rankbuilderseo\.com\/articles\/escaped-record<\/id>/);
  assert.match(feed, /<published>2026-07-01T00:00:00Z<\/published>/);
  assert.match(feed, /<updated>2026-07-03T00:00:00Z<\/updated>/);
  assert.match(feed, /<summary type="text">Summary &quot;quoted&quot; &amp; bounded<\/summary>/);
  assert.equal((feed.match(/<entry>/g) ?? []).length, 1);
});

test("analytics events remain sparse, named, and free of page copy or query data", async () => {
  const sources = await Promise.all([
    readFile(new URL("app/articles/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/glossary/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/about/page.tsx", root), "utf8"),
  ]);
  const joined = sources.join("\n");
  const names = [...joined.matchAll(/data-umami-event="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(new Set(names), new Set([
    "citation-click",
    "related-article-click",
    "correction-path-click",
    "correction-email-click",
  ]));
  assert.equal(/scroll-depth|search-query|article-title/.test(joined), false);
});

test("measured prefetch policy preserves primary defaults and disables low-priority shell links", async () => {
  const source = await readFile(new URL("app/site-chrome.tsx", root), "utf8");
  assert.match(source, /return <Link className=\{className\} href=\{href\} aria-current=\{active \? "page" : undefined\}/);
  assert.match(source, /className="wordmark" href="\/" prefetch=\{false\}/);
  assert.match(source, /className="header-link" href="\/about" prefetch=\{false\}/);
  assert.match(source, /href="\/privacy" prefetch=\{false\}/);
  assert.match(source, /<NavigationLink href="\/articles" onClick=\{closeMenu\}>/);
});

test("publication eligibility uses the injected build clock instead of Worker startup time", async () => {
  const [viteConfig, publications] = await Promise.all([
    readFile(new URL("vite.config.ts", root), "utf8"),
    readFile(new URL("app/content/publications.ts", root), "utf8"),
  ]);
  assert.match(viteConfig, /RANK_BUILDER_CONTENT_BUILD_TIME/);
  assert.match(viteConfig, /new Date\(\)\.toISOString\(\)/);
  assert.match(publications, /new Date\(contentBuildTime\)/);
  assert.match(publications, /now: contentBuildNow/);
  assert.match(publications, /publicationsForSurface\(publicationRegistry, "feed", contentBuildNow\)/);
  assert.match(publications, /publicationExposure\(publication, contentBuildNow\)/);
});
