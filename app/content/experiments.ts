import source from "../../content/experiments.md?raw";
import { publications } from "./publications";
import { parseExperimentRegistrySource } from "./registry";

export const experiments = parseExperimentRegistrySource(source, publications);
