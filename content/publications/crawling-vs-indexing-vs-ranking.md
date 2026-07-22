---
{
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-22",
  "revisedAt": "2026-07-22",
  "correctionHistory": [],
  "slug": "crawling-vs-indexing-vs-ranking",
  "title": "Crawling vs. Indexing vs. Ranking: Where Search Problems Actually Happen",
  "description": "Separate discovery, crawling, rendering, indexing, canonical selection, and ranking so you can diagnose the stage that actually failed.",
  "directAnswer": "Crawling fetches a URL, indexing processes and selects it, and ranking chooses indexed material for a query; a problem at one stage is not proof of a problem at another.",
  "takeaways": [
    "A URL can be discovered without being crawled, crawled without being indexed, and indexed without ranking for a target query.",
    "A live test shows current technical availability, not final canonical selection or index inclusion.",
    "Canonicalization groups duplicates before serving search results and is not a separate ranking trick."
  ],
  "claimLimits": [
    "Google’s systems evaluate pages over time and across duplicate clusters; this guide cannot predict whether a specific URL will be indexed or rank for a particular query."
  ],
  "citations": [
    {
      "id": "google-how-search-works",
      "title": "In-depth guide to how Google Search works",
      "url": "https://developers.google.com/search/docs/fundamentals/how-search-works",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-technical-requirements",
      "title": "Google Search technical requirements",
      "url": "https://developers.google.com/search/docs/essentials/technical",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-url-inspection",
      "title": "URL Inspection Tool",
      "url": "https://support.google.com/webmasters/answer/9012289?hl=en-FM",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-canonicalization-overview",
      "title": "What is canonicalization?",
      "url": "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-links",
      "title": "Link best practices for Google",
      "url": "https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    }
  ],
  "relatedContent": [
    "why-google-isnt-indexing-your-page",
    "google-search-console-url-inspection",
    "technical-seo-baseline",
    "canonical-tags-when-they-work"
  ]
}
---

## Definition

A page cannot rank before it is indexed, and it cannot be indexed before Google can discover and process it. That sounds obvious. It still prevents an astonishing amount of wasted SEO work when applied consistently.

When someone says, “Google cannot find my page,” they may mean any of the following:

- Google does not know that the URL exists.
- Google knows the URL but has not fetched it.
- Google fetched the page but could not render the useful content.
- Google processed the page but consolidated it under another canonical URL.
- Google did not retain the page in the index.
- Google indexed the page but does not rank it for the expected query.
- Google ranks it, but so low that the owner assumes it is absent.

These are different failures. They produce different evidence and require different fixes.

**Short answer**

- **Discovery** means Google learns that a URL exists.
- **Crawling** means Google requests and downloads the URL.
- **Rendering** means Google processes the page like a browser, including supported JavaScript.
- **Indexing** means Google analyzes the page and may store information about a canonical version in its index.
- **Ranking and serving** mean Google selects indexed material for a particular search and orders the results.

Google’s own description uses three broad stages: crawling, indexing, and serving search results. Not every page proceeds through every stage, and following the technical rules does not guarantee crawling, indexing, or visibility. [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)[@google-how-search-works]

## Mechanism

**The pipeline**

| Stage | What happens | Evidence that it happened | Common failure |
|---|---|---|---|
| Discovery | Google learns the URL exists | URL appears in Search Console or logs show a crawler later requested it | No crawlable links, missing sitemap, wrong URL |
| Crawling | Googlebot requests the URL | Last crawl date, server logs, successful fetch | robots block, login, DNS, timeout, `4xx`, `5xx` |
| Rendering | Google processes page resources and JavaScript | Rendered screenshot and HTML | Main content depends on failed scripts or blocked resources |
| Indexing | Google evaluates content, metadata, duplication, and canonical choice | URL Inspection indexed data | `noindex`, duplicate consolidation, weak or unprocessable content |
| Serving/ranking | Google selects results for a query | Search performance impressions and positions | Low relevance, weak quality, competition, query mismatch |

The stages are sequential, but the evidence is not always updated simultaneously. Search Console’s indexed data reflects Google’s stored information from a crawl and indexing attempt. Its live test reflects the current page and does not reproduce every indexing decision.

**Discovery is knowing the URL exists**

There is no master registry containing every page on the web. Google discovers URLs through mechanisms such as:

- crawlable links from pages it already knows;
- sitemaps;
- previously crawled URLs;
- external links.

A URL can be discovered without being crawled. That is the important distinction behind “Discovered – currently not indexed.”

Good discovery signals are not merely numerous. They are consistent:

- internal links point to the intended canonical;
- the sitemap lists the intended canonical;
- redirects do not send the crawler elsewhere;
- the page is reachable through the actual information architecture;
- links use ordinary anchor elements with usable `href` values.

Google says links help it discover pages and understand relevance. It can reliably crawl standard anchor links. [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en)[@google-links]

## Examples

**Crawling is fetching the URL**

After discovering a URL, Google may request it with Googlebot. The site must respond.

Crawling can fail because of:

- robots.txt;
- authentication;
- DNS or network failure;
- timeouts;
- server errors;
- malformed or unsupported URL structures;
- anti-bot systems;
- redirect loops.

Google’s minimum technical requirements for an indexable page include allowing Googlebot to access it and returning HTTP `200`. That is eligibility, not a promise that the page will move into the index. [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)[@google-technical-requirements]

The cleanest evidence for a crawl is a combination of:

- URL Inspection’s last crawl and fetch fields;
- server or platform logs;
- the response Google received.

**Rendering is what Google can actually see**

Modern pages often depend on JavaScript. Google renders pages using a browser-like system during crawling and indexing, but rendering can still fail or produce a different result from what a human sees after clicking, scrolling, logging in, or waiting for an API request.

A URL can return `200` while the main article is absent from the rendered output.

Use URL Inspection’s live test to review:

- screenshot;
- tested HTML;
- loaded resources;
- JavaScript errors;
- response headers.

If the source contains only a shell and the rendered result is empty, the problem is not solved merely because the server returned `200`.

**Indexing is analysis and selection**

After crawling, Google processes the page and decides how it relates to other known pages. Google may:

- identify the main content;
- process metadata;
- determine language and other signals;
- group duplicate or strongly similar URLs;
- select a canonical representative;
- store information about that representative in the index.

A crawled page is not automatically indexed. Google states directly that indexing is not guaranteed. Common indexing problems include low-quality content, robots meta directives that prohibit indexing, and site designs that make the page difficult to process. [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)[@google-how-search-works]

Indexing failures and deliberate exclusions include:

- `noindex`;
- duplicate or alternate canonical;
- error or soft-error page;
- content Google processed but did not select;
- a page that rendered without its meaningful content.

**Canonicalization is not a separate ranking trick**

Canonicalization happens during indexing. Google groups duplicate or strongly similar URLs and selects one representative.

A canonical annotation tells Google which URL you prefer. It does not force Google to agree. Redirects, sitemap inclusion, internal links, HTTPS, and canonical annotations contribute to the selection. [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]

This means:

- an unindexed alternate URL may be functioning correctly;
- the content may be indexed under another URL;
- inspecting the wrong variant can make a healthy page look broken;
- inconsistent internal links and sitemaps can weaken your stated preference.

**Ranking begins after indexing**

Ranking is query-specific. An indexed page may not appear for the phrase its owner typed because:

- the page is not relevant enough to that query;
- the page satisfies a different intent;
- stronger results exist;
- the page’s quality or evidence is weaker;
- location, language, or device changes the result;
- the result appears too low to be noticed.

Do not use “not indexed” as shorthand for “does not rank where I want.”

Use:

- URL Inspection to check the exact URL’s indexed state;
- Search Console performance data to see impressions, queries, and positions;
- the search result itself only as contextual evidence.

**How to identify the failing stage**

**No Search Console knowledge and no crawl evidence**

Likely stage: **discovery**

Check:

- exact URL;
- crawlable internal links;
- sitemap;
- redirect behavior;
- hostname and protocol.

**Known URL, no last crawl**

Likely stage: **discovered but not crawled**

Check:

- age of the page;
- section-wide pattern;
- server health;
- duplicate URL inventory;
- internal importance.

**Crawl failed**

Likely stage: **access or response**

Check:

- status code;
- robots.txt;
- login;
- DNS;
- timeouts;
- platform challenge pages.

**Crawl succeeded, rendered page is empty**

Likely stage: **rendering**

Check:

- scripts;
- blocked resources;
- API calls;
- content requiring interaction;
- client-side errors.

**Crawl succeeded, Google selected another canonical**

Likely stage: **canonicalization**

Check:

- duplicate versions;
- internal-link consistency;
- sitemap;
- redirects;
- declared canonical.

**URL is indexed but receives no impressions**

Likely stage: **serving or ranking**

Check:

- query relevance;
- content purpose;
- competition;
- title and snippet;
- whether the page addresses a search demand at all.

## Boundaries

**Common language mistakes**

**“Google crawled it, so it should rank”**

No. Crawling only means Google fetched the page.

**“The live test says indexable, so it is indexed”**

No. The live test assesses the current page against a subset of technical conditions. It does not reproduce the complete indexing decision.

**“It is in the sitemap, so Google must index it”**

No. A sitemap communicates preferred URLs and helps discovery. It is not an inclusion command.

**“The alternate URL is not indexed, so the article is missing”**

Not necessarily. The content may be indexed under Google’s selected canonical.

**“It does not show for my keyword, so it is not indexed”**

Ranking for one query is not an index test.

**A practical diagnosis sentence**

When recording an issue, use this format:

```text
Google **[does/does not] know the URL**, last crawled it on **[date/unknown]**, received **[response]**, reports crawling **[allowed/blocked]**, reports indexing **[allowed/prohibited]**, selected **[canonical]**, and currently classifies the URL as **[exact status]**.
```

That sentence is far more useful than “Google hates the page.”

## Sources

- [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)[@google-how-search-works]
- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)[@google-technical-requirements]
- [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]
- [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]
- [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en)[@google-links]
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)

## Related guides

- [Why Google Isn’t Indexing Your Page](/articles/why-google-isnt-indexing-your-page/)
- [How to Use Google Search Console URL Inspection](/articles/google-search-console-url-inspection/)
- [Technical SEO Baseline Checklist](/articles/technical-seo-baseline/)
- [Canonical URL](/glossary/canonical-url/)
