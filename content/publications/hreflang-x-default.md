---
{
  "slug": "hreflang-x-default",
  "title": "Hreflang x-default: Choose a Real Fallback for Unmatched Users",
  "description": "How to use hreflang x-default for global selectors and fallback pages without confusing it with a language code, canonical, or forced redirect.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Use `hreflang=\"x-default\"` to identify the fallback URL for users whose language or region does not match another annotation in the cluster. Point it to a useful selector, global page, or deliberate default, and include it reciprocally throughout the cluster.",
  "takeaways": [
    "`x-default` is a fallback label, not a language code and not a substitute for a generic language annotation.",
    "It works best for language or country selectors and global landing pages.",
    "Every page in the hreflang cluster should include the same `x-default` destination.",
    "The fallback page should remain useful without forcing users into an irreversible redirect."
  ],
  "claimLimits": [
    "`x-default` helps describe fallback intent to Google Search, but it does not control every user redirect, guarantee a selected search result, or repair an incomplete hreflang cluster."
  ],
  "citations": [
    {
      "id": "xdefault-localized",
      "title": "Tell Google about localized versions of your page",
      "url": "https://developers.google.com/search/docs/specialty/international/localized-versions",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "xdefault-multiregional",
      "title": "Managing multi-regional and multilingual sites",
      "url": "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "locale-adaptive-pages-seo",
    "hreflang-implementation-guide",
    "international-seo-url-structure",
    "multilingual-canonical-tags"
  ]
}
---

## Definition

`x-default` is a reserved hreflang value for the fallback page used when none of the explicitly listed language or region annotations matches the user.

It is not a spoken language, country, script, or universal-English label. It answers a routing question:

```text
Where should unmatched users land?
```

Google designed `x-default` primarily for international home pages and language or country selectors. A site with specific pages for British, American, and Australian English might use a global selector as `x-default`. A site with complete language sections might use its global home page or another deliberately chosen fallback. [@xdefault-localized]

A simplified cluster can be represented as:

```text
en-GB → United Kingdom page
en-US → United States page
en-AU → Australia page
x-default → global country selector
```

The fallback does not need a language code because its purpose is to catch users whose settings are not represented elsewhere in the cluster.

## Mechanism

Google uses hreflang relationships to understand that several URLs are localized alternatives. When no listed language or region is a suitable match, the `x-default` annotation identifies the publisher’s preferred fallback candidate. [@xdefault-localized]

The fallback URL should be selected by user experience, not by convenience for the development team.

Useful `x-default` destinations include:

- A global language selector
- A country or market selector
- A neutral international home page
- A generic-language page that is intentionally the fallback
- A global product page that explains regional availability

Weak destinations include:

- A hardcoded US page simply because the company is headquartered there
- A redirect loop that immediately sends the user elsewhere
- A blank geolocation interstitial
- A login page unrelated to the requested content
- A URL blocked from crawling
- A page that returns different inaccessible content to crawlers and users

**x-default versus a generic language**

A generic language annotation and `x-default` solve different problems.

Suppose a site has:

```text
en-US
en-CA
en-AU
```

Google recommends considering a generic `en` page for English speakers outside those countries. That page says, “This URL is appropriate for English speakers without a more specific region.”

`x-default` says, “Use this URL when no listed language or region matches.”

The same URL can sometimes serve both purposes, but the meanings remain distinct. A global English page might be annotated as `en` and also chosen as `x-default` if it is genuinely the best fallback. A country selector may be `x-default` without being an English-content destination at all. [@xdefault-localized]

**Cluster consistency**

Every page in the localized set should expose the same alternate set, including the `x-default` relationship.

For example, the British, American, Australian, and global pages should all declare:

```text
en-GB → UK URL
en-US → US URL
en-AU → Australia URL
x-default → global URL
```

The fallback page should also include a self-referential `x-default` annotation and the other locale alternatives. Treat it as a full member of the relationship graph, not a detached signpost.

**Interaction with redirects**

An international home page may detect location or language and suggest a destination. Google advises against automatic redirects that prevent users and crawlers from accessing all versions. The safer pattern is to preserve a stable URL, offer an explicit locale choice, remember the preference, and keep links to the other versions. [@xdefault-multiregional]

If the fallback immediately redirects every visitor based on IP, users may lose control and Google may not be able to crawl the selector or discover the alternatives consistently. The annotation does not magically make an inaccessible redirect system crawlable.

**Interaction with canonicals**

The `x-default` URL needs its own deliberate canonical treatment. A real global selector or global page can self-canonicalize. If the fallback is a duplicate URL that should consolidate elsewhere, the canonical and hreflang design must describe the same architecture.

Do not point `x-default` to a temporary URL, tracking variant, or redirect while the rest of the cluster points to final canonical pages.

## Examples

**Global retailer**

A retailer has localized stores for the United States, Canada, Germany, and Japan. The root home page asks users to choose a country and links to every store.

```text
en-US → US store
en-CA → Canadian English store
de-DE → German store
ja-JP → Japanese store
x-default → country selector
```

This is the clearest intended use. Unmatched users receive a page designed to help them choose.

**Software documentation**

Documentation exists in English, French, German, and Japanese. The English documentation is also the official fallback for all unsupported languages.

The English URL can be annotated as `en` and selected as `x-default`. The site should still provide a visible language switcher and preserve access to all translations.

**Regional English pages without a fallback**

A company publishes only US, UK, and Australian versions. Users in India, South Africa, or Singapore do not have an obvious target.

Add a generic English page if possible. That page can serve `en`, while a global selector or the generic English page can serve `x-default`, depending on the intended experience.

**Automatic geolocation wall**

The fallback URL displays no content until JavaScript obtains location permission, then redirects. Crawlers and privacy-conscious users receive a dead end.

Replace the wall with a server-rendered selector containing crawlable links. Location detection can offer a recommendation without making the other markets inaccessible.

**One global default for page-level clusters**

`x-default` is not limited to the home page. Equivalent product, support, or documentation pages can each have their own fallback.

```text
/product/en-us/widget
/product/en-gb/widget
/product/de-de/widget
/product/global/widget → x-default
```

The fallback should correspond to the same product concept, not dump every unmatched user onto the site home page.

## Boundaries

`x-default` does not mean “all countries,” “international English,” “the canonical page,” or “the version Google must rank.” It is a fallback relationship inside a localized alternate cluster.

It also does not excuse an incomplete set. If pages do not reciprocate, use unsupported locale codes, point to redirects, or canonicalize inconsistently, adding `x-default` is decorative punctuation on a broken graph.

Do not use several `x-default` URLs in one cluster. The publisher should make one deliberate fallback decision for that set of alternatives.

Do not assume the fallback should always be the commercially preferred market. Sending an unsupported user to a US checkout that cannot ship to their country is technically easy and operationally stupid. The correct fallback helps the user find an available locale or understand the global offering.

Continue with [Hreflang Implementation](/articles/hreflang-implementation-guide) for complete cluster rules and [Locale-Adaptive Pages SEO](/articles/locale-adaptive-pages-seo) for the crawling risks of automatic language and country responses.
