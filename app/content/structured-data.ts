import type { PublicationSummary } from "./publications";
import type { GlossaryEntry, Publication, Topic } from "./registry";

const origin = "https://rankbuilderseo.com";
const organizationId = `${origin}/#organization`;

type JsonRecord = Record<string, unknown>;

export function organizationStructuredData(): JsonRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Republic of Bohemia LLC",
    url: origin,
    email: "support@rankbuilderseo.com",
    logo: `${origin}/icon-512.png`,
    brand: {
      "@type": "Brand",
      name: "Rank Builder SEO",
    },
  };
}

export function websiteStructuredData(): JsonRecord {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: "Rank Builder SEO",
    url: origin,
    inLanguage: "en",
    publisher: { "@id": organizationId },
  };
}

export function toolsCollectionStructuredData(): JsonRecord {
  const url = `${origin}/tools`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: "Free SEO inspection tools",
    description:
      "Bounded public utilities for inspecting indexability signals and HTTP redirect paths.",
    url,
    inLanguage: "en",
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": organizationId },
    hasPart: [
      {
        "@type": "WebApplication",
        name: "Indexability Inspector",
        url: `${origin}/tools/indexability-inspector`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
      },
      {
        "@type": "WebApplication",
        name: "Redirect Chain Visualizer",
        url: `${origin}/tools/redirect-chain-visualizer`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
      },
    ],
  };
}

export function topicStructuredData(topic: Topic, publications: readonly PublicationSummary[]): JsonRecord {
  const url = `${origin}/topics/${topic.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: topic.title,
        description: topic.description,
        url,
        inLanguage: "en",
        isPartOf: { "@id": `${origin}/#website` },
        publisher: { "@id": organizationId },
        hasPart: publications.map((publication) => ({
          "@type": "Article",
          name: publication.title,
          description: publication.description,
          url: `${origin}/articles/${publication.slug}`,
        })),
      },
      breadcrumbs([
        { name: "Home", url: `${origin}/` },
        { name: "Topics", url: `${origin}/topics` },
        { name: topic.title, url },
      ]),
    ],
  };
}

export function topicsIndexStructuredData(topics: readonly Topic[]): JsonRecord {
  const url = `${origin}/topics`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: "SEO topics",
    description: "Seven controlled paths through Rank Builder's articles, tools, glossary, and research.",
    url,
    inLanguage: "en",
    isPartOf: { "@id": `${origin}/#website` },
    publisher: { "@id": organizationId },
    hasPart: topics.map((topic) => ({
      "@type": "CollectionPage",
      name: topic.title,
      description: topic.description,
      url: `${origin}/topics/${topic.slug}`,
    })),
  };
}

function breadcrumbs(items: Array<{ name: string; url: string }>): JsonRecord {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleStructuredData(publication: Publication, topic?: Topic): JsonRecord {
  const url = `${origin}/articles/${publication.slug}`;
  const image = publication.heroImage
    ? new URL(publication.heroImage.src, origin).href
    : `${origin}/og.png`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: publication.title,
        description: publication.description,
        datePublished: publication.publishedAt,
        dateModified: publication.revisedAt,
        url,
        image,
        inLanguage: "en",
        isAccessibleForFree: true,
        wordCount: publication.wordCount,
        author: {
          "@type": publication.author.type,
          name: publication.author.name,
          ...(publication.author.url ? { url: new URL(publication.author.url, origin).href } : {}),
        },
        editor: {
          "@type": publication.editor.type,
          name: publication.editor.name,
          ...(publication.editor.url ? { url: new URL(publication.editor.url, origin).href } : {}),
        },
        publisher: { "@id": organizationId },
        mainEntityOfPage: url,
        articleSection: publication.category,
        ...(publication.citations.length > 0 ? { citation: publication.citations.map(({ url: citationUrl }) => citationUrl) } : {}),
      },
      breadcrumbs(topic ? [
        { name: "Home", url: `${origin}/` },
        { name: "Topics", url: `${origin}/topics` },
        { name: topic.title, url: `${origin}/topics/${topic.slug}` },
        { name: publication.title, url },
      ] : [
        { name: "Home", url: `${origin}/` },
        { name: "Articles", url: `${origin}/articles` },
        { name: publication.title, url },
      ]),
    ],
  };
}

export function glossaryStructuredData(entry: GlossaryEntry): JsonRecord {
  const url = `${origin}/glossary/${entry.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: entry.term,
        description: entry.short,
        url,
        inDefinedTermSet: `${origin}/glossary`,
        inLanguage: "en",
        ...(entry.citations.length > 0 ? { citation: entry.citations.map(({ url: citationUrl }) => citationUrl) } : {}),
      },
      breadcrumbs([
        { name: "Home", url: `${origin}/` },
        { name: "Glossary", url: `${origin}/glossary` },
        { name: entry.term, url },
      ]),
    ],
  };
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
