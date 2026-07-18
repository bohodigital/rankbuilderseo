import source from "../../content/glossary.md?raw";
import { parseGlossaryRegistrySource } from "./registry";

export const glossary = parseGlossaryRegistrySource(source);
export const glossaryBySlug = new Map(glossary.map((entry) => [entry.slug, entry]));
