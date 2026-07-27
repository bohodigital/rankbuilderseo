import type { MetadataRoute } from "next";
import { glossary } from "./content/glossary";
import { sitemapPublications } from "./content/publications";

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
const toolPaths = [
  "/tools/indexability-inspector/",
  "/tools/redirect-chain-visualizer/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.map((path) => ({
    url: `${origin}${path || "/"}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
  const publicationEntries = sitemapPublications.map((publication) => ({
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
  const toolEntries = toolPaths.map((path) => ({
    url: `${origin}${path}`,
    lastModified: "2026-07-26",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticEntries, ...toolEntries, ...publicationEntries, ...glossaryEntries];
}
