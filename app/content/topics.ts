import source from "../../content/topics.json?raw";
import { glossaryBySlug } from "./glossary";
import { publicationBySlug, publicationRegistry } from "./publications";
import { documentLinkTargets, parseTopicRegistrySource, type GlossaryEntry, type Publication } from "./registry";

const contentBuildTime = import.meta.env.RANK_BUILDER_CONTENT_BUILD_TIME;
const contentBuildNow = new Date(contentBuildTime);
if (!contentBuildTime || Number.isNaN(contentBuildNow.getTime())) {
  throw new Error("RANK_BUILDER_CONTENT_BUILD_TIME must be an ISO build timestamp");
}

export const topics = parseTopicRegistrySource(source, publicationRegistry, [...glossaryBySlug.values()], contentBuildNow);
export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
export const topicByPublicationSlug = new Map(
  topics.flatMap((topic) => topic.primaryPublications.map((publicationSlug) => [publicationSlug, topic] as const)),
);

export function topicPublications(slugs: readonly string[]): Publication[] {
  return slugs.map((slug) => publicationBySlug.get(slug)).filter((item): item is Publication => Boolean(item));
}

export function topicGlossaryEntries(topicSlug: string): GlossaryEntry[] {
  const topic = topicBySlug.get(topicSlug);
  if (!topic) return [];
  const explicit = new Set(topic.relatedGlossary);
  for (const publication of topicPublications([...topic.primaryPublications, ...topic.secondaryPublications])) {
    for (const href of documentLinkTargets(publication.document)) {
      const slug = href.match(/^\/glossary\/([a-z0-9-]+)(?:#.*)?$/)?.[1];
      if (slug) explicit.add(slug);
    }
  }
  return [...explicit]
    .map((slug) => glossaryBySlug.get(slug))
    .filter((item): item is GlossaryEntry => Boolean(item))
    .sort((left, right) => left.term.localeCompare(right.term, "en-US"));
}
