---
{
  "slug": "xml-sitemap-priority-changefreq-google",
  "title": "XML Sitemap Priority and Changefreq: Does Google Use Them?",
  "description": "Google documents that it ignores XML sitemap priority and changefreq values. Here is what those fields mean, why they do not control crawling, and what to use instead.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Google does not use the XML sitemap `priority` or `changefreq` fields. If you want a sitemap to help Google understand which URLs are current, focus on canonical URL inclusion and an accurate `lastmod` value rather than trying to assign crawl importance scores or guessed update frequencies.",
  "takeaways": [
    "Google's current sitemap documentation says it ignores both `priority` and `changefreq`.",
    "An accurate `lastmod` value can be useful when it reflects a meaningful page change and is consistently trustworthy.",
    "Sitemaps are discovery and canonical-hint infrastructure; they are not a queue where publishers can dictate Google's crawl order."
  ],
  "claimLimits": [
    "Other search engines or private crawlers may interpret sitemap fields differently; this article is specifically about Google Search unless otherwise stated."
  ],
  "citations": [
    {
      "id": "rb2-sitemap-google-build",
      "title": "Build and Submit a Sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-sitemap-google-blog",
      "title": "Sitemaps ping endpoint is going away",
      "url": "https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-sitemap-protocol",
      "title": "Sitemaps XML format",
      "url": "https://www.sitemaps.org/protocol.html",
      "publisher": "Sitemaps.org",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "robots-txt-wildcards-precedence",
    "meta-refresh-redirects-seo"
  ]
}
---

## Definition

The XML sitemap protocol allows each URL entry to include optional metadata such as `lastmod`, `changefreq`, and `priority`. Those names invite a very human assumption: if you mark a page as high priority and say it changes hourly, Google should crawl it more aggressively. That assumption is wrong for Google Search.

Google's current sitemap documentation says it ignores both `priority` and `changefreq`. Google may use `lastmod` when the value is consistently accurate and can be verified against meaningful changes on the page. [@rb2-sitemap-google-build] In a Search Central explanation dedicated to these fields, Google also states that `changefreq` and `priority` are not used at all. [@rb2-sitemap-google-blog]

The sitemap protocol itself still defines the optional fields, so they are valid XML sitemap syntax. [@rb2-sitemap-protocol] The distinction is between what the protocol permits and what Google's crawler and indexing systems actually consume.

## Mechanism

A sitemap primarily helps a search engine discover URLs and understand which URLs a site considers canonical candidates. It is especially useful when important pages are new, weakly linked, deeply nested, media-heavy, or otherwise difficult to discover through ordinary crawling. Submitting a sitemap does not guarantee indexing, and adding metadata does not turn the sitemap into a crawl scheduler.

The `priority` field was designed as a relative value within a site. It is not a global ranking score. Even within the protocol, it does not mean one domain's `1.0` should outrank another domain's lower value. Google goes further and ignores the value entirely. [@rb2-sitemap-google-blog] Setting every URL to `1.0` therefore accomplishes nothing for Google except creating extra markup.

The `changefreq` field describes a publisher's estimate of how frequently a page changes. In practice, publishers often generate it mechanically: homepages become “daily,” articles become “monthly,” and static pages become “yearly.” Google does not use those declarations. A crawler can observe actual change patterns directly, and a guessed schedule is often less reliable than the page history.

`lastmod` is different because it can represent a concrete timestamp or date. Google says it can use `lastmod` if the value is accurate and consistently reflects meaningful changes. [@rb2-sitemap-google-build] That final condition matters. Automatically rewriting the `lastmod` date every time a template rebuilds, an analytics script changes, or a cache regenerates makes the field noisy. A trustworthy last-modified signal should track content changes that matter to users.

## Examples

Imagine a 50,000-URL ecommerce sitemap where every product is assigned `priority` 1.0. The field cannot express relative importance because every value is identical, and Google ignores it anyway. Internal linking, actual content value, canonicalization, server health, and Google's own crawl systems are the mechanisms that determine what gets crawled and indexed.

Now imagine the same store marks every product as `changefreq` daily, even though most products have not changed in six months. That declaration does not force daily crawling. It also adds no trustworthy information. If the store instead updates `lastmod` only when price, availability, description, images, or other meaningful product content changes, the sitemap becomes more informative.

A news publisher has a different pattern. New articles may appear every few minutes, while old explainers change only when facts are updated. The publisher does not need to label the homepage “always” or every story “hourly” to tell Google the site is active. New URLs, accurate modification dates, strong internal links, feeds, and normal crawl discovery do that work more directly.

For a documentation site, a useful deployment pipeline can update `lastmod` when the source document changes rather than whenever the site generator runs. That avoids falsely signaling that 20,000 documents changed because a footer was rebuilt. If your content system cannot reliably distinguish meaningful edits, omitting `lastmod` can be better than publishing fabricated precision.

There is also a canonicalization angle. Google's sitemap documentation recommends listing the URLs you actually want indexed. If the same content is reachable through tracking parameters, print views, sorting variants, or alternate hosts, do not stuff every duplicate into the sitemap and then try to rescue the mess with priority scores. A sitemap should reinforce your canonical URL strategy, not contradict it.

## Boundaries

Ignoring `priority` and `changefreq` does not mean sitemaps are unimportant. It means those two optional fields are not useful levers for Google. Sitemaps can still improve discovery, surface crawl errors in Search Console, carry image, video, news, or localized-page extensions, and provide a clean inventory of preferred URLs. [@rb2-sitemap-google-build]

Do not convert this into the opposite myth that `lastmod` always accelerates crawling. Google says it may use the value when it is accurate. That is not a promise that changing the date causes immediate recrawling or indexing. The field is a hint grounded in observed trust, not an API command.

Also avoid “freshness theater.” Updating dates without substantive page changes can make your metadata less credible and can mislead users when dates are displayed publicly. If a page changed meaningfully, record the change accurately. If it did not, leave the date alone.

The practical sitemap hierarchy is simple: include the right canonical URLs, keep the XML valid, split files when size limits require it, maintain accurate `lastmod` values when you can, and monitor submitted sitemaps in Search Console. You can safely stop spending engineering time tuning `priority` and `changefreq` for Google. They look like control knobs, but for Google Search they are decorative knobs connected to nothing.
