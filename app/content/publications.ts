/// <reference types="vite/client" />

import { loadPublicationRegistry } from "./registry";

const sources = import.meta.glob("../../content/publications/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const publications = loadPublicationRegistry(sources);
export const publicationBySlug = new Map(publications.map((publication) => [publication.slug, publication]));
