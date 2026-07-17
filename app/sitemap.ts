import type { MetadataRoute } from "next";
import { articles } from "./data";

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
  const articleEntries = articles.map((article) => ({
    url: `${origin}/articles/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticEntries, ...articleEntries];
}
