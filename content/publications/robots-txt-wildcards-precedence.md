---
{
  "slug": "robots-txt-wildcards-precedence",
  "title": "Robots.txt Wildcards Explained: How Google Chooses Between Allow and Disallow",
  "description": "Learn how Google matches robots.txt rules, how * and $ work, what happens when Allow and Disallow conflict, and why rule specificity matters more than line order.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Google does not simply obey the first robots.txt rule it sees. For matching Allow and Disallow rules, it uses the most specific path match; when equally specific rules conflict, the least restrictive rule wins. Wildcards can make a rule more specific by matching additional path characters.",
  "takeaways": [
    "Rule specificity, not file order, determines which matching robots.txt rule Google applies.",
    "Google supports `*` as a wildcard and `$` as an end-of-URL marker in robots.txt path rules.",
    "An Allow rule can beat a broader Disallow rule when the Allow path is more specific."
  ],
  "claimLimits": [
    "This article describes Google's documented interpretation of robots.txt; other crawlers may implement the Robots Exclusion Protocol differently within the standard's allowed behavior."
  ],
  "citations": [
    {
      "id": "rb2-robots-google-spec",
      "title": "How Google Interprets the robots.txt Specification",
      "url": "https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-robots-rfc",
      "title": "RFC 9309: Robots Exclusion Protocol",
      "url": "https://www.rfc-editor.org/rfc/rfc9309.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-robots-google-refresher",
      "title": "Robots Refresher: robots.txt — a flexible way to control how machines explore your website",
      "url": "https://developers.google.com/search/blog/2025/03/robotstxt-flexible-way-to-control",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "404-vs-410-seo-deleted-pages",
    "xml-sitemap-priority-changefreq-google"
  ]
}
---

## Definition

A `robots.txt` file is a crawl-control file served from the root of a host. It tells compliant crawlers which URL paths they may request. It is not an indexing-removal system, and it is not an access-control system. If a URL must stay private, authentication belongs at the application layer. If a page must stay out of Google Search while remaining crawlable, an indexing directive such as `noindex` is the relevant tool instead. [@rb2-robots-google-refresher]

The subtle part is rule matching. Real robots files often contain a mixture of broad blocks, narrow exceptions, wildcards, and multiple user-agent groups. That creates a common debugging question: when several rules match the same URL, which one does Googlebot actually use?

Google's current robots.txt specification documentation answers that directly. The matching rule with the most specific path wins. Specificity is based on the length of the matching rule path. If equally specific Allow and Disallow rules conflict, Google uses the least restrictive result, meaning Allow wins that tie. [@rb2-robots-google-spec]

## Mechanism

Consider a broad rule that disallows `/private/` and a narrower rule that allows `/private/public-report.pdf`. A request for the PDF matches both rules. The Allow rule is more specific because its path matches more characters, so Googlebot may crawl that PDF even though the containing directory is broadly blocked. [@rb2-robots-google-spec]

The same logic applies when wildcards are involved. Google supports `*` to match any sequence of characters and `$` to mark the end of a URL path. A rule such as `Disallow: /*.pdf$` can target URLs that end in `.pdf`, while an Allow rule for a specific PDF can carve out an exception. The important mental model is not “top rule wins” or “last rule wins.” It is “most specific matching path wins.”

The Robots Exclusion Protocol is standardized in RFC 9309. The standard defines how crawlers locate and parse robots.txt, user-agent grouping, and rule matching. Google's documentation adds implementation examples that are especially useful for SEO debugging because they show how Google resolves conflicting paths and wildcards in practice. [@rb2-robots-rfc]

A second source of mistakes is forgetting that rules apply to URL paths as crawlers see them. Pattern matching is literal enough that a tiny difference can matter. A rule ending in `$` only matches when the relevant pattern reaches the end. A wildcard can make a rule match more URLs than the human who wrote it expected. Query strings can also participate in matching behavior, so parameterized URLs deserve testing rather than assumptions.

A third mistake is using robots.txt to solve the wrong problem. Blocking crawling does not guarantee a URL disappears from search results. Google may still know the URL from links or other discovery paths even if it cannot fetch the content. Conversely, allowing crawling says nothing about whether a page will be indexed or ranked. Crawling, indexing, and ranking are separate stages.

## Examples

Suppose an ecommerce site blocks every search-result URL with `Disallow: /search`, but wants one static public help page at `/search/help` crawlable. An `Allow: /search/help` rule is more specific than the broad block, so the exception can work for Googlebot. The file order is not what makes it work; path specificity does.

Now suppose a site wants to block all URLs ending in `.php` except `/public/page.php`. A wildcard-ending rule can block the broad class, while a more specific Allow rule can preserve the named page. This is exactly the kind of configuration that should be tested against representative URLs before deployment, because a small wildcard mistake can block a large section of a site.

Consider another pattern: `Disallow: /folder` and `Allow: /folder`. The two paths are equally specific. Google's documented behavior uses the least restrictive rule in an equal conflict, so the URL is allowed. [@rb2-robots-google-spec] That surprises people who assume Disallow always has priority.

A migration can create a different class of failure. Teams sometimes copy a staging robots.txt file containing `Disallow: /` into production. There is no subtle precedence puzzle there: the site has told compliant crawlers not to crawl the host. A launch checklist should therefore verify not only that robots.txt exists, but that its broadest rules reflect the production intent.

For large sites, build a small test matrix: representative indexable pages, intentionally blocked resources, parameter variants, media URLs, and any important exceptions. For each URL, record every matching rule and identify the longest path match. That turns robots debugging from guesswork into deterministic QA.

## Boundaries

Robots.txt is advisory crawl control, not authorization. Sensitive files must not depend on crawler cooperation. Likewise, a robots block is not a reliable removal method for an already known URL. Those distinctions are security and indexing fundamentals, not edge cases. [@rb2-robots-rfc]

Do not assume every bot follows Google's wildcard behavior exactly. RFC 9309 standardizes the protocol, but individual crawler documentation still matters. If Bing, an AI crawler, an archive bot, or an internal crawler is operationally important, validate that crawler's documented behavior rather than projecting Googlebot rules onto it.

Avoid overengineering robots.txt to compensate for uncontrolled URL generation. If faceted navigation creates millions of useless combinations, the durable fix may involve URL design, internal linking, canonicals, or application behavior in addition to crawl rules. Robots.txt can reduce crawler access; it does not repair a broken information architecture.

Finally, keep the file understandable. A robots.txt that requires a detective novel to determine whether a product page is crawlable is an operational liability. Prefer broad, intentional groups with narrowly documented exceptions, and test the exact URLs that matter. The point is predictable crawling, not winning a pattern-matching contest against your future self.
