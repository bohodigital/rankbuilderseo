import { pathToFileURL } from "node:url";

import { parseSafeMarkdown } from "../app/content/markdown.ts";

const MAX_INPUT_BYTES = 1_048_576;
const MAX_PUBLICATIONS = 10;
const PUBLICATION_ID = /^PUB-[A-Z0-9-]{8,64}$/;

function fail(message) {
  throw new Error(`Rank Builder publication Markdown precheck: ${message}`);
}

export function validatePublicationBodies(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_PUBLICATIONS) {
    fail(`expected 1 through ${MAX_PUBLICATIONS} publication bodies`);
  }
  const validated = [];
  for (const [position, item] of value.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item)) fail(`item ${position + 1} must be an object`);
    if (Object.keys(item).sort().join(",") !== "body_markdown,publication_id") {
      fail(`item ${position + 1} must contain exactly publication_id and body_markdown`);
    }
    if (typeof item.publication_id !== "string" || !PUBLICATION_ID.test(item.publication_id)) {
      fail(`item ${position + 1} has an invalid publication_id`);
    }
    if (typeof item.body_markdown !== "string" || Buffer.byteLength(item.body_markdown, "utf8") > 262_144) {
      fail(`${item.publication_id} has an invalid or oversized body_markdown`);
    }
    parseSafeMarkdown(item.body_markdown, item.publication_id);
    validated.push(item.publication_id);
  }
  return { ok: true, validated };
}

async function readBoundedStandardInput() {
  const chunks = [];
  let size = 0;
  for await (const chunk of process.stdin) {
    size += chunk.length;
    if (size > MAX_INPUT_BYTES) fail(`input exceeds ${MAX_INPUT_BYTES} bytes`);
    chunks.push(chunk);
  }
  const source = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(source);
  } catch {
    fail("input must be valid JSON");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = validatePublicationBodies(await readBoundedStandardInput());
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : "Rank Builder publication Markdown precheck failed"}\n`);
    process.exitCode = 1;
  }
}
