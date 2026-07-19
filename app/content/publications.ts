/// <reference types="vite/client" />

import { controlledRegistries, mediaRegistry } from "./registries";
import { loadPublicationRegistry, publicationExposure, publicationsForSurface } from "./registry";

const sources = import.meta.glob("../../content/publications/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const publicationRegistry = loadPublicationRegistry(sources, {
  registries: controlledRegistries,
  media: mediaRegistry,
});
export const publications = publicationsForSurface(publicationRegistry, "related");
export const routePublications = publicationsForSurface(publicationRegistry, "route");
export const feedPublications = publicationsForSurface(publicationRegistry, "feed");
export const sitemapPublications = publicationsForSurface(publicationRegistry, "sitemap");
export const publicationRouteBySlug = new Map(routePublications.map((publication) => [
  publication.slug,
  { publication, exposure: publicationExposure(publication) },
]));
export const publicationBySlug = new Map([...publicationRouteBySlug].filter(([, route]) => route.exposure.route === "public").map(([slug, route]) => [slug, route.publication]));
