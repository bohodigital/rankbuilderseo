---
{
  "slug": "opt-out-google-ai-overviews-ai-mode",
  "title": "How to Opt Out of Google AI Overviews and AI Mode Without Leaving Google Search",
  "description": "Google is testing a Search Console control that opts sites out of AI Overviews and AI Mode without changing ordinary Search rankings. Learn the tradeoffs.",
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
  "publishedAt": "2026-08-06",
  "revisedAt": "2026-08-06",
  "directAnswer": "Google now has a dedicated generative-AI Search control in testing. For participating UK publishers, the Search Console toggle can remove a site from AI Overviews, AI Mode, and AI Overviews in Discover without acting as a ranking signal for ordinary Search.",
  "takeaways": [
    "Google now has a dedicated generative-AI Search control in testing. For participating UK publishers, the Search Console toggle can remove a site from AI Overviews, AI Mode, and AI Overviews in Discover without acting as a ranking signal for ordinary Search.",
    "Google began testing a new Search Console control in June 2026 that lets participating website owners choose whether their site can appear in and help ground Google’s generative AI Search features.",
    "Google names: AI Overviews; AI Mode; AI Overviews in Discover."
  ],
  "claimLimits": [
    "The cited sources supporting this opt out of Google AI Overviews review were checked through 2026-08-06.",
    "opt out of Google AI Overviews documentation, interfaces, measurement methods, policies, and availability can change after publication.",
    "Correct handling of opt out of Google AI Overviews does not guarantee rankings, traffic, citations, advertising delivery, or commercial outcomes."
  ],
  "citations": [
    {
      "id": "rb-algo-trend-06-04-source-1",
      "title": "New opportunities, control and insights for website owners",
      "url": "https://blog.google/products-and-platforms/products/search/new-controls-website-owners/",
      "publisher": "Google",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-04-source-2",
      "title": "AI features and your website",
      "url": "https://developers.google.com/search/docs/appearance/ai-features",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-06"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-canonical-re-evaluation-two-weeks",
    "google-extended-ai-overviews",
    "ai-mode-vs-ai-overviews"
  ]
}
---

## Definition

Google now has a dedicated generative-AI Search control in testing. For participating UK publishers, the Search Console toggle can remove a site from AI Overviews, AI Mode, and AI Overviews in Discover without acting as a ranking signal for ordinary Search.

Google began testing a new Search Console control in June 2026 that lets participating website owners choose whether their site can appear in and help ground Google’s generative AI Search features.

Google names:

- AI Overviews;
- AI Mode;
- AI Overviews in Discover.

Google says a site that opts out will not receive traffic or impressions from those generative AI features.

Google also says the choice will not be used as a ranking signal for search results outside those generative AI experiences.

The initial test began with a subset of website owners in the United Kingdom.

This is not yet a universal control.

**Why this matters.**

Publishers have been asking a very specific question:

> Can I remain in ordinary Google Search but decline participation in generative Search?

Historically, the available controls were awkward because Search crawling and AI Search are closely connected.

Google’s new toggle is a product-level attempt to answer that request more precisely.

That makes it different from broad crawler blocking.

**The tradeoff is explicit.**

Opting out means losing:

- generative AI Search impressions;
- generative AI Search traffic.

The choice is not:

```text
keep citations
remove summaries
```

It is closer to:

```text
decline participation in these generative Search surfaces
```

Measure before changing it.

**Sources reviewed.**

1. [New opportunities, control and insights for website owners](https://blog.google/products-and-platforms/products/search/new-controls-website-owners/) — Google; accessed 2026-08-06. [@rb-algo-trend-06-04-source-1]
2. [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — Google Search Central; accessed 2026-08-06. [@rb-algo-trend-06-04-source-2]

## Mechanism

**Build a baseline.**

Export:

- AI impressions;
- pages receiving AI impressions;
- countries;
- ordinary Web clicks;
- organic sessions;
- conversions;
- Discover traffic;
- branded searches;
- subscriptions or leads.

Then record the date and setting.

Otherwise, a month later you will have a graph and no memory of why it changed, the traditional destiny of analytics.

**Who might consider opting out?**

Possible cases:

**Subscription publishers.**

Original reporting is expensive and licensing matters.

**Databases or research sites.**

The site may have a commercial model built around direct access to information.

**Publishers with weak AI referral value.**

AI exposure may generate impressions without meaningful downstream business value.

**Organizations with policy requirements.**

Editorial, legal, or contractual rules can shape participation.

None of these groups should opt out automatically.

Measure the opportunity cost.

**Who may prefer to remain included?**

Sites using AI search for:

- brand discovery;
- product discovery;
- educational reach;
- lead generation;
- authority;
- citation visibility.

Google says AI Overviews now has billions of monthly users and AI Mode more than one billion monthly users.

Leaving those surfaces can remove exposure to a large audience.

**This is not robots.txt.**

Blocking Googlebot is far broader.

Googlebot supports Google Search crawling.

A rule such as:

```text
User-agent: Googlebot
Disallow: /
```

can damage ordinary Search visibility.

Do not use a crawler sledgehammer when the policy question is product participation.

**This is not Google-Extended.**

Google-Extended relates to certain other Google AI uses.

Google’s Search documentation says it is not the control for AI Overviews or AI Mode.

Keep:

```text
Search crawling
generative Search participation
other AI uses
```

as separate policy layers.

## Examples

**This is not noindex.**

`noindex` tells Google not to index the page for Search after Google processes the directive.

That removes much more than generative AI participation.

Do not deploy `noindex` to solve an AI-only policy objective.

**Snippet controls are another layer.**

Google documents:

- `nosnippet`;
- `data-nosnippet`;
- `max-snippet`.

These control the information Google can show from pages in Search previews.

They can affect AI Search presentation because AI features use Search content.

But they are not identical to the new dedicated opt-out toggle.

**The publisher decision model.**

Score four areas.

**1. Traffic.**

How much AI exposure exists?

**2. Revenue.**

Does AI traffic subscribe, buy, or convert?

**3. Brand.**

Does citation visibility improve awareness even without clicks?

**4. Content economics.**

How expensive is the information to produce and how important is controlled distribution?

A local service business and an investigative newsroom may reach different conclusions.

**Run a controlled test.**

If you have access and policy allows:

1. Export 28 days of pre-change data.
2. Record ordinary Search and AI metrics separately.
3. Change the setting.
4. Wait for processing.
5. Track AI impressions.
6. Track ordinary Web performance.
7. Track brand and conversion metrics.
8. Review after a defined period.

Do not toggle daily.

Search systems need time to process changes.

**If the toggle is missing.**

Google said the rollout began with a subset of UK publishers.

If your property does not have the setting, you cannot unlock it with:

- a plugin;
- schema;
- API trick;
- robots token;
- Search Console request.

Wait for Google’s rollout or use existing controls for the outcome they actually support.

## Boundaries

**FAQ.**

**Can I block AI Overviews but keep ordinary Search?**

Google is testing a control designed for that distinction.

**Is it available everywhere?**

No. Initial availability is limited.

**Does opting out hurt ordinary rankings?**

Google says the setting is not used as a ranking signal outside the generative AI features.

**Do I keep AI impressions?**

No. Google says opted-out sites do not receive traffic or impressions from those features.

**Is Google-Extended the same setting?**

No.

**Change-control checklist.**

- Current availability confirmed.
- Baseline exported.
- Revenue model documented.
- Editorial/legal owner approved.
- AI impressions recorded.
- Ordinary Search recorded.
- Setting timestamp recorded.
- Monitoring window defined.
- No Googlebot block added accidentally.
- Noindex not used as substitute.
- Review date assigned.

**Verdict.**

The new control turns a philosophical publisher debate into an operating decision.

If you have access, use data before ideology.

The question is not whether AI Search is morally pure. The question is what participation is worth to your specific business and audience.

**Verification record.**

- June 3, 2026 test scope and stated consequences were checked on 2026-08-06.
- Initial UK subset is stated clearly.
- No global availability or ordinary-ranking guarantee beyond Google’s statement is invented.

**Duplication and search-intent record.**

No prior package targets the exact opt-out-without-leaving-Search query.
