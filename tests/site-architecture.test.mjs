import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalInternalRoute,
  validateApplicationRouteSources,
} from "../app/content/site-graph.ts";
import {
  checkContent,
  validateMediaDuplicateContracts,
} from "../scripts/content-check.mjs";

test("controlled topics own every public article exactly once and form one complete graph", async () => {
  const registry = await checkContent();
  const primaryAssignments = registry.topics.flatMap((topic) => topic.primaryPublications);
  const publicArticles = registry.publications.filter((publication) => publication.state === "published");

  assert.equal(registry.topics.length, 7);
  assert.equal(primaryAssignments.length, publicArticles.length);
  assert.equal(new Set(primaryAssignments).size, publicArticles.length);
  assert.equal(registry.graph.report.connectedComponents.length, 1);
  assert.deepEqual(registry.graph.report.orphans, []);
  assert.deepEqual(registry.graph.report.deadEnds, []);
  assert.deepEqual(registry.graph.report.redirectingInternalLinks, []);
});

test("application route validation rejects slashes, redirects, missing pages, and wrong internal origins", () => {
  const routes = new Set(["/", "/articles", "/tools/indexability-inspector"]);
  const redirects = new Map([["/guides", "/articles"]]);
  assert.equal(canonicalInternalRoute("/articles#latest", routes, redirects, "fixture"), "/articles");
  assert.equal(canonicalInternalRoute("https://example.com/path", routes, redirects, "fixture"), undefined);
  assert.throws(() => canonicalInternalRoute("/articles/", routes, redirects, "fixture"), /trailing slash/i);
  assert.throws(() => canonicalInternalRoute("/guides", routes, redirects, "fixture"), /points through redirect/i);
  assert.throws(() => canonicalInternalRoute("/missing", routes, redirects, "fixture"), /no generated destination/i);
  assert.throws(
    () => canonicalInternalRoute("https://www.rankbuilderseo.com/articles", routes, redirects, "fixture"),
    /must use https:\/\/rankbuilderseo\.com/i,
  );
  assert.throws(
    () => validateApplicationRouteSources(
      [{ path: "app/page.tsx", source: '<Link href="/tools/indexability-inspector/">Tool</Link>' }],
      routes,
      redirects,
    ),
    /trailing slash/i,
  );
});

test("registered static downloads bypass page-graph edges while unknown downloads fail closed", () => {
  const routes = new Set(["/", "/articles"]);
  const redirects = new Map();
  assert.equal(
    canonicalInternalRoute(
      "https://rankbuilderseo.com/downloads/url-parameter-audit-template.csv",
      routes,
      redirects,
      "fixture",
    ),
    undefined,
  );
  assert.throws(
    () => canonicalInternalRoute("/downloads/missing-template.csv", routes, redirects, "fixture"),
    /internal download has no registered static asset/i,
  );
});

test("media duplicate contracts require bounded explicit exemptions", () => {
  const base = {
    id: "one",
    src: "/media/one.jpg",
    sourceUrl: "https://example.com/source",
    status: "approved",
    rights: "licensed",
    mimeType: "image/jpeg",
  };
  assert.throws(
    () => validateMediaDuplicateContracts(
      [base, { ...base, id: "two", src: "/media/two.jpg" }],
      [],
      new Map(),
    ),
    /same source-page URL without an explicit exemption/i,
  );
  assert.throws(
    () => validateMediaDuplicateContracts(
      [
        { ...base, sourceUrl: undefined },
        { ...base, id: "two", src: "/media/two.jpg", sourceUrl: undefined },
      ],
      [],
      new Map([["same-hash", [base, { ...base, id: "two", src: "/media/two.jpg" }]]]),
    ),
    /same content hash under different filenames/i,
  );
  assert.doesNotThrow(() => validateMediaDuplicateContracts(
    [
      { ...base, rights: "owned", sourceUrl: undefined, reuseExemption: "Approved diagram reuse." },
      { ...base, id: "two", src: "/media/two.jpg", rights: "owned", sourceUrl: undefined },
    ],
    [],
    new Map([["same-hash", [
      { ...base, rights: "owned", sourceUrl: undefined, reuseExemption: "Approved diagram reuse." },
      { ...base, id: "two", src: "/media/two.jpg", rights: "owned", sourceUrl: undefined },
    ]]]),
  ));
});
