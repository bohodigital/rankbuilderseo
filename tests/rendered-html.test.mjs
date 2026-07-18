import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
  const reportOnlyCsp = response.headers.get("content-security-policy-report-only") ?? "";
  assert.match(reportOnlyCsp, /default-src 'self'/);
  assert.match(reportOnlyCsp, /script-src[^;]*analytics\.bohodigitalservices\.com/);
  assert.match(reportOnlyCsp, /connect-src[^;]*analytics\.bohodigitalservices\.com/);
  assert.match(reportOnlyCsp, /frame-ancestors 'none'/);

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
  for (const slug of articleSlugs) {
    const response = await request(`/guides/${slug}?source=legacy&position=1`);
    assert.equal(response.status, 301, slug);
    assert.equal(
      response.headers.get("location"),
      `https://rankbuilderseo.com/articles/${slug}?source=legacy&position=1`,
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
  const robotsText = await robots.text();
  assert.match(robotsText, /User-Agent:\s*\*/i);
  assert.match(robotsText, /Sitemap:\s*https:\/\/rankbuilderseo\.com\/sitemap\.xml/i);

  const sitemap = await request("/sitemap.xml", "application/xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /xml/i);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/articles\/how-to-read-an-seo-audit/i);
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/privacy/i);
  assert.match(sitemapText, /https:\/\/rankbuilderseo\.com\/glossary\/canonical-url/i);
  assert.doesNotMatch(sitemapText, /https:\/\/rankbuilderseo\.com\/guides(?:\/|<)/i);

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

  assert.deepEqual(
    headers.trimEnd().split("\n\n"),
    [
      `/*\n  X-Content-Type-Options: nosniff\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  X-Frame-Options: DENY\n  X-XSS-Protection: 0\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy-Report-Only: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://analytics.bohodigitalservices.com; connect-src 'self' https://analytics.bohodigitalservices.com`,
      "/assets/*\n  ! X-Robots-Tag",
      "/og.png\n  ! X-Robots-Tag",
    ],
  );
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
