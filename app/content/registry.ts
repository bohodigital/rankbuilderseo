export const publicationFormats = ["Explainer", "Playbook", "Claim check", "Data note", "Checklist"] as const;
export const evidenceLevels = ["Primary sources", "Documented practice", "Desk analysis"] as const;
export const experimentStatuses = ["Queued", "Measuring", "Complete", "Inconclusive"] as const;

export type PublicationFormat = (typeof publicationFormats)[number];
export type EvidenceLevel = (typeof evidenceLevels)[number];
export type ExperimentStatus = (typeof experimentStatuses)[number];

export type EditorialIdentity = {
  name: string;
  type: "Organization" | "Person";
  url?: string;
};

export type Citation = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  accessedAt?: string;
};

export type CorrectionRecord = {
  date: string;
  summary: string;
};

export type PublicationSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Publication = {
  slug: string;
  title: string;
  description: string;
  format: PublicationFormat;
  category: string;
  series: string;
  audience: string;
  evidenceLevel: EvidenceLevel;
  author: EditorialIdentity;
  editor: EditorialIdentity;
  publishedAt: string;
  revisedAt: string;
  readTime: string;
  directAnswer: string;
  takeaways: string[];
  claimLimits: string[];
  citations: Citation[];
  correctionHistory: CorrectionRecord[];
  relatedContent: string[];
  sections: PublicationSection[];
  sourceFile: string;
};

export type GlossaryEntry = {
  term: string;
  slug: string;
  category: string;
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
  result: string;
  limitations: string[];
  relatedPublications: string[];
};

type UnknownRecord = Record<string, unknown>;

function fail(label: string, message: string): never {
  throw new Error(`${label}: ${message}`);
}

function record(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(label, "must be an object");
  return value as UnknownRecord;
}

function string(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") fail(label, "must be a non-empty string");
  return value;
}

function slug(value: unknown, label: string): string {
  const result = string(value, label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    fail(label, "must be a lowercase URL-safe slug");
  }
  return result;
}

function stringArray(value: unknown, label: string, allowEmpty = false): string[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    fail(label, allowEmpty ? "must be an array" : "must be a non-empty array");
  }
  return value.map((item, index) => string(item, `${label}[${index}]`));
}

function isoDate(value: unknown, label: string): string {
  const result = string(value, label);
  const parsed = new Date(`${result}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(result)
    || Number.isNaN(parsed.valueOf())
    || parsed.toISOString().slice(0, 10) !== result
  ) {
    fail(label, "must be an ISO date (YYYY-MM-DD)");
  }
  return result;
}

function oneOf<T extends readonly string[]>(value: unknown, choices: T, label: string): T[number] {
  const result = string(value, label);
  if (!choices.includes(result)) fail(label, `must be one of: ${choices.join(", ")}`);
  return result as T[number];
}

function parseFrontMatter(source: string, label: string): { metadata: UnknownRecord; body: string } {
  const normalized = source.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) fail(label, "must begin with JSON front matter between --- delimiters");
  let metadata: unknown;
  try {
    metadata = JSON.parse(match[1]);
  } catch (error) {
    fail(label, `front matter is not valid JSON (${error instanceof Error ? error.message : "unknown error"})`);
  }
  return { metadata: record(metadata, `${label} front matter`), body: match[2] };
}

function identity(value: unknown, label: string): EditorialIdentity {
  const item = record(value, label);
  const type = oneOf(item.type, ["Organization", "Person"] as const, `${label}.type`);
  const url = item.url === undefined ? undefined : string(item.url, `${label}.url`);
  if (url) {
    const isCanonicalPath = /^\/[a-z0-9/-]*$/.test(url) && !url.includes("//");
    let isHttpsUrl = false;
    try {
      isHttpsUrl = new URL(url).protocol === "https:";
    } catch {
      // A root-relative canonical path is handled above.
    }
    if (!isCanonicalPath && !isHttpsUrl) fail(`${label}.url`, "must be a root-relative path or HTTPS URL");
  }
  return { name: string(item.name, `${label}.name`), type, ...(url ? { url } : {}) };
}

function citation(value: unknown, label: string): Citation {
  const item = record(value, label);
  const url = string(item.url, `${label}.url`);
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(`${label}.url`, "must be an absolute URL");
  }
  if (parsed!.protocol !== "https:") fail(`${label}.url`, "must use HTTPS");
  const accessedAt = item.accessedAt === undefined ? undefined : isoDate(item.accessedAt, `${label}.accessedAt`);
  return {
    id: string(item.id, `${label}.id`),
    title: string(item.title, `${label}.title`),
    url,
    publisher: string(item.publisher, `${label}.publisher`),
    ...(accessedAt ? { accessedAt } : {}),
  };
}

function citations(value: unknown, label: string): Citation[] {
  if (!Array.isArray(value)) fail(label, "must be an array");
  const items = value.map((item, index) => citation(item, `${label}[${index}]`));
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) fail(label, `duplicate citation id: ${item.id}`);
    ids.add(item.id);
  }
  return items;
}

function corrections(value: unknown, label: string): CorrectionRecord[] {
  if (!Array.isArray(value)) fail(label, "must be an array");
  const records = value.map((value, index) => {
    const item = record(value, `${label}[${index}]`);
    return {
      date: isoDate(item.date, `${label}[${index}].date`),
      summary: string(item.summary, `${label}[${index}].summary`),
    };
  });
  const identities = new Set<string>();
  for (const item of records) {
    const identity = `${item.date}\n${item.summary}`;
    if (identities.has(identity)) fail(label, `duplicate correction record: ${item.date} ${item.summary}`);
    identities.add(identity);
  }
  return records;
}

function uniqueStrings(values: string[], label: string): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) fail(label, `duplicate value: ${value}`);
    seen.add(value);
  }
  return values;
}

function markdownSections(body: string, label: string): PublicationSection[] {
  const lines = body.trim().split("\n");
  const sections: PublicationSection[] = [];
  let current: PublicationSection | undefined;

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      current = { heading: string(line.slice(3), `${label} section heading`), paragraphs: [] };
      sections.push(current);
      index += 1;
      continue;
    }
    if (!current) fail(label, "body content must begin with an H2 section");
    if (line.startsWith("- ")) {
      current.bullets ??= [];
      current.bullets.push(string(line.slice(2), `${label} bullet`));
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || next.startsWith("## ") || next.startsWith("- ")) break;
      paragraph.push(next);
      index += 1;
    }
    current.paragraphs.push(string(paragraph.join(" "), `${label} paragraph`));
  }

  if (sections.length === 0) fail(label, "must contain at least one H2 section");
  for (const section of sections) {
    if (section.paragraphs.length === 0) fail(label, `section has no paragraph: ${section.heading}`);
  }
  return sections;
}

function parsePublicationSource(source: string, sourceFile: string): Publication {
  const { metadata, body } = parseFrontMatter(source, sourceFile);
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
  const relatedContent = uniqueStrings(
    stringArray(metadata.relatedContent, `${sourceFile}.relatedContent`, true),
    `${sourceFile}.relatedContent`,
  );

  return {
    slug: slug(metadata.slug, `${sourceFile}.slug`),
    title: string(metadata.title, `${sourceFile}.title`),
    description: string(metadata.description, `${sourceFile}.description`),
    format: oneOf(metadata.format, publicationFormats, `${sourceFile}.format`),
    category: string(metadata.category, `${sourceFile}.category`),
    series: string(metadata.series, `${sourceFile}.series`),
    audience: string(metadata.audience, `${sourceFile}.audience`),
    evidenceLevel,
    author: identity(metadata.author, `${sourceFile}.author`),
    editor: identity(metadata.editor, `${sourceFile}.editor`),
    publishedAt,
    revisedAt,
    readTime: string(metadata.readTime, `${sourceFile}.readTime`),
    directAnswer: string(metadata.directAnswer, `${sourceFile}.directAnswer`),
    takeaways: stringArray(metadata.takeaways, `${sourceFile}.takeaways`),
    claimLimits: stringArray(metadata.claimLimits, `${sourceFile}.claimLimits`),
    citations: publicationCitations,
    correctionHistory,
    relatedContent,
    sections: markdownSections(body, sourceFile),
    sourceFile,
  };
}

export function loadPublicationRegistry(sources: Record<string, string>): Publication[] {
  const publications = Object.entries(sources).map(([sourceFile, source]) => parsePublicationSource(source, sourceFile));
  const slugs = new Set<string>();
  for (const publication of publications) {
    if (slugs.has(publication.slug)) fail("publication registry", `duplicate publication slug: ${publication.slug}`);
    slugs.add(publication.slug);
  }
  for (const publication of publications) {
    const fileSlug = publication.sourceFile.split("/").at(-1)?.replace(/\.md$/, "");
    if (fileSlug && fileSlug !== publication.slug) {
      fail(publication.sourceFile, `filename must match publication slug: ${publication.slug}`);
    }
    for (const relatedSlug of publication.relatedContent) {
      if (relatedSlug === publication.slug) fail(publication.sourceFile, "a publication cannot relate to itself");
      if (!slugs.has(relatedSlug)) fail(publication.sourceFile, `unknown related publication: ${relatedSlug}`);
    }
  }
  return publications.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug));
}

export function publicationRoutePaths(publications: Publication[]): string[] {
  return publications.map(({ slug }) => `/articles/${slug}`);
}

export function formatPublicationDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function parseGlossaryRegistrySource(source: string): GlossaryEntry[] {
  const { metadata } = parseFrontMatter(source, "content/glossary.md");
  if (!Array.isArray(metadata.entries)) fail("content/glossary.md.entries", "must be an array");
  const slugs = new Set<string>();
  return metadata.entries.map((value, index) => {
    const label = `content/glossary.md.entries[${index}]`;
    const item = record(value, label);
    const entrySlug = slug(item.slug, `${label}.slug`);
    if (slugs.has(entrySlug)) fail("glossary registry", `duplicate glossary slug: ${entrySlug}`);
    slugs.add(entrySlug);
    return {
      term: string(item.term, `${label}.term`),
      slug: entrySlug,
      category: string(item.category, `${label}.category`),
      short: string(item.short, `${label}.short`),
      full: string(item.full, `${label}.full`),
      myth: string(item.myth, `${label}.myth`),
      citations: item.citations === undefined ? [] : citations(item.citations, `${label}.citations`),
    };
  });
}

export function parseExperimentRegistrySource(source: string, publications: Publication[]): Experiment[] {
  const { metadata } = parseFrontMatter(source, "content/experiments.md");
  if (!Array.isArray(metadata.experiments)) fail("content/experiments.md.experiments", "must be an array");
  const publicationSlugs = new Set(publications.map(({ slug }) => slug));
  const ids = new Set<string>();

  return metadata.experiments.map((value, index) => {
    const label = `content/experiments.md.experiments[${index}]`;
    const item = record(value, label);
    const id = string(item.id, `${label}.id`);
    if (ids.has(id)) fail("experiment registry", `duplicate experiment id: ${id}`);
    ids.add(id);
    const relatedPublications = uniqueStrings(
      stringArray(item.relatedPublications, `${label}.relatedPublications`, true),
      `${label}.relatedPublications`,
    );
    for (const slug of relatedPublications) {
      if (!publicationSlugs.has(slug)) fail(label, `unknown related publication: ${slug}`);
    }
    return {
      id,
      title: string(item.title, `${label}.title`),
      hypothesis: string(item.hypothesis, `${label}.hypothesis`),
      protocol: stringArray(item.protocol, `${label}.protocol`),
      baseline: string(item.baseline, `${label}.baseline`),
      measurementWindow: string(item.measurementWindow, `${label}.measurementWindow`),
      status: oneOf(item.status, experimentStatuses, `${label}.status`),
      measurement: string(item.measurement, `${label}.measurement`),
      result: string(item.result, `${label}.result`),
      limitations: stringArray(item.limitations, `${label}.limitations`),
      relatedPublications,
    };
  });
}
