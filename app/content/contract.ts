import type { SafeMarkdownDocument } from "./markdown.ts";
import { isSafeMediaSource } from "./markdown.ts";

export const publicationStates = ["draft", "review", "scheduled", "published", "archived"] as const;
export const citationModes = ["inline-required", "references-only"] as const;
export const archiveDispositions = ["redirect", "replacement", "retained-public"] as const;
export const mediaRights = ["owned", "licensed", "public-domain", "fair-use"] as const;
export const mediaStatuses = ["approved", "restricted", "expired"] as const;
export const mediaMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"] as const;

export type PublicationState = (typeof publicationStates)[number];
export type CitationMode = (typeof citationModes)[number];
export type ArchiveDisposition = (typeof archiveDispositions)[number];
export type MediaRights = (typeof mediaRights)[number];
export type MediaStatus = (typeof mediaStatuses)[number];
export type MediaMimeType = (typeof mediaMimeTypes)[number];

export type EditorialIdentity = {
  id: string;
  name: string;
  type: "Organization" | "Person";
  url?: string;
};

export type ControlledRegistries = {
  categories: string[];
  series: string[];
  audiences: string[];
  glossaryCategories: string[];
  authors: Map<string, EditorialIdentity>;
  editors: Map<string, EditorialIdentity>;
};

export type MediaRecord = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl?: string;
  width: number;
  height: number;
  mimeType: MediaMimeType;
  rights: MediaRights;
  status: MediaStatus;
  templateOnly: boolean;
};

export type PublicationExposure = {
  effectiveState: "hidden" | "published" | "archived";
  route: "public" | "hidden" | "redirect";
  redirectTo?: string;
  feed: boolean;
  sitemap: boolean;
  indexable: boolean;
  related: boolean;
};

type UnknownRecord = Record<string, unknown>;

function fail(label: string, message: string): never {
  throw new Error(`${label}: ${message}`);
}

export function object(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(label, "must be an object");
  return value as UnknownRecord;
}

export function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") fail(label, "must be a non-empty string");
  return value;
}

export function optionalString(value: unknown, label: string): string | undefined {
  return value === undefined ? undefined : requiredString(value, label);
}

export function oneOf<T extends readonly string[]>(value: unknown, choices: T, label: string): T[number] {
  const result = requiredString(value, label);
  if (!choices.includes(result)) fail(label, `must be one of: ${choices.join(", ")}`);
  return result as T[number];
}

export function stringList(value: unknown, label: string, allowEmpty = false): string[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    fail(label, allowEmpty ? "must be an array" : "must be a non-empty array");
  }
  return unique(value.map((item, index) => requiredString(item, `${label}[${index}]`)), label);
}

export function integer(value: unknown, label: string, minimum: number, maximum: number): number {
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) {
    fail(label, `must be an integer from ${minimum} through ${maximum}`);
  }
  return value as number;
}

export function slugValue(value: unknown, label: string): string {
  const result = requiredString(value, label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) fail(label, "must be a lowercase URL-safe slug");
  return result;
}

export function isoDate(value: unknown, label: string): string {
  const result = requiredString(value, label);
  const parsed = new Date(`${result}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== result) {
    fail(label, "must be an ISO date (YYYY-MM-DD)");
  }
  return result;
}

export function isoDateTime(value: unknown, label: string): string {
  const result = requiredString(value, label);
  const parsed = new Date(result);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result) || Number.isNaN(parsed.valueOf())) {
    fail(label, "must be a UTC ISO timestamp (YYYY-MM-DDTHH:mm:ssZ)");
  }
  return result;
}

export function unique(values: string[], label: string): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) fail(label, `duplicate value: ${value}`);
    seen.add(value);
  }
  return values;
}

function parseJson(source: string, label: string): UnknownRecord {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error) {
    fail(label, `must be valid JSON (${error instanceof Error ? error.message : "unknown error"})`);
  }
  return object(value, label);
}

function safeIdentityUrl(value: unknown, label: string): string | undefined {
  const url = optionalString(value, label);
  if (!url) return undefined;
  const isCanonicalPath = /^\/[a-z0-9/-]*$/.test(url) && !url.includes("//");
  let isHttps = false;
  try {
    const parsed = new URL(url);
    isHttps = parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    // Root-relative paths are checked above.
  }
  if (!isCanonicalPath && !isHttps) fail(label, "must be a root-relative path or HTTPS URL");
  return url;
}

function identityMap(value: unknown, label: string): Map<string, EditorialIdentity> {
  const entries = object(value, label);
  const result = new Map<string, EditorialIdentity>();
  for (const [id, raw] of Object.entries(entries)) {
    slugValue(id, `${label} id`);
    const item = object(raw, `${label}.${id}`);
    const url = safeIdentityUrl(item.url, `${label}.${id}.url`);
    result.set(id, {
      id,
      name: requiredString(item.name, `${label}.${id}.name`),
      type: oneOf(item.type, ["Organization", "Person"] as const, `${label}.${id}.type`),
      ...(url ? { url } : {}),
    });
  }
  if (result.size === 0) fail(label, "must contain at least one identity");
  return result;
}

export function parseControlledRegistries(source: string): ControlledRegistries {
  const item = parseJson(source, "content/registries.json");
  return {
    categories: stringList(item.categories, "content/registries.json.categories"),
    series: stringList(item.series, "content/registries.json.series"),
    audiences: stringList(item.audiences, "content/registries.json.audiences"),
    glossaryCategories: stringList(item.glossaryCategories, "content/registries.json.glossaryCategories"),
    authors: identityMap(item.authors, "content/registries.json.authors"),
    editors: identityMap(item.editors, "content/registries.json.editors"),
  };
}

function httpsUrl(value: unknown, label: string): string {
  const result = requiredString(value, label);
  let parsed: URL;
  try {
    parsed = new URL(result);
  } catch {
    fail(label, "must be an absolute HTTPS URL");
  }
  if (parsed!.protocol !== "https:" || parsed!.username || parsed!.password) fail(label, "must be an absolute HTTPS URL without credentials");
  return result;
}

function mimeForSource(src: string): MediaMimeType {
  if (src.endsWith(".png")) return "image/png";
  if (/\.jpe?g$/.test(src)) return "image/jpeg";
  if (src.endsWith(".webp")) return "image/webp";
  return "image/svg+xml";
}

export function parseMediaRegistry(source: string): MediaRecord[] {
  const root = parseJson(source, "content/media.json");
  if (!Array.isArray(root.media)) fail("content/media.json.media", "must be an array");
  const ids = new Set<string>();
  const sources = new Set<string>();
  return root.media.map((raw, index) => {
    const label = `content/media.json.media[${index}]`;
    const item = object(raw, label);
    const id = slugValue(item.id, `${label}.id`);
    const src = requiredString(item.src, `${label}.src`);
    if (!isSafeMediaSource(src)) fail(`${label}.src`, "must be a local root-relative PNG, JPEG, WebP, or SVG path");
    if (ids.has(id)) fail("media registry", `duplicate media id: ${id}`);
    if (sources.has(src)) fail("media registry", `duplicate media source: ${src}`);
    ids.add(id);
    sources.add(src);
    const mimeType = oneOf(item.mimeType, mediaMimeTypes, `${label}.mimeType`);
    if (mimeForSource(src) !== mimeType) fail(`${label}.mimeType`, `does not match ${src}`);
    const rights = oneOf(item.rights, mediaRights, `${label}.rights`);
    const sourceUrl = item.sourceUrl === undefined ? undefined : httpsUrl(item.sourceUrl, `${label}.sourceUrl`);
    if (item.templateOnly !== undefined && typeof item.templateOnly !== "boolean") {
      fail(`${label}.templateOnly`, "must be a boolean when declared");
    }
    if (rights !== "owned" && !sourceUrl) fail(`${label}.sourceUrl`, `is required for ${rights} media`);
    return {
      id,
      src,
      alt: requiredString(item.alt, `${label}.alt`),
      caption: requiredString(item.caption, `${label}.caption`),
      credit: requiredString(item.credit, `${label}.credit`),
      ...(sourceUrl ? { sourceUrl } : {}),
      width: integer(item.width, `${label}.width`, 1, 4000),
      height: integer(item.height, `${label}.height`, 1, 4000),
      mimeType,
      rights,
      status: oneOf(item.status, mediaStatuses, `${label}.status`),
      templateOnly: item.templateOnly === true,
    };
  });
}

export function validateDocumentMedia(
  document: SafeMarkdownDocument,
  media: readonly MediaRecord[],
  label: string,
  state: PublicationState = "published",
): void {
  const bySource = new Map(media.map((item) => [item.src, item]));
  for (const figure of document.figures) {
    const record = bySource.get(figure.src);
    if (!record) fail(label, `figure is absent from content/media.json: ${figure.src}`);
    if (state !== "draft" && record.templateOnly) fail(label, `figure is template-only media: ${figure.src}`);
    if (state !== "draft" && record.status !== "approved") fail(label, `figure is not approved for publication: ${figure.src}`);
    if (figure.alt !== record.alt) fail(label, `figure alt text conflicts with media registry: ${figure.src}`);
    if (figure.caption !== record.caption) fail(label, `figure caption conflicts with media registry: ${figure.src}`);
  }
}

export type LifecycleRecord = {
  state: PublicationState;
  scheduledAt?: string;
  archiveDisposition?: ArchiveDisposition;
  archiveTarget?: string;
};

export function publicationExposure(record: LifecycleRecord, at = new Date()): PublicationExposure {
  if (record.state === "draft" || record.state === "review") {
    return { effectiveState: "hidden", route: "hidden", feed: false, sitemap: false, indexable: false, related: false };
  }
  if (record.state === "scheduled") {
    if (!record.scheduledAt) fail("scheduled publication", "scheduledAt is required");
    if (new Date(record.scheduledAt) > at) {
      return { effectiveState: "hidden", route: "hidden", feed: false, sitemap: false, indexable: false, related: false };
    }
    return { effectiveState: "published", route: "public", feed: true, sitemap: true, indexable: true, related: true };
  }
  if (record.state === "published") {
    return { effectiveState: "published", route: "public", feed: true, sitemap: true, indexable: true, related: true };
  }
  if (!record.archiveDisposition) fail("archived publication", "archiveDisposition is required");
  if (record.archiveDisposition === "retained-public") {
    return { effectiveState: "archived", route: "public", feed: false, sitemap: false, indexable: false, related: false };
  }
  if (!record.archiveTarget) fail("archived publication", `archiveTarget is required for ${record.archiveDisposition}`);
  return {
    effectiveState: "archived",
    route: "redirect",
    redirectTo: record.archiveTarget,
    feed: false,
    sitemap: false,
    indexable: false,
    related: false,
  };
}

export function validateLifecycleMetadata(
  metadata: UnknownRecord,
  label: string,
  publishedAt: string,
  revisedAt: string,
  now: Date,
): LifecycleRecord & { revisionNote?: string } {
  const state = oneOf(metadata.state, publicationStates, `${label}.state`);
  const scheduledAt = metadata.scheduledAt === undefined ? undefined : isoDateTime(metadata.scheduledAt, `${label}.scheduledAt`);
  const archiveDisposition = metadata.archiveDisposition === undefined
    ? undefined
    : oneOf(metadata.archiveDisposition, archiveDispositions, `${label}.archiveDisposition`);
  const archiveTarget = optionalString(metadata.archiveTarget, `${label}.archiveTarget`);
  const revisionNote = optionalString(metadata.revisionNote, `${label}.revisionNote`);

  if (revisedAt > publishedAt && !revisionNote) fail(label, "revisionNote is required when revisedAt is later than publishedAt");
  if (publishedAt > now.toISOString().slice(0, 10) && state !== "scheduled") {
    fail(label, "future publishedAt dates require state scheduled");
  }
  if (state === "scheduled") {
    if (!scheduledAt) fail(label, "scheduledAt is required for scheduled publications");
    if (scheduledAt.slice(0, 10) !== publishedAt) fail(label, "scheduledAt date must match publishedAt");
  } else if (scheduledAt) {
    fail(label, "scheduledAt is only allowed for scheduled publications");
  }
  if (state === "archived") {
    if (!archiveDisposition) fail(label, "archiveDisposition is required for archived publications");
    if (archiveDisposition !== "retained-public") {
      if (!archiveTarget || !/^\/(?!\/)[a-z0-9/_-]+$/.test(archiveTarget)) {
        fail(label, "archived redirect/replacement records require a safe root-relative archiveTarget");
      }
    } else if (archiveTarget) {
      fail(label, "retained-public archives must not declare archiveTarget");
    }
  } else if (archiveDisposition || archiveTarget) {
    fail(label, "archive fields are only allowed for archived publications");
  }

  return {
    state,
    ...(scheduledAt ? { scheduledAt } : {}),
    ...(archiveDisposition ? { archiveDisposition } : {}),
    ...(archiveTarget ? { archiveTarget } : {}),
    ...(revisionNote ? { revisionNote } : {}),
  };
}

export function readingMetrics(
  document: SafeMarkdownDocument,
  visibleText: readonly string[],
  overrideValue: unknown,
  label: string,
): { wordCount: number; readingMinutes: number; readTime: string; readTimeOverrideMinutes?: number } {
  const wordCount = document.wordCount + visibleText.reduce((total, value) => total + (value.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0), 0);
  const computed = Math.max(1, Math.ceil(wordCount / 220));
  if (overrideValue === undefined) return { wordCount, readingMinutes: computed, readTime: `${computed} min read` };
  const override = integer(overrideValue, `${label}.readTimeOverrideMinutes`, 1, 60);
  const tolerance = Math.max(1, Math.ceil(computed * 0.2));
  if (Math.abs(override - computed) > tolerance) {
    fail(`${label}.readTimeOverrideMinutes`, `must remain within ${tolerance} minute(s) of computed reading time ${computed}`);
  }
  return { wordCount, readingMinutes: override, readTime: `${override} min read`, readTimeOverrideMinutes: override };
}

export type CitationLike = { id: string; title: string; url: string; publisher: string };

export function validateCitationConflicts(groups: Array<{ label: string; citations: readonly CitationLike[] }>): void {
  const seen = new Map<string, { signature: string; label: string }>();
  for (const group of groups) {
    for (const citation of group.citations) {
      const signature = JSON.stringify([citation.title, citation.url, citation.publisher]);
      const previous = seen.get(citation.id);
      if (previous && previous.signature !== signature) {
        fail("citation registry", `conflicting citation id ${citation.id} in ${previous.label} and ${group.label}`);
      }
      seen.set(citation.id, { signature, label: group.label });
    }
  }
}

export function validateCitationUsage(
  citations: readonly CitationLike[],
  document: SafeMarkdownDocument,
  mode: CitationMode,
  label: string,
): void {
  const available = new Set(citations.map(({ id }) => id));
  const used = new Set(document.citationIds);
  for (const id of used) if (!available.has(id)) fail(label, `inline citation has no source record: ${id}`);
  if (mode === "inline-required") {
    for (const { id } of citations) if (!used.has(id)) fail(label, `source is listed but never cited inline: ${id}`);
  }
}

export type RelationshipPublication = LifecycleRecord & {
  slug: string;
  category: string;
  series: string;
  relatedContent: string[];
  document: SafeMarkdownDocument;
};

export type RelationshipGlossary = { slug: string; term: string; status: "established" | "new" };
export type RelationshipDiagnostics = { errors: string[]; warnings: string[] };

export function publicationRelationshipDiagnostics(
  publications: readonly RelationshipPublication[],
  glossary: readonly RelationshipGlossary[] = [],
  at = new Date(),
): RelationshipDiagnostics {
  const errors: string[] = [];
  const warnings: string[] = [];
  const bySlug = new Map(publications.map((item) => [item.slug, item]));
  const incoming = new Map(publications.map((item) => [item.slug, 0]));

  for (const publication of publications) {
    const exposure = publicationExposure(publication, at);
    if (!exposure.related) continue;
    if (publication.relatedContent.length === 0) errors.push(`${publication.slug}: published records need related reading`);
    if (publication.relatedContent.length > 4) errors.push(`${publication.slug}: related reading is limited to four records`);
    for (const relatedSlug of publication.relatedContent) {
      const related = bySlug.get(relatedSlug);
      if (!related) continue;
      if (!publicationExposure(related, at).related) errors.push(`${publication.slug}: related record is not publicly eligible: ${relatedSlug}`);
      incoming.set(relatedSlug, (incoming.get(relatedSlug) ?? 0) + 1);
      if (publication.category !== related.category && publication.series !== related.series) {
        warnings.push(`${publication.slug}: review possibly weak relationship to ${relatedSlug}`);
      }
    }
  }
  for (const publication of publications) {
    if (publicationExposure(publication, at).related && (incoming.get(publication.slug) ?? 0) === 0) {
      errors.push(`${publication.slug}: published record has no incoming related link`);
    }
  }

  const corpus = publications.map((publication) => ({
    slug: publication.slug,
    text: publication.document.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join(" ").toLowerCase(),
    links: new Set(publication.document.blocks.flatMap((block) => {
      const inlineGroups = block.type === "heading" || block.type === "paragraph" || block.type === "blockquote" ? [block.children]
        : block.type === "list" ? block.items
          : block.type === "table" ? [...block.header, ...block.rows.flat()]
            : [];
      return inlineGroups.flat().filter((node) => node.type === "link").map((node) => node.type === "link" ? node.href : "");
    })),
  }));
  for (const entry of glossary) {
    const target = `/glossary/${entry.slug}`;
    const linked = corpus.some(({ links }) => links.has(target));
    if (entry.status === "new" && !linked) errors.push(`glossary/${entry.slug}: new glossary term is unused`);
    if (!linked) {
      for (const publication of corpus) {
        if (publication.text.includes(entry.term.toLowerCase())) {
          warnings.push(`${publication.slug}: mentions glossary term ${entry.term} without linking ${target}`);
        }
      }
    }
  }
  return { errors, warnings: [...new Set(warnings)] };
}
