---
{
  "slug": "translated-results-google-search-data-note",
  "title": "Translated Results in Google Search: notranslate, Reporting, and Publisher Tradeoffs",
  "description": "Understand Google translated results, automatic eligibility, notranslate controls, Search Console reporting, language pages, hreflang, and publisher tradeoffs.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Search landscape",
  "series": "Reading the research",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Google translated results can translate a result’s title and snippet and, after a click, machine-translate the page for users whose query language differs from the source. Publishers do not need to opt in. A notranslate directive can opt a page out of Google translation features, but it is broader than an AI- or result-only preference. Search Console can report translated-result appearances through Search appearance.",
  "takeaways": [
    "Translated results are automatic for supported languages and user contexts.",
    "notranslate can be delivered with a robots meta tag or X-Robots-Tag.",
    "The control affects Google translation features broadly, not only one title or snippet.",
    "Translated results are different from publisher-created localized URLs and hreflang."
  ],
  "claimLimits": [
    "Supported languages, devices, countries, and interfaces can change.",
    "Search Console reporting depends on available data and current dimensions.",
    "Machine translation quality and legal suitability must be evaluated by the publisher."
  ],
  "citations": [
    {
      "id": "translated-results",
      "title": "Translated results in Google Search",
      "url": "https://developers.google.com/search/docs/appearance/translated-results",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "meta-tags",
      "title": "Meta tags and attributes that Google supports",
      "url": "https://developers.google.com/search/docs/crawling-indexing/special-tags",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "performance-report",
      "title": "Performance report overview",
      "url": "https://support.google.com/webmasters/answer/7576553?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "multilingual-sites",
      "title": "Managing multi-regional and multilingual sites",
      "url": "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-news-transparency-checklist",
    "expired-jobposting-markup-seo-claim-check",
    "survivorship-bias-seo-reporting"
  ]
}
---

## Dataset and period

This data note reviews Google’s current documentation for translated results, supported robots controls, Search Console performance reporting, and multilingual-site management. The documentation was checked on August 3, 2026, so language availability and interface behavior remain time-sensitive.

Google describes translated results as a Search feature that can translate a result title, result snippet, and the destination page after the click. The feature is automatic for eligible pages and supported language combinations. Publishers do not need special structured data, a Publisher Center submission, a translation sitemap, or an opt-in request. [@translated-results]

The source page remains the publisher’s page. Google’s translation experience does not automatically create a publisher-controlled localized edition, a separate canonical URL, or an independently maintained language version.

## Methodology

The review separates four systems that are often confused: Google-generated translated results, publisher-created localized URLs, the `notranslate` directive, and Search Console reporting. The analysis compares their documented inputs, outputs, control surfaces, and measurement limits.

A simplified translated-result flow is:

1. A user searches in user language Lu.
2. Google identifies a potentially useful result in source language Ls.
3. Search may display a translated title and snippet.
4. The user opens the result.
5. Google may present a machine-translated page experience.
6. The user can access the original source.

Publisher-created localization follows a different model. A publisher may maintain stable paths such as `/en/guide`, `/es/guia`, and `/fr/guide`, connect them through hreflang, and edit each version independently. Google’s multilingual guidance recommends stable language-specific URLs when publishers create their own versions. [@multilingual-sites]

The opt-out review uses Google’s supported meta-tag documentation. Google recognizes `notranslate` when it appears in an applicable robots meta directive or an HTTP `X-Robots-Tag` header. [@meta-tags] The instruction must remain visible to Googlebot. Blocking the page in robots.txt can prevent Google from reading a changed page-level instruction.

For measurement, the review uses Google’s translated-results documentation and ordinary Performance-report rules. Google says translated-result performance can appear under Search appearance. [@translated-results] The Performance report still applies its normal aggregation, privacy, canonicalization, filtering, and data-availability behavior. [@performance-report]

## Result

Translated-result eligibility is automatic. A publisher does not need hreflang, translated schema, a special sitemap, Search Console submission, or Publisher Center enrollment merely to be considered for Google-generated translation. That convenience also means the publisher does not control every translated phrase or every presentation detail.

The `notranslate` control is broader than a title-only or AI-only switch. Google does not document a directive equivalent to `no-translated-title-only`. A publisher using `notranslate` should expect to give up translation features for the page more generally, not merely one search-result treatment.

That creates a real tradeoff. Translation can expand access for public reference material, documentation, tourism information, research explanations, and educational guidance. It can also create unacceptable risk for legal terms, medical instructions, safety warnings, regulated financial disclosures, licensed text, or terminology with no safe machine equivalent.

Search Console can help quantify the feature through Search appearance, but a report should preserve property, Search type, appearance filter, country, device, date range, page, and query-coverage limitations. A click count does not reveal the full translated user journey, whether the user switched to the original, or whether the machine-rendered wording was accurate.

Translated results are not localization. They do not add local law, prices, inventory, currency, support, editorial review, or market-specific corrections. Publishers should not describe Google’s generated experience as their own localized edition.

A defensible publisher decision record should identify the page class, expected user benefit, translation risk, support capacity, legal or licensing constraint, current appearance, measurement plan, owner, and review date. Testing should confirm the current supported behavior, inspect the result from a relevant language and market, review Search Console appearance data, evaluate terminology risk, and test `notranslate` on a bounded cohort before wider deployment.

## Limitations

Supported languages, countries, devices, result interfaces, and reporting labels can change. The documentation reviewed on August 3, 2026 establishes the current public control model but does not guarantee continued eligibility or a fixed machine-translation workflow. Google generates the experience, so the publisher cannot inspect or approve every translation before it reaches a user.

Search Console does not reveal every query or every interaction inside the translated page experience. A translated-result click is not evidence that the user read, trusted, or converted on the generated version. The legal and safety suitability of machine translation depends on the content, jurisdiction, audience, and contractual rights. A publisher should not infer that automatic eligibility transfers responsibility for high-risk wording to Google.
