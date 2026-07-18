import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import {
  formatPublicationDate,
  loadPublicationRegistry,
  parseExperimentRegistrySource,
  parseGlossaryRegistrySource,
  publicationRoutePaths,
} from "../app/content/registry.ts";
import {
  articleStructuredData,
  glossaryStructuredData,
  organizationStructuredData,
  serializeStructuredData,
} from "../app/content/structured-data.ts";

const root = new URL("../", import.meta.url);

const protectedParity = [
  {"slug":"how-to-read-an-seo-audit","title":"How to read an SEO audit without getting snowed","h1":"How to read an SEO audit without getting snowed","description":"A long PDF is not a strategy. Here is how to separate reproducible findings from expensive formatting and recycled warnings.","published":"July 11, 2026","primaryCopySha256":"4ab4a0839fc886d10f1a3be3020f8cca376c0a4b5830b9d55c44d517df5ffa66"},
  {"slug":"technical-seo-baseline","title":"The technical SEO baseline before you touch content","h1":"The technical SEO baseline before you touch content","description":"Confirm that the site can be crawled, understood, measured, and repaired before chasing keywords.","published":"July 10, 2026","primaryCopySha256":"5d3b5f57cab7111a3df2e568d1ba493faff9cc643c115ffd218ee7c186d0cfb3"},
  {"slug":"seo-pricing-without-fairy-tales","title":"SEO pricing without the decorative averages","h1":"SEO pricing without the decorative averages","description":"Most pricing questions are scope questions wearing a dollar sign. Ask what actually happens after the invoice.","published":"July 9, 2026","primaryCopySha256":"f48da4e77172f40de28e2fdfcfbedf2dc0b66650aa7242cee8222dbb6cb9694c"},
  {"slug":"ranking-guarantees","title":"Ranking guarantees are a contract-reading exercise","h1":"Ranking guarantees are a contract-reading exercise","description":"The promise is only as useful as its query set, geography, device context, exclusions, and remedy.","published":"July 8, 2026","primaryCopySha256":"52d470bb2f8bb45b0fae011a3596ddd2832f37a856c5db18a9d0611f09077c01"},
  {"slug":"search-console-is-not-analytics","title":"Search Console is not Analytics—and that is useful","h1":"Search Console is not Analytics—and that is useful","description":"One shows how Google Search saw and surfaced your pages. The other records configured behavior after visits.","published":"July 7, 2026","primaryCopySha256":"4b26f8505f78e82833447a4d1920213cedfc55bcce850dc727f08ce7727e14fe"},
  {"slug":"canonical-tags-when-they-work","title":"Canonical tags: what they solve, what they merely suggest","h1":"Canonical tags: what they solve, what they merely suggest","description":"A canonical is a consolidation signal, not a cleanup crew. Use it for duplicates, not as a substitute for URL discipline.","published":"July 6, 2026","primaryCopySha256":"a6a213ee452b4add8e44bae787c746c2b277b2fb68283858ac9bbce6be3db8af"},
  {"slug":"seo-migration-launch-checklist","title":"The no-drama SEO migration launch checklist","h1":"The no-drama SEO migration launch checklist","description":"A compact launch sequence for protecting valuable URLs, signals, measurement, and rollback options during a site move.","published":"July 5, 2026","primaryCopySha256":"4015bda7cc2bd2cdb937562cdc61f9332a25a5f1b96508c9d0d00d49c5ffcae9"},
  {"slug":"what-an-seo-report-should-answer","title":"Seven questions every SEO report should answer","h1":"Seven questions every SEO report should answer","description":"Reporting should reduce uncertainty and change decisions. If it only inventories activity, it is a receipt for busyness.","published":"July 4, 2026","primaryCopySha256":"49bb519fa8ee23a2aaed88a62e5fbb892a05a0d5fdacc2ecf781c8f6ca2b8a16"},
  {"slug":"ai-overviews-traffic-claims","title":"AI Overviews traffic claims: read the denominator","h1":"AI Overviews traffic claims: read the denominator","description":"Big percentage claims can hide tiny samples, unstable features, mismatched query sets, or traffic that was never commercially useful.","published":"July 3, 2026","primaryCopySha256":"04deed661b3ddb6762b96e6e0d994e81eba3347d98da793c48f56da32954307d"},
  {"slug":"local-seo-provider-scorecard","title":"A local SEO provider scorecard you can actually use","h1":"A local SEO provider scorecard you can actually use","description":"Evaluate access, operating discipline, local evidence, reporting, and ownership before charisma gets a vote.","published":"July 2, 2026","primaryCopySha256":"73e5b37db91280d4e96c30bc5d01e84635655d1770b46ad752f5bd056d90c9d7"},
  {"slug":"internal-links-audit-by-template","title":"Audit internal links by template, not one URL at a time","h1":"Audit internal links by template, not one URL at a time","description":"The scalable unit of technical SEO is often the template. Find repeated link behavior before editing isolated pages.","published":"July 1, 2026","primaryCopySha256":"e474dd16159ac967b1613c77967f8464b36c39acc5b5a2514352709737a2bbde"},
  {"slug":"zero-click-search-study-notes","title":"Zero-click studies: four numbers that change the story","h1":"Zero-click studies: four numbers that change the story","description":"A data note on devices, query samples, result features, and the difference between fewer clicks and less opportunity.","published":"July 1, 2026","primaryCopySha256":"1c840fe5e02523074b45adc3d254eb43bffad756996b1c96847aac158966e91f"}
];

async function publicationSources() {
  const directory = new URL("content/publications/", root);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".md")).sort();
  return Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(file, directory), "utf8")])));
}

function source(overrides = {}) {
  const metadata = {
    slug: "example-record",
    title: "Example record",
    description: "A complete record used to exercise validation.",
    format: "Explainer",
    category: "Testing",
    series: "Registry tests",
    audience: "Maintainers",
    evidenceLevel: "Documented practice",
    author: { name: "Rank Builder SEO Research Desk", type: "Organization" },
    editor: { name: "Rank Builder SEO Editorial Desk", type: "Organization" },
    publishedAt: "2026-07-01",
    revisedAt: "2026-07-01",
    readTime: "1 min read",
    directAnswer: "Validated records fail closed.",
    takeaways: ["Validate before rendering"],
    claimLimits: ["This fixture proves validation behavior only."],
    citations: [],
    correctionHistory: [],
    relatedContent: [],
    ...overrides,
  };
  return `---\n${JSON.stringify(metadata, null, 2)}\n---\n\n## One section\n\nOne paragraph.\n`;
}

test("loads the canonical Markdown registry with complete typed metadata", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  assert.equal(publications.length, 12);
  assert.equal(new Set(publications.map(({ slug }) => slug)).size, publications.length);
  for (const publication of publications) {
    assert.ok(publication.author.name);
    assert.ok(publication.editor.name);
    assert.ok(publication.directAnswer);
    assert.ok(publication.takeaways.length);
    assert.ok(publication.claimLimits.length);
    assert.ok(Array.isArray(publication.citations));
    assert.ok(Array.isArray(publication.correctionHistory));
    assert.ok(Array.isArray(publication.relatedContent));
    assert.ok(publication.sections.length);
  }
});

test("rejects duplicate slugs, broken related references, and missing required citations", () => {
  assert.throws(
    () => loadPublicationRegistry({ "one.md": source(), "two.md": source() }),
    /duplicate publication slug: example-record/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({ relatedContent: ["missing-record"] }) }),
    /unknown related publication: missing-record/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({ evidenceLevel: "Primary sources" }) }),
    /primary sources.*citation/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "escape.md": source({ slug: "../escape" }) }),
    /url-safe slug/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({ relatedContent: ["other", "other"] }), "other.md": source({ slug: "other" }) }),
    /duplicate value: other/i,
  );
});

test("rejects unsafe identities, invalid dates, invalid citation URLs, and inconsistent correction history", () => {
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({ publishedAt: "2026-02-31", revisedAt: "2026-03-01" }) }),
    /must be an ISO date/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({ author: { name: "Unsafe", type: "Organization", url: "javascript:alert(1)" } }) }),
    /root-relative path or HTTPS URL/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({
      evidenceLevel: "Primary sources",
      citations: [{ id: "insecure", title: "Insecure", url: "http://example.com", publisher: "Fixture" }],
    }) }),
    /must use HTTPS/i,
  );
  assert.throws(
    () => loadPublicationRegistry({ "example-record.md": source({
      correctionHistory: [{ date: "2026-07-02", summary: "Correction after the declared revision." }],
    }) }),
    /correction dates must fall between publishedAt and revisedAt/i,
  );
});

test("generates only the authoritative article route family", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  const routes = publicationRoutePaths(publications);
  assert.equal(routes.length, 12);
  assert.ok(routes.every((route) => route.startsWith("/articles/")));
  assert.ok(routes.every((route) => !route.startsWith("/guides/")));
});

test("preserves protected URL, title, H1, description, date, and primary copy signals", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  const parity = protectedParity;
  const actual = publications.map((publication) => ({
    slug: publication.slug,
    title: publication.title,
    h1: publication.title,
    description: publication.description,
    published: formatPublicationDate(publication.publishedAt),
    primaryCopySha256: createHash("sha256")
      .update(publication.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join("\n"))
      .digest("hex"),
  }));
  assert.deepEqual(actual, parity);
});

test("validates glossary and experiment references from separate registries", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  const glossary = parseGlossaryRegistrySource(await readFile(new URL("content/glossary.md", root), "utf8"));
  const experiments = parseExperimentRegistrySource(
    await readFile(new URL("content/experiments.md", root), "utf8"),
    publications,
  );
  assert.equal(glossary.length, 12);
  assert.equal(new Set(glossary.map(({ slug }) => slug)).size, glossary.length);
  assert.equal(experiments.length, 3);
  assert.ok(experiments.every(({ relatedPublications }) => relatedPublications.every((slug) => publications.some((item) => item.slug === slug))));
});

test("rejects experiment links to unknown publications", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  const invalid = `---\n${JSON.stringify({ experiments: [{
    id: "RB-EXP-999", title: "Broken reference", hypothesis: "A broken link should fail.",
    protocol: ["Validate"], baseline: "No baseline", measurementWindow: "1 day", status: "Queued",
    measurement: "None", result: "Pending", limitations: ["Fixture only"], relatedPublications: ["missing"],
  }] })}\n---\n`;
  assert.throws(() => parseExperimentRegistrySource(invalid, publications), /unknown related publication: missing/i);
});

test("generates valid Organization, Article, DefinedTerm, and Breadcrumb records", async () => {
  const publications = loadPublicationRegistry(await publicationSources());
  const glossary = parseGlossaryRegistrySource(await readFile(new URL("content/glossary.md", root), "utf8"));
  const organization = organizationStructuredData();
  const article = articleStructuredData(publications[0]);
  const term = glossaryStructuredData(glossary[0]);
  assert.equal(organization["@type"], "Organization");
  assert.deepEqual(article["@graph"].map((item) => item["@type"]), ["Article", "BreadcrumbList"]);
  assert.deepEqual(term["@graph"].map((item) => item["@type"]), ["DefinedTerm", "BreadcrumbList"]);
  assert.equal(article["@graph"][0].mainEntityOfPage, `https://rankbuilderseo.com/articles/${publications[0].slug}`);
  assert.doesNotThrow(() => JSON.parse(serializeStructuredData(article)));
  assert.doesNotMatch(serializeStructuredData({ value: "</script>" }), /<\/script>/i);
});
