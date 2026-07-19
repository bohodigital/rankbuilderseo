/// <reference types="vite/client" />

import { controlledRegistries, mediaRegistry } from "./registries";
import { loadPublicationRegistry, publicationExposure, publicationsForSurface } from "./registry";

const sources = import.meta.glob("../../content/publications/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const contentBuildTime = import.meta.env.RANK_BUILDER_CONTENT_BUILD_TIME;
const contentBuildNow = new Date(contentBuildTime);
if (!contentBuildTime || Number.isNaN(contentBuildNow.getTime())) {
  throw new Error("RANK_BUILDER_CONTENT_BUILD_TIME must be an ISO build timestamp");
}

export const publicationRegistry = loadPublicationRegistry(sources, {
  registries: controlledRegistries,
  media: mediaRegistry,
  now: contentBuildNow,
});
export const publications = publicationsForSurface(publicationRegistry, "related", contentBuildNow);
export const routePublications = publicationsForSurface(publicationRegistry, "route", contentBuildNow);
export const feedPublications = publicationsForSurface(publicationRegistry, "feed", contentBuildNow);
export const sitemapPublications = publicationsForSurface(publicationRegistry, "sitemap", contentBuildNow);
export const publicationRouteBySlug = new Map(routePublications.map((publication) => [
  publication.slug,
  { publication, exposure: publicationExposure(publication, contentBuildNow) },
]));
export const publicationBySlug = new Map([...publicationRouteBySlug].filter(([, route]) => route.exposure.route === "public").map(([slug, route]) => [slug, route.publication]));
