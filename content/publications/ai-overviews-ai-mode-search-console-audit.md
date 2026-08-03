---
{
  "slug": "ai-overviews-ai-mode-search-console-audit",
  "title": "AI Overviews and AI Mode Traffic Audit: What Search Console Can Actually Show",
  "description": "Audit AI Overviews and AI Mode visibility using Search Console's generative AI report, impression rules, canonical aggregation, exports, comparisons, and limits.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Search landscape",
  "series": "Measurement without theater",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Use the dedicated Generative AI performance report when the property has access. Preserve the report’s availability date, export page, country, device, and date data, compare complete periods, and reconcile those impressions with the ordinary Web performance report. Do not infer query-level exposure, unlinked citations, ranking causality, or revenue impact from impression totals alone.",
  "takeaways": [
    "The current report includes impressions from AI Overviews and AI Mode and is rolling out to a subset of properties.",
    "The documented dimensions include page, country, date, and device, but not query.",
    "Its data is included in the ordinary Web search type, so the totals must not be added together.",
    "Access and minimum-impression conditions create selection bias across properties."
  ],
  "claimLimits": [
    "The report and feature list are actively evolving and must be rechecked.",
    "Search Console cannot establish whether an AI feature caused a later conversion.",
    "The report does not expose every generated answer, unlinked mention, or Search Labs experiment."
  ],
  "citations": [
    {
      "id": "ai-gsc-report",
      "title": "Generative AI performance report (Search)",
      "url": "https://support.google.com/webmasters/answer/16984139",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ai-gsc-metrics",
      "title": "What are impressions, position, and clicks?",
      "url": "https://support.google.com/webmasters/answer/7042828",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ai-gsc-data",
      "title": "Performance report: About the data",
      "url": "https://support.google.com/webmasters/answer/17011364?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ai-gsc-dimensions",
      "title": "Performance report: Dimensions and data groupings",
      "url": "https://support.google.com/webmasters/answer/17011259?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ai-google-guide",
      "title": "Google's guide to optimizing for generative AI features on Google Search",
      "url": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "http3-google-ranking-claim-check",
    "infinite-calendar-urls-crawl-trap",
    "discover-ranking-systems-claim-check"
  ]
}
---

## Preconditions

Before opening the report, record the measurement question.

Useful questions include:

- Which canonical pages receive impressions in generative AI features?
- Did the mix change after a product launch or editorial revision?
- Are impressions concentrated by country or device?
- Did AI-feature visibility move differently from ordinary Web visibility?
- Are the pages producing qualified visits and business outcomes elsewhere?

Do not begin with “Did AI Search steal our traffic?” That sentence combines exposure, clicks, user behavior, attribution, and counterfactual causation into one dramatic bucket.

Google’s current Search Console help page says the Generative AI performance report for Search is rolling out to a subset of website owners. It includes impressions from AI Overviews and AI Mode while excluding Search Labs experiments. [@ai-gsc-report] If the property does not show the report, documented reasons include rollout status and insufficient impressions.

Preserve:

```text
property
property type
report first observed
report last observed
timezone
access role
export date
site releases
known Search events
```

Also preserve the administrator account and property type. A domain property and a URL-prefix property can contain different inventories, and a report visible to one user may be absent for another because of permissions or product rollout.

## Ordered process

1. **Confirm report availability and scope.** Capture the report name, help-page version, and included features on the audit date. Google says the included capability list may change as Search develops. [@ai-gsc-report]

2. **Record the counting model.** The report counts impressions when links to the property are shown in supported generative AI features. For AI Mode, Google applies standard impression rules; a click on an external link counts as a click, and a follow-up question is treated as a new query. [@ai-gsc-metrics]

3. **Export the complete available views.** Export chart and tables for pages, countries, devices, and dates. Preserve original files before filtering. Record whether the export came from the interface, API, or another tool. Do not merge datasets until aggregation and retrieval times are known.

4. **Separate property and page aggregation.** Google says chart totals are aggregated by property while a page table is aggregated by page. Multiple results from one property can therefore behave differently in chart and table totals. [@ai-gsc-report] A discrepancy is not evidence of corruption until the aggregation basis is checked.

5. **Confirm canonical ownership.** Page data is generally assigned to the final linked canonical URL. A duplicate URL can receive a visit while the canonical receives reported credit. [@ai-gsc-dimensions] Group pages by canonical rather than by every observed request URL.

6. **Build complete comparison periods.** Exclude preliminary points and align weekdays. Use periods beginning after the property received access. Missing report history before rollout is not zero performance. If access begins midweek, wait for complete comparable weeks rather than dividing partial totals by hope.

7. **Reconcile with Web performance.** Google states that the generative AI report’s data is included in the Web search type of the ordinary Performance report. [@ai-gsc-report]

```text
Web total includes generative AI report data
```

Do not calculate:

```text
total Search visibility = Web report + generative AI report
```

That double counts the included component.

8. **Segment page cohorts.** Group pages by template, topic, publication date, commercial role, and update state. Compare stable cohorts rather than one winning page. Useful groups include product pages, editorial guides, news, support, home page, and category pages.

9. **Segment countries and devices.** A property-wide increase can be caused by one market or device class. Record absolute values as well as percentages so a small launch does not masquerade as a sitewide transformation.

10. **Annotate competing events.** Record content releases, migrations, title changes, indexing issues, external campaigns, product launches, major news, and announced Search events. Timing consistency is evidence, not proof of cause.

11. **Join site and business data carefully.** Use analytics and business systems to inspect sessions, leads, subscriptions, or revenue after clicks. Keep Search Console impressions distinct from on-site users and attributed conversions. One impression can produce no visit; one user can produce several events.

12. **Review quality rather than only volume.** Inspect whether exposed pages are accurate, current, useful, and aligned with the business. More AI impressions on outdated or low-margin content can be operationally worse than fewer impressions on valuable pages.

13. **Write a bounded conclusion.** State what changed, where, and under which reporting rules. Name unavailable dimensions and competing explanations.

## Practical audit table

```text
page cohort
AI impressions
AI clicks
AI CTR
Web impressions
Web clicks
country
device
period
content change
conversion evidence
notes
```

If the current interface does not include a metric, record only the fields actually present. Do not manufacture a zero column to make the spreadsheet feel emotionally complete.

**AI impressions rise while Web clicks remain flat.** Possible explanations include more AI-feature exposure without proportional link engagement, growth in queries or markets not visible as a query dimension, page mix shifting toward informational exposure, ordinary Web losses elsewhere offsetting gains, or reporting access beginning mid-period. The pattern does not establish traffic theft.

**One page dominates the report.** Check canonical consolidation, publication timing, country concentration, and whether the page appears in several generated responses. Property and page aggregation can produce different totals. Review whether the page is a true business priority or merely a highly visible definition.

**The report disappears.** Record the date and check official documentation, access, and data thresholds. A disappearing interface does not prove impressions ceased. It may reflect product rollout, permissions, thresholds, or a reporting issue.

**Table total is below chart.** The help page warns that aggregation differences can create chart-table discrepancies. [@ai-gsc-report] Privacy and row limits can create additional gaps. [@ai-gsc-data]

**AI clicks rise while conversions fall.** Check landing-page intent, device mix, geography, page speed, analytics continuity, and conversion definitions. The report alone cannot identify whether traffic was lower quality, the site changed, or measurement failed.

**A recently updated page gains exposure.** The timing can justify a follow-up test. It does not prove the specific edit caused the gain. Preserve the change log and compare similar untreated pages.

## Failure cases

**Adding AI impressions to Web impressions.** The data is already included.

**Claiming query intent from page data.** The documented report dimensions do not provide a query table.

**Comparing pre-access zeros with post-access data.** No report history is not evidence of no exposure.

**Treating impressions as citations.** The metric counts shown links; it does not inventory every factual use of a source.

**Using one date.** Preliminary data can change, and daily visibility can be volatile.

**Calling correlation an update effect.** Content changes, demand, country mix, feature rollout, and ranking changes can overlap.

**Reporting only percentages.** A 300% increase from one impression to four is mathematically true and operationally tiny.

**Assuming every unlinked answer is measured.** The public report documents link impressions, not a complete record of textual mentions.

**Using the report as a content brief generator.** It does not expose the queries or answer passages that created the impression.

## Completion criteria

The audit includes:

- report-access date;
- features included on the audit date;
- raw exports;
- aggregation method;
- canonical handling;
- complete periods;
- Web-report reconciliation;
- page cohorts;
- country and device segments;
- absolute values;
- on-site outcome evidence;
- competing events;
- explicit unavailable dimensions;
- bounded conclusions;
- a scheduled rerun date.

Google’s broader generative AI guidance says familiar SEO practices remain relevant and does not identify special markup or a separate optimization system for inclusion. [@ai-google-guide] The report is a useful window, not an omniscient glass elevator descending into the ranking systems.
