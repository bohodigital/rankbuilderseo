import type { Publication } from "./registry";

const origin = "https://rankbuilderseo.com";
const feedUrl = origin + "/feed.xml";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function atomDate(value: string): string {
  return value + "T00:00:00Z";
}

export function buildAtomFeed(publications: readonly Publication[]): string {
  const updated = publications.reduce(
    (latest, publication) => publication.revisedAt > latest ? publication.revisedAt : latest,
    "1970-01-01",
  );
  const entries = publications.map((publication) => {
    const canonical = origin + "/articles/" + publication.slug;
    return [
      "  <entry>",
      "    <title>" + escapeXml(publication.title) + "</title>",
      "    <id>" + canonical + "</id>",
      '    <link rel="alternate" href="' + canonical + '" />',
      "    <published>" + atomDate(publication.publishedAt) + "</published>",
      "    <updated>" + atomDate(publication.revisedAt) + "</updated>",
      "    <author><name>" + escapeXml(publication.author.name) + "</name></author>",
      '    <summary type="text">' + escapeXml(publication.description) + "</summary>",
      "  </entry>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">',
    "  <title>Rank Builder SEO</title>",
    "  <subtitle>Evidence-aware SEO articles from the Rank Builder research desk.</subtitle>",
    "  <id>" + origin + "/</id>",
    '  <link rel="self" type="application/atom+xml" href="' + feedUrl + '" />',
    '  <link rel="alternate" type="text/html" href="' + origin + '/" />',
    "  <updated>" + atomDate(updated) + "</updated>",
    entries,
    "</feed>",
    "",
  ].join("\n");
}
