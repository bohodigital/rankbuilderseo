import mediaSource from "../../content/media.json?raw";
import registrySource from "../../content/registries.json?raw";
import { parseControlledRegistries, parseMediaRegistry } from "./registry";

export const controlledRegistries = parseControlledRegistries(registrySource);
export const mediaRegistry = parseMediaRegistry(mediaSource);
export const mediaBySource = new Map(mediaRegistry.map((item) => [item.src, item]));
