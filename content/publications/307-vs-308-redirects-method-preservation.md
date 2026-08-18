---
{
  "slug": "307-vs-308-redirects-method-preservation",
  "title": "307 vs. 308 Redirects: Method Preservation, Caching, and Migration Checks",
  "description": "A standards-based guide to choosing 307 or 308 redirects, preserving HTTP methods, and validating temporary and permanent redirect behavior before a migration ships.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Use 307 when a redirect is temporary and the request method must be preserved; use 308 when the move is permanent and method preservation is required. Validate the status code, Location target, request method, redirect chain, canonical signals, and cache behavior before launch.",
  "takeaways": [
    "307 and 308 preserve the original HTTP request method instead of permitting a POST-to-GET rewrite.",
    "Google documents 307 as temporary and 308 as permanent, so permanence should match the intended URL move.",
    "A technically correct status code can still fail operationally when its Location target, chain, cache policy, or canonical signals are wrong.",
    "Migration testing should include non-GET requests when applications, APIs, forms, or upload endpoints can reach the redirected URL."
  ],
  "claimLimits": [
    "This guide explains standards and validation behavior; it does not guarantee how every intermediary, browser, crawler, or custom client handles malformed responses.",
    "Search consolidation depends on more than the 3xx code alone, including target quality, internal links, canonicals, sitemaps, crawl access, and time."
  ],
  "citations": [
    {
      "id": "rb-rfc9110-redirect-methods",
      "title": "HTTP Semantics: 307 Temporary Redirect and 308 Permanent Redirect",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb-rfc7538-permanent-redirect",
      "title": "The Hypertext Transfer Protocol Status Code 308 (Permanent Redirect)",
      "url": "https://www.rfc-editor.org/rfc/rfc7538.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb-google-redirect-classification",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "redirect-location-header-validation"
  ]
}
---

## Definition

A 307 redirect says the requested resource is available at another location temporarily. A 308 redirect says the move is permanent. Both codes preserve the original request method and body when the client follows the redirect. That preservation is the defining operational difference from older redirect behavior that can allow a POST request to become a GET. [@rb-rfc9110-redirect-methods]

For ordinary page migrations, teams often default to 301 or 302 because those codes are familiar and widely supported. The 307 and 308 codes matter when method preservation is part of correctness, not merely a technical curiosity. Forms, API endpoints, payment callbacks, uploads, and application routes can break when a redirect changes the method or drops the request body.

Google Search Central groups 301 and 308 as permanent redirects and 302 and 307 as temporary redirects. A search migration should therefore choose between 307 and 308 according to whether the move is genuinely temporary or permanent, while still checking the broader consolidation signals around the redirected URL. [@rb-google-redirect-classification]

## Mechanism

HTTP methods carry meaning. A GET asks for a representation. A POST submits data. PUT and PATCH change state. DELETE requests removal. When a redirected request changes from POST to GET, the target receives a materially different request even if the destination URL is correct.

RFC 9110 defines 307 so that the user agent must not change the request method when it automatically follows the redirect. The same method-preserving rule applies to 308 as the permanent counterpart. RFC 7538 standardized 308 specifically to provide a permanent redirect that does not permit the method rewrite associated with historical 301 behavior. [@rb-rfc9110-redirect-methods] [@rb-rfc7538-permanent-redirect]

A client receives the 3xx response, resolves the Location value, and issues a new request to that target. With 307 or 308, the new request retains the original method. When the original request has a body, a correct client preserves that body as well. The redirect does not tunnel one request through the server; it instructs the client to make another request.

This distinction is easy to miss in SEO work because crawlers primarily request documents with GET or HEAD. A migration can therefore look correct in a crawler report while a form submission, webhook, API client, or administrative action is failing. A complete validation plan tests both search-facing URLs and application behavior.

Permanent redirects can also be cached by clients and intermediaries, while temporary redirects can be cached when response directives permit it. Cache behavior depends on the full response and the participating systems, not on a simplistic permanent-equals-cached rule.

## Examples

Use 307 when the alternate location is temporary and the original method must survive the hop. Typical examples include a short maintenance window, temporary traffic routing, controlled experiments, or an application endpoint that will return to its original location.

A temporary redirect should not be used merely because a team is nervous about declaring a migration permanent. If the old URL is being retired and the new URL is intended to remain canonical, a temporary code communicates the wrong lifecycle. Temporary redirects are useful when the original URL remains the durable identity and clients should continue treating it that way.

Use 308 when the move is permanent and preserving the request method is necessary. Examples include permanent API route changes, permanent protocol or host normalization where non-GET requests are possible, and application migrations that cannot tolerate method conversion.

For search purposes, Google documents 308 as a permanent redirect. That makes it a valid consolidation signal when the old URL should resolve permanently to the new one. The redirect still needs a relevant destination, consistent internal links, aligned canonical tags, and an updated sitemap. A permanent code pointing to an unrelated page is not made sensible by being technically permanent. [@rb-google-redirect-classification]

Consider a checkout endpoint receiving a POST request. A temporary move during maintenance calls for 307 when the target must receive the same POST body. A permanent replacement endpoint calls for 308. Testing only a browser GET to either source would miss the behavior that matters.

## Validation sequence

Start with the exact production-like URL and inspect the first response without automatically following redirects. Record the status code and Location value. Then follow the redirect and record every hop until the final response.

Use this sequence for each representative URL:

1. Confirm that the source returns exactly 307 or 308 as intended.
2. Confirm that the Location target resolves to the expected scheme, host, path, query handling, and trailing-slash form.
3. Confirm that the target does not redirect back to the source or enter a longer loop.
4. Confirm that the chain contains no unnecessary intermediate hop.
5. Repeat the request with every method that can reach the source, including POST, PUT, PATCH, or DELETE where applicable.
6. Confirm that the request body and relevant headers arrive at the target intact.
7. Check the final response code and content rather than stopping at the first 3xx.
8. Verify that internal links, canonical tags, sitemap entries, hreflang references, and structured-data URLs point directly to the preferred destination.

The non-GET tests are essential. A GET-only crawl cannot prove method preservation because GET remains GET under every common redirect pattern.

Inspect Cache-Control, Expires, CDN rules, browser behavior, and application-level caching. Test a correction path before launch so the team knows how quickly an erroneous redirect can be reversed. A redirect that is easy to add but difficult to purge is a production risk, particularly when it affects a hostname or broad path pattern.

After deployment, crawl the old URL set and confirm that each source reaches one intended final destination. Crawl the new URL set independently and confirm that destinations return indexable final responses. Compare the redirect map with internal links, canonicals, sitemaps, hreflang annotations, feeds, navigation, and generated metadata. Google recommends permanent server-side redirects for permanent moves, but the surrounding site should also stop advertising the retired URLs. [@rb-google-redirect-classification]

Monitor server logs and search reporting for old URLs that are still requested, redirect loops, unexpected 404 responses, and destinations that return soft errors. Keep the redirect map versioned so later changes can be traced to an explicit decision.

## Boundaries

The standards define expected semantics, but they do not guarantee correct behavior from every legacy library, embedded client, proxy, CDN rule, or custom HTTP stack. Test the actual clients and intermediaries that matter to the system.

The choice of 307 or 308 also does not settle the entire SEO migration. Search consolidation depends on the target content, crawlability, internal links, canonical tags, sitemaps, indexability, and the absence of conflicting signals. The status code is one signal inside a larger system.

Choose 307 when the move is temporary and method preservation is required. Choose 308 when the move is permanent and method preservation is required. The final test is behavioral: the right code, the right destination, the right method and body, one clean hop, consistent canonical signals, and a final response that actually works.
