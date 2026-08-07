---
{
  "slug": "bing-webmaster-tools-ai-performance",
  "title": "Bing Webmaster Tools AI Performance: How to Track Copilot Citations in 2026",
  "description": "Track Copilot and Bing AI citations with Bing Webmaster Tools AI Performance, including grounding queries, cited pages, trends, limitations, and IndexNow.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Measurement",
  "series": "Reading the research",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-06",
  "revisedAt": "2026-08-06",
  "directAnswer": "Microsoft now exposes something publishers have spent years begging AI platforms to provide: citation reporting. Bing Webmaster Tools AI Performance can show which pages are cited, how often, and sample grounding queries used in AI retrieval.",
  "takeaways": [
    "Microsoft now exposes something publishers have spent years begging AI platforms to provide: citation reporting. Bing Webmaster Tools AI Performance can show which pages are cited, how often, and sample grounding queries used in AI retrieval.",
    "Microsoft launched AI Performance in Bing Webmaster Tools as a public preview in February 2026.",
    "The report shows how publisher content is cited across supported Microsoft AI experiences, including Microsoft Copilot, AI-generated summaries in Bing, and select partner integrations."
  ],
  "claimLimits": [
    "The cited sources supporting this Bing Webmaster Tools AI Performance review were checked through 2026-08-06.",
    "Bing Webmaster Tools AI Performance documentation, interfaces, measurement methods, policies, and availability can change after publication.",
    "Correct handling of Bing Webmaster Tools AI Performance does not guarantee rankings, traffic, citations, advertising delivery, or commercial outcomes."
  ],
  "citations": [
    {
      "id": "rb-algo-trend-06-12-source-1",
      "title": "Introducing AI Performance in Bing Webmaster Tools Public Preview",
      "url": "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
      "publisher": "Microsoft Bing",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-12-source-2",
      "title": "Bing Webmaster Blog",
      "url": "https://blogs.bing.com/webmaster",
      "publisher": "Microsoft Bing",
      "accessedAt": "2026-08-06"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-zero-click-searches-2026",
    "indexnow-ai-search",
    "ai-overviews-traffic-claims"
  ]
}
---

## Preconditions

Microsoft now exposes something publishers have spent years begging AI platforms to provide: citation reporting. Bing Webmaster Tools AI Performance can show which pages are cited, how often, and sample grounding queries used in AI retrieval.

Microsoft launched **AI Performance** in Bing Webmaster Tools as a public preview in February 2026.

The report shows how publisher content is cited across supported Microsoft AI experiences, including Microsoft Copilot, AI-generated summaries in Bing, and select partner integrations.

Microsoft documents metrics including:

- Total Citations;
- Average Cited Pages;
- grounding queries;
- page-level citation activity;
- visibility trends.

That makes Bing Webmaster Tools one of the clearest first-party citation reporting surfaces currently available to publishers.

**Total Citations.**

Total Citations counts citations displayed as sources in supported AI-generated answers during the selected period.

It does not tell you:

- citation position;
- sentiment;
- whether the user clicked;
- whether the citation was decisive;
- whether the page was the most important source.

Treat it as exposure.

Not rank.

**Average Cited Pages.**

This metric shows the average number of unique site pages cited per day.

Useful questions:

- Is AI visibility concentrated on one page?
- Is the cited-page footprint expanding?
- Did a site migration reduce citation breadth?
- Did a new research cluster create more cited URLs?

Microsoft explicitly says this is not a ranking or authority metric.

Do not create:

```text
AI Authority Score = Average Cited Pages × 10
```

unless you enjoy inventing numbers that mean nothing.

**Sources reviewed.**

1. [Introducing AI Performance in Bing Webmaster Tools Public Preview](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) — Microsoft Bing; accessed 2026-08-06. [@rb-algo-trend-06-12-source-1]
2. [Bing Webmaster Blog](https://blogs.bing.com/webmaster) — Microsoft Bing; accessed 2026-08-06. [@rb-algo-trend-06-12-source-2]

## Ordered process

Use the article in this order:

1. Total Citations
2. Average Cited Pages
3. Grounding queries
4. Page-level citations
5. Citation trends
6. Export a baseline
7. Compare Bing and Google separately
8. IndexNow connection
9. Local business visibility
10. How to improve cited pages
11. Build an AI citation dashboard

**Grounding queries.**

This is the most interesting field.

Microsoft says grounding queries show key phrases the AI used while retrieving content that was ultimately cited.

The data is a sample rather than a complete query log.

Grounding queries can reveal vocabulary you did not target directly.

Example:

Your article:

```text
HTTP 423 Locked and SEO
```

Grounding query:

```text
webdav locked resource response
```

That can expose adjacent intent.

Use it for research.

Do not create a separate page for every phrase automatically.

**Page-level citations.**

Page reporting tells you which URLs receive citations.

Build categories:

**High citations, high conversions.**

Protect and improve.

**High citations, low website traffic.**

The answer may be useful to AI but generate limited visits.

Assess brand value.

**Low citations, high organic rank.**

The page may satisfy classic Search better than AI answer retrieval.

**New page suddenly cited.**

Investigate what information the AI found distinctive.

**Citation trends.**

Track citation counts over time.

Annotate:

- major content update;
- IndexNow submission;
- site migration;
- canonical fix;
- robots change;
- new original research;
- product launch.

Do not infer causality from one line moving after one edit.

Use repeated patterns.

**Export a baseline.**

Preserve:

```text
DATE_RANGE
TOTAL_CITATIONS
AVERAGE_CITED_PAGES
TOP_URLS
GROUNDING_QUERY_SAMPLE
EXPORT_DATE
```

A public preview can evolve.

Historical definitions can change.

Save raw exports when they matter.

**Compare Bing and Google separately.**

Google Search Console’s generative AI report and Bing’s AI Performance report measure different ecosystems.

Do not merge:

```text
Google AI impression
Bing citation
ChatGPT referral
```

into one undifferentiated “AI visibility” number without preserving the underlying channels.

A citation is not an impression.

An impression is not a click.

A click is not a conversion.

**IndexNow connection.**

Microsoft recommends keeping content fresh through IndexNow.

When a page is:

- published;
- updated;
- removed;

IndexNow can notify participating search engines quickly.

This matters for fast-changing facts:

- prices;
- availability;
- legal status;
- software versions;
- current dates.

A cited article containing stale information is worse than no citation.

**Local business visibility.**

Microsoft also recommends keeping Bing Places information current for local businesses.

Audit:

- name;
- address;
- phone;
- hours;
- categories;
- website;
- status.

AI systems can draw on structured local data beyond the website page itself.

**How to improve cited pages.**

Do not “optimize for citations” by repeating more keywords.

Improve:

- direct answers;
- source links;
- entity names;
- dates;
- version numbers;
- tables;
- definitions;
- original data;
- stable URLs;
- current facts.

Reduce ambiguity.

Microsoft’s own recommendations emphasize alignment across text, images, and video.

**Build an AI citation dashboard.**

Use columns:

```text
URL
TOPIC
BING CITATIONS
GOOGLE AI IMPRESSIONS
ORGANIC CLICKS
CHATGPT REFERRALS
CONVERSIONS
LAST UPDATED
```

This creates one executive view while preserving channel-specific metrics.

## Failure cases

**FAQ.**

**Does Bing Webmaster Tools show Copilot citations?**

Yes. Microsoft says AI Performance covers supported Microsoft AI experiences including Copilot.

**What is a grounding query?**

A sampled phrase used by the AI retrieval system when content that was cited was retrieved.

**Is citation count a ranking metric?**

No. Microsoft explicitly says citation activity does not indicate rank or authority.

**Can I see clicks from each citation?**

The AI Performance report is focused on citation visibility; use analytics and other reporting for website visits.

**Is the feature final?**

It launched as public preview, so definitions and coverage may evolve.

**Weekly workflow.**

1. Export citation trend.
2. Review new cited pages.
3. Review grounding query samples.
4. Check stale high-citation pages.
5. Submit real updates through IndexNow.
6. Compare traffic and conversions.
7. Record meaningful changes.

**Verdict.**

Bing AI Performance is useful precisely because it does not pretend citation visibility is ordinary ranking.

Use it to understand **which information Microsoft’s AI systems retrieve from your site**, then connect that evidence to traffic and business outcomes.

**Verification record.**

- Bing AI Performance fields and public-preview status were checked on 2026-08-06.
- Microsoft’s limits around citation rank and grounding-query sampling are preserved.
- No cross-platform equivalence with Google metrics is claimed.

**Duplication and search-intent record.**

No prior RankBuilder package targets Bing Webmaster Tools AI Performance as a complete Copilot citation workflow.
