---
{
  "slug": "review-gating-local-seo-data-note",
  "title": "Review Gating and Local SEO: Google Policy, FTC Rules, and Evidence",
  "description": "Understand review gating, Google Maps policy, incentives, selective review requests, FTC rules, Business Profile restrictions, and audit evidence.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Bad SEO patterns",
  "series": "Reading the research",
  "audience": "Local business owners",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Do not condition a public review request on positive sentiment or divert only unhappy customers away from the public review path. Google Maps policy says merchants may not discourage or prohibit negative reviews or selectively solicit positive reviews. Google also prohibits offering incentives for reviews. FTC rules separately prohibit specified fake, false, insider, suppressed, and purchased-sentiment practices. A private feedback channel can coexist with an honest, sentiment-neutral public review request.",
  "takeaways": [
    "Send the same public review opportunity regardless of sentiment.",
    "Do not offer discounts, gifts, entries, or payment in exchange for Google reviews.",
    "Private customer-support surveys are allowed when they do not gate public review access.",
    "Audit the actual email, SMS, kiosk, QR, and landing-page flow rather than relying only on review statistics."
  ],
  "claimLimits": [
    "Google platform policy and FTC law are separate systems with different scopes and remedies.",
    "This article is not jurisdiction-specific legal advice.",
    "An unusual review distribution does not by itself prove review gating."
  ],
  "citations": [
    {
      "id": "maps-policy",
      "title": "Prohibited and restricted content",
      "url": "https://support.google.com/contributionpolicy/answer/7400114?hl=en",
      "publisher": "Google Maps User Contributed Content Policy Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "google-reviews",
      "title": "Tips to get more Google reviews",
      "url": "https://support.google.com/business/answer/3474122?hl=en",
      "publisher": "Google Business Profile Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "gbp-restrictions",
      "title": "Business Profile restrictions for policy violations",
      "url": "https://support.google.com/business/answer/14114287?hl=en",
      "publisher": "Google Business Profile Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ftc-rule",
      "title": "Consumer Reviews and Testimonials Rule: Questions and Answers",
      "url": "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers",
      "publisher": "Federal Trade Commission",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ftc-rule-page",
      "title": "Trade Regulation Rule on the Use of Consumer Reviews and Testimonials",
      "url": "https://www.ftc.gov/legal-library/browse/rules/rulemaking-use-consumer-reviews-testimonials",
      "publisher": "Federal Trade Commission",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "expired-jobposting-markup-seo-claim-check",
    "seo-vendor-security-due-diligence-playbook",
    "google-news-transparency-checklist"
  ]
}
---

## Dataset and period

This data note compares Google Maps user-contributed-content policy, Google Business Profile review guidance, Google Business Profile restriction guidance, and the Federal Trade Commission’s Consumer Reviews and Testimonials Rule. The sources were checked on August 3, 2026. Platform policies and federal rules can change, so the date matters.

A common gating flow asks a customer whether the experience was positive, sends positive respondents to Google, sends negative respondents to a private form, and then presents the resulting public review stream as ordinary customer sentiment. The private support form is not the core problem. The conditional public-review opportunity is.

Google Maps policy says merchants may not discourage or prohibit negative reviews or selectively solicit positive reviews. [@maps-policy] Google Business Profile guidance also says businesses should not offer incentives in exchange for reviews. [@google-reviews]

The FTC’s rule operates separately. The agency’s formal rulemaking page and compliance Q&A address fake or false reviews, reviews by people without experience, undisclosed insider reviews, company-controlled review sites presented as independent, review suppression, and purchases conditioned on sentiment. [@ftc-rule-page] [@ftc-rule]

## Methodology

The audit method evaluates the actual review-request path rather than inferring misconduct from rating averages. Evidence should include SMS templates, email templates, QR destinations, survey branching, landing-page logic, kiosk screens, staff instructions, review-vendor settings, incentive terms, review links, complaint-resolution flows, and dated versions.

Test every branch under approved conditions:

1. positive response;
2. neutral response;
3. negative response;
4. no response;
5. complaint response;
6. refund response;
7. mobile and desktop.

The test asks whether the public review opportunity remains available regardless of expected sentiment. It should not create or submit fake public reviews.

A sentiment-neutral flow can offer both options to every eligible customer:

```text
Share private feedback with our team.
Leave an honest public review.
```

The business can still contact dissatisfied users, resolve complaints, request operational feedback, and improve service. The rule is not “never ask how the customer feels.” The rule is that anticipated praise should not determine who is allowed or encouraged to reach the public platform.

High-risk selection rules include asking only customers who gave five stars in a private survey, hiding the Google link after a low NPS score, instructing staff to identify “happy” customers, or routing kiosk users differently based on rating. Ordinary operational targeting can be legitimate when it asks verified customers, avoids duplicates, excludes incomplete transactions, follows communication consent, or pauses all requests under a neutral dispute rule. The distinction is whether expected sentiment drives access.

A vendor audit should ask whether the public review path changes by survey score, whether a customer can reach Google after a negative answer, whether incentives are supported, how employees and insiders are handled, who owns the contact list, whether templates and branching are exportable, what happens at termination, and whether compensation depends on review volume.

## Result

A review request is defensible when every eligible customer receives the same opportunity to leave an honest public review, incentives are absent, private feedback remains optional, negative reviews are not intimidated or hidden, insider relationships are disclosed, and the vendor’s branching logic is inspectable.

Google Business Profile guidance prohibits incentives for Google reviews. [@google-reviews] That includes discounts, gifts, sweepstakes entries, free products, loyalty points, or employee bonuses conditioned on review production. Even a request for “any honest review” can violate the platform’s incentive rule.

The FTC rule has different boundaries and remedies. It prohibits specified deceptive review practices, including fake reviews, certain insider practices, review suppression through unfounded legal threats or intimidation, and misrepresentations that displayed reviews represent all or most submitted reviews when negative reviews were suppressed. [@ftc-rule] A practice can violate Google policy even when the FTC rule describes the issue differently.

Google can impose Business Profile restrictions for policy violations. Current help guidance describes possible review removals, temporary restrictions, or warning displays under applicable enforcement. [@gbp-restrictions] The precise response depends on the facts and Google’s decision. No audit should promise that one gating configuration will produce one specific penalty.

A corrective plan disables sentiment-based branching, preserves evidence, restores the same public review option for every eligible customer, removes incentives, updates staff scripts, reviews recent campaigns, documents vendor settings, monitors restrictions, keeps private support channels, and schedules periodic rechecks.

Reporting should include request count, delivery count, public review link exposure, private feedback use, platform removals, response rate, rating distribution, complaints, and policy changes. “Five-star review count” should not be the sole employee performance metric because the incentive predictably migrates into manipulation.

## Limitations

Google platform policy and FTC law are separate systems with different definitions, scopes, evidence requirements, enforcement mechanisms, and remedies. A configuration can violate platform rules without creating the same federal-law question, and a deceptive practice can raise legal concerns beyond what a platform interface visibly enforces.

An unusual rating distribution does not prove review gating. High ratings can result from real customer satisfaction, selection into the customer base, low response volume, or other benign mechanisms. The audit must inspect the flow, instructions, incentives, and branching logic. This article is not jurisdiction-specific legal advice, and state consumer-protection, privacy, communication-consent, or sector-specific rules may add obligations beyond the sources reviewed here.
