/// <reference types="vite/client" />

import summariesSource from "../../.generated/publication-index.json";
import {
  publicationExposure,
  publicationsForSurface,
  type Publication,
} from "./registry";

export type PublicationSummary = Omit<
  Publication,
  "document" | "sections" | "citations" | "correctionHistory" | "takeaways" | "claimLimits"
> & {
  glossaryLinks: string[];
};

type PublicationModule = { default: Publication };
type PublicationLoader = () => Promise<PublicationModule>;

const contentBuildTime = import.meta.env.RANK_BUILDER_CONTENT_BUILD_TIME;
const contentBuildNow = new Date(contentBuildTime);
if (!contentBuildTime || Number.isNaN(contentBuildNow.getTime())) {
  throw new Error("RANK_BUILDER_CONTENT_BUILD_TIME must be an ISO build timestamp");
}

const publicationLoaders = import.meta.glob(
  "../../.generated/publications/*.json",
) as Record<string, PublicationLoader>;

export const publicationRegistry = summariesSource as PublicationSummary[];
export const publications = publicationsForSurface(
  publicationRegistry,
  "related",
  contentBuildNow,
);
export const routePublications = publicationsForSurface(
  publicationRegistry,
  "route",
  contentBuildNow,
);
export const feedPublications = publicationsForSurface(
  publicationRegistry,
  "feed",
  contentBuildNow,
);
export const sitemapPublications = publicationsForSurface(
  publicationRegistry,
  "sitemap",
  contentBuildNow,
);
export const publicationRouteBySlug = new Map(routePublications.map((publication) => [
  publication.slug,
  { publication, exposure: publicationExposure(publication, contentBuildNow) },
]));
export const publicationBySlug = new Map(
  [...publicationRouteBySlug]
    .filter(([, route]) => route.exposure.route === "public")
    .map(([slug, route]) => [slug, route.publication]),
);

function loaderForSlug(slug: string): PublicationLoader | undefined {
  return publicationLoaders[`../../.generated/publications/${slug}.json`];
}

export async function loadPublicationBySlug(slug: string): Promise<Publication | undefined> {
  const loader = loaderForSlug(slug);
  if (!loader) return undefined;
  const publicationModule = await loader();
  return publicationModule.default;
}
