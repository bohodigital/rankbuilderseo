import type { MetadataRoute } from "next";
import { glossary } from "./content/glossary";
import { publications } from "./content/publications";

const origin = "https://rankbuilderseo.com";
const staticPaths = [
  "",
  "/about",
  "/articles",
  "/glossary",
  "/lab",
  "/method",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.map((path) => ({
    url: `${origin}${path || "/"}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
  const publicationEntries = publications.map((publication) => ({
    url: `${origin}/articles/${publication.slug}`,
    lastModified: publication.revisedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const glossaryEntries = glossary.map((entry) => ({
    url: `${origin}/glossary/${entry.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticEntries, ...publicationEntries, ...glossaryEntries];
}
