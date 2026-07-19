import type { GlossaryEntry, Publication } from "./registry";

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

export function articleStructuredData(publication: Publication): JsonRecord {
  const url = `${origin}/articles/${publication.slug}`;
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
        image: `${origin}/og.png`,
        inLanguage: "en",
        isAccessibleForFree: true,
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
      breadcrumbs([
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
