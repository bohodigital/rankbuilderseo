---
{
  "slug": "discovered-currently-not-indexed",
  "title": "Discovered – Currently Not Indexed: What It Means and What to Check",
  "description": "Understand why Google knows a URL but has not crawled it, and check discovery, crawl demand, server capacity, duplication, and internal linking in the right order.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-25",
  "revisedAt": "2026-07-25",
  "directAnswer": "“Discovered – currently not indexed” means Google knows the URL exists but has not crawled it yet. It is not proof of a page-level technical error. Check recency, crawlable internal links, sitemap consistency, server health, unwanted URL inventory, and whether the pattern affects one page or a large section.",
  "takeaways": [
    "The status describes a known but not-yet-crawled URL.",
    "One recent page may simply need time; a large persistent pattern requires sitewide investigation.",
    "Crawl budget is mainly an advanced concern for large, rapidly changing, or heavily affected sites."
  ],
  "claimLimits": [
    "Search Console does not expose a single definitive reason for every URL remaining in this status."
  ],
  "citations": [
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-how-search-works",
      "title": "In-depth guide to how Google Search works",
      "url": "https://developers.google.com/search/docs/fundamentals/how-search-works",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-crawl-budget",
      "title": "Optimize your crawl budget",
      "url": "https://developers.google.com/crawling/docs/crawl-budget",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-crawl-errors",
      "title": "Troubleshoot Google Search crawling errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "crawled-currently-not-indexed",
    "why-google-isnt-indexing-your-page",
    "crawling-vs-indexing-vs-ranking",
    "google-search-console-page-indexing-report",
    "how-long-google-takes-to-index-page",
    "server-error-5xx"
  ]
}
---

## Definition

![Open filing cabinet drawer filled with organized paper records](/media/discovered-currently-not-indexed-hero.jpg "A discovered URL is known to Google, but it has not yet been fetched and processed as a page.")

“Discovered – currently not indexed” means Google knows that a URL exists but has not crawled it yet. Because the page has not been fetched, Google has not processed its current content for indexing.

Google’s Page Indexing documentation says this status typically appears when Google wanted to crawl the URL but rescheduled the crawl because doing so was expected to overload the site. The label does not prove that your server actually failed or that the individual page contains an error. [Page indexing report](https://support.google.com/webmasters/answer/7440203)[@gsc-page-indexing]

The useful distinction is:

| Status | Has Google discovered the URL? | Has Google crawled the page? |
| --- | --- | --- |
| Unknown to Google | Not established | No |
| Discovered – currently not indexed | Yes | No |
| Crawled – currently not indexed | Yes | Yes |
| Indexed | Yes | Yes, subject to later recrawls |

If Search Console reports “Discovered – currently not indexed,” do not begin by rewriting the article. Google has not crawled the current page, so the status itself cannot be a page-content verdict based on that crawl.

## Mechanism

Google discovers URLs through links, sitemaps, previously known paths, redirects, and other signals. Discovery adds a URL to Google’s known inventory. Crawling is a separate scheduling decision.

Google says its crawlers determine which sites to crawl, how often, and how many pages to fetch. They also try not to overload servers. Google does not crawl every URL it discovers. [In-depth guide to how Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)[@google-how-search-works]

For larger or heavily affected sites, two crawl-budget concepts are useful:

- **Crawl capacity limit:** How much crawling the host can handle without instability.
- **Crawl demand:** How much Google wants to recrawl the site and its URLs based on factors such as inventory, popularity, freshness, quality, and relevance.

Google’s current crawl-budget guide is primarily intended for very large sites, rapidly changing sites, or sites with a large proportion of URLs in this status. If your small site publishes a few pages and Google normally crawls them promptly, you probably do not need an elaborate crawl-budget project. [Optimize your crawl budget](https://developers.google.com/crawling/docs/crawl-budget)[@google-crawl-budget]

**Check recency first**

A new page can remain discovered for a while before its first crawl. Google advises that new pages and sites can take time to be found and crawled, and that indexing is not instant.

For one recently published page:

- Confirm it is publicly accessible.
- Confirm it has a crawlable internal link.
- Confirm the sitemap uses the preferred URL.
- Avoid repeated changes for several days unless evidence shows a defect.

A recent isolated URL is different from thousands of old URLs accumulating in the same state.

## Examples

**Check whether the pattern is isolated or systemic**

Use a sample across templates and publication dates.

| Pattern | More likely next question |
| --- | --- |
| One new page | Has Google simply not scheduled the first crawl yet? |
| One section | Does the section have weak links, duplicate URLs, or a template problem? |
| Most recent pages | Did publication, sitemap, or server behavior change? |
| Thousands of parameter URLs | Is Google spending attention on unwanted inventory? |
| Many URLs plus slow or failing responses | Is server capacity causing Google to back off? |

Do not infer a sitewide crawl-capacity problem from one URL.

**Verify internal discovery**

A sitemap is useful, but a page should also belong to the crawlable site structure.

Check that:

- A known, indexable page links directly to the URL.
- The link is an ordinary crawlable anchor.
- The page is not reachable only through site search, a form, or client-side interaction.
- Parent hubs are not blocked or noindexed.
- Internal links use the preferred canonical form.
- The page is not buried in an infinite or broken pagination path.

A clear internal link does more than reveal the URL. It also provides context and an importance signal within the site.

**Check sitemap consistency**

Confirm that the sitemap:

- Returns a successful response.
- Contains the preferred canonical URL.
- Does not list a redirecting or blocked variant.
- Uses accurate modification dates when supplied.
- Does not include large volumes of low-value or duplicate URLs.

A sitemap tells Google which URLs you consider important. It does not force a crawl or indexing decision.

**Check server health and crawl access**

Google’s crawling-error guidance recommends checking whether Google knows about new pages, whether crawling is blocked, whether the site has enough serving capacity, and whether crawl resources are being used efficiently. [Troubleshoot Google Search crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)[@google-crawl-errors]

Review:

- `5xx` errors
- `429` rate limiting
- Slow response times
- DNS and TLS failures
- Bot protection or firewall challenges
- Hosting incidents
- Large asset or rendering failures

Use Crawl Stats and server logs when the pattern is broad enough to justify them.

**Manage unwanted URL inventory**

Google’s crawl-budget guidance identifies duplicate or unwanted URL inventory as a major controllable source of wasted crawling. [Optimize your crawl budget](https://developers.google.com/crawling/docs/crawl-budget)[@google-crawl-budget]

Look for:

- Sorting and filtering parameters
- Calendar or faceted combinations
- Session and tracking parameters
- Duplicate print or preview routes
- Infinite pagination
- Staging or demo copies
- Multiple protocol and hostname variants
- Internal links to redirects

Do not block everything reflexively. First determine whether the URLs should be consolidated, redirected, canonicalized, removed, or excluded from crawling.

**Strengthen the pages that matter**

If the site generates many low-value or repetitive URLs, publishing even more near-duplicates can make the inventory problem worse. The corrective action is not to add arbitrary word count to every page. It is to make the preferred pages distinct, useful, well linked, and easy to identify as the canonical inventory.

| Situation | Best interpretation | First action |
| --- | --- | --- |
| A page published yesterday appears in the status | Google knows the URL but has not fetched it | Confirm links and sitemap, then allow time. |
| A six-month-old product section remains discovered | A section-level crawl or inventory problem is plausible | Sample links, sitemap URLs, server logs, parameters, and template behavior. |
| A small site has three affected URLs and healthy crawl history | A major crawl-budget project is probably disproportionate | Check the exact URLs and recent publication signals. |
| A large faceted store has millions of discovered filters | Unwanted URL inventory may be consuming crawl attention | Reduce duplicate inventory and control crawlable combinations. |
| New pages became affected after a hosting change | Serving capacity or bot protection may be involved | Check `5xx`, `429`, firewall, latency, and Crawl Stats. |

## Boundaries

This status does not tell you exactly when Google will crawl the URL. It does not establish that the page will be indexed after crawling, and it does not prove that a server-capacity problem is the only cause.

Google’s crawl allocation is algorithmic and depends on sitewide conditions that Search Console does not expose as one simple score.

Use the status to choose the correct stage of investigation. If Google later crawls the URL but does not index it, move to [Crawled – Currently Not Indexed](/articles/crawled-currently-not-indexed/) rather than continuing to diagnose discovery.
