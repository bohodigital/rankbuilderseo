---
{
  "slug": "faq-schema-2026-google-rich-results-removed",
  "title": "FAQ Schema in 2026: Google Removed FAQ Rich Results—Should You Keep the Markup?",
  "description": "Google removed FAQ rich results in 2026. Learn whether to keep FAQPage markup, how Search Console changed, and what FAQs are still useful for.",
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
  "publishedAt": "2026-08-07",
  "revisedAt": "2026-08-07",
  "directAnswer": "Google removed FAQ rich results in 2026. That does not mean FAQs are useless or that every FAQPage block must be ripped out immediately. It means the markup no longer earns that Search appearance and should not be maintained solely for stars-and-serp-decoration fantasies.",
  "takeaways": [
    "Google removed FAQ rich results in 2026. That does not mean FAQs are useless or that every FAQPage block must be ripped out immediately. It means the markup no longer earns that Search appearance and should not be maintained solely for stars-and-serp-decoration fantasies.",
    "Google no longer shows the FAQ rich result feature in Search.",
    "Google’s documentation says the feature stopped appearing beginning May 7, 2026, and Google removed its FAQ rich result documentation in June."
  ],
  "claimLimits": [
    "The cited sources supporting this FAQ schema 2026 review were checked through 2026-08-07.",
    "FAQ schema 2026 documentation, interfaces, measurement methods, policies, and availability can change after publication.",
    "Correct handling of FAQ schema 2026 does not guarantee rankings, traffic, citations, advertising delivery, or commercial outcomes."
  ],
  "citations": [
    {
      "id": "rb-algo-trend-07-06-source-1",
      "title": "Latest Google Search documentation updates",
      "url": "https://developers.google.com/search/updates",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-07"
    },
    {
      "id": "rb-algo-trend-07-06-source-2",
      "title": "Changes to HowTo and FAQ rich results",
      "url": "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-07"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "ai-mode-seo-2026",
    "search-console-ai-performance-report",
    "june-2026-google-spam-update",
    "search-console-data-anomalies-2026"
  ]
}
---

## Definition

Google removed FAQ rich results in 2026. That does not mean FAQs are useless or that every FAQPage block must be ripped out immediately. It means the markup no longer earns that Search appearance and should not be maintained solely for stars-and-serp-decoration fantasies.

Google no longer shows the FAQ rich result feature in Search.

Google’s documentation says the feature stopped appearing beginning **May 7, 2026**, and Google removed its FAQ rich result documentation in June.

That means FAQPage markup no longer provides the old visible FAQ expansion in Google Search.

You do **not** need to delete useful FAQ content.

You also do not need to panic-remove syntactically valid FAQPage markup solely because the rich result disappeared.

The real question is whether your site still has a reason to maintain the markup.

**What changed.**

FAQ rich results used to let eligible pages show question-and-answer expansions directly in Search.

Google had already restricted the feature heavily in earlier years.

In 2026, Google completed the retirement.

The Search appearance is gone.

That means there is no current SEO strategy based on:

```text
add FAQ schema
→ receive FAQ rich result
→ get larger SERP footprint
```

That playbook is obsolete.

**Should you remove FAQPage markup?**

There are three reasonable cases.

**Case 1: markup is generated automatically and causes no problems.**

You can leave it temporarily.

Structured data that accurately describes visible content is not inherently harmful merely because Google no longer uses that type for a rich result.

But maintaining unused markup forever adds complexity.

Put it on the cleanup backlog.

**Case 2: markup requires custom code or maintenance.**

Remove it if the only reason it exists was the retired Google rich result.

Every line of production code has a maintenance cost.

Do not preserve a custom FAQ schema pipeline for a feature that no longer exists.

**Case 3: markup is inaccurate or hidden.**

Fix or remove it immediately.

Do not keep stale questions, wrong answers, or invisible content in structured data.

**Sources reviewed.**

1. [Latest Google Search documentation updates](https://developers.google.com/search/updates) — Google Search Central; accessed 2026-08-07. [@rb-algo-trend-07-06-source-1]
2. [Changes to HowTo and FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — Google Search Central; accessed 2026-08-07. [@rb-algo-trend-07-06-source-2]

## Mechanism

**FAQ content is still useful.**

A useful FAQ section can still help readers.

Good questions answer real friction:

- cancellation;
- compatibility;
- pricing;
- eligibility;
- setup;
- shipping;
- refunds;
- limitations.

The value is the answer.

Not the schema.

A clear FAQ can also improve:

- page comprehension;
- internal navigation;
- conversion;
- support;
- crawlable information.

**Do not create fake FAQs for keywords.**

Weak:

```text
What is the best SEO company Chicago?
How do I find the best SEO company Chicago?
Why is our SEO company Chicago the best?
```

That is keyword stuffing disguised as customer service.

Strong:

```text
Who owns the Search Console account?
Can I cancel month to month?
Do you subcontract link building?
What happens to content after termination?
```

The questions should reflect actual decisions.

**Search Console reporting changes.**

When Google removes a rich result type, associated reporting and testing support can also disappear.

Do not treat missing FAQ rich-result reporting as an indexing failure.

The page can remain indexed normally.

Search appearance features and indexing are separate.

**Rich Results Test.**

A retired Search feature can disappear from Google’s rich-result tooling.

That does not mean JSON-LD itself becomes invalid schema.org syntax.

Google Search support and schema.org vocabulary are separate things.

If your objective is Google Search enhancement, follow Google’s supported structured data documentation.

**Could another platform use FAQPage?**

Possibly.

Other consumers of structured data can interpret schema.org vocabulary independently.

If another product or integration genuinely uses FAQPage markup, document that dependency before removal.

Do not maintain markup because “maybe AI likes it.”

Require an actual consumer.

## Examples

**AI Mode does not restore the old feature.**

Google’s AI optimization guidance does not say FAQ schema is required for AI Mode or AI Overviews.

Do not repurpose old FAQ schema as a supposed “GEO hack.”

AI search can understand useful visible text without a retired rich-result feature.

**Content design after FAQ rich results.**

Move the emphasis from markup to answer quality.

A strong FAQ answer should be:

- direct;
- self-contained;
- specific;
- current;
- linked to detail when needed.

Example:

> **Can I cancel Hibu online?**
> Hibu’s published terms should be checked for the specific product because cancellation procedures and notice requirements can vary. Preserve written evidence of any cancellation request.

That is useful regardless of Search appearance.

**Do not remove all question headings.**

Some sites reacted to schema changes by deleting entire FAQ sections.

That confuses format with purpose.

A question heading can still be the clearest way to structure content.

Google removing a rich result does not make human questions illegal.

**Audit your FAQ implementation.**

Inventory:

```text
URL
FAQ SECTION
FAQPAGE MARKUP
MARKUP SOURCE
CUSTOM CODE
CONSUMER
OWNER
```

Then classify:

```text
KEEP
REMOVE
FIX
```

Remove dead dependencies deliberately.

## Boundaries

**FAQ.**

**Did Google remove FAQ rich results?**

Yes. Google says the feature stopped appearing in Search starting May 7, 2026.

**Should I delete all FAQPage schema?**

Not automatically. Remove it if it has no remaining consumer or creates maintenance cost. Fix it if inaccurate.

**Are FAQ sections still useful?**

Yes, when they answer real user questions.

**Does FAQ schema help AI Mode?**

Google does not document FAQPage markup as a requirement for AI Mode or AI Overviews.

**Will removing FAQ markup hurt indexing?**

FAQ rich-result markup is separate from ordinary page indexing.

**Migration checklist.**

- FAQ pages inventoried.
- Custom schema code identified.
- Other consumers identified.
- Retired Google Search benefit removed from documentation.
- Inaccurate markup removed.
- Useful visible FAQs preserved.
- Keyword-stuffed questions rewritten.
- Tests updated.
- Search Console dashboards updated.
- Internal SEO playbooks corrected.

**Verdict.**

FAQ schema is a perfect example of why SEO teams should optimize for **user value first and Search features second**.

The rich result disappeared.

A useful answer did not.

**Verification record.**

- May 7 feature retirement and June documentation removal were checked against Google’s 2026 documentation changelog.
- The article separates Google Search support from schema.org vocabulary.
- No AI benefit is attributed to retired FAQ markup.

**Duplication and search-intent record.**

No prior RankBuilder package targets the complete 2026 FAQ rich-result retirement and markup cleanup decision.
