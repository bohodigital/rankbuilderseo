---
{
  "slug": "hyphens-vs-underscores-urls-seo",
  "title": "Hyphens vs. Underscores in URLs: Which Is Better for SEO?",
  "description": "Google recommends hyphens instead of underscores to separate words in URLs. Learn what that recommendation means, what it does not mean, and when not to migrate.",
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
  "publishedAt": "2026-08-19",
  "revisedAt": "2026-08-19",
  "directAnswer": "For new URLs, use hyphens to separate words. Google explicitly recommends hyphens rather than underscores because hyphens make word boundaries clearer. That is a URL-structure best practice, not a reason to migrate a healthy site solely to replace every underscore.",
  "takeaways": [
    "Google recommends hyphens as word separators in URLs.",
    "Underscores do not automatically make a page unindexable or invisible.",
    "The recommendation is strongest when designing new URL structures.",
    "Changing established URLs creates migration work that can outweigh the separator benefit."
  ],
  "claimLimits": [
    "This article does not claim that switching underscores to hyphens creates a measurable ranking increase.",
    "Existing URLs should be evaluated as migration assets, not rewritten mechanically."
  ],
  "citations": [
    {
      "id": "b1-hyphen-structure",
      "title": "URL Structure Best Practices for Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/url-structure",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-19"
    },
    {
      "id": "b1-hyphen-hours",
      "title": "April 2024 Google SEO Office Hours",
      "url": "https://developers.google.com/search/help/office-hours/2024/april",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-19"
    },
    {
      "id": "b1-hyphen-starter",
      "title": "SEO Starter Guide",
      "url": "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-19"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "https-google-ranking-signal"
  ]
}
---

## Definition

When words need to be separated in a URL path, Google recommends using hyphens rather than underscores. Its current URL-structure documentation says hyphens help users and search engines identify concepts in the URL. [@b1-hyphen-structure] Google has repeated the same practical answer in Search office-hours guidance: keywords in URLs contribute very little to ranking, but hyphens are the clearer separator. [@b1-hyphen-hours]

That is more nuanced than the folklore version, which often sounds like “underscores are bad for SEO.” An underscore does not make a page impossible to crawl, index, or rank. The recommendation is about how word boundaries are represented and how cleanly a URL communicates its concepts.

The right default for a new page is therefore simple: write readable words separated by hyphens. The harder question is what to do when thousands of existing URLs already contain underscores.

This is also a good example of why SEO recommendations need a sense of scale. A syntax choice that is easy and sensible before launch can become expensive once a URL has accumulated links, traffic, bookmarks, crawl history, analytics references, and operational dependencies. The technical recommendation does not disappear, but the cost of applying it changes dramatically.

## Mechanism

A URL is an identifier, not a sentence. Search systems parse the URL as one of many signals available around a page. Google’s SEO Starter Guide says keywords in domain names or URL paths by themselves have little ranking effect. [@b1-hyphen-starter] That makes it a mistake to inflate the separator recommendation into a major ranking lever.

Hyphens are useful because they visibly divide words. A path such as `/air-conditioner-repair` is immediately legible as three concepts. A path such as `/air_conditioner_repair` may still work technically, but it does not follow Google’s preferred separator convention.

The larger SEO mechanism is consistency. A site should have one stable URL for a resource, one internal-link target, one sitemap entry, and a coherent canonical model. If developers casually create both hyphenated and underscored versions, they can manufacture duplicate routes. The separator decision then becomes a canonicalization problem rather than a stylistic preference.

Changing a separator on an existing URL also changes the URL itself. Search engines, browsers, analytics systems, backlinks, bookmarks, caches, and users do not treat `/blue_widget` and `/blue-widget` as spelling variations. They are different addresses. A migration therefore requires redirects and updated references.

There is another implementation issue: routing frameworks sometimes normalize or decode paths differently, while caches and proxies may key responses by the exact requested URL. A careless rewrite rule can therefore create redirect chains, loops, or inconsistent cache behavior. A seemingly tiny punctuation cleanup should be tested with the same discipline as any other URL migration.

If a site chooses to migrate, the clean process is to map every old URL directly to its new counterpart, update internal links, sitemap entries, canonicals, hreflang references where applicable, and any application-generated links. The old address should not bounce through multiple intermediate redirects merely because several historical URL conventions existed.

## Examples

Imagine a new recipe site creating a page about cast-iron cleaning. `/cast-iron-cleaning` follows Google’s recommended convention and is easy to read. There is no good reason to choose `/cast_iron_cleaning` for a new public route when the application supports hyphens.

Now imagine a ten-year-old documentation site with 50,000 indexed pages such as `/api/user_authentication`. Those pages have backlinks, bookmarks, search history, and stable internal references. Rewriting all 50,000 paths solely because hyphens are preferred would create a large migration. Every old URL would need a direct permanent redirect, internal links would need updating, and logs would need monitoring. The theoretical clarity improvement may not justify the operational risk.

A third case is a site accidentally serving both formats. `/roof_repair` and `/roof-repair` return the same content with status 200. That is worse than simply having the less-preferred separator because it creates competing URLs for one resource. Choose a canonical address, redirect the duplicate if appropriate, and make internal links consistent.

A fourth case is a redesign where URLs are already changing for justified architectural reasons. If `/services_home/roof_repair.html` is being replaced with a cleaner route during a carefully planned migration, that is an excellent time to adopt hyphenated words. The separator improvement is then bundled into a migration that already has redirects, QA, and monitoring rather than causing a migration by itself.

The office-hours guidance is useful here because it places the issue in proportion: Google says URL keywords have barely any ranking contribution while still preferring hyphens as separators. [@b1-hyphen-hours] That is a clear invitation to fix architecture before obsessing over punctuation.

## Boundaries

Some applications, legacy frameworks, APIs, file naming conventions, and generated routes may rely on underscores. SEO should not blindly override system contracts. Public web pages can often use friendly hyphenated aliases while internal identifiers remain unchanged.

Likewise, a successful existing URL should not be migrated casually. Changing it for a larger information-architecture project may be worthwhile, but then the separator change is merely one part of a properly managed migration.

The recommendation also should not be turned into an audit scare tactic. Finding underscores in a mature site is not, by itself, evidence of a severe SEO defect. Severity depends on whether duplicate versions exist, whether users can understand the paths, whether the architecture creates crawl waste, and whether a migration has a compelling business or technical rationale.

The practical rule is therefore asymmetric. **For new human-facing URLs, choose hyphens. For established underscored URLs, measure the value of migration before touching them.** Keep the preferred version stable, avoid creating both variants, update internal references when you do migrate, and do not sell punctuation as a secret ranking hack.
