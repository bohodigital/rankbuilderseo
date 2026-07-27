---
{
  "slug": "google-indexing-time-study-baseline",
  "title": "Google Indexing Time Study: Baseline and First Cohort",
  "description": "Rank Builder's first indexing cohort contains 31 active article URLs. See the pre-expansion Search Console baseline, registered reporting gates, and why no duration estimate is claimed yet.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Reading the research",
  "audience": "Analysts and marketing leads",
  "evidenceLevel": "Desk analysis",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-26",
  "revisedAt": "2026-07-26",
  "directAnswer": "The first study cohort contains 31 active canonical article URLs released across Batches 2 through 5. Before those releases, Rank Builder recorded 298 Google Search impressions, zero clicks, and a weighted average position of 64.54 over 12 complete days. No indexing-duration estimate is reported yet because URL-level observations have not met the registered evidence threshold.",
  "takeaways": [
    "The published baseline describes sitewide search visibility before the large indexing corpus could affect the data.",
    "The first cohort contains 31 active URLs across four batch releases.",
    "A median indexing time remains withheld until at least ten URLs have confirmed indexed intervals."
  ],
  "claimLimits": [
    "The baseline contains aggregate Search Console metrics, not URL-level indexing durations.",
    "The cohort is observational, site-specific, and too young to support a universal indexing-time claim."
  ],
  "citations": [
    {
      "id": "gsc-search-analytics-api",
      "title": "Search Analytics: query",
      "url": "https://developers.google.com/webmaster-tools/v1/searchanalytics/query",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "gsc-url-inspection-api",
      "title": "Method: index.inspect",
      "url": "https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "gsc-url-inspection-help",
      "title": "URL Inspection tool",
      "url": "https://support.google.com/webmasters/answer/9012289?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-indexing-time-study-methodology",
    "how-long-google-takes-to-index-page",
    "page-indexing-report-not-updating",
    "google-search-console-url-inspection",
    "why-request-indexing-is-not-working",
    "search-console-is-not-analytics"
  ]
}
---

## Dataset and period

![Laptop displaying charts beside a notebook and mug](/media/google-indexing-time-study-baseline-hero.jpg "The baseline records what was measurable before the new indexing corpus had time to influence search performance.")

This page is the first public status report for the Rank Builder Google Indexing Time Study.

It reports two things:

1. The aggregate Search Console baseline before the new indexing corpus could materially affect performance data.
2. The composition and evidence status of the first URL cohort.

It does **not** report a median indexing time. The URL-level evidence required for that calculation is not yet available in sufficient quantity.

**Pre-expansion baseline**

The baseline covers twelve complete Search Console days from July 13 through July 24, 2026.

| Metric | Baseline value |
| --- | ---: |
| Complete days | 12 |
| Google Search impressions | 298 |
| Google Search clicks | 0 |
| CTR | 0% |
| Impression-weighted average position | 64.54 |
| Lowest daily impressions | 17 |
| Highest daily impressions | 36 |

The data was observed in the internal aggregate analytics store on July 26, 2026, with Search Console data complete through July 24. The bounded query fingerprint for the published calculation is:

```text
d0f7b3208d888d78
```

The baseline is deliberately sitewide. The current analytics record does not contain page-level indexing events for this period.

Search Analytics can group performance by page and date, but Google notes that its API is internally bounded and does not guarantee every possible row.[@gsc-search-analytics-api] The study therefore treats a recorded first impression as affirmative evidence while treating a missing row more cautiously.

**First cohort**

The first cohort contains 31 active canonical article URLs released across four production batches.

| Cohort | Active eligible URLs | Release date | Release commit |
| --- | ---: | --- | --- |
| Batch 2 active pages | 7 | July 25, 2026 | `cf80bb2316bdee90727f2d0ea312e3bf3a269a71` |
| Batch 3 | 8 | July 25, 2026 | `77f51363fc6c93e4a9c90eec01cbcf972fc08adf` |
| Batch 4 | 8 | July 26, 2026 | `3204ad21b370c714e3854888980275cedad1f7bf` |
| Batch 5 | 8 | July 26, 2026 | `206fcf85c30a1aa9220e7b4777ed0811a80de3b5` |
| **Total** | **31** | — | — |

The duplicate Batch 2 troubleshooting hub is excluded because it was archived and redirected to the preserved flagship article.

The cohort spans:

- Search Console indexing statuses
- HTTP and redirect failures
- Canonicalization and discovery
- JavaScript and rendering
- Crawl-budget guidance
- WordPress, Shopify, Next.js, and Cloudflare implementation

This is not a randomized sample of the web. It is a practical cohort of connected technical-SEO pages published on one young domain.

## Methodology

The full registered protocol appears in [Google Indexing Time Study: Methodology](/articles/google-indexing-time-study-methodology).

For this status report, a URL counts as eligible only when it is:

- public on the canonical domain;
- a stable `200` HTML page;
- crawlable and indexable;
- self-canonical;
- present in the sitemap;
- internally linked;
- tied to a verified production commit.

The study seeks the following events:

| Event | Evidence source |
| --- | --- |
| Production release | Git and deployment evidence |
| Sitemap availability | Generated production sitemap |
| First Google crawl | URL Inspection indexed data or verified equivalent evidence |
| First confirmed indexed state | URL Inspection indexed data |
| First search impression | Search Analytics page-and-date data |

The URL Inspection API reports information about Google's indexed version. It does not run a live test.[@gsc-url-inspection-api] A positive live test may show technical eligibility, but it does not establish that Google has selected the URL for the index.[@gsc-url-inspection-help]

**Reporting thresholds**

The registered gates are:

- At least 10 confirmed indexed URLs before publishing a median
- At least 20 confirmed indexed URLs before publishing percentile estimates
- At least 7 days of follow-up for the first descriptive comparison
- A primary observation window of up to 28 days

Before those gates are met, the page may report counts and individual bounded intervals. It must not imply a stable central estimate.

## Result

**Current evidence status**

| Status | Count |
| --- | ---: |
| Eligible cohort URLs | 31 |
| Batch cohorts | 4 |
| URLs with imported URL-level inspection observations | 0 |
| Confirmed indexed intervals | 0 |
| Confirmed first-impression dates | 0 |
| Publishable duration estimate | No |

The current result is therefore:

> **No indexing-duration estimate is available yet.**

That is not a failed study. It is the correct result when a cohort has been registered but the observation system has not yet produced enough URL-level evidence.

**What can be concluded now**

The site had measurable but weak search visibility before the expansion:

- 298 impressions across twelve complete days
- No recorded clicks
- Average position far outside the range likely to produce meaningful traffic
- Daily impressions between 17 and 36

The new corpus is large enough to support an indexing cohort, but the baseline cannot tell us:

- how many new URLs Google has discovered;
- which URLs have been crawled;
- which URLs are indexed;
- how long those transitions took;
- which pages have received their first impression.

Those questions require the URL-level observation process described in the methodology.

**Next update trigger**

The first descriptive update may be published when both conditions are true:

1. At least seven days have passed for the earliest active cohort.
2. URL-level observations exist for enough pages to describe state counts without guessing.

The first median remains gated until at least ten URLs have completed confirmed indexing intervals.

## Limitations

The baseline precedes the large content rollout and therefore cannot measure its effect.

Other limitations include the following. Search Console performance data can lag. Aggregate metrics cannot establish URL-level indexing. The site's early query mix is unknown in the published baseline. Zero clicks does not mean zero indexing. Average position combines different queries and pages. Batch releases share site conditions and are not independent experiments. Some early URLs may have received manual indexing requests that were not recorded prospectively. A URL can be indexed under a different canonical. A URL can be indexed without producing a reported impression.

This page will be updated through versioned observations rather than rewritten into a success story after the fact.

The responsible conclusion is intentionally plain:

> **Rank Builder has a registered 31-URL cohort and a documented pre-expansion baseline. It does not yet have enough URL-level evidence to claim an indexing time.**
