---
{
  "slug": "meta-refresh-redirects-seo",
  "title": "Meta Refresh Redirects and SEO: When Google Treats Them as Permanent or Temporary",
  "description": "Google supports meta refresh redirects, but their timing changes how they are interpreted. Learn when instant refresh acts permanent, when delayed refresh acts temporary, and why server redirects are usually cleaner.",
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
  "directAnswer": "Google interprets an instant meta refresh as a permanent redirect and a delayed meta refresh as a temporary redirect. Google still recommends server-side redirects when possible because they are simpler, faster, and do not depend on rendering page markup before the redirect signal is discovered.",
  "takeaways": [
    "A zero-second meta refresh is treated by Google as permanent; a delayed refresh is treated as temporary.",
    "Google recommends server-side permanent redirects over meta refresh when the platform allows them.",
    "JavaScript redirects are another fallback, but they depend on rendering and are therefore less robust than server redirects."
  ],
  "claimLimits": [
    "This article describes Google's documented interpretation; browser behavior, accessibility concerns, and non-Google crawlers may differ."
  ],
  "citations": [
    {
      "id": "rb2-refresh-google-redirects",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-refresh-google-tags",
      "title": "Meta Tags and Attributes that Google Supports",
      "url": "https://developers.google.com/search/docs/crawling-indexing/special-tags",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-refresh-rfc",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "xml-sitemap-priority-changefreq-google",
    "nofollow-sponsored-ugc-rel-attributes"
  ]
}
---

## Definition

A meta refresh redirect is a page-level instruction that sends a browser from the requested URL to another URL after a specified delay. It is commonly implemented with a `meta` refresh directive in the document head, although an HTTP `Refresh` header can express similar behavior. Unlike an HTTP 301 or 302 response, the original request may still return `200 OK`; the redirect instruction is then discovered in page metadata. [@rb2-refresh-google-tags]

HTTP itself defines permanent and temporary redirect status semantics such as 301, 302, 307, and 308, which is why server-side redirects can communicate the move directly in the response rather than through page markup. [@rb2-refresh-rfc]

Google documents two materially different meta-refresh cases. An instant meta refresh, using a zero-second delay, is interpreted as a permanent redirect. A delayed meta refresh is interpreted as a temporary redirect. [@rb2-refresh-google-redirects] That distinction matters because a permanent redirect is a stronger canonicalization signal than a temporary redirect.

## Mechanism

With a server-side redirect, the redirect status and destination arrive immediately in the HTTP response. Googlebot does not need to parse a page to learn that the old URL moved. HTTP permanent redirects such as 301 and 308 are therefore Google's preferred implementation when a move is permanent. [@rb2-refresh-google-redirects]

Meta refresh changes the sequence. The crawler receives a normal document response, reads the page, discovers the refresh instruction, and then processes the destination. Google supports this, so a site is not automatically broken just because its platform can only emit meta refresh. But it introduces another layer between the request and the redirect signal.

Timing changes the meaning. A zero-second refresh behaves like “this content has moved now,” which Google classifies as permanent. A delay greater than zero behaves more like “show this page briefly, then take the user elsewhere,” which Google classifies as temporary. That can be appropriate for interstitial notices, countdowns, or other workflows where the original URL still has a temporary role.

Google also documents JavaScript `location` redirects as a fallback. Those are processed through the Web Rendering Service, meaning Google must render and execute the page to observe the redirect. Because rendering can fail or be delayed, Google recommends JavaScript redirects only when server-side and meta refresh options are unavailable. [@rb2-refresh-google-redirects]

## Examples

Suppose a legacy CMS cannot configure HTTP status codes but can edit the page head. A company permanently moves `/old-service` to `/services/new-service`. An instant meta refresh can communicate the move to Google and users. It is not as clean as a real 301 or 308, but Google documents it as a supported permanent redirect method. [@rb2-refresh-google-redirects]

Now imagine an event landing page that displays “Registration has closed; you will be sent to the archive in five seconds.” The delay means the current page still has a short-lived purpose. Google interprets that delayed refresh as temporary rather than permanent. If the actual business intent is permanent retirement, the delay is sending a weaker signal than necessary.

A migration creates a more dangerous example. A site launches 50,000 new URLs but leaves the old URLs as 200-status pages containing delayed refresh tags. Users eventually arrive at the new pages, but crawlers must parse each old document before understanding the move, and the delay is interpreted as temporary. Replacing that system with direct permanent HTTP redirects would make the migration signal clearer and reduce unnecessary processing.

Another common pattern is a JavaScript-only redirect injected by a client framework after hydration. Google can execute JavaScript, but that redirect depends on rendering. If the server already knows the destination from the requested path, issuing an HTTP redirect at the edge or origin is the more robust design.

Meta refresh can also become an accidental trap when a template or plugin emits it without the SEO team realizing it. During QA, inspect both response headers and rendered metadata. A browser appearing to “redirect correctly” does not tell you which mechanism performed the redirect or how Google will classify it.

## Boundaries

Meta refresh support is not an endorsement of using it everywhere. Google explicitly recommends server-side redirects when possible, and its supported-meta-tags documentation notes that refresh behavior is not supported uniformly by all browsers and can confuse users. [@rb2-refresh-google-tags] Accessibility and user experience are therefore legitimate reasons to prefer direct HTTP redirects even before SEO is considered.

Do not use a delayed refresh when you actually mean permanent migration just because an old implementation already does so. The delay changes Google's interpretation. Likewise, do not assume a zero-second refresh will rescue a migration where destinations are irrelevant, redirect chains are long, canonicals conflict, or internal links still point to retired URLs.

A redirect method is only one signal in a migration. Update internal links, canonicals, sitemaps, hreflang where applicable, and navigation to point directly at final destinations. Otherwise Google and users continue encountering the obsolete URLs unnecessarily.

Finally, distinguish a redirect from an interstitial. If the original page contains meaningful content that users should read before moving on, a delayed refresh may be intentional. If nobody needs the original page anymore, a direct permanent redirect is usually the cleaner answer. The technical question is not “does Google support meta refresh?” It does. The better question is whether meta refresh is the most direct expression of what the URL is supposed to mean.
