---
{
  "slug": "search-console-average-position-not-fixed-rank",
  "title": "Search Console Average Position Is Not Your Page’s Fixed Google Rank",
  "description": "Understand how Search Console calculates average position across impressions, queries, pages, devices, countries, and result types with a transparent worked example.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Measurement",
  "series": "Measurement without theater",
  "audience": "Analysts and marketing leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-02",
  "revisedAt": "2026-08-02",
  "revisionNote": "Expanded Methodology and Limitations for native Data note staging. Citation IDs were namespaced for the global RankBuilder registry.",
  "directAnswer": "Search Console average position is the mean of the topmost position recorded for the selected property or page across qualifying impressions. It is not a statement that one URL ranked at that exact position for every user or query. Segment by query, page, country, device, search appearance, and date before using the metric to diagnose change.",
  "takeaways": [
    "Position is recorded per impression and then averaged.",
    "Property aggregation can use the topmost result from the property, while page aggregation treats each URL separately.",
    "A single average can combine different queries, countries, devices, result features, and dates.",
    "Clicks and impressions usually provide a more direct performance context than position alone."
  ],
  "claimLimits": [
    "The worked dataset below is illustrative, not exported from a live property. It demonstrates Google’s documented aggregation rules and does not estimate normal ranking volatility."
  ],
  "citations": [
    {
      "id": "rba07-gsc-position",
      "title": "What are impressions, position, and clicks?",
      "url": "https://support.google.com/webmasters/answer/7042828",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba07-gsc-about-data",
      "title": "Performance report: About the data",
      "url": "https://support.google.com/webmasters/answer/17011364",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba07-gsc-common-tasks",
      "title": "Performance report: Common tasks and use cases",
      "url": "https://support.google.com/webmasters/answer/17010961",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "googlebot-rendering-queue-documentation-note",
    "search-console-performance-data-limits",
    "search-console-is-not-analytics",
    "search-console-bulk-data-export-bigquery"
  ]
}
---

## Dataset and period

**Documentation dataset owner:** Google Search Console Help  
**Documentation access date:** 2026-08-02  
**Population described:** Impressions recorded in Google Search performance reporting  
**Illustrative sample:** Eight synthetic impressions created solely to demonstrate the published calculation rules  
**Period:** One hypothetical day

Google defines position as a relative placement in Search and reports average position across impressions. For a property or page, the recorded position is generally the topmost position occupied by a link from that property or page in the result. [What are impressions, position, and clicks?](https://support.google.com/webmasters/answer/7042828)[@rba07-gsc-position]

Google also documents different aggregation behavior for property and page views. When aggregated by property, multiple results from the same property on one search result page can count as one impression and use the topmost property position. When aggregated by page, each unique URL is counted separately. [Performance report: About the data](https://support.google.com/webmasters/answer/17011364)[@rba07-gsc-about-data]

## Methodology
The worked example uses synthetic impressions so the calculation remains transparent and contains no private property data. Each row represents one qualifying impression with a recorded topmost position for the selected page. We calculate the arithmetic mean across all eight impressions, then hold the rows constant while segmenting by query class and device. A second comparison uses two different four-impression distributions with the same mean to show why the aggregate cannot describe variance or query mix. The method follows Google’s documented distinction between impression-level position, property aggregation, and page aggregation; it does not simulate personalization or every search-feature layout.


We construct eight impressions for one page across four query-device combinations:

| Impression | Query class | Device | Country | Recorded position |
| --- | --- | --- | --- | ---: |
| 1 | Brand | Mobile | US | 1 |
| 2 | Brand | Desktop | US | 1 |
| 3 | Broad nonbrand | Mobile | US | 8 |
| 4 | Broad nonbrand | Desktop | US | 6 |
| 5 | Technical long-tail | Mobile | UK | 3 |
| 6 | Technical long-tail | Desktop | UK | 4 |
| 7 | Ambiguous query | Mobile | CA | 18 |
| 8 | Ambiguous query | Desktop | CA | 15 |

The unweighted average across impressions is:

```text
(1 + 1 + 8 + 6 + 3 + 4 + 18 + 15) / 8 = 56 / 8 = 7
```

Search Console would therefore report an average position of `7` for this synthetic selection, even though the page never appeared in position 7 in any row.

We then compare segments rather than changing the underlying impressions.

## Result

| Measure | Result |
| --- | ---: |
| Overall average position | 7.0 |
| Brand-query average | 1.0 |
| Broad nonbrand average | 7.0 |
| Technical long-tail average | 3.5 |
| Ambiguous-query average | 16.5 |
| Mobile average | 7.5 |
| Desktop average | 6.5 |

The overall value hides four materially different search situations.

**The same average can describe different distributions**
Consider two additional four-impression sets:

```text
Set A: 6, 7, 7, 8 → average 7
Set B: 1, 1, 13, 13 → average 7
```

Set A is tightly clustered. Set B combines top visibility with weak visibility. The average is identical, but the diagnostic interpretation is not.

**Query mix can move the average without a ranking loss**
Suppose the page gains many new impressions for broad queries at positions 12–20 while retaining the same brand and long-tail positions. Average position can worsen because the page became visible for a wider query set.

That does not automatically mean performance improved. It also does not automatically mean existing rankings fell. The query mix changed.

**Property and page views can disagree correctly**
If two pages from the same property appear in one result at positions 2 and 5:

- Property aggregation can record one impression at the topmost property position, 2.
- Page aggregation can record an impression for each URL at its own topmost page position.

Google warns that property aggregation can therefore produce a higher apparent CTR and position than page aggregation when multiple pages appear. [Performance report: About the data](https://support.google.com/webmasters/answer/17011364)[@rba07-gsc-about-data]

**Result features complicate visual interpretation**
Search result elements can contain several links and still occupy one reported position. Google’s methodology explains that compound elements can assign the containing element’s position to multiple links. Ads do not occupy organic search positions. [What are impressions, position, and clicks?](https://support.google.com/webmasters/answer/7042828)[@rba07-gsc-position]

A manual search from one device cannot reproduce the full population represented by the report because location, history, language, device, time, query variant, and result layout differ.

## Practical interpretation

Use average position as a diagnostic trend after narrowing the population.

A useful sequence is:

1. Select one page or controlled page group.
2. Segment brand and nonbrand queries.
3. Compare the same countries and devices.
4. Check search appearance types.
5. Compare equal date windows.
6. Review impressions and clicks beside position.
7. Inspect newly appearing or disappearing queries.
8. Annotate releases, migrations, seasonality, and campaigns.

Google’s current Search Console guidance recommends focusing more on trends in impressions and clicks than on position alone. [Performance report: Common tasks](https://support.google.com/webmasters/answer/17010961)[@rba07-gsc-common-tasks]

**A defensible report sentence**
Weak:

> Our Google rank fell from 5 to 8.

Stronger:

> Search Console average position for nonbrand mobile impressions to the service-page group in the United States moved from 5.2 to 8.1, while impressions increased 46% and clicks remained flat. The query table shows most new impressions came from broader terms outside the previous top 10.

The stronger sentence identifies the measured population and the evidence needed to interpret the movement.

## Limitations
The sample is synthetic and intentionally small, so it demonstrates arithmetic and aggregation rules rather than normal volatility for a live site. Search Console omits some query rows for privacy and internal limits, and preliminary values can change after processing. Position behavior also varies across result features, while third-party trackers observe a different, controlled population. The example cannot reconstruct personalization, every country or device, or impressions Google does not expose. Use average position for bounded comparisons within a stable selection and interpret it beside impressions, clicks, query mix, page scope, and release evidence rather than as a universal rank.


- The worked sample is synthetic and intentionally small.
- Search Console omits some query rows for privacy and internal limits.
- Preliminary data can change after collection completes.
- Average position does not measure visibility in every search surface the same way.
- Search Console and third-party rank trackers measure different populations and should not be forced into exact agreement.
- An average cannot establish why a change occurred without segment and release evidence.
