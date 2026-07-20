import {
  citationModes,
  isoDate,
  object,
  oneOf,
  optionalString,
  parseControlledRegistries,
  parseMediaRegistry,
  publicationExposure,
  publicationRelationshipDiagnostics,
  readingMetrics,
  requiredString,
  slugValue,
  stringList,
  unique,
  validateCitationConflicts,
  validateCitationUsage,
  validateDocumentMedia,
  validateLifecycleMetadata,
  type CitationMode,
  type ControlledRegistries,
  type EditorialIdentity,
  type LifecycleRecord,
  type MediaRecord,
} from "./contract.ts";
import {
  markdownPlainText,
  parseSafeMarkdown,
  renderedWordCount,
  type MarkdownSection,
  type SafeMarkdownDocument,
} from "./markdown.ts";

export { parseControlledRegistries, parseMediaRegistry, publicationExposure, publicationRelationshipDiagnostics } from "./contract.ts";
export { headingSlug, isSafeLinkTarget, isSafeMediaSource, parseSafeMarkdown } from "./markdown.ts";

export const publicationFormats = ["Explainer", "Playbook", "Claim check", "Data note", "Checklist"] as const;
export const authoringContracts = ["canonical-v1", "legacy-protected-v1"] as const;
const legacyProtectedPublicationSlugs = new Set([
  "ai-overviews-traffic-claims", "canonical-tags-when-they-work", "how-to-read-an-seo-audit",
  "internal-links-audit-by-template", "local-seo-provider-scorecard", "ranking-guarantees",
  "search-console-is-not-analytics", "seo-migration-launch-checklist", "seo-pricing-without-fairy-tales",
  "technical-seo-baseline", "what-an-seo-report-should-answer", "zero-click-search-study-notes",
]);
export const evidenceLevels = ["Primary sources", "Documented practice", "Desk analysis"] as const;
export const experimentStatuses = ["Queued", "Measuring", "Complete", "Inconclusive"] as const;
const establishedGlossarySlugs = new Set([
  "canonical-url", "conversion", "crawling", "indexing", "google-search-console", "xml-sitemap",
  "robots-txt", "redirect", "search-intent", "technical-seo", "web-analytics", "domain-name",
]);

export type PublicationFormat = (typeof publicationFormats)[number];
export type AuthoringContract = (typeof authoringContracts)[number];
export type EvidenceLevel = (typeof evidenceLevels)[number];
export type ExperimentStatus = (typeof experimentStatuses)[number];

export type Citation = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  accessedAt?: string;
};

export type CorrectionRecord = { date: string; summary: string };
export type PublicationSection = MarkdownSection;

export type Publication = LifecycleRecord & {
  slug: string;
  title: string;
  description: string;
  format: PublicationFormat;
  authoringContract: AuthoringContract;
  category: string;
  series: string;
  audience: string;
  evidenceLevel: EvidenceLevel;
  authorId: string;
  editorId: string;
  author: EditorialIdentity;
  editor: EditorialIdentity;
  publishedAt: string;
  revisedAt: string;
  revisionNote?: string;
  citationMode: CitationMode;
  directAnswer: string;
  takeaways: string[];
  claimLimits: string[];
  citations: Citation[];
  correctionHistory: CorrectionRecord[];
  relatedContent: string[];
  document: SafeMarkdownDocument;
  sections: PublicationSection[];
  wordCount: number;
  readingMinutes: number;
  readTime: string;
  readTimeOverrideMinutes?: number;
  sourceFile: string;
};

export type GlossaryEntry = {
  term: string;
  slug: string;
  category: string;
  status: "established" | "new";
  short: string;
  full: string;
  myth: string;
  citations: Citation[];
};

export type Experiment = {
  id: string;
  title: string;
  hypothesis: string;
  protocol: string[];
  baseline: string;
  measurementWindow: string;
  status: ExperimentStatus;
  measurement: string;
  cohort: string;
  intervention: string;
  startedAt?: string;
  baselineCapturedAt?: string;
  endedAt?: string;
  resultPublishedAt?: string;
  result: string;
  inconclusiveReason?: string;
  limitations: string[];
  provenance: string[];
  relatedPublications: string[];
};

type UnknownRecord = Record<string, unknown>;

function fail(label: string, message: string): never {
  throw new Error(`${label}: ${message}`);
}

export function parseFrontMatter(source: string, label: string): { metadata: UnknownRecord; body: string } {
  const normalized = source.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) fail(label, "must begin with JSON front matter between --- delimiters");
  let metadata: unknown;
  try {
    metadata = JSON.parse(match[1]);
  } catch (error) {
    fail(label, `front matter is not valid JSON (${error instanceof Error ? error.message : "unknown error"})`);
  }
  return { metadata: object(metadata, `${label} front matter`), body: match[2] };
}

function httpsUrl(value: unknown, label: string): string {
  const result = requiredString(value, label);
  let parsed: URL;
  try {
    parsed = new URL(result);
  } catch {
    fail(label, "must be an absolute HTTPS URL");
  }
  if (parsed!.protocol !== "https:" || parsed!.username || parsed!.password) fail(label, "must use HTTPS without URL credentials");
  return result;
}

function citation(value: unknown, label: string): Citation {
  const item = object(value, label);
  const accessedAt = item.accessedAt === undefined ? undefined : isoDate(item.accessedAt, `${label}.accessedAt`);
  return {
    id: slugValue(item.id, `${label}.id`),
    title: requiredString(item.title, `${label}.title`),
    url: httpsUrl(item.url, `${label}.url`),
    publisher: requiredString(item.publisher, `${label}.publisher`),
    ...(accessedAt ? { accessedAt } : {}),
  };
}

function citations(value: unknown, label: string): Citation[] {
  if (!Array.isArray(value)) fail(label, "must be an array");
  const items = value.map((item, index) => citation(item, `${label}[${index}]`));
  unique(items.map(({ id }) => id), label);
  return items;
}

function corrections(value: unknown, label: string): CorrectionRecord[] {
  if (!Array.isArray(value)) fail(label, "must be an array");
  const result = value.map((raw, index) => {
    const item = object(raw, `${label}[${index}]`);
    return { date: isoDate(item.date, `${label}[${index}].date`), summary: requiredString(item.summary, `${label}[${index}].summary`) };
  });
  unique(result.map(({ date, summary }) => `${date}\n${summary}`), label);
  return result;
}

function controlledValue(value: unknown, allowed: readonly string[], label: string): string {
  const result = requiredString(value, label);
  if (!allowed.includes(result)) fail(label, `must reference an approved registry value: ${allowed.join(", ")}`);
  return result;
}

function identityReference(value: unknown, identities: Map<string, EditorialIdentity>, label: string): { id: string; identity: EditorialIdentity } {
  const id = slugValue(value, label);
  const identity = identities.get(id);
  if (!identity) fail(label, `unknown controlled identity: ${id}`);
  return { id, identity };
}

const minimumArticleWords: Record<PublicationFormat, number> = {
  Explainer: 700,
  Playbook: 900,
  "Claim check": 900,
  "Data note": 700,
  Checklist: 600,
};

const templateMarkerPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "Replace this", pattern: /\breplace this\b/i },
  { label: "draft format label", pattern: /\bdraft (?:explainer|playbook|claim check|data note|checklist)\b/i },
  { label: "placeholder", pattern: /\bplaceholder\b/i },
  { label: "authoring-example", pattern: /authoring-example/i },
  { label: "template takeaway", pattern: /\b(?:validate inputs|keep output bounded|review evidence|first durable takeaway|second durable takeaway|third durable takeaway)\b/i },
  { label: "template claim limit", pattern: /state what this article cannot establish/i },
  { label: "template caption", pattern: /example of a controlled editorial figure/i },
  { label: "template revision note", pattern: /authoring and revision notes|before moving this draft/i },
];

function templateMarker(value: string): string | undefined {
  return templateMarkerPatterns.find(({ pattern }) => pattern.test(value))?.label;
}

function validateNoTemplateMarkers(publication: Publication, media: readonly MediaRecord[]): void {
  if (publication.state === "draft" || publication.authoringContract !== "canonical-v1") return;
  const values: Array<[string, string]> = [
    ["title", publication.title],
    ["description", publication.description],
    ["directAnswer", publication.directAnswer],
    ...publication.takeaways.map((value, index) => [`takeaways[${index}]`, value] as [string, string]),
    ...publication.claimLimits.map((value, index) => [`claimLimits[${index}]`, value] as [string, string]),
    ["body", markdownPlainText(publication.document)],
    ...(publication.revisionNote ? [["revisionNote", publication.revisionNote] as [string, string]] : []),
  ];
  for (const figure of publication.document.figures) {
    values.push([`figure ${figure.src} caption`, figure.caption], [`figure ${figure.src} source`, figure.src]);
    const record = media.find(({ src }) => src === figure.src);
    if (record) {
      values.push(
        [`media ${record.id} id`, record.id],
        [`media ${record.id} alt`, record.alt],
        [`media ${record.id} caption`, record.caption],
        [`media ${record.id} credit`, record.credit],
      );
    }
  }
  for (const [field, value] of values) {
    const marker = templateMarker(value);
    if (marker) fail(publication.sourceFile, `${field} contains prohibited template marker: ${marker}`);
  }
}

function sectionProseWords(section: MarkdownSection): number {
  const quotes = section.blocks
    .filter((block) => block.type === "blockquote")
    .map((block) => block.type === "blockquote"
      ? block.children.map((node) => node.type === "text" || node.type === "code" ? node.value : "").join(" ")
      : "");
  return renderedWordCount(section.paragraphs, quotes);
}

function formatRequirements(publication: Publication, warnings: string[]): void {
  if (publication.state === "draft") return;
  if (publication.authoringContract === "legacy-protected-v1") return;

  const byRole = new Map(publication.document.sections.map((section) => [section.heading.toLocaleLowerCase("en-US"), section]));
  const requireRole = (role: string, requireProse = true) => {
    const section = byRole.get(role.toLocaleLowerCase("en-US"));
    if (!section) fail(publication.sourceFile, `${publication.format} requires a "${role}" section under canonical-v1`);
    if (requireProse && sectionProseWords(section) < 75) {
      fail(publication.sourceFile, `${publication.format} requires at least 75 words of meaningful prose in "${role}"`);
    }
    return section;
  };
  const listItems = (role: string, ordered: boolean) => requireRole(role, false).blocks
    .reduce((count, block) => block.type === "list" && block.ordered === ordered ? count + block.items.length : count, 0);

  if (publication.format === "Claim check") {
    requireRole("Identified claim");
    requireRole("Sources and evidence");
    requireRole("Conclusion");
    requireRole("Limitations");
    if (publication.citations.length === 0) fail(publication.sourceFile, "Claim check requires at least one identified source");
    if (renderedWordCount(publication.claimLimits) < 20) fail(publication.sourceFile, "Claim check requires meaningful limitations of at least 20 words");
  } else if (publication.format === "Data note") {
    requireRole("Dataset and period");
    requireRole("Methodology");
    requireRole("Result");
    requireRole("Limitations");
    if (publication.citations.length === 0) fail(publication.sourceFile, "Data note requires a dataset/source citation");
    if (renderedWordCount(publication.claimLimits) < 20) fail(publication.sourceFile, "Data note requires meaningful limitations of at least 20 words");
  } else if (publication.format === "Playbook") {
    requireRole("Preconditions");
    requireRole("Failure cases");
    const steps = listItems("Ordered process", true);
    if (steps < 2) fail(publication.sourceFile, "Playbook requires at least two ordered process items");
    if (steps < 4) warnings.push(`${publication.slug}: playbook has ${steps} ordered steps; review whether at least four substantive steps are needed`);
  } else if (publication.format === "Checklist") {
    requireRole("Completion criteria");
    const items = listItems("Checklist", false);
    if (items < 3) fail(publication.sourceFile, "Checklist requires at least three actual checklist items");
    if (items < 5) warnings.push(`${publication.slug}: checklist has ${items} items; review whether at least five substantive items are needed`);
  } else {
    requireRole("Definition");
    requireRole("Mechanism");
    requireRole("Examples");
    requireRole("Boundaries");
  }
  const minimum = minimumArticleWords[publication.format];
  if (publication.wordCount < minimum) {
    fail(publication.sourceFile, `${publication.format} requires at least ${minimum} rendered words before ${publication.state}; found ${publication.wordCount}`);
  }
}

function normalizedMetadata(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function tokenSimilarity(left: string, right: string): number {
  const a = new Set(normalizedMetadata(left).split(" ").filter(Boolean));
  const b = new Set(normalizedMetadata(right).split(" ").filter(Boolean));
  if (a.size === 0 || b.size === 0) return 0;
  const overlap = [...a].filter((value) => b.has(value)).length;
  return overlap / new Set([...a, ...b]).size;
}

function publicationMetadataDiagnostics(publications: readonly Publication[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const field of ["title", "description"] as const) {
    const exact = new Map<string, string>();
    for (const publication of publications) {
      const normalized = normalizedMetadata(publication[field]);
      const previous = exact.get(normalized);
      if (previous) errors.push(`duplicate publication ${field}: ${previous} and ${publication.slug}`);
      else exact.set(normalized, publication.slug);
    }
  }
  for (let left = 0; left < publications.length; left += 1) {
    for (let right = left + 1; right < publications.length; right += 1) {
      for (const field of ["title", "description"] as const) {
        const similarity = tokenSimilarity(publications[left][field], publications[right][field]);
        if (similarity >= 0.82 && normalizedMetadata(publications[left][field]) !== normalizedMetadata(publications[right][field])) {
          warnings.push(`${publications[left].slug} and ${publications[right].slug}: near-duplicate ${field} (${similarity.toFixed(2)})`);
        }
      }
    }
  }
  const boilerplate = new Map<string, Set<string>>();
  for (const publication of publications.filter((item) => item.authoringContract === "canonical-v1" && item.state !== "draft")) {
    for (const value of [publication.directAnswer, ...publication.takeaways, ...publication.claimLimits]) {
      const normalized = normalizedMetadata(value);
      if (normalized.split(" ").length < 6) continue;
      const slugs = boilerplate.get(normalized) ?? new Set<string>();
      slugs.add(publication.slug);
      boilerplate.set(normalized, slugs);
    }
  }
  for (const slugs of boilerplate.values()) {
    if (slugs.size >= 3) warnings.push(`repeated generic boilerplate across ${slugs.size} records: ${[...slugs].join(", ")}`);
  }
  for (const publication of publications.filter((item) => item.authoringContract === "canonical-v1" && item.state !== "draft")) {
    if (publication.title.length < 25 || publication.title.length > 75) {
      warnings.push(`${publication.slug}: title length ${publication.title.length} is outside the 25-75 character editorial range`);
    }
    if (publication.description.length < 100 || publication.description.length > 180) {
      warnings.push(`${publication.slug}: description length ${publication.description.length} is outside the 100-180 character editorial range`);
    }
  }
  return { errors, warnings };
}

export type PublicationRegistryOptions = {
  registries: ControlledRegistries;
  media: readonly MediaRecord[];
  now?: Date;
  relationshipWarnings?: string[];
};

function parsePublicationSource(source: string, sourceFile: string, options: PublicationRegistryOptions): Publication {
  const { metadata, body } = parseFrontMatter(source, sourceFile);
  const publicationSlug = slugValue(metadata.slug, `${sourceFile}.slug`);
  const authoringContract = oneOf(metadata.authoringContract, authoringContracts, `${sourceFile}.authoringContract`);
  const evidenceLevel = oneOf(metadata.evidenceLevel, evidenceLevels, `${sourceFile}.evidenceLevel`);
  const publicationCitations = citations(metadata.citations, `${sourceFile}.citations`);
  if (evidenceLevel === "Primary sources" && publicationCitations.length === 0) {
    fail(sourceFile, "Primary sources evidence requires at least one citation");
  }
  const publishedAt = isoDate(metadata.publishedAt, `${sourceFile}.publishedAt`);
  const revisedAt = isoDate(metadata.revisedAt, `${sourceFile}.revisedAt`);
  if (revisedAt < publishedAt) fail(sourceFile, "revisedAt cannot precede publishedAt");
  const correctionHistory = corrections(metadata.correctionHistory, `${sourceFile}.correctionHistory`);
  for (const correction of correctionHistory) {
    if (correction.date < publishedAt || correction.date > revisedAt) {
      fail(sourceFile, "correction dates must fall between publishedAt and revisedAt");
    }
  }
  const lifecycle = validateLifecycleMetadata(metadata, sourceFile, publishedAt, revisedAt, options.now ?? new Date());
  if (authoringContract === "legacy-protected-v1") {
    if (!legacyProtectedPublicationSlugs.has(publicationSlug)) {
      fail(sourceFile, "legacy-protected-v1 is reserved for the exact twelve protected migration slugs");
    }
    if (lifecycle.state !== "published") fail(sourceFile, "legacy-protected-v1 is limited to retained published records");
  }
  const author = identityReference(metadata.author, options.registries.authors, `${sourceFile}.author`);
  const editor = identityReference(metadata.editor, options.registries.editors, `${sourceFile}.editor`);
  const document = parseSafeMarkdown(body, sourceFile);
  const citationMode = oneOf(metadata.citationMode, citationModes, `${sourceFile}.citationMode`);
  validateCitationUsage(publicationCitations, document, citationMode, sourceFile);
  validateDocumentMedia(document, options.media, sourceFile, lifecycle.state);
  const directAnswer = requiredString(metadata.directAnswer, `${sourceFile}.directAnswer`);
  const takeaways = stringList(metadata.takeaways, `${sourceFile}.takeaways`);
  const claimLimits = stringList(metadata.claimLimits, `${sourceFile}.claimLimits`);
  const metrics = readingMetrics(document, [directAnswer, ...takeaways, ...claimLimits], metadata.readTimeOverrideMinutes, sourceFile);

  const publication: Publication = {
    slug: publicationSlug,
    title: requiredString(metadata.title, `${sourceFile}.title`),
    description: requiredString(metadata.description, `${sourceFile}.description`),
    format: oneOf(metadata.format, publicationFormats, `${sourceFile}.format`),
    authoringContract,
    category: controlledValue(metadata.category, options.registries.categories, `${sourceFile}.category`),
    series: controlledValue(metadata.series, options.registries.series, `${sourceFile}.series`),
    audience: controlledValue(metadata.audience, options.registries.audiences, `${sourceFile}.audience`),
    evidenceLevel,
    authorId: author.id,
    editorId: editor.id,
    author: author.identity,
    editor: editor.identity,
    publishedAt,
    revisedAt,
    citationMode,
    directAnswer,
    takeaways,
    claimLimits,
    citations: publicationCitations,
    correctionHistory,
    relatedContent: stringList(metadata.relatedContent, `${sourceFile}.relatedContent`, true),
    document,
    sections: document.sections,
    ...metrics,
    ...lifecycle,
    sourceFile,
  };
  validateNoTemplateMarkers(publication, options.media);
  formatRequirements(publication, options.relationshipWarnings ?? []);
  return publication;
}

export function loadPublicationRegistry(sources: Record<string, string>, options: PublicationRegistryOptions): Publication[] {
  const publications = Object.entries(sources).map(([sourceFile, source]) => parsePublicationSource(source, sourceFile, options));
  const slugs = new Set<string>();
  for (const publication of publications) {
    if (slugs.has(publication.slug)) fail("publication registry", `duplicate publication slug: ${publication.slug}`);
    slugs.add(publication.slug);
  }
  const metadataDiagnostics = publicationMetadataDiagnostics(publications);
  if (metadataDiagnostics.errors.length > 0) fail("publication registry", metadataDiagnostics.errors.join("; "));
  options.relationshipWarnings?.push(...metadataDiagnostics.warnings);
  for (const publication of publications) {
    const fileSlug = publication.sourceFile.split("/").at(-1)?.replace(/\.md$/, "");
    if (fileSlug && fileSlug !== publication.slug) fail(publication.sourceFile, `filename must match publication slug: ${publication.slug}`);
    for (const relatedSlug of publication.relatedContent) {
      if (relatedSlug === publication.slug) fail(publication.sourceFile, "a publication cannot relate to itself");
      if (!slugs.has(relatedSlug)) fail(publication.sourceFile, `unknown related publication: ${relatedSlug}`);
    }
  }
  const publicationsBySlug = new Map(publications.map((publication) => [publication.slug, publication]));
  const at = options.now ?? new Date();
  for (const publication of publications) {
    if (publication.state !== "archived" || publication.archiveDisposition === "retained-public") continue;
    const targetSlug = publication.archiveTarget?.match(/^\/articles\/([a-z0-9-]+)$/)?.[1];
    if (!targetSlug) fail(publication.sourceFile, "archived redirect/replacement targets must use /articles/<slug>");
    const target = publicationsBySlug.get(targetSlug);
    if (!target || publicationExposure(target, at).route !== "public") {
      fail(publication.sourceFile, `archiveTarget must resolve to a public article: ${publication.archiveTarget}`);
    }
  }
  validateCitationConflicts(publications.map((publication) => ({ label: publication.sourceFile, citations: publication.citations })));
  const diagnostics = publicationRelationshipDiagnostics(publications, [], at);
  if (diagnostics.errors.length > 0) fail("publication relationships", diagnostics.errors.join("; "));
  options.relationshipWarnings?.push(...diagnostics.warnings);
  return publications.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug));
}

export function publicationsForSurface(
  publications: readonly Publication[],
  surface: "route" | "feed" | "sitemap" | "related" | "index",
  at = new Date(),
): Publication[] {
  return publications.filter((publication) => {
    const exposure = publicationExposure(publication, at);
    if (surface === "route") return exposure.route !== "hidden";
    if (surface === "index") return exposure.indexable;
    return exposure[surface];
  });
}

export function publicationRoutePaths(publications: readonly Publication[], at = new Date()): string[] {
  return publicationsForSurface(publications, "route", at).map(({ slug }) => `/articles/${slug}`);
}

export function formatPublicationDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export function parseGlossaryRegistrySource(source: string, registries: ControlledRegistries): GlossaryEntry[] {
  const { metadata } = parseFrontMatter(source, "content/glossary.md");
  if (!Array.isArray(metadata.entries)) fail("content/glossary.md.entries", "must be an array");
  const slugs = new Set<string>();
  const entries = metadata.entries.map((value, index) => {
    const label = `content/glossary.md.entries[${index}]`;
    const item = object(value, label);
    const entrySlug = slugValue(item.slug, `${label}.slug`);
    if (slugs.has(entrySlug)) fail("glossary registry", `duplicate glossary slug: ${entrySlug}`);
    slugs.add(entrySlug);
    return {
      term: requiredString(item.term, `${label}.term`),
      slug: entrySlug,
      category: controlledValue(item.category, registries.glossaryCategories, `${label}.category`),
      status: item.status === undefined && establishedGlossarySlugs.has(entrySlug)
        ? "established" as const
        : oneOf(item.status, ["established", "new"] as const, `${label}.status`),
      short: requiredString(item.short, `${label}.short`),
      full: requiredString(item.full, `${label}.full`),
      myth: requiredString(item.myth, `${label}.myth`),
      citations: item.citations === undefined ? [] : citations(item.citations, `${label}.citations`),
    };
  });
  validateCitationConflicts(entries.map((entry) => ({ label: `glossary/${entry.slug}`, citations: entry.citations })));
  return entries;
}

function optionalDate(value: unknown, label: string): string | undefined {
  return value === undefined ? undefined : isoDate(value, label);
}

export function parseExperimentRegistrySource(source: string, publications: readonly Publication[]): Experiment[] {
  const { metadata } = parseFrontMatter(source, "content/experiments.md");
  if (!Array.isArray(metadata.experiments)) fail("content/experiments.md.experiments", "must be an array");
  const publicationSlugs = new Set(publications.map(({ slug }) => slug));
  const ids = new Set<string>();

  return metadata.experiments.map((value, index) => {
    const label = `content/experiments.md.experiments[${index}]`;
    const item = object(value, label);
    const id = requiredString(item.id, `${label}.id`);
    if (!/^RB-EXP-\d{3}$/.test(id)) fail(`${label}.id`, "must use RB-EXP-NNN format");
    if (ids.has(id)) fail("experiment registry", `duplicate experiment id: ${id}`);
    ids.add(id);
    const relatedPublications = stringList(item.relatedPublications, `${label}.relatedPublications`, true);
    for (const relatedSlug of relatedPublications) if (!publicationSlugs.has(relatedSlug)) fail(label, `unknown related publication: ${relatedSlug}`);
    const status = oneOf(item.status, experimentStatuses, `${label}.status`);
    const startedAt = optionalDate(item.startedAt, `${label}.startedAt`);
    const baselineCapturedAt = optionalDate(item.baselineCapturedAt, `${label}.baselineCapturedAt`);
    const endedAt = optionalDate(item.endedAt, `${label}.endedAt`);
    const resultPublishedAt = optionalDate(item.resultPublishedAt, `${label}.resultPublishedAt`);
    const result = requiredString(item.result, `${label}.result`);
    const pendingResult = /^(?:pending|not started)/i.test(result);
    const inconclusiveReason = optionalString(item.inconclusiveReason, `${label}.inconclusiveReason`);
    const provenance = item.provenance === undefined ? [] : stringList(item.provenance, `${label}.provenance`);

    if (status === "Queued") {
      if (startedAt || baselineCapturedAt || endedAt || resultPublishedAt || !pendingResult) fail(label, "Queued experiments cannot claim dates or a result");
    } else {
      if (!startedAt || !baselineCapturedAt) fail(label, `${status} experiments require startedAt and baselineCapturedAt`);
      if (provenance.length === 0) fail(label, `${status} experiments require explicit evidence provenance`);
      if (baselineCapturedAt > startedAt) fail(label, "baselineCapturedAt cannot follow startedAt");
      if (status === "Measuring" && (endedAt || resultPublishedAt || !pendingResult)) fail(label, "Measuring experiments cannot claim an end or published result");
      if (status === "Complete" || status === "Inconclusive") {
        if (!endedAt || !resultPublishedAt || pendingResult) fail(label, `${status} experiments require an end date and published result`);
        if (endedAt < startedAt || resultPublishedAt < endedAt) fail(label, "experiment lifecycle dates are out of order");
      }
      if (status === "Inconclusive" && !inconclusiveReason) fail(label, "Inconclusive experiments require inconclusiveReason");
    }

    return {
      id,
      title: requiredString(item.title, `${label}.title`),
      hypothesis: requiredString(item.hypothesis, `${label}.hypothesis`),
      protocol: stringList(item.protocol, `${label}.protocol`),
      baseline: requiredString(item.baseline, `${label}.baseline`),
      measurementWindow: requiredString(item.measurementWindow, `${label}.measurementWindow`),
      status,
      measurement: requiredString(item.measurement, `${label}.measurement`),
      cohort: requiredString(item.cohort, `${label}.cohort`),
      intervention: requiredString(item.intervention, `${label}.intervention`),
      ...(startedAt ? { startedAt } : {}),
      ...(baselineCapturedAt ? { baselineCapturedAt } : {}),
      ...(endedAt ? { endedAt } : {}),
      ...(resultPublishedAt ? { resultPublishedAt } : {}),
      result,
      ...(inconclusiveReason ? { inconclusiveReason } : {}),
      limitations: stringList(item.limitations, `${label}.limitations`),
      provenance,
      relatedPublications,
    };
  });
}

export function validateCompleteContentRegistry(
  publications: readonly Publication[],
  glossary: readonly GlossaryEntry[],
  warnings: string[] = [],
  at = new Date(),
): void {
  validateCitationConflicts([
    ...publications.map((publication) => ({ label: publication.sourceFile, citations: publication.citations })),
    ...glossary.map((entry) => ({ label: `glossary/${entry.slug}`, citations: entry.citations })),
  ]);
  const diagnostics = publicationRelationshipDiagnostics(publications, glossary, at);
  if (diagnostics.errors.length > 0) fail("content relationships", diagnostics.errors.join("; "));
  warnings.push(...diagnostics.warnings);
}

export type RegistryBundleSources = {
  publications: Record<string, string>;
  registries: string;
  media: string;
  glossary: string;
  experiments: string;
};

export function loadCompleteContentRegistry(sources: RegistryBundleSources, now = new Date()) {
  const registries = parseControlledRegistries(sources.registries);
  const media = parseMediaRegistry(sources.media);
  const warnings: string[] = [];
  const publications = loadPublicationRegistry(sources.publications, { registries, media, now, relationshipWarnings: warnings });
  const glossary = parseGlossaryRegistrySource(sources.glossary, registries);
  const experiments = parseExperimentRegistrySource(sources.experiments, publications);
  validateCompleteContentRegistry(publications, glossary, warnings, now);
  return { registries, media, publications, glossary, experiments, warnings: [...new Set(warnings)] };
}
