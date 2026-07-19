import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  loadPublicationRegistry,
  parseControlledRegistries,
  parseExperimentRegistrySource,
  parseMediaRegistry,
  parseSafeMarkdown,
  publicationExposure,
  publicationRelationshipDiagnostics,
} from "../app/content/registry.ts";
import {
  readingMetrics,
  validateCitationConflicts,
  validateCitationUsage,
  validateDocumentMedia,
} from "../app/content/contract.ts";
import { inspectSource, resolvePublicTarget, runSourceLinkCheck } from "../scripts/check-source-links.mjs";
import { mediaDimensions, validateMediaFiles } from "../scripts/content-check.mjs";
import { scaffoldPublication } from "../scripts/content-new.mjs";
import { semanticSignature, stableEntries } from "../app/content/stable-keys.ts";

const root = new URL("../", import.meta.url);
const registries = parseControlledRegistries(await readFile(new URL("content/registries.json", root), "utf8"));
const media = parseMediaRegistry(await readFile(new URL("content/media.json", root), "utf8"));
const registriesSource = await readFile(new URL("content/registries.json", root), "utf8");
const NOW = new Date("2026-07-19T00:00:00Z");

function publicationSource({ metadata = {}, body } = {}) {
  const record = {
    slug: "fixture-record",
    title: "Fixture record",
    description: "A bounded fixture used to prove the authoring contract.",
    format: "Explainer",
    authoringContract: "canonical-v1",
    category: registries.categories[0],
    series: registries.series[0],
    audience: registries.audiences[0],
    evidenceLevel: "Documented practice",
    state: "draft",
    citationMode: "references-only",
    author: [...registries.authors.keys()][0],
    editor: [...registries.editors.keys()][0],
    publishedAt: "2026-07-18",
    revisedAt: "2026-07-18",
    directAnswer: "The contract fails closed.",
    takeaways: ["Validate inputs", "Keep output bounded", "Review evidence"],
    claimLimits: ["Fixtures prove software behavior, not an SEO result."],
    citations: [],
    correctionHistory: [],
    relatedContent: [],
    ...metadata,
  };
  const content = body ?? "## Definition\n\nDefine the fixture.\n\n## Mechanism\n\nExplain the mechanism.\n\n## Boundaries\n\nState the boundary.\n";
  return `---\n${JSON.stringify(record, null, 2)}\n---\n\n${content}`;
}

function loadOne(options = {}) {
  const source = publicationSource(options);
  const slug = options.metadata?.slug ?? "fixture-record";
  return loadPublicationRegistry({ [`content/publications/${slug}.md`]: source }, { registries, media, now: NOW })[0];
}

test("renders the contracted Markdown subset into a typed safe document", () => {
  const document = parseSafeMarkdown(`## Supported syntax {#stable-anchor}

A [safe link](https://example.com/source), [local link](/articles), **bold**, *italics*, \`inline code\`, and a citation.[@source-id]

1. First ordered step
2. Second ordered step

- One bullet
- Another bullet

\`\`\`js
const safe = true;
\`\`\`

> [!NOTE]
> A bounded callout.

| Signal | Meaning |
| --- | --- |
| One | Two |

![Three connected boxes labeled question, evidence, and bounded answer](/media/authoring-example.svg "Example of a controlled editorial figure; replace or remove it before review.")

## Fragment target

Return to [the stable section](#stable-anchor).
`, "supported fixture");
  assert.deepEqual([...new Set(document.blocks.map(({ type }) => type))], [
    "heading", "paragraph", "list", "code", "blockquote", "table", "figure",
  ]);
  assert.deepEqual(document.citationIds, ["source-id"]);
  assert.deepEqual(document.fragmentLinks, ["stable-anchor"]);
  assert.equal(document.sections[0].id, "stable-anchor");
  assert.ok(document.wordCount > 20);
  validateCitationUsage(
    [{ id: "source-id", title: "Source", url: "https://example.com/source", publisher: "Fixture" }],
    document,
    "inline-required",
    "supported fixture",
  );
  validateDocumentMedia(document, media, "supported fixture");
});

test("rejects raw execution surfaces, unsafe schemes, and unsupported Markdown", () => {
  const invalidBodies = [
    "## Safe\n\n<div>raw</div>",
    "## Safe\n\n<script>alert(1)</script>",
    "## Safe\n\n<iframe src=\"https://example.com\"></iframe>",
    "## Safe\n\n<Widget value=\"unsafe\" />",
    "## Safe\n\n[unsafe](javascript:alert(1))",
    "## Safe\n\n[unsupported](mailto:test@example.com)",
    "# H1 is unsupported",
    "## Safe\n\n- [ ] task",
    "## Safe\n\n  - nested",
    "## Safe\n\n---",
    "## Safe\n\n| A | B |\n| -- | --- |\n| one | two |",
    "## Safe\n\n![remote](https://example.com/a.png \"caption\")",
    "## Safe\n\n[missing](#does-not-exist)",
    "## Same\n\nOne.\n\n## Same\n\nTwo.",
    "## One {#same}\n\nOne.\n\n## Two {#same}\n\nTwo.",
    "## Safe\n\nWidget { arbitrary }",
  ];
  for (const body of invalidBodies) assert.throws(() => parseSafeMarkdown(body, "invalid fixture"), /invalid fixture/i, body);
});

test("citations fail on missing, unused, conflicting, and unsafe records", () => {
  const cited = parseSafeMarkdown("## Evidence\n\nA claim.[@missing]", "citation fixture");
  assert.throws(() => validateCitationUsage([], cited, "inline-required", "citation fixture"), /no source record: missing/i);
  const uncited = parseSafeMarkdown("## Evidence\n\nA claim.", "citation fixture");
  assert.throws(
    () => validateCitationUsage([{ id: "unused", title: "Unused", url: "https://example.com", publisher: "Fixture" }], uncited, "inline-required", "citation fixture"),
    /never cited inline: unused/i,
  );
  assert.throws(() => validateCitationConflicts([
    { label: "one", citations: [{ id: "shared", title: "One", url: "https://example.com/one", publisher: "Fixture" }] },
    { label: "two", citations: [{ id: "shared", title: "Two", url: "https://example.com/two", publisher: "Fixture" }] },
  ]), /conflicting citation id shared/i);
  assert.throws(() => loadOne({ metadata: {
    evidenceLevel: "Primary sources",
    citations: [{ id: "unsafe", title: "Unsafe", url: "http://example.com", publisher: "Fixture" }],
  } }), /must use HTTPS/i);
});

test("controlled media requires descriptive metadata, rights, approval, safe types, local files, and dimensions", async () => {
  const base = {
    id: "fixture-media", src: "/media/fixture.svg", alt: "Descriptive alternative", caption: "Bounded caption",
    credit: "Fixture desk", width: 10, height: 10, mimeType: "image/svg+xml", rights: "owned", status: "approved",
  };
  const parse = (record) => parseMediaRegistry(JSON.stringify({ media: [record] }));
  for (const field of ["alt", "caption", "credit"]) {
    assert.throws(() => parse({ ...base, [field]: "" }), new RegExp(field, "i"));
  }
  assert.throws(() => parse({ ...base, src: "https://example.com/image.svg" }), /local root-relative/i);
  assert.throws(() => parse({ ...base, src: "/media/file.gif", mimeType: "image/gif" }), /local root-relative|must be one of/i);
  assert.throws(() => parse({ ...base, width: 0 }), /integer from 1/i);
  assert.throws(() => parse({ ...base, rights: "licensed" }), /sourceUrl.*required/i);
  const restricted = parse({ ...base, status: "restricted" });
  const figure = parseSafeMarkdown('## Figure\n\n![Descriptive alternative](/media/fixture.svg "Bounded caption")');
  assert.throws(
    () => mediaDimensions(Buffer.from('<svg viewBox="0 0 10 10"><style>@import url(https://example.com/x.css)</style></svg>'), base),
    /document type, entity, script, foreign object, style, event handler, or external reference/i,
  );
  assert.throws(() => mediaDimensions(Buffer.from('<!DOCTYPE svg><svg viewBox="0 0 10 10"/>'), base), /invalid SVG root|document type/i);
  assert.throws(() => validateDocumentMedia(figure, restricted, "media fixture"), /not approved/i);
  await assert.rejects(() => validateMediaFiles(parse(base)), /local media file is missing/i);
  await assert.rejects(
    () => validateMediaFiles([{ ...media[0], width: media[0].width + 1 }]),
    /declared .* actual/i,
  );
});

test("publication exposure covers every route, feed, sitemap, related, and indexing state", () => {
  const future = new Date("2026-07-20T00:00:00Z");
  const matrix = [
    ["draft", { route: "hidden", feed: false, sitemap: false, related: false, indexable: false }],
    ["review", { route: "hidden", feed: false, sitemap: false, related: false, indexable: false }],
    ["scheduled", { scheduledAt: "2026-07-21T00:00:00Z", route: "hidden", feed: false, sitemap: false, related: false, indexable: false }],
    ["scheduled", { scheduledAt: "2026-07-19T00:00:00Z", route: "public", feed: true, sitemap: true, related: true, indexable: true }],
    ["published", { route: "public", feed: true, sitemap: true, related: true, indexable: true }],
    ["archived", { archiveDisposition: "retained-public", route: "public", feed: false, sitemap: false, related: false, indexable: false }],
    ["archived", { archiveDisposition: "redirect", archiveTarget: "/articles/replacement", route: "redirect", feed: false, sitemap: false, related: false, indexable: false }],
  ];
  for (const [state, expected] of matrix) {
    const { scheduledAt, archiveDisposition, archiveTarget, ...surface } = expected;
    assert.deepEqual(
      (({ route, feed, sitemap, related, indexable }) => ({ route, feed, sitemap, related, indexable }))(
        publicationExposure({ state, scheduledAt, archiveDisposition, archiveTarget }, future),
      ),
      surface,
      state,
    );
  }
});

test("word count and reading time come from rendered content and bound overrides", () => {
  const document = parseSafeMarkdown("## Counted words\n\nOne two **three** and \`four\`.", "metrics fixture");
  const computed = readingMetrics(document, ["Five six"], undefined, "metrics fixture");
  assert.equal(computed.wordCount, 9);
  assert.equal(computed.readingMinutes, 1);
  assert.equal(computed.readTime, "1 min read");
  assert.equal(readingMetrics(document, [], 2, "metrics fixture").readingMinutes, 2);
  assert.throws(() => readingMetrics(document, [], 3, "metrics fixture"), /within 1 minute.*computed reading time 1/i);
});

test("controlled taxonomy and identities fail closed", () => {
  assert.throws(() => loadOne({ metadata: { category: "Typo category" } }), /approved registry value/i);
  assert.throws(() => loadOne({ metadata: { series: "Typo series" } }), /approved registry value/i);
  assert.throws(() => loadOne({ metadata: { audience: "Typo audience" } }), /approved registry value/i);
  assert.throws(() => loadOne({ metadata: { author: "unknown-author" } }), /unknown controlled identity/i);
  const unsafe = JSON.parse(registriesSource);
  unsafe.authors["unsafe-author"] = { name: "Unsafe", type: "Organization", url: "javascript:alert(1)" };
  assert.throws(() => parseControlledRegistries(JSON.stringify(unsafe)), /root-relative path or HTTPS URL/i);
});

test("all five format templates scaffold valid drafts and non-draft validation is format-specific", async () => {
  for (const format of ["explainer", "playbook", "claim-check", "data-note", "checklist"]) {
    const result = await scaffoldPublication({ format, slug: `fixture-${format}`, title: `Fixture ${format}`, dryRun: true });
    assert.match(result.source, new RegExp(`"state": "draft"`));
    assert.match(result.source, /## Authoring and revision notes/);
  }

  const formats = [
    ["Explainer", "## Definition\n\nOne.\n\n## Mechanism\n\nTwo.\n\n## Examples\n\nThree.\n\n## Boundaries\n\nFour.", []],
    ["Playbook", "## Preconditions\n\nReady.\n\n## Ordered process\n\n1. One\n2. Two\n\n## Failure cases\n\nStop.", []],
    ["Claim check", "## Identified claim\n\nClaim.\n\n## Sources and evidence\n\nEvidence.\n\n## Conclusion\n\nBounded.\n\n## Limitations\n\nLimited.", [{ id: "source", title: "Source", url: "https://example.com/source", publisher: "Fixture" }]],
    ["Data note", "## Dataset and period\n\nDataset.\n\n## Methodology\n\nMethod.\n\n## Result\n\nResult.\n\n## Limitations\n\nLimited.", [{ id: "source", title: "Source", url: "https://example.com/source", publisher: "Fixture" }]],
    ["Checklist", "## Checklist\n\n- One\n- Two\n- Three\n\n## Completion criteria\n\nComplete.", []],
  ];
  for (const [format, body, citations] of formats) {
    assert.doesNotThrow(() => loadOne({ metadata: { format, state: "review", citations }, body }), format);
  }

  const arbitraryRoles = "## Arbitrary one\n\nOne.\n\n## Arbitrary two\n\nTwo.\n\n## Arbitrary three\n\nThree.\n\n## Arbitrary four\n\nFour.";
  const unorderedPlaybook = "## Preconditions\n\nReady.\n\n## Ordered process\n\nProcess prose only.\n\n## Failure cases\n\nStop.";
  for (const state of ["review", "scheduled", "published"]) {
    const lifecycle = state === "scheduled" ? { state, scheduledAt: "2026-07-18T00:00:00Z" } : { state };
    assert.throws(() => loadOne({ metadata: { ...lifecycle, format: "Explainer" }, body: arbitraryRoles }), /requires a "Definition" section/i, state);
    assert.throws(() => loadOne({ metadata: { ...lifecycle, format: "Playbook" }, body: unorderedPlaybook }), /ordered process items/i, state);
  }

  assert.throws(
    () => loadOne({ metadata: { authoringContract: "legacy-protected-v1", state: "published" } }),
    /reserved for the exact twelve protected migration slugs/i,
  );
  assert.throws(() => loadOne({ metadata: { format: "Explainer", state: "review" }, body: "## Definition\n\nOnly." }), /requires a "Mechanism" section/i);
  assert.throws(() => loadOne({ metadata: { format: "Claim check", state: "review" }, body: "## Identified claim\n\nOne.\n\n## Sources and evidence\n\nTwo.\n\n## Conclusion\n\nThree.\n\n## Limitations\n\nFour." }), /at least one identified source/i);
  assert.throws(() => loadOne({ metadata: { format: "Data note", state: "review" }, body: "## Dataset and period\n\nOne.\n\n## Methodology\n\nTwo.\n\n## Result\n\nThree.\n\n## Limitations\n\nFour." }), /dataset\/source citation/i);
  assert.throws(() => loadOne({ metadata: { format: "Checklist", state: "review" }, body: "## Checklist\n\nOne.\n\n## Completion criteria\n\nTwo." }), /actual checklist items/i);
});

function experimentSource(record) {
  return `---\n${JSON.stringify({ experiments: [record] }, null, 2)}\n---\n`;
}

function experiment(overrides = {}) {
  return {
    id: "RB-EXP-999", title: "Fixture experiment", hypothesis: "Validation improves lifecycle integrity.",
    protocol: ["Capture evidence"], baseline: "A recorded baseline", measurementWindow: "30 days",
    status: "Queued", measurement: "Observed outcome", cohort: "Fixture cohort", intervention: "Fixture change",
    result: "Pending", limitations: ["Fixture only"], relatedPublications: [], ...overrides,
  };
}

test("experiment lifecycle rules reject impossible states and accept complete evidence", () => {
  assert.doesNotThrow(() => parseExperimentRegistrySource(experimentSource(experiment()), []));
  assert.throws(
    () => parseExperimentRegistrySource(experimentSource(experiment({ status: "Queued", startedAt: "2026-07-01" })), []),
    /Queued experiments cannot claim dates/i,
  );
  assert.throws(
    () => parseExperimentRegistrySource(experimentSource(experiment({ status: "Measuring", startedAt: "2026-07-01" })), []),
    /require startedAt and baselineCapturedAt/i,
  );
  assert.throws(
    () => parseExperimentRegistrySource(experimentSource(experiment({
      status: "Measuring", startedAt: "2026-07-02", baselineCapturedAt: "2026-07-01",
    })), []),
    /provenance/i,
  );
  const complete = experiment({
    status: "Complete", startedAt: "2026-07-02", baselineCapturedAt: "2026-07-01",
    endedAt: "2026-07-10", resultPublishedAt: "2026-07-11", result: "A bounded observed result.",
    provenance: ["Fixture evidence record"],
  });
  assert.doesNotThrow(() => parseExperimentRegistrySource(experimentSource(complete), []));
  assert.throws(
    () => parseExperimentRegistrySource(experimentSource({ ...complete, status: "Inconclusive" }), []),
    /require inconclusiveReason/i,
  );
  assert.doesNotThrow(() => parseExperimentRegistrySource(experimentSource({
    ...complete, status: "Inconclusive", inconclusiveReason: "The sample was insufficient.",
  }), []));
});

test("relationship diagnostics flag orphans, excessive or hidden relations, and unused glossary records", () => {
  const docA = parseSafeMarkdown("## Alpha\n\nAlpha mentions Fixture term.");
  const docB = parseSafeMarkdown("## Beta\n\nBeta.");
  const records = [
    { slug: "alpha", category: "One", series: "One", state: "published", relatedContent: ["beta"], document: docA },
    { slug: "beta", category: "One", series: "One", state: "published", relatedContent: ["alpha"], document: docB },
  ];
  assert.deepEqual(publicationRelationshipDiagnostics(records).errors, []);
  const diagnostics = publicationRelationshipDiagnostics(
    [{ ...records[0], relatedContent: [] }, records[1]],
    [{ slug: "fixture-term", term: "Fixture term", status: "new" }],
  );
  assert.ok(diagnostics.errors.some((error) => /needs related reading|no incoming related link/.test(error)));
  assert.ok(diagnostics.errors.some((error) => /new glossary term is unused/.test(error)));
  assert.ok(diagnostics.warnings.some((warning) => /mentions glossary term/.test(warning)));
});

const publicResolver = async () => [{ address: "93.184.216.34", family: 4 }];

test("source targets reject private, reserved, credentialed, DNS-private, and redirect-private destinations", async () => {
  for (const url of [
    "https://127.0.0.1/source",
    "https://10.0.0.1/source",
    "https://169.254.169.254/latest/meta-data",
    "https://[::1]/source",
    "https://[fc00::1]/source",
    "https://192.0.2.1/source",
  ]) {
    await assert.rejects(() => resolvePublicTarget(url, publicResolver), /localhost-like|non-public address/i, url);
  }
  await assert.rejects(() => resolvePublicTarget("http://sources.example.org/source", publicResolver), /HTTPS without URL credentials/i);
  await assert.rejects(() => resolvePublicTarget("https://user:pass@sources.example.org/source", publicResolver), /HTTPS without URL credentials/i);
  await assert.rejects(
    () => resolvePublicTarget("https://sources.example.org/source", async () => [{ address: "192.168.1.20", family: 4 }]),
    /resolves to non-public address 192\.168\.1\.20/i,
  );

  let requests = 0;
  await assert.rejects(
    () => inspectSource(
      { id: "redirect-fixture", title: "Fixture", url: "https://sources.example.org/source", publisher: "Fixture" },
      {
        resolveHost: publicResolver,
        fetchImpl: async () => {
          requests += 1;
          return new Response(null, { status: 302, headers: { location: "https://127.0.0.1/admin" } });
        },
      },
    ),
    /localhost-like|non-public address/i,
  );
  assert.equal(requests, 1, "the redirect target must be rejected before a second request");
});

test("the periodic source-link checker reports failures without making verify network-dependent", async () => {
  const results = await runSourceLinkCheck({
    resolveHost: publicResolver,
    fetchImpl: async () => new Response("Unavailable", { status: 503, headers: { "content-type": "text/plain" } }),
  });
  assert.ok(results.length >= 2);
  assert.ok(results.every(({ issue }) => issue === "HTTP 503"));
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.match(packageJson.scripts["content:links"], /check-source-links/);
  assert.doesNotMatch(packageJson.scripts.verify, /content:links/);
});

test("semantic renderer keys survive distinct-item reordering", async () => {
  const first = stableEntries([{ id: "alpha" }, { id: "beta" }], "fixture", semanticSignature);
  const reordered = stableEntries([{ id: "beta" }, { id: "alpha" }], "fixture", semanticSignature);
  assert.deepEqual(
    Object.fromEntries(first.map(({ key, value }) => [value.id, key])),
    Object.fromEntries(reordered.map(({ key, value }) => [value.id, key])),
  );
  const rendererSource = await readFile(new URL("app/articles/article-content.tsx", root), "utf8");
  assert.match(rendererSource, /stableEntries\(section\.blocks/);
  assert.match(rendererSource, /stableEntries\(block\.items/);
  assert.doesNotMatch(rendererSource, /(?:block|item|row|cell)Index/);
});
