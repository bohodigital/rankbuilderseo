---
{
  "slug": "vary-header-seo-dynamic-serving",
  "title": "Vary Header SEO: Serve Dynamic Content Without Hiding Versions",
  "description": "The Vary response header helps caches distinguish representations, but it does not solve discoverability problems created by dynamic delivery.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-02",
  "revisedAt": "2026-08-02",
  "directAnswer": "Use `Vary` to tell shared caches which request headers can change the returned representation. Do not rely on it to make hidden language or device variants discoverable. Google must still be able to request, render, and understand every important version.",
  "takeaways": [
    "`Vary` is cache metadata, not an indexing or canonicalization directive.",
    "Dynamic serving by user agent should identify `User-Agent` as a representation selector.",
    "Important localized content is usually safer on distinct crawlable URLs connected with hreflang."
  ],
  "claimLimits": [
    "Cache behavior varies across CDNs, reverse proxies, and application frameworks.",
    "Google may change crawler capabilities and implementation guidance.",
    "This playbook does not replace testing against the site’s actual origin and edge configuration."
  ],
  "citations": [
    {
      "id": "rfc9110",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "mobile-first",
      "title": "Mobile-first indexing best practices",
      "url": "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "locale-adaptive",
      "title": "How Google crawls locale-adaptive pages",
      "url": "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "localized-versions",
      "title": "Tell Google about localized versions of your page",
      "url": "https://developers.google.com/search/docs/specialty/international/localized-versions",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "http-304-not-modified-seo",
    "locale-adaptive-pages-seo",
    "international-seo-url-structure"
  ]
}
---

## Preconditions

Use this playbook only when the same URL can return materially different representations according to request headers. Common cases include device-specific HTML selected by `User-Agent`, language selection influenced by `Accept-Language`, compression selected through `Accept-Encoding`, or a documented application header that changes public output. The team must have access to the origin, CDN configuration, production response headers, and a way to issue repeatable requests with controlled headers.

Before changing anything, identify who owns rollback and preserve the current edge configuration. Record the canonical URL, robots directives, primary content, structured data, language annotations, and response headers for every known variant. The `Vary` field is cache-selection metadata defined by HTTP semantics. It does not declare a canonical URL, expose a hidden page to crawlers, or guarantee that a search engine will request every possible representation. [@rfc9110]

The process should stop if the team cannot enumerate the meaningful variants or cannot test the public hostname. Adding `Vary` to an undocumented state machine can increase cache fragmentation without making delivery correct.

## Ordered process

1. **Map the representation matrix.** Create one row for each meaningful combination of URL, user agent, language, country logic, authentication state, and expected output. Record the status code, title, main content, canonical, robots directives, structured data, hreflang, and cache result. Exclude private personalization from the public SEO design rather than pretending every cookie-defined response is an indexable page.

2. **Identify the actual selectors.** Compare production responses while changing one request header at a time. If HTML materially changes by user agent, Google’s mobile guidance says dynamic-serving configurations should send `Vary: User-Agent`. The mobile representation must still contain important content, metadata, structured data, and links because Google primarily indexes the mobile version. [@mobile-first]

3. **Configure the narrowest truthful `Vary` value.** Add only headers that genuinely influence the public representation. High-cardinality values such as cookies or arbitrary client identifiers can multiply cache entries and destroy cache efficiency. `Vary: *` effectively prevents ordinary reuse and is rarely a sensible default for a public page. Confirm whether the application, reverse proxy, and CDN merge or replace existing `Vary` values.

4. **Give important locales stable URLs.** Google says locale-adaptive pages can be incompletely crawled because Googlebot may appear from particular countries and generally does not set `Accept-Language`. Google recommends separate locale URLs with hreflang annotations for important language or regional versions. [@locale-adaptive] Stable URLs also let users override automatic selection and let internal links expose each version directly.

5. **Test cold and warm caches.** Run every representation-matrix request against the application origin, the public CDN hostname, a cold cache, and a warm cache. Record `Vary`, cache-status headers, the page body, canonical, robots directives, hreflang, and structured data. Repeat the tests in a different order to detect cache poisoning, such as a desktop response being stored and served to mobile requests.

6. **Verify search accessibility.** Fetch the important URLs with a current smartphone Googlebot user agent and with an ordinary browser user agent. Confirm that the mobile output contains the same primary purpose and that locale URLs remain discoverable through links. Google’s localized-version documentation recommends reciprocal hreflang annotations and explicit locale URLs rather than depending only on automatic negotiation. [@localized-versions]

7. **Deploy with observation.** Release the change during a controlled window. Monitor cache hit behavior, response size, error rate, and server logs for unexpected variant multiplication. Re-crawl the affected URLs and compare the rendered production output with the recorded baseline. Keep rollback instructions next to the deployment record.

## Failure cases

Stop and roll back if a mobile request receives cached desktop HTML despite different origin output, if Googlebot receives a reduced or empty representation, or if a language version exists only behind request-header negotiation with no crawlable URL. A missing or rewritten `Vary` field at the CDN can make a correct application response irrelevant. Accidental differences in canonicals, robots directives, or structured data across variants are also release blockers because they can send contradictory signals from one URL.

Cache explosion is a separate failure. If adding a high-cardinality header produces an unbounded number of objects, the configuration may be technically truthful but operationally unusable. Reconsider whether the varying content belongs on separate URLs, should be client-side personalization after a stable public response, or should not be cached at all. Do not repair a discoverability problem by varying on more headers. That only creates more hidden states.

Another invalidation condition is an incomplete matrix. If the team discovers undocumented location rules, device redirects, or cookie-dependent public content during testing, pause the rollout and update the model before continuing.

## Completion criteria

The implementation is complete only when every intended public representation can be requested predictably, incompatible variants are never served from the same cache object, and important language or regional versions have stable crawlable URLs. The mobile representation must contain the material content and search metadata required for indexing, and all variants must agree on the intended canonical and robots state unless a documented exception explains otherwise.

The evidence package should include the representation matrix, origin and edge response captures, cold- and warm-cache tests, mobile and desktop body comparisons, locale URL checks, hreflang validation, deployment details, and rollback instructions. A final crawl should show that internal links expose the important URLs and that no required version depends solely on `Accept-Language`, apparent geography, or a browser cookie.

`Vary` supports a delivery architecture. It cannot rescue an architecture that makes valuable content inaccessible, returns contradictory metadata, or treats a cache header as a substitute for crawlable URLs.
