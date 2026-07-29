---
{
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "state": "review",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-29",
  "revisedAt": "2026-07-29",
  "correctionHistory": [],
  "slug": "xml-sitemap-lastmod",
  "title": "XML Sitemap lastmod: What Google Uses and What It Ignores",
  "description": "Generate trustworthy XML sitemap lastmod values from meaningful page revisions instead of deployment time, and stop relying on ignored priority and changefreq fields.",
  "format": "Explainer",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "directAnswer": "Use lastmod only when it accurately describes the page's most recent significant change. Preserve the prior value when the page did not meaningfully change, omit it when no reliable date exists, and do not rely on priority or changefreq because Google ignores them.",
  "takeaways": [
    "Site build time is not automatically a page modification time.",
    "Meaningful content, structured-data, or link changes can justify a new lastmod value.",
    "An unreliable current date is worse than omitting the optional field.",
    "Google ignores sitemap priority and changefreq values."
  ],
  "claimLimits": [
    "An accurate lastmod value can assist crawl scheduling, but it does not command recrawling or guarantee rendering, indexing, canonical selection, ranking, or traffic."
  ],
  "citations": [
    {
      "id": "b7-google-sitemap-lastmod",
      "title": "Build and submit a sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google",
      "accessedAt": "2026-07-29"
    }
  ],
  "relatedContent": [
    "sitemap-could-not-be-read",
    "internal-links-vs-xml-sitemaps",
    "page-indexing-report-not-updating",
    "google-search-console-crawl-stats-report",
    "why-request-indexing-is-not-working"
  ]
}
---

## Definition

![Decision tree for preserving, updating, or omitting an XML sitemap lastmod value](/media/xml-sitemap-lastmod-decision-tree.svg "A trustworthy lastmod value describes a meaningful page change rather than the latest site build.")

The optional XML sitemap `<lastmod>` element describes the date or timestamp of the last significant modification to the page identified by `<loc>`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.example.com/guides/widget</loc>
    <lastmod>2026-07-29</lastmod>
  </url>
</urlset>
```

Google says it uses `lastmod` when the values are consistently and verifiably accurate. It identifies changes to primary content, structured data, or links as generally significant and says a copyright-year change is not. Google ignores sitemap `<priority>` and `<changefreq>`. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@b7-google-sitemap-lastmod]

Use:

```text
lastmod = last meaningful public page revision
```

Do not use:

```text
lastmod = latest build or deployment time
```

unless that deployment actually changed the page meaningfully.

## Mechanism

A publishing system usually has several timestamps:

- Record creation time
- Editorial publication time
- Editorial revision time
- Database update time
- Static build time
- Deployment time
- Sitemap generation time
- Cache refresh time

They are not interchangeable.

Use a page-level source of truth.

Possible sources include:

- Editorial `revisedAt`
- CMS revision record
- Database content-update field
- Content hash connected to a stored revision date
- Git history for the specific source file
- Product inventory update time when availability is primary page content

The system must preserve the prior meaningful date. It cannot calculate a trustworthy history if every build destroys it.

**Date-only value**

```xml
<lastmod>2026-07-29</lastmod>
```

**Full timestamp**

```xml
<lastmod>2026-07-29T20:15:00Z</lastmod>
```

Use one consistent timezone policy. UTC is the simplest when systems operate across regions.

**Sitemap index**

A sitemap index can describe when an individual sitemap file changed:

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.example.com/sitemaps/articles.xml</loc>
    <lastmod>2026-07-29</lastmod>
  </sitemap>
</sitemapindex>
```

That value describes the child sitemap file, not every URL inside it.

## Examples

A static build may rewrite every HTML file without changing the visible page. A deployment may update analytics code, CSS, headers, or infrastructure. Those events do not automatically justify replacing the modification date of every article.

**Significant changes**

Usually update `lastmod` after:

- Substantial main-content revision
- Material factual correction
- New section changing the page’s answer
- Material structured-data change
- Material internal-link change
- Major product availability change
- Changed legal or policy text
- Replaced downloadable resource central to the page

**Insignificant changes**

Usually preserve the previous value after:

- Analytics-script update
- CSS-only change
- Rebuilding identical output
- Copyright-year change
- Unrelated header or footer deployment
- Infrastructure migration without content change
- Cache purge
- Sitemap regeneration
- Formatting change that does not alter the page meaningfully

**Correct generation logic**

```text
meaningfulRevision = page.editorialRevisionDate

if meaningfulRevision exists:
    emit meaningfulRevision
else:
    omit lastmod
```

A content-hash system can improve accuracy:

```text
currentHash = hash(meaningfulPageRepresentation)

if currentHash differs from storedHash:
    store currentHash
    store currentTime as meaningfulRevision
else:
    preserve stored meaningfulRevision
```

The hash must represent meaningful content rather than unstable build output. Exclude nondeterministic IDs, deployment timestamps, tracking values, and asset fingerprints that do not change page meaning.

**Aggregate pages**

A category or topic page can update when:

- An article is added or removed
- The ordering changes materially
- The description changes
- Navigation or links change materially

Do not update the homepage timestamp every minute merely because a dynamic counter changes.

## Boundaries

Validate sitemap dates for:

- Valid ISO format
- Impossible dates
- Future dates
- Timezone drift
- Mass updates on every deployment
- Dates earlier than publication
- Dates unrelated to page revisions
- Sitemap-index dates confused with URL dates
- Redirecting URLs
- Noncanonical URLs
- Noindexed URLs
- Removed pages

Do not include `<priority>` and `<changefreq>` because another SEO checklist insists every XML element needs emotional support. Google says it ignores both values. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@b7-google-sitemap-lastmod]

An accurate `lastmod` can help a crawler decide when a page may deserve another request. It cannot guarantee a request or any later search outcome.

Use [Sitemap Could Not Be Read](/articles/sitemap-could-not-be-read) for transport, parsing, and response failures; [Internal Links vs. XML Sitemaps](/articles/internal-links-vs-xml-sitemaps) for discovery roles; [Page Indexing Report Not Updating](/articles/page-indexing-report-not-updating) for reporting delay; and [Crawl Stats](/articles/google-search-console-crawl-stats-report) to examine observed crawling.

The correct policy is deliberately boring:

```text
Meaningful page changed and date is reliable:
    Update lastmod.

Meaningful page did not change:
    Preserve lastmod.

Reliable date is unavailable:
    Omit lastmod.
```
