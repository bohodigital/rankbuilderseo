import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { legacyGuideRedirects, legacyGuideTarget } from "../app/content/legacy-guide-redirects.ts";

const root = new URL("../", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const articleSlugs = [
  "how-to-read-an-seo-audit",
  "technical-seo-baseline",
  "seo-pricing-without-fairy-tales",
  "ranking-guarantees",
  "search-console-is-not-analytics",
  "canonical-tags-when-they-work",
  "seo-migration-launch-checklist",
  "what-an-seo-report-should-answer",
  "ai-overviews-traffic-claims",
  "local-seo-provider-scorecard",
  "internal-links-audit-by-template",
  "zero-click-search-study-notes",
];

const glossarySlugs = [
  "canonical-url",
  "conversion",
  "crawling",
  "indexing",
  "google-search-console",
  "xml-sitemap",
  "robots-txt",
  "redirect",
  "search-intent",
  "technical-seo",
  "web-analytics",
  "domain-name",
];

function extractAll(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

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
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
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
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-robots-tag"), null);
  assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  assert.equal(response.headers.get("content-security-policy"), null);
  const reportOnlyCsp = response.headers.get("content-security-policy-report-only") ?? "";
  assert.match(reportOnlyCsp, /default-src 'self'/);
  assert.match(reportOnlyCsp, /script-src[^;]*analytics\.bohodigitalservices\.com/);
  assert.match(reportOnlyCsp, /connect-src[^;]*analytics\.bohodigitalservices\.com/);
  assert.match(reportOnlyCsp, /frame-ancestors 'none'/);

  const html = await response.text();
  assert.match(html, /<title>Rank Builder SEO/i);
  assert.match(html, /<link[^>]+rel="alternate"[^>]+type="application\/atom\+xml"[^>]+href="https:\/\/rankbuilderseo\.com\/feed\.xml"/i);
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

test("redirects the production Pages alias to the apex with path and query intact", async () => {
  const response = await request(
    "/articles/how-to-read-an-seo-audit?source=pages-alias",
    "text/html",
    "https://rankbuilderseo.pages.dev",
  );
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://rankbuilderseo.com/articles/how-to-read-an-seo-audit?source=pages-alias",
  );
});

test("marks immutable Pages deployment HTML as noindex", async () => {
  const response = await request(
    "/articles/how-to-read-an-seo-audit",
    "text/html",
    "https://c6457348.rankbuilderseo.pages.dev",
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(
    await response.text(),
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/rankbuilderseo\.com\/articles\/how-to-read-an-seo-audit"/i,
  );

  const asset = await request(
    "/assets/index-test.css",
    "text/css",
    "https://c6457348.rankbuilderseo.pages.dev",
    async () => new Response("body {}", {
      headers: { "content-type": "text/css; charset=utf-8" },
    }),
  );
  assert.equal(asset.status, 200);
  assert.equal(asset.headers.get("x-robots-tag"), null);
});

test("marks branch preview Pages HTML as noindex", async () => {
  const response = await request(
    "/",
    "text/html",
    "https://technical-indexing-repair.rankbuilderseo.pages.dev",
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.match(
    await response.text(),
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/rankbuilderseo\.com\/"/i,
  );
});

test("redirects every retired guide detail in one hop and preserves query strings", async () => {
  for (const [slug, target] of Object.entries(legacyGuideRedirects)) {
    const response = await request(`/guides/${slug}?source=legacy&position=1`);
    assert.equal(response.status, 301, slug);
    assert.equal(
      response.headers.get("location"),
      `https://rankbuilderseo.com${target}?source=legacy&position=1`,
      slug,
    );
  }

  const archive = await request("/guides?source=legacy");
  assert.equal(archive.status, 301);
  assert.equal(
    archive.headers.get("location"),
    "https://rankbuilderseo.com/articles?source=legacy",
  );

  const unknownGuide = await request("/guides/not-a-published-slug");
  assert.equal(unknownGuide.status, 404);

  assert.equal(legacyGuideTarget("new-canonical-article"), undefined);
  assert.equal(
    legacyGuideTarget("how-to-read-an-seo-audit"),
    "/articles/how-to-read-an-seo-audit",
    "archiving a destination later must not mutate the historical registry",
  );

  for (const alias of ["https://www.rankbuilderseo.com", "https://rankbuilderseo.pages.dev"]) {
    const aliasResponse = await request(
      "/guides/how-to-read-an-seo-audit?source=alias",
      "text/html",
      alias,
    );
    assert.equal(aliasResponse.status, 301, alias);
    assert.equal(
      aliasResponse.headers.get("location"),
      "https://rankbuilderseo.com/articles/how-to-read-an-seo-audit?source=alias",
      alias,
    );
  }
});

test("serves the representative route matrix and a real 404", async () => {
  const expected = [
    "/about",
    "/articles",
    "/articles/how-to-read-an-seo-audit",
    "/glossary",
    "/glossary/canonical-url",
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

  const missingArticle = await request("/articles/definitely-missing");
  assert.equal(missingArticle.status, 404);

  const missingTerm = await request("/glossary/definitely-missing");
  assert.equal(missingTerm.status, 404);
});

test("publishes only canonical 200 self-canonicalizing URLs in crawler endpoints", async () => {
  const robots = await request("/robots.txt", "text/plain");
  assert.equal(robots.status, 200);
  assert.equal(robots.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  const robotsText = await robots.text();
  assert.match(robotsText, /User-Agent:\s*\*/i);
  assert.match(robotsText, /Sitemap:\s*https:\/\/rankbuilderseo\.com\/sitemap\.xml/i);

  const sitemap = await request("/sitemap.xml", "application/xml");
  assert.equal(sitemap.status, 200);
  assert.equal(sitemap.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  assert.match(sitemap.headers.get("content-type") ?? "", /xml/i);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/articles\/how-to-read-an-seo-audit/i);
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/privacy/i);
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/glossary\/canonical-url/i);
  assert.doesNotMatch(sitemapText, /https:\/\/rankbuilderseo\.com\/guides(?:\/|<)/i);

  const feed = await request("/feed.xml", "application/atom+xml");
  assert.equal(feed.status, 200);
  assert.match(feed.headers.get("content-type") ?? "", /^application\/atom\+xml/i);
  assert.equal(feed.headers.get("cache-control"), "public, max-age=0, must-revalidate");
  const feedText = await feed.text();
  assert.match(feedText, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(feedText, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/);
  assert.equal((feedText.match(/<entry>/g) ?? []).length, articleSlugs.length);
  for (const slug of articleSlugs) {
    assert.match(feedText, new RegExp("<id>https:\/\/rankbuilderseo\\.com\/articles\/" + slug + "<\/id>"), slug);
  }
  assert.match(feedText, /<published>\d{4}-\d{2}-\d{2}T00:00:00Z<\/published>/);
  assert.match(feedText, /<updated>\d{4}-\d{2}-\d{2}T00:00:00Z<\/updated>/);
  assert.match(feedText, /<summary type="text">[^<]+<\/summary>/);

  const sitemapUrls = extractAll(sitemapText, /<loc>([^<]+)<\/loc>/g);
  assert.equal(sitemapUrls.length, 31);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);

  const pageTitles = new Set();
  for (const sitemapUrl of sitemapUrls) {
    assert.match(sitemapUrl, /^https:\/\/rankbuilderseo\.com\//);
    const url = new URL(sitemapUrl);
    const page = await request(`${url.pathname}${url.search}`);
    assert.equal(page.status, 200, sitemapUrl);
    assert.match(page.headers.get("content-type") ?? "", /^text\/html\b/i, sitemapUrl);
    const html = await page.text();
    const canonicals = extractAll(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"[^>]*>/gi);
    assert.deepEqual(canonicals, [sitemapUrl], sitemapUrl);
    const openGraphUrls = extractAll(html, /<meta[^>]+property="og:url"[^>]+content="([^"]+)"[^>]*>/gi);
    assert.deepEqual(openGraphUrls, [sitemapUrl], sitemapUrl);
    const openGraphImages = extractAll(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"[^>]*>/gi);
    assert.deepEqual(
      openGraphImages,
      ["https://rankbuilderseo.com/og.png"],
      sitemapUrl,
    );
    const openGraphSiteNames = extractAll(html, /<meta[^>]+property="og:site_name"[^>]+content="([^"]+)"[^>]*>/gi);
    assert.deepEqual(openGraphSiteNames, ["Rank Builder SEO"], sitemapUrl);
    const openGraphTypes = extractAll(html, /<meta[^>]+property="og:type"[^>]+content="([^"]+)"[^>]*>/gi);
    assert.deepEqual(
      openGraphTypes,
      [url.pathname.startsWith("/articles/") ? "article" : "website"],
      sitemapUrl,
    );
    const titles = extractAll(html, /<title>([^<]+)<\/title>/gi);
    assert.equal(titles.length, 1, sitemapUrl);
    assert.ok(!pageTitles.has(titles[0]), `duplicate title: ${titles[0]}`);
    pageTitles.add(titles[0]);
    assert.doesNotMatch(html, /href="\/guides(?:\/|"|\?)/i, sitemapUrl);
  }
});

test("keeps Organization, Article, and Breadcrumb data aligned with canonical records", async () => {
  for (const slug of articleSlugs) {
    const response = await request(`/articles/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    const schemas = extractAll(html, /<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis).map(JSON.parse);
    const organization = schemas.find((schema) => schema["@type"] === "Organization");
    const graph = schemas.find((schema) => Array.isArray(schema["@graph"]))?.["@graph"];
    const article = graph?.find((schema) => schema["@type"] === "Article");
    const breadcrumbs = graph?.find((schema) => schema["@type"] === "BreadcrumbList");
    assert.equal(organization?.name, "Republic of Bohemia LLC", slug);
    assert.equal(article?.mainEntityOfPage, `https://rankbuilderseo.com/articles/${slug}`, slug);
    assert.equal(article?.publisher?.["@id"], "https://rankbuilderseo.com/#organization", slug);
    assert.equal(breadcrumbs?.itemListElement.at(-1).item, `https://rankbuilderseo.com/articles/${slug}`, slug);
  }
});

test("renders canonical glossary pages while preserving index fragment anchors", async () => {
  const index = await request("/glossary");
  const indexHtml = await index.text();
  for (const slug of glossarySlugs) {
    assert.match(indexHtml, new RegExp(`id="${slug}"`), slug);
    assert.match(indexHtml, new RegExp(`href="/glossary/${slug}"`), slug);
    const response = await request(`/glossary/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assert.match(html, new RegExp(`rel="canonical"[^>]+href="https://rankbuilderseo\\.com/glossary/${slug}"`), slug);
    const schemas = extractAll(html, /<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis).map(JSON.parse);
    const graph = schemas.find((schema) => Array.isArray(schema["@graph"]))?.["@graph"];
    assert.ok(graph?.some((schema) => schema["@type"] === "DefinedTerm"), slug);
    assert.ok(graph?.some((schema) => schema["@type"] === "BreadcrumbList"), slug);
  }
});

test("renders canonical references, corrections, experiment records, and public contact", async () => {
  const article = await request("/articles/ranking-guarantees");
  const articleHtml = await article.text();
  assert.match(articleHtml, /Do you need an SEO\? Tips for hiring an SEO/i);
  assert.match(articleHtml, /No corrections recorded/i);
  assert.match(articleHtml, /href="\/articles\/seo-pricing-without-fairy-tales"/i);

  const about = await request("/about");
  const aboutHtml = await about.text();
  assert.match(aboutHtml, /Republic of Bohemia LLC/i);
  assert.match(aboutHtml, /legal operator of Boho/i);
  assert.match(aboutHtml, /mailto:support@rankbuilderseo\.com/i);

  const lab = await request("/lab");
  const labHtml = await lab.text();
  for (const label of ["Protocol", "Baseline", "Result", "Limitations", "Measurement", "Window"]) {
    assert.match(labHtml, new RegExp(label, "i"), label);
  }

  await assert.rejects(access(new URL("app/guides/page.tsx", root)), { code: "ENOENT" });
  await assert.rejects(access(new URL("app/guides/[slug]/page.tsx", root)), { code: "ENOENT" });
});

test("renders a complete semantic mobile navigation contract", async () => {
  const response = await request("/");
  const html = await response.text();
  assert.match(html, /<button[^>]+class="menu-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="primary-navigation"/i);
  const navigation = html.match(/<nav[^>]+id="primary-navigation"[^>]+aria-label="Primary navigation"[^>]*>(.*?)<\/nav>/is);
  assert.ok(navigation, "primary navigation is rendered");
  for (const destination of ["/articles", "/glossary", "/lab", "/method", "/about"]) {
    assert.match(navigation[1], new RegExp(`href="${destination}"`), destination);
  }

  const [chromeSource, cssSource] = await Promise.all([
    readFile(new URL("app/site-chrome.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(chromeSource, /event\.key === "Escape"/);
  assert.match(chromeSource, /menuButtonRef\.current\?\.focus\(\)/);
  assert.match(cssSource, /@media \(max-width: 900px\)[\s\S]*\.primary-nav\.is-open/);
  assert.match(cssSource, /\.menu-toggle:focus-visible/);
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

test("emits scoped Pages X-Robots-Tag detach rules for static preview assets", async () => {
  const headers = await readFile(new URL("dist/client/_headers", root), "utf8");

  for (const asset of ["/assets/*", "/og.png", "/favicon.ico", "/favicon.svg", "/favicon-32x32.png", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/site.webmanifest"]) {
    assert.ok(headers.includes(`${asset}\n  ! X-Robots-Tag`), asset);
  }
});

test("keeps the editorial interface calm, accessible, and motion-safe", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  const editorial = css.split("/* Editorial simplification:")[1] ?? "";
  assert.match(editorial, /--signal: #8d3c32|color: var\(--signal\)/);
  assert.match(editorial, /a:focus-visible, button:focus-visible/);
  assert.match(editorial, /\.ticker-track \{[^}]*animation: none/);
  assert.match(editorial, /\.system-intro, \.article-rail \{ position: static/);
  assert.match(editorial, /\.article-layout \{ grid-template-columns: 205px minmax\(0, 690px\)/);
  assert.match(editorial, /\.lab-rules \.rules-grid span, \.lab-status\.live \{ color: var\(--signal\)/);
  assert.match(editorial, /\.article-body h2, \.rules-grid h3, \.standards-list h3, \.about-grid h2 \{ text-transform: none/);
  assert.match(editorial, /@media \(max-width: 900px\) \{[\s\S]*\.hero, \.split-heading, \.system-grid, \.article-layout \{ grid-template-columns: 1fr/);
  assert.match(editorial, /@media \(max-width: 620px\) \{[\s\S]*\.system-steps li \{ grid-template-columns: 1fr/);
  assert.doesNotMatch(editorial, /animation: drift|position: sticky/);
});
test("defines the packet-one metadata, semantic, accessibility, and asset contract", async () => {
  const [layout, article, renderer, glossary, chrome, css, metadata, structured, headers, manifest, socialCard] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/articles/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/articles/article-content.tsx", root), "utf8"),
    readFile(new URL("app/glossary/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/site-chrome.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/metadata.ts", root), "utf8"),
    readFile(new URL("app/content/structured-data.ts", root), "utf8"),
    readFile(new URL("public/_headers", root), "utf8"),
    readFile(new URL("public/site.webmanifest", root), "utf8"),
    readFile(new URL("public/og.png", root)),
  ]);
  assert.match(layout, /icons:/);
  assert.match(layout, /manifest: "\/site\.webmanifest"/);
  assert.match(metadata, /width: 1200/);
  assert.match(metadata, /height: 630/);
  assert.match(article, /twitter:/);
  assert.match(article, /aria-label="Breadcrumb"/);
  assert.match(article, /aria-label="On this page"/);
  assert.match(article, /padStart\(2, "0"\)/);
  assert.match(article, /<time dateTime=/);
  assert.match(article, /Related reading/);
  assert.match(article, /related\.every/);
  assert.match(article, /rel="noopener noreferrer external"/);
  const sourceFiles = (await readdir(new URL("app/", root), { recursive: true }))
    .filter((file) => /\.(?:ts|tsx)$/.test(file));
  const applicationSource = await Promise.all(
    sourceFiles.map((file) => readFile(new URL(`app/${file}`, root), "utf8")),
  );
  assert.ok(applicationSource.every((source) => !source.includes("↗")), "internal links never use fake external arrows");
  assert.match(article, /<ArticleContent publication=\{publication\}/);
  assert.match(renderer, /<h2 id=\{section\.id\}>/);
  assert.match(renderer, /key=\{\`\$\{publication\.slug\}-\$\{section\.id\}\`\}/);
  assert.doesNotMatch(article, /section-\$\{index/);
  assert.doesNotMatch(article, /key=\{`(?:toc|section|takeaway|correction|claim-limit)-\$\{index\}/);
  assert.match(glossary, /aria-label="Breadcrumb"/);
  assert.match(chrome, /usePathname/);
  assert.match(chrome, /aria-current/);
  assert.match(css, /\.menu-toggle, \.primary-nav a, \.footer-nav a \{[^}]*min-width: 44px[^}]*min-height: 44px/s);
  assert.match(structured, /inLanguage: "en"/);
  assert.match(structured, /isAccessibleForFree: true/);
  assert.match(structured, /wordCount: publication\.wordCount/);
  assert.match(headers, /\/site\.webmanifest/);
  assert.equal(JSON.parse(manifest).display, "browser");
  assert.ok(socialCard.byteLength < 2_000_000);
});
