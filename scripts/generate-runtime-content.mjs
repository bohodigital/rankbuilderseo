import { mkdir, rm, writeFile } from "node:fs/promises";

import { checkContent } from "./content-check.mjs";
import { documentLinkTargets } from "../app/content/registry.ts";

const outputRoot = new URL("../.generated/", import.meta.url);
const publicationRoot = new URL("publications/", outputRoot);
const fullBodyFields = new Set([
  "document",
  "sections",
  "citations",
  "correctionHistory",
  "takeaways",
  "claimLimits",
]);

const registry = await checkContent();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(publicationRoot, { recursive: true });

const summaries = registry.publications.map((publication) => {
  const summary = Object.fromEntries(
    Object.entries(publication).filter(([key]) => !fullBodyFields.has(key)),
  );
  return {
    ...summary,
    glossaryLinks: [...new Set(documentLinkTargets(publication.document)
      .map((href) => href.match(/^\/glossary\/([a-z0-9-]+)(?:#.*)?$/)?.[1])
      .filter(Boolean))],
  };
});

await writeFile(
  new URL("publication-index.json", outputRoot),
  JSON.stringify(summaries),
  "utf8",
);
await Promise.all(registry.publications.map((publication) => writeFile(
  new URL(`${publication.slug}.json`, publicationRoot),
  JSON.stringify(publication),
  "utf8",
)));

console.log(
  `Generated bounded runtime content: ${summaries.length} summaries and ${registry.publications.length} lazy publication modules.`,
);
