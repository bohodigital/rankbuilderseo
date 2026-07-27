import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { escapeCsvCell, redirectReportCsv } from "../app/tools/export.ts";
import {
  checkMemoryRateLimit,
  createIndexabilityReport,
  createRedirectTrace,
  handleToolApi,
  resetMemoryRateLimits,
} from "../worker/tool-api.ts";
import {
  ToolBoundaryError,
  evaluateRobots,
  isProhibitedIp,
  parseHtmlSignals,
  parseLinkCanonicals,
  validatePublicUrl,
} from "../worker/tool-core.ts";

const publicResolver = async () => ["93.184.216.34", "2606:2800:220:1:248:1893:25c8:1946"];

function dependencies(routes, resolver = publicResolver) {
  let now = Date.parse("2026-07-26T23:45:00Z");
  return {
    now: () => now += 5,
    resolver,
    fetcher: async (input) => {
      const url = typeof input === "string" ? input : input.url;
      const response = routes[url];
      if (response instanceof Error) throw response;
      if (!response) throw new Error(`Unexpected test fetch: ${url}`);
      return typeof response === "function" ? response() : response.clone();
    },
  };
}

function response(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", ...headers } });
}

test("public URL validation rejects every prohibited input family", () => {
  const unsafe = [
    "http://127.0.0.1/",
    "http://[::1]/",
    "http://10.0.0.1/",
    "http://172.16.0.1/",
    "http://192.168.0.1/",
    "http://169.254.169.254/",
    "http://100.100.100.200/",
    "http://[fc00::1]/",
    "http://[fe80::1]/",
    "http://[2001:db8::1]/",
    "http://metadata.google.internal/",
    "http://localhost/",
    "http://printer.local/",
    "http://service.internal/",
    "http://user:pass@example.com/",
    "http://example.com:8080/",
    "file:///etc/passwd",
    "ftp://example.com/",
    "javascript:alert(1)",
    "https://example.com/#fragment",
  ];
  for (const url of unsafe) {
    assert.throws(() => validatePublicUrl(url), ToolBoundaryError, url);
  }
  assert.equal(validatePublicUrl("https://example.com/path?x=1").href, "https://example.com/path?x=1");
});

test("reserved address checks include IPv4, IPv6, and mapped IPv4", () => {
  for (const address of ["127.0.0.1", "100.64.0.1", "192.0.2.1", "198.51.100.1", "::1", "fc00::1", "fe80::1", "2001:db8::1", "::ffff:127.0.0.1"]) {
    assert.equal(isProhibitedIp(address), true, address);
  }
  assert.equal(isProhibitedIp("93.184.216.34"), false);
  assert.equal(isProhibitedIp("2606:2800:220:1:248:1893:25c8:1946"), false);
});

test("DNS validation fails closed on prohibited records and empty answers", async () => {
  await assert.rejects(
    createRedirectTrace("https://example.com/", dependencies({}, async () => ["10.0.0.5"])),
    (error) => error instanceof ToolBoundaryError && error.code === "unsafe-destination",
  );
  await assert.rejects(
    createRedirectTrace("https://example.com/", dependencies({}, async () => { throw new Error("DNS failure"); })),
  );
});

test("HTML tokenizer extracts directives, canonicals, title, H1s, text, and refresh without executing markup", () => {
  const parsed = parseHtmlSignals(`<!doctype html><html><head>
    <title>Remote & title</title>
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="noindex">
    <meta http-equiv="refresh" content="0; url=/next">
    <link rel="alternate canonical" href="/preferred">
    <script><h1>Fake</h1>window.location='/bad'</script>
    </head><body><h1>Real heading</h1><p>Enough visible returned text for the bounded inspection.</p></body></html>`);
  assert.deepEqual(parsed.robotsMeta, ["index, follow"]);
  assert.deepEqual(parsed.googlebotMeta, ["noindex"]);
  assert.deepEqual(parsed.htmlCanonicals, ["/preferred"]);
  assert.equal(parsed.title, "Remote & title");
  assert.equal(parsed.h1Count, 1);
  assert.equal(parsed.hasMeaningfulText, true);
  assert.deepEqual(parsed.metaRefresh, { delaySeconds: 0, target: "/next" });
});

test("Link canonical parsing handles comma-separated fields without splitting inside angle brackets", () => {
  assert.deepEqual(
    parseLinkCanonicals('<https://example.com/a,b>; rel="canonical", <https://example.com/other>; rel="alternate"'),
    ["https://example.com/a,b"],
  );
});

test("robots evaluation prefers Googlebot, uses longest match, and lets Allow win a tie", () => {
  const robots = `
    User-agent: *
    Disallow: /

    User-agent: Googlebot
    Disallow: /private
    Allow: /private/public
    Disallow: /private/public
  `;
  assert.deepEqual(evaluateRobots(robots, new URL("https://example.com/private/public")), {
    allowed: true,
    matchedUserAgent: "Googlebot",
    matchedRule: "Allow: /private/public",
  });
  assert.equal(evaluateRobots("User-agent: *\nDisallow:\n", new URL("https://example.com/anything")).allowed, true);
  assert.equal(evaluateRobots("User-agent: *\nDisallow: /caf%C3%A9\n", new URL("https://example.com/caf%C3%A9")).allowed, false);
});

test("indexability report classifies HTML, Googlebot, and X-Robots noindex", async () => {
  for (const [markup, headers] of [
    ['<html><head><title>A page</title><meta name="robots" content="noindex"></head><body><h1>A</h1><p>Meaningful returned page text is present here.</p></body></html>', {}],
    ['<html><head><title>A page</title><meta name="googlebot" content="noindex"></head><body><h1>A</h1><p>Meaningful returned page text is present here.</p></body></html>', {}],
    ['<html><head><title>A page</title></head><body><h1>A</h1><p>Meaningful returned page text is present here.</p></body></html>', { "x-robots-tag": "noindex, nofollow" }],
  ]) {
    const report = await createIndexabilityReport("https://example.com/page", dependencies({
      "https://example.com/page": response(markup, 200, headers),
      "https://example.com/robots.txt": response("User-agent: *\nAllow: /\n", 200, { "content-type": "text/plain" }),
    }));
    assert.equal(report.classification, "indexing-prohibited");
    assert.equal(report.directives.effectiveNoindex, true);
  }
});

test("indexability report handles robots blocks, relative canonicals, conflicts, and potentially indexable HTML", async () => {
  const report = await createIndexabilityReport("https://example.com/start", dependencies({
    "https://example.com/start": response("", 301, { location: "/page" }),
    "https://example.com/page": response('<html><head><title>A page</title><link rel="canonical" href="/page"></head><body><h1>A</h1><p>Meaningful returned page text is present here.</p></body></html>', 200, {
      link: '<https://other.example/page>; rel="canonical"',
    }),
    "https://example.com/robots.txt": response("User-agent: Googlebot\nDisallow: /page\n", 200, { "content-type": "text/plain" }),
  }));
  assert.equal(report.classification, "crawling-blocked");
  assert.equal(report.redirectCount, 1);
  assert.equal(report.robotsTxt.allowed, false);
  assert.ok(report.canonicals.resolved.includes("https://example.com/page"));
  assert.ok(report.warnings.some(({ code }) => code === "canonical-header-conflict"));
});

test("indexability report covers empty, non-HTML, and error responses", async () => {
  const cases = [
    [401, "text/html", "unavailable"],
    [403, "text/html", "unavailable"],
    [404, "text/html", "unavailable"],
    [429, "text/html", "unavailable"],
    [500, "text/html", "unavailable"],
    [200, "application/pdf", "indeterminate"],
    [200, "text/html", "indeterminate"],
  ];
  for (const [status, contentType, classification] of cases) {
    const report = await createIndexabilityReport("https://example.com/page", dependencies({
      "https://example.com/page": response(status === 200 && contentType === "text/html" ? "<html><head><title>Empty</title></head><body></body></html>" : "body", status, { "content-type": contentType }),
      "https://example.com/robots.txt": response("", 404, { "content-type": "text/plain" }),
    }));
    assert.equal(report.classification, classification, `${status} ${contentType}`);
  }
});

test("redirect visualizer handles direct, permanent, temporary, relative, multi-hop, and final errors", async () => {
  const direct = await createRedirectTrace("https://example.com/direct", dependencies({
    "https://example.com/direct": response("<html><body>Direct response</body></html>"),
  }));
  assert.equal(direct.classification, "direct-response");

  const chain = await createRedirectTrace("https://example.com/old", dependencies({
    "https://example.com/old": response("", 302, { location: "/middle" }),
    "https://example.com/middle": response("", 301, { location: "https://www.example.com/final" }),
    "https://www.example.com/final": response("<html><body>Final response</body></html>"),
  }));
  assert.equal(chain.classification, "redirect-chain");
  assert.equal(chain.hops.length, 3);
  assert.equal(chain.hops[0].locationResolved, "https://example.com/middle");
  assert.ok(chain.hops[0].warnings.includes("Mixed permanent and temporary redirects"));
  assert.ok(chain.hops[1].warnings.includes("Hostname changed"));

  const broken = await createRedirectTrace("https://example.com/old", dependencies({
    "https://example.com/old": response("", 301, { location: "/missing" }),
    "https://example.com/missing": response("Missing", 404),
  }));
  assert.equal(broken.classification, "broken-destination");
});

test("redirect visualizer detects loops, missing or malformed locations, and unsafe targets", async () => {
  const loop = await createRedirectTrace("https://example.com/a", dependencies({
    "https://example.com/a": response("", 301, { location: "/b" }),
    "https://example.com/b": response("", 302, { location: "/a" }),
  }));
  assert.equal(loop.classification, "redirect-loop");

  for (const location of [null, "http://[bad"]) {
    const headers = location == null ? {} : { location };
    const report = await createRedirectTrace("https://example.com/a", dependencies({
      "https://example.com/a": response("", 301, headers),
    }));
    assert.equal(report.classification, "broken-destination");
  }

  const privateRedirect = await createRedirectTrace("https://example.com/a", dependencies({
    "https://example.com/a": response("", 301, { location: "http://127.0.0.1/" }),
  }));
  assert.equal(privateRedirect.classification, "broken-destination");
  assert.ok(privateRedirect.hops[0].warnings.includes("Unsafe redirect target"));
});

test("redirect visualizer enforces hop, body-size, and timeout limits", async () => {
  const routes = {};
  for (let index = 0; index <= 10; index += 1) {
    routes[`https://example.com/${index}`] = response("", 301, { location: `/${index + 1}` });
  }
  const hopLimit = await createRedirectTrace("https://example.com/0", dependencies(routes));
  assert.equal(hopLimit.classification, "hop-limit-exceeded");

  await assert.rejects(
    createRedirectTrace("https://example.com/large", dependencies({
      "https://example.com/large": response("small", 200, { "content-length": String(600 * 1024) }),
    })),
    (error) => error instanceof ToolBoundaryError && error.code === "response-too-large",
  );

  const timeout = new DOMException("Timed out", "TimeoutError");
  await assert.rejects(
    createRedirectTrace("https://example.com/slow", dependencies({ "https://example.com/slow": timeout })),
    (error) => error instanceof ToolBoundaryError && error.code === "timeout",
  );
});

test("refresh detection reports HTTP and zero-delay meta refresh but does not follow JavaScript", async () => {
  const headerRefresh = await createRedirectTrace("https://example.com/header", dependencies({
    "https://example.com/header": response("<html><body>Header refresh page text</body></html>", 200, { refresh: "5; url=/next" }),
  }));
  assert.deepEqual(headerRefresh.detectedRefresh, { type: "http-refresh", delaySeconds: 5, target: "/next" });

  const metaRefresh = await createRedirectTrace("https://example.com/meta", dependencies({
    "https://example.com/meta": response('<html><head><meta http-equiv="refresh" content="0; url=/next"></head><body>Meta refresh page text</body></html>'),
  }));
  assert.equal(metaRefresh.detectedRefresh?.type, "meta-refresh");

  const javascript = await createRedirectTrace("https://example.com/js", dependencies({
    "https://example.com/js": response("<html><body><p>JavaScript only redirect page text.</p><script>window.location='/next'</script></body></html>"),
  }));
  assert.equal(javascript.classification, "direct-response");
  assert.equal(javascript.detectedRefresh, undefined);
  assert.equal(javascript.hops.length, 1);
});

test("CSV exports prevent spreadsheet formula execution", () => {
  assert.equal(escapeCsvCell("=HYPERLINK(\"bad\")"), "\"'=HYPERLINK(\"\"bad\"\")\"");
  const csv = redirectReportCsv([{
    sequence: 1,
    status: 301,
    url: "=1+1",
    locationRaw: "@command",
    locationResolved: "https://example.com/",
    elapsedMs: 10,
    redirectKind: "permanent",
    warnings: [],
    changes: { protocol: false, hostname: false, port: false, path: true, query: false, fragmentRemoved: false },
  }]);
  assert.match(csv, /"'=1\+1"/);
  assert.match(csv, /"'@command"/);
});

test("rate limiter enforces ten-minute and daily windows", () => {
  resetMemoryRateLimits();
  const base = Date.parse("2026-07-26T00:00:00Z");
  for (let index = 0; index < 10; index += 1) assert.equal(checkMemoryRateLimit("burst", base + index), true);
  assert.equal(checkMemoryRateLimit("burst", base + 10), false);
  assert.equal(checkMemoryRateLimit("burst", base + 600_001), true);

  resetMemoryRateLimits();
  for (let index = 0; index < 100; index += 1) assert.equal(checkMemoryRateLimit("daily", base + index * 610_000), true);
  assert.equal(checkMemoryRateLimit("daily", base + 99 * 610_000 + 1), false);
});

test("tool endpoints require POST JSON, same origin, no-store, and noindex", async () => {
  resetMemoryRateLimits();
  const get = await handleToolApi(new Request("https://rankbuilderseo.com/api/tools/indexability-inspector"), {});
  assert.equal(get.status, 405);
  const crossOrigin = await handleToolApi(new Request("https://rankbuilderseo.com/api/tools/indexability-inspector", {
    method: "POST",
    headers: { origin: "https://evil.example", "content-type": "application/json" },
    body: JSON.stringify({ url: "http://127.0.0.1/" }),
  }), {});
  assert.equal(crossOrigin.status, 403);
  const wrongType = await handleToolApi(new Request("https://rankbuilderseo.com/api/tools/indexability-inspector", {
    method: "POST",
    headers: { origin: "https://rankbuilderseo.com", "content-type": "text/plain" },
    body: "url=x",
  }), {});
  assert.equal(wrongType.status, 415);
  const unsafe = await handleToolApi(new Request("https://rankbuilderseo.com/api/tools/indexability-inspector", {
    method: "POST",
    headers: { origin: "https://rankbuilderseo.com", "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify({ url: "http://127.0.0.1/" }),
  }), {});
  assert.equal(unsafe.status, 403);
  assert.equal(unsafe.headers.get("cache-control"), "no-store");
  assert.equal(unsafe.headers.get("x-robots-tag"), "noindex");
});

test("tool clients keep submitted URLs out of analytics properties and expose accessible result behavior", async () => {
  const source = await readFile(new URL("../app/tools/indexability-inspector/inspector-client.tsx", import.meta.url), "utf8")
    + await readFile(new URL("../app/tools/redirect-chain-visualizer/visualizer-client.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /data-umami-event--(?:url|query|report)/);
  assert.doesNotMatch(source, /(?:url|hostname):\s*(?:url|report|payload)/);
  assert.match(source, /href="\/tools#acceptable-use"/);
  assert.match(source, /role="status" aria-live="polite"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /tabIndex=\{-1\}/);
  assert.match(source, /resultHeading\.current\?\.focus\(\)/);
});

test("indexing study data reconciles the baseline and registered result gate", async () => {
  const data = JSON.parse(await readFile(new URL("../content/research/indexing-time-study.json", import.meta.url), "utf8"));
  assert.equal(data.baseline.completeDays, 12);
  assert.equal(data.baseline.impressions, 298);
  assert.equal(data.baseline.clicks, 0);
  assert.equal(data.baseline.ctr, 0);
  assert.equal(Number(data.baseline.weightedAveragePosition.toFixed(2)), 64.54);
  assert.equal(data.baseline.minimumDailyImpressions, 17);
  assert.equal(data.baseline.maximumDailyImpressions, 36);
  assert.equal(data.cohorts.length, 4);
  assert.equal(data.cohorts.reduce((total, cohort) => total + cohort.eligibleUrlCount, 0), 31);
  assert.equal(data.cohorts.flatMap((cohort) => cohort.urls).length, 31);
  assert.equal(new Set(data.cohorts.flatMap((cohort) => cohort.urls)).size, 31);
  assert.equal(data.observations.length, 0);
  assert.equal(data.summary.durationEstimateAvailable, false);
  assert.equal(data.summary.confirmedIndexedUrls, 0);
  assert.doesNotMatch(JSON.stringify(data.summary), /median|percentile/i);
});
