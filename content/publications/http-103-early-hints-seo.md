---
{
  "slug": "http-103-early-hints-seo",
  "title": "HTTP 103 Early Hints and SEO: Performance Signal, Not Indexing Signal",
  "description": "Understand HTTP 103 Early Hints, Link preload and preconnect headers, browser and CDN behavior, performance measurement, crawler limits, and why 103 is not an indexing status.",
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
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "HTTP 103 Early Hints is an informational response that can let a browser begin preconnecting or preloading critical resources while the server prepares the final response. It does not replace the final 200, redirect, 404, or other response, and Google does not document 103 itself as an indexing or ranking signal. Its SEO value is indirect: a correct implementation may improve real user loading performance, while a bad hint can waste bandwidth, expose stale resource references, or complicate debugging.",
  "takeaways": [
    "A 103 response is informational and must be followed by a final response.",
    "Early Hints commonly carry Link headers for preconnect or preload.",
    "Use them when server think-time delays discovery of stable critical resources.",
    "Measure field performance and verify the final status, headers, redirects, cache behavior, and duplicate fetch risk."
  ],
  "claimLimits": [
    "Browser, CDN, proxy, crawler, and server support can differ.",
    "Early Hints may improve performance only when resource discovery is materially delayed.",
    "Google does not document HTTP 103 as a direct ranking, crawling, canonicalization, or indexing signal."
  ],
  "citations": [
    {
      "id": "early-hints-rfc8297",
      "title": "RFC 8297: An HTTP Status Code for Indicating Hints",
      "url": "https://www.rfc-editor.org/rfc/rfc8297.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "early-hints-mdn",
      "title": "103 Early Hints",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103",
      "publisher": "MDN Web Docs",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "early-hints-chrome",
      "title": "Faster page loads using server think-time with Early Hints",
      "url": "https://developer.chrome.com/docs/web-platform/early-hints",
      "publisher": "Chrome for Developers",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "early-hints-cloudflare",
      "title": "Early Hints",
      "url": "https://developers.cloudflare.com/cache/advanced-configuration/early-hints/",
      "publisher": "Cloudflare Docs",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "early-hints-cwv",
      "title": "Understanding Core Web Vitals and Google search results",
      "url": "https://developers.google.com/search/docs/appearance/core-web-vitals",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "cloudflare-cache-rules-seo",
    "http-304-not-modified-seo",
    "vary-header-seo-dynamic-serving"
  ]
}
---

## Definition

HTTP 103 Early Hints is an informational response. A server or intermediary can send it before the final response to communicate headers that help the client prepare for the document that is still being generated.

RFC 8297 defines the 103 status for hints that are likely to appear in the final response. The main use is sending `Link` headers while a server performs time-consuming work before returning the final status and body. [@early-hints-rfc8297]

A typical exchange is:

```text
103 Early Hints
Link: </styles.css>; rel=preload; as=style

200 OK
Content-Type: text/html
```

The 103 response is not the page’s final status. The later response still determines whether the request succeeded, redirected, failed, or required authorization.

## Mechanism

Without Early Hints, a browser may wait for the server to generate the HTML before it discovers critical stylesheets, fonts, scripts, images, or external origins.

With Early Hints, the browser can receive a preliminary `Link` header during that server think-time. A compatible browser may start a preconnect or preload before the HTML arrives. MDN describes 103 as a way to begin loading expected resources or connecting to expected origins before the final response is ready. [@early-hints-mdn]

The useful sequence is:

1. Browser requests the document.
2. Server or CDN knows one or more stable critical dependencies.
3. Server or CDN sends 103 with appropriate `Link` hints.
4. Browser begins eligible work.
5. Server sends the final response.
6. The final HTML uses the hinted resource.

Chrome’s implementation guidance says Early Hints are most useful when the server cannot send the final response immediately and when the hinted resources contribute to important user metrics. It also recommends stable resources and warns that stale hashed URLs, unsupported hints, noncacheable preloads, or mismatched resources can waste work or create duplicate downloads. [@early-hints-chrome]

Early Hints do not make the final page crawlable, indexable, or canonical. They do not carry the main body. They do not turn an error into a success response.

## Examples

A dynamic product page requires several database calls before it can return HTML. The page always uses the same critical stylesheet. The server sends a 103 preload for that stylesheet, then later returns the final 200 response. The browser can begin fetching the stylesheet during the database delay.

A site uses a third-party font origin on every landing page. A 103 preconnect hint may begin DNS, transport, and security negotiation before the HTML is complete.

A page sends a 103 preload for an old versioned stylesheet, but the final HTML references a newer hash. The browser may fetch a resource it never uses. The hint has converted stale configuration into early wasted bandwidth.

A personalized route sometimes returns a 403. A CDN can emit a cached 103 before the origin returns that final response. Cloudflare warns that Early Hints can be sent before the origin or Worker is reached, including on routes that later return a denial. [@early-hints-cloudflare]

A server returns 103 and then a cross-origin redirect. Browser behavior can discard hinted resources or connections because the final destination differs. MDN and browser guidance recommend careful redirect testing. [@early-hints-mdn]

Cloudflare’s current documentation says its implementation uses cached `Link` headers for preconnect and preload and currently supports Early Hints over HTTP/2 and HTTP/3. It also notes that some crawler user agents may not receive 103 responses when compatibility is uncertain. [@early-hints-cloudflare]

## Performance measurement

The useful outcome is not that the 103 response exists. It is that real users receive important resources earlier without harmful competition.

Measure:

- time to first byte;
- discovery time for the hinted resource;
- connection start;
- resource priority;
- duplicate requests;
- transfer bytes;
- Largest Contentful Paint;
- error rate;
- cache status;
- performance by device and geography.

Google’s Core Web Vitals guidance describes LCP, INP, and CLS as real-world user-experience metrics and recommends good results for users and Search success. It does not describe HTTP 103 as a separate ranking signal. [@early-hints-cwv]

A defensible inference is:

- Early Hints moved a stable critical fetch earlier.
- Field loading performance improved.
- User experience improved.

An unsupported inference is:

- Googlebot saw status 103.
- The page received an indexing or ranking bonus.

## QA

Test the full response chain:

- final status code;
- redirect path;
- 103 headers;
- final `Link` headers;
- `Content-Security-Policy`;
- `Content-Type`;
- cache status;
- resource URL equality;
- `as` value;
- cross-origin mode;
- duplicate fetches;
- browser support;
- crawler logs.

Keep important hints in the final response or HTML when appropriate. Early Hints are an optimization layer, not the only declaration of a critical resource.

Do not preload every resource. The initial network has limited bandwidth and priority. A long list of early fetches can delay the resources that actually determine rendering.

## Boundaries

HTTP 103 is useful when server think-time creates a meaningful gap and the system can identify stable, high-priority resources before the final response is ready.

It is less useful when the server can send the final headers immediately, when the resource is already discovered early in HTML, when the resource changes frequently, or when the hint creates cross-origin, caching, or priority conflicts.

The final response remains authoritative for status and content. A 103 followed by 404 is still a missing page. A 103 followed by 301 is still a redirect. A 103 followed by 200 is still evaluated through the final page’s content, metadata, canonical signals, links, and indexing eligibility.

Common mistakes include treating 103 as a successful final status, using stale versioned assets, preloading noncacheable resources, ignoring redirects, assuming all clients act on the hint, and measuring only a synthetic test.

The operational conclusion is narrow: Early Hints can spend server think-time on useful browser work. That can improve performance when the hints are accurate. It does not give an informational status code the power to index a page.
