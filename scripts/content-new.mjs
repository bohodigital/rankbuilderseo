import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import { loadCompleteContentRegistry } from "../app/content/registry.ts";

const root = new URL("../", import.meta.url);
const formats = new Map([
  ["explainer", "explainer.md"],
  ["playbook", "playbook.md"],
  ["claim-check", "claim-check.md"],
  ["data-note", "data-note.md"],
  ["checklist", "checklist.md"],
]);

function argument(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index < 0 ? undefined : process.argv[index + 1];
}

function usage(message) {
  if (message) console.error(message);
  console.error("Usage: npm run content:new -- --format <explainer|playbook|claim-check|data-note|checklist> --slug <url-slug> --title <title> [--dry-run]");
  process.exitCode = 1;
}

async function publicationSources() {
  const directory = new URL("content/publications/", root);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".md")).sort();
  return Object.fromEntries(await Promise.all(files.map(async (file) => [
    `content/publications/${file}`,
    await readFile(new URL(file, directory), "utf8"),
  ])));
}

export async function scaffoldPublication({ format, slug, title, dryRun = false }) {
  const templateFile = formats.get(format);
  if (!templateFile) throw new Error(`Unknown format "${format}". Choose: ${[...formats.keys()].join(", ")}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug must be lowercase words separated by single hyphens.");
  if (!title?.trim()) throw new Error("Title must be non-empty.");
  const outputUrl = new URL(`content/publications/${slug}.md`, root);
  try {
    await readFile(outputUrl);
    throw new Error(`Refusing to overwrite existing publication: content/publications/${slug}.md`);
  } catch (error) {
    if (error instanceof Error && !("code" in error && error.code === "ENOENT")) throw error;
  }

  const date = new Date().toISOString().slice(0, 10);
  const description = `Draft ${format.replace("-", " ")}: replace this description before review.`;
  const template = await readFile(new URL(`content/templates/${templateFile}`, root), "utf8");
  const source = template
    .replaceAll("__SLUG__", slug)
    .replaceAll("__TITLE_JSON__", JSON.stringify(title.trim()))
    .replaceAll("__DESCRIPTION_JSON__", JSON.stringify(description))
    .replaceAll("__DATE__", date);

  const publications = await publicationSources();
  publications[`content/publications/${slug}.md`] = source;
  loadCompleteContentRegistry({
    publications,
    registries: await readFile(new URL("content/registries.json", root), "utf8"),
    media: await readFile(new URL("content/media.json", root), "utf8"),
    glossary: await readFile(new URL("content/glossary.md", root), "utf8"),
    experiments: await readFile(new URL("content/experiments.md", root), "utf8"),
  });

  if (!dryRun) await writeFile(outputUrl, source, { encoding: "utf8", flag: "wx" });
  return { path: fileURLToPath(outputUrl), source };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const format = argument("format");
  const slug = argument("slug");
  const title = argument("title");
  if (!format || !slug || !title) {
    usage();
  } else {
    try {
      const result = await scaffoldPublication({ format, slug, title, dryRun: process.argv.includes("--dry-run") });
      if (process.argv.includes("--dry-run")) process.stdout.write(result.source);
      else console.log(`Created ${result.path}`);
    } catch (error) {
      usage(error instanceof Error ? error.message : String(error));
    }
  }
}
