---
{
  "slug": "404-vs-410-seo-deleted-pages",
  "title": "404 vs. 410 for SEO: Which Status Code Should Deleted Pages Return?",
  "description": "A practical guide to choosing 404 Not Found or 410 Gone for deleted URLs, including what Google documents, when redirects are better, and how to avoid soft 404 mistakes.",
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
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "For ordinary SEO cleanup, both 404 Not Found and 410 Gone are valid responses when a URL has been removed and has no relevant replacement. Use a redirect when equivalent content moved; use 410 when you specifically want to communicate that a resource is intentionally gone, but do not expect a special ranking benefit over a correct 404.",
  "takeaways": [
    "Google's current crawling guidance accepts either 404 or 410 when content is permanently unavailable and has no suitable replacement.",
    "A relevant permanent redirect is better than either error code when the old URL truly moved to an equivalent destination.",
    "The bigger SEO mistake is returning a misleading 200 response for a missing page, which can create a soft 404."
  ],
  "claimLimits": [
    "Google does not promise a ranking or deindexing-speed advantage for 410 over 404; this article treats the distinction primarily as HTTP semantics and operational intent."
  ],
  "citations": [
    {
      "id": "rb2-404-google-troubleshoot",
      "title": "Troubleshoot Google Search Crawling Errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-404-rfc",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-404-google-blog",
      "title": "Do 404 errors hurt my site?",
      "url": "https://developers.google.com/search/blog/2011/05/do-404s-hurt-my-site",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "robots-txt-wildcards-precedence",
    "pagination-self-canonical-seo"
  ]
}
---

## Definition

A `404 Not Found` response means the server did not find a current representation for the requested URL. A `410 Gone` response is more specific: the server is indicating that access to the target resource is no longer available and is likely to remain unavailable. HTTP gives 410 a stronger semantic statement of intentional removal, while 404 can describe either a temporary absence or a permanent one when the server does not want to say more. [@rb2-404-rfc]

For SEO work, the practical question is narrower: what should a site return after a page, product, listing, article, or other URL has been removed? Google's current crawling documentation says that if content is no longer available and there is no replacement page that serves a similar user need, the site should return either `404` or `410`. Both tell search engines that the requested page does not exist and should not remain indexed as a normal live page. [@rb2-404-google-troubleshoot]

That makes 404 versus 410 less dramatic than many SEO discussions suggest. The choice matters for accurate server behavior and operational clarity, but it is not a secret ranking switch.

## Mechanism

When Googlebot requests an old URL, the HTTP status code is one of the first machine-readable signals it receives. A genuine 404 or 410 makes the missing state explicit. Google can then process that URL as unavailable rather than as a successful document that happens to contain an error message. [@rb2-404-google-troubleshoot]

The important branch in the decision tree comes before choosing between 404 and 410: did the content move somewhere meaningfully equivalent? If the answer is yes, a permanent redirect is normally the better response. A redirect preserves the user journey and gives Google a strong canonicalization signal toward the destination. If a product was renamed and moved, an article changed URLs, or a category was consolidated into a direct successor, sending users to that real successor is more useful than showing an error page.

If there is no genuine replacement, do not manufacture one merely to avoid a 404. Redirecting every deleted product to a category page, every expired job to the careers homepage, or every removed article to the site root can produce irrelevant redirects and a worse user experience. A clean 404 or 410 is often the more honest response.

The second major branch is whether the server is actually returning the status code you think it is. A page can visually say “not found” while still returning `200 OK`. Google calls this class of mismatch a soft 404. The HTML looks like an error state, but the transport layer says the request succeeded. Google's troubleshooting guidance explicitly warns about soft 404s and recommends a real 404 or 410 for content that is gone. [@rb2-404-google-troubleshoot]

A 410 can be useful when your application knows the deletion is deliberate. For example, an API or CMS may distinguish between an unknown URL and an object that existed but was intentionally retired. That distinction can improve logs, monitoring, and downstream behavior even if Google ultimately treats both statuses as unavailable content.

## Examples

Suppose an ecommerce store permanently discontinues a product and has no current model that is a legitimate substitute. Returning 404 is completely reasonable. The URL no longer resolves to an active product, and the site has no equivalent destination to recommend. Returning 410 is also reasonable if the catalog system explicitly records the product as permanently retired. The SEO objective is the same: stop pretending the old product page is a live document.

Now suppose the same product was replaced by an updated model that is genuinely the successor users would expect. A permanent redirect to that successor may be better than either 404 or 410. The key is relevance. The redirect should solve the same user need, not merely land somewhere convenient for the site's internal metrics.

Consider a news site that removes a duplicate article because two URLs accidentally published the same story. That is usually a consolidation problem, not a deletion problem. Redirect the duplicate to the retained canonical article rather than return an error.

Consider an expired event with archival value. Removing it may be the wrong choice altogether. If people may still search for the event, link to it, or need the historical information, preserving the page with clearly marked past dates can be more useful than deleting it. Status-code hygiene cannot compensate for an unnecessarily destructive content policy.

Finally, consider a deleted spam page created by a compromised plugin. If there is no legitimate replacement, a real 404 or 410 is appropriate after the compromise is cleaned up. Do not leave a 200 response carrying a generic “page removed” message just because the CMS template makes that easier.

Google has also addressed the mythology around these codes directly in older Search Central guidance, saying it treated 410 the same as 404 for this purpose at the time and that either was appropriate for content removed without a replacement. [@rb2-404-google-blog] Current documentation continues to recommend either response, which is the more useful operational signal for today's decision.

## Boundaries

There is no good basis for promising that 410 will produce faster deindexing, better rankings elsewhere on the site, or some special crawl-budget bonus. Google's current public guidance does not make those promises. Use 410 because “intentionally gone” is the right server meaning, not because an SEO checklist claims it has magical urgency.

Likewise, a 404 is not inherently a site-quality problem. Sites naturally accumulate missing URLs through typos, old links, deleted content, and external references. What matters is whether important internal links are broken, valuable pages were removed accidentally, or large-scale 404 patterns reveal a migration failure. The status code itself is often the correct response to a bad request.

Do not use 404 or 410 for content that merely changed location. Do not use redirects when no relevant replacement exists. Do not serve a 200 error template for genuinely missing content. Those three rules eliminate most of the SEO damage that gets incorrectly blamed on the 404-versus-410 choice.

For migration QA, classify every retiring URL into one of three buckets: moved to an equivalent destination, intentionally removed with no replacement, or still valuable and therefore retained. Use permanent redirects for the first bucket, 404 or 410 for the second, and a normal 200 response for the third. That decision model is more defensible than treating one status code as universally superior.
