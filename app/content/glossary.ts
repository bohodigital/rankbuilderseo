import source from "../../content/glossary.md?raw";
import { controlledRegistries } from "./registries";
import { parseGlossaryRegistrySource } from "./registry";

export const glossary = parseGlossaryRegistrySource(source, controlledRegistries);
export const glossaryBySlug = new Map(glossary.map((entry) => [entry.slug, entry]));
