---
{
  "slug": "search-console-ai-performance-report",
  "title": "Google Search Console AI Performance Report: How to Track AI Overviews and AI Mode",
  "description": "How to use Google's new Search Console AI performance report for AI Mode and AI Overviews, including impressions, pages, devices, countries, and limits.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-06",
  "revisedAt": "2026-08-06",
  "directAnswer": "Search Console finally has a dedicated view for AI Mode and AI Overview visibility. The catch is important: the current Search report is built around impressions, not a clean AI click metric, and its page, aggregation, canonical, row-limit, and rollout rules can make sloppy analysis wildly misleading.",
  "takeaways": [
    "Search Console finally has a dedicated view for AI Mode and AI Overview visibility. The catch is important: the current Search report is built around impressions, not a clean AI click metric, and its page, aggregation, canonical, row-limit, and rollout rules can make sloppy analysis wildly misleading.",
    "Google Search Console’s new Generative AI performance report for Search shows how often URLs from your site appear in supported generative AI features, currently including AI Overviews and AI Mode.",
    "The report can break visibility down by:",
    "- pages; - countries; - dates; - devices."
  ],
  "claimLimits": [
    "Reviewed against cited sources available through 2026-08-06.",
    "Search features, documentation, policies, interfaces, sampling, and enforcement can change after publication.",
    "Eligibility, compliance, or correct implementation does not guarantee rankings, traffic, citations, or rich results."
  ],
  "citations": [
    {
      "id": "rb-handoff-20-02-source-1",
      "title": "Generative AI performance report (Search)",
      "url": "https://support.google.com/webmasters/answer/16984139",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-handoff-20-02-source-2",
      "title": "Introducing Search Generative AI performance reports in Search Console",
      "url": "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-handoff-20-02-source-3",
      "title": "Performance report: About the data",
      "url": "https://support.google.com/webmasters/answer/17011364",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-handoff-20-02-source-4",
      "title": "Performance report: Dimensions and data groupings",
      "url": "https://support.google.com/webmasters/answer/17011259",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-06"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "ai-mode-seo-2026",
    "may-2026-google-core-update-recovery",
    "google-search-console-page-indexing-report"
  ]
}
---

## Preconditions

Search Console finally has a dedicated view for AI Mode and AI Overview visibility. The catch is important: the current Search report is built around impressions, not a clean AI click metric, and its page, aggregation, canonical, row-limit, and rollout rules can make sloppy analysis wildly misleading.

Google Search Console’s new **Generative AI performance report for Search** shows how often URLs from your site appear in supported generative AI features, currently including AI Overviews and AI Mode.[@rb-handoff-20-02-source-1]

The report can break visibility down by:

- pages;
- countries;
- dates;
- devices.

The default metric is **impressions**.

That is the first analytical rule to tattoo onto the spreadsheet:

> Do not turn AI impressions into AI clicks unless Google actually provides a click metric for that report.

Google launched the report on June 3, 2026 and is still rolling it out to a subset of website owners.[@rb-handoff-20-02-source-2]

**Why this keyword is hot.**

For years, publishers asked the same question:

> Is Google’s AI using my site, and what traffic am I getting from it?

Until 2026, Search Console rolled AI features into ordinary Web performance data.

The dedicated generative AI report is the first Google-native surface specifically designed to show AI feature visibility.

That makes “Search Console AI performance report” a high-intent query for:

- SEOs;
- publishers;
- analysts;
- agencies;
- executives;
- clients asking for AI visibility reports.

**What the report includes.**

The Search report currently includes impressions from:

- AI Overviews;
- AI Mode.[@rb-handoff-20-02-source-1]

Google says it expects the supported capability list to change as Search evolves.

Search Labs experiments are excluded.

The report lets you group by:

**Pages.**

The final URL linked by the generative AI feature after redirects. Most data is assigned to the canonical URL.

**Countries.**

The country where the search originated.

**Dates.**

Daily, weekly, or monthly groupings in Pacific Time.

**Devices.**

Desktop, tablet, or mobile.

That is enough to answer useful questions.

It is not enough to answer every question.

**Sources reviewed.**

1. [Generative AI performance report (Search)](https://support.google.com/webmasters/answer/16984139) — Google Search Console Help; accessed 2026-08-06. [@rb-handoff-20-02-source-1]
2. [Introducing Search Generative AI performance reports in Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) — Google Search Central; accessed 2026-08-06. [@rb-handoff-20-02-source-2]
3. [Performance report: About the data](https://support.google.com/webmasters/answer/17011364) — Google Search Console Help; accessed 2026-08-06. [@rb-handoff-20-02-source-3]
4. [Performance report: Dimensions and data groupings](https://support.google.com/webmasters/answer/17011259) — Google Search Console Help; accessed 2026-08-06. [@rb-handoff-20-02-source-4]

## Ordered process

Use the article in this order:

1. Why this keyword is hot
2. What the report includes
3. What the report does not give you cleanly
4. Why chart totals and page totals can differ
5. Canonical URLs matter
6. The 1,000-row limitation still matters
7. Preliminary data
8. How to build a useful AI visibility dashboard
9. A practical report template
10. Not seeing the report?
11. How to find pages worth improving
12. Compare periods carefully

**What the report does not give you cleanly.**

Do not assume the report provides:

- a query table;
- exact prompt text;
- citation position;
- AI response text;
- click-through rate from the AI answer;
- conversion value;
- citation sentiment;
- whether your page was quoted or merely linked.

The report is an exposure dataset.

Treat it that way.

**Why chart totals and page totals can differ.**

Google aggregates the chart and table differently depending on the selected dimension.[@rb-handoff-20-02-source-1]

At the property level, if two links from the same property appear in one generative AI result, they can count as one property impression.

When grouped by page, page-level aggregation applies.

This can create:

```text
chart total ≠ sum of visible page rows
```

That is not automatically a bug.

Search Console has always required analysts to understand aggregation before summing columns like they were grocery receipts.

**Canonical URLs matter.**

Most Search Console performance data is assigned to Google’s canonical URL.[@rb-handoff-20-02-source-1][@rb-handoff-20-02-source-3]

Suppose AI Mode links to:

```text
https://example.com/article?utm_source=test
```

but Google’s canonical is:

```text
https://example.com/article/
```

The page dimension can credit the canonical.

If your AI visibility seems to “disappear” from a duplicate or parameter URL, check URL Inspection before declaring data loss.

**The 1,000-row limitation still matters.**

Google says the usual Search performance limitations apply, including the 1,000-row table limit.[@rb-handoff-20-02-source-1]

This matters for large publishers.

A visible page table is not necessarily every page that earned an AI impression.

Export the data.

Preserve the selected:

- date range;
- dimension;
- filters;
- extraction time;
- property.

**Preliminary data.**

The newest data can be preliminary.

Google marks preliminary chart data with a dotted line.[@rb-handoff-20-02-source-1]

Do not send an executive alert because today’s AI impressions fell at 10 a.m.

Wait for the reporting window to settle.

**How to build a useful AI visibility dashboard.**

Use four layers.

**Layer 1: Search Console AI impressions.**

Track:

```text
total AI impressions
AI impressions by page
AI impressions by country
AI impressions by device
AI impressions over time
```

**Layer 2: ordinary Search clicks.**

Use the standard Performance report for clicks and queries.

Do not pretend those clicks are all from AI Mode.

**Layer 3: analytics.**

Track organic landing-page sessions and conversions in GA4 or another analytics system.

Compare pages with rising AI visibility against:

- sessions;
- leads;
- transactions;
- engagement.

**Layer 4: observation.**

For priority queries, manually sample AI Mode and AI Overviews.

Record:

- date;
- exact query;
- cited domain;
- cited URL;
- response context;
- competitors.

This is observational, not exhaustive.

**A practical report template.**

| Metric | Source | Meaning |
|---|---|---|
| AI impressions | GSC AI report | URL appeared in supported AI feature |
| Organic clicks | GSC Performance | Click from Google Search |
| Organic sessions | Analytics | Landing session attributed to organic |
| Conversion | Analytics/CRM | Business outcome |
| Citation sample | Manual/tool | Observed AI response evidence |

Keep the layers separate.

A dashboard can show them together without pretending they are the same event stream.

**Not seeing the report?**

Google gives two common reasons.[@rb-handoff-20-02-source-1]

1. The property has not received access yet.
2. The property has not received enough supported generative AI impressions.

Google also notes that exclusion controls can affect eligibility.

Do not install a plugin to “unlock” the report.

Rollout is controlled by Google.

**How to find pages worth improving.**

Sort or export page impressions.

Create three buckets.

**High AI impressions, high organic value.**

Protect and improve.

Add:

- current sources;
- updated facts;
- original media;
- better internal links;
- clearer direct answers.

**High AI impressions, low business value.**

Understand why.

The page may attract broad informational visibility with little commercial payoff.

**Low AI impressions, high commercial importance.**

Audit:

- indexability;
- canonical;
- content depth;
- entity clarity;
- originality;
- competing pages;
- supporting media.

Do not infer that adding the phrase “AI optimized” will fix it.

**Compare periods carefully.**

For a new report, year-over-year comparisons may be unavailable or meaningless.

Use:

```text
last 28 days vs previous 28 days
```

after the property has enough stable history.

Annotate:

- rollout date;
- site migrations;
- core updates;
- major content changes.

## Failure cases

**FAQ.**

**Does Search Console show AI Mode clicks?**

The dedicated report is currently focused on AI feature impressions and dimensions. Use the standard Search performance report and analytics for click and conversion analysis rather than inventing a dedicated AI click number.

**Does the report include AI Overviews?**

Yes. Google currently lists AI Overviews and AI Mode as included generative AI Search capabilities.

**Why do page rows not add up to the chart?**

Aggregation and row limits can create discrepancies.

**Does the report show queries?**

The current dedicated report documentation centers on pages, countries, dates, and devices rather than a prompt or query table.

**Is the report available to everyone?**

No. Google says rollout remains limited to a subset of site owners.

**Verdict.**

Search Console’s AI report is useful because it finally gives publishers a first-party AI visibility baseline.

Its greatest danger is that people will manufacture a click metric, attribution model, or “AI share of voice” number the report never supplied.

Use it as an impressions dataset, connect it to ordinary Search and conversion data, and keep every transformation auditable.

**Verification record.**

- Dedicated report fields, aggregation rules, canonical handling, preliminary data, and row limits were checked against Google Search Console Help on 2026-08-06.
- Rollout status remains limited.
- No AI click metric is invented.

**Duplication and search-intent record.**

No prior package targets the exact new Generative AI performance report with current 2026 rollout mechanics, aggregation rules, dashboard design, and measurement limitations.

This playbook reflects sources available through 2026-08-06. Search features, reporting interfaces, policies, enforcement, and company records can change. Eligibility, compliance, or correct implementation does not guarantee rankings, traffic, citations, rich results, refunds, or a particular commercial outcome.
