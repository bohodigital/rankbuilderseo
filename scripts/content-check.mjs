import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import { loadCompleteContentRegistry } from "../app/content/registry.ts";

const root = new URL("../", import.meta.url);

async function publicationSources() {
  const directory = new URL("content/publications/", root);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".md")).sort();
  return Object.fromEntries(await Promise.all(files.map(async (file) => [
    `content/publications/${file}`,
    await readFile(new URL(file, directory), "utf8"),
  ])));
}

function jpegDimensions(bytes, label) {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error(`${label}: malformed JPEG marker`);
    const marker = bytes[offset + 1];
    const size = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    }
    if (size < 2) throw new Error(`${label}: malformed JPEG segment`);
    offset += size + 2;
  }
  throw new Error(`${label}: JPEG dimensions were not found`);
}

export function mediaDimensions(bytes, record) {
  const label = `content/media.json ${record.src}`;
  if (record.mimeType === "image/png") {
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`${label}: invalid PNG signature`);
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (record.mimeType === "image/jpeg") {
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`${label}: invalid JPEG signature`);
    return jpegDimensions(bytes, label);
  }
  if (record.mimeType === "image/webp") {
    if (bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") throw new Error(`${label}: invalid WebP signature`);
    if (bytes.toString("ascii", 12, 16) !== "VP8X") throw new Error(`${label}: only bounded VP8X WebP files are supported`);
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  }
  const source = bytes.toString("utf8");
  if (!/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(source)) throw new Error(`${label}: invalid SVG root`);
  if (/<!DOCTYPE|<!ENTITY|<(?:script|foreignObject|style)\b|\son[a-z]+\s*=|\sstyle\s*=|\burl\s*\(|(?:href|xlink:href)\s*=\s*["'](?!#)/i.test(source)) {
    throw new Error(`${label}: SVG contains a document type, entity, script, foreign object, style, event handler, or external reference`);
  }
  const viewBox = source.match(/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (!viewBox) throw new Error(`${label}: SVG requires a numeric viewBox`);
  return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
}

export async function validateMediaFiles(media) {
  for (const record of media) {
    const target = new URL(`public${record.src}`, root);
    const resolved = fileURLToPath(target);
    const publicRoot = fileURLToPath(new URL("public/", root));
    if (!resolved.startsWith(publicRoot)) throw new Error(`${record.src}: media path escapes public/`);
    let bytes;
    try {
      bytes = await readFile(target);
    } catch (error) {
      throw new Error(`${record.src}: local media file is missing (${error instanceof Error ? error.message : "unknown error"})`);
    }
    const dimensions = mediaDimensions(bytes, record);
    if (dimensions.width !== record.width || dimensions.height !== record.height) {
      throw new Error(`${record.src}: declared ${record.width}x${record.height}, actual ${dimensions.width}x${dimensions.height}`);
    }
  }
}

export async function checkContent() {
  const sources = {
    publications: await publicationSources(),
    registries: await readFile(new URL("content/registries.json", root), "utf8"),
    media: await readFile(new URL("content/media.json", root), "utf8"),
    glossary: await readFile(new URL("content/glossary.md", root), "utf8"),
    experiments: await readFile(new URL("content/experiments.md", root), "utf8"),
  };
  const registry = loadCompleteContentRegistry(sources);
  await validateMediaFiles(registry.media);
  return registry;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await checkContent();
    console.log(`Content check passed: ${result.publications.length} publications, ${result.glossary.length} glossary terms, ${result.experiments.length} experiments, ${result.media.length} media records.`);
    for (const warning of result.warnings) console.warn(`Content warning: ${warning}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
