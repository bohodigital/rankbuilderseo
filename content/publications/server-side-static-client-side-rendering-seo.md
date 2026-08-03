---
{
  "slug": "server-side-static-client-side-rendering-seo",
  "title": "Server-Side, Static, and Client-Side Rendering for SEO",
  "description": "Compare server-side rendering, static generation, and client-side rendering by returned HTML, rendered content, status codes, links, metadata, and failure modes.",
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
  "publishedAt": "2026-08-02",
  "revisedAt": "2026-08-02",
  "revisionNote": "Expanded the Examples section to meet the native meaningful-prose requirement. Citation IDs were namespaced for the global RankBuilder registry.",
  "directAnswer": "Search engines can process pages built with SSR, SSG, or CSR, but SSR and SSG usually expose critical content and links in the first HTTP response while CSR may require a separate rendering step. Choose the architecture that reliably returns meaningful status codes, canonical metadata, crawlable links, and equivalent primary content under realistic failure conditions.",
  "takeaways": [
    "Rendering strategy is not a ranking factor by label; the observable page output is what matters.",
    "SSR generates HTML per request, SSG generates HTML ahead of time, and CSR depends more heavily on browser-side JavaScript to create the main content.",
    "Google renders JavaScript, but rendering is a distinct processing phase and not every crawler does it.",
    "A browser screenshot is not enough. Test the raw response, rendered HTML, status code, metadata, links, and resource failures."
  ],
  "claimLimits": [
    "This article compares delivery and crawlability characteristics. It does not prove that one architecture will rank better, load faster, or cost less for every site."
  ],
  "citations": [
    {
      "id": "rba01-google-js-basics",
      "title": "Understand JavaScript SEO basics",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba01-google-fix-js",
      "title": "Fix search-related JavaScript problems",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba01-google-dynamic-rendering",
      "title": "Dynamic rendering as a workaround",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba01-webdev-rendering",
      "title": "Rendering on the Web",
      "url": "https://web.dev/articles/rendering-on-the-web",
      "publisher": "Google web.dev",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "cloudflare-cache-rules-seo",
    "javascript-seo-crawling-rendering-indexing",
    "javascript-seo-rendering-pipeline",
    "rendered-html-missing-content"
  ]
}
---

## Definition

**Server-side rendering**, or SSR, creates HTML on the server in response to a request. The page may then hydrate in the browser so interactive components can take over.

**Static site generation**, or SSG, creates HTML before the request, usually during a build. The server or CDN returns the already-generated file.

**Client-side rendering**, or CSR, often returns an application shell and relies on JavaScript in the browser to request data and construct much of the visible page.

These categories describe where and when HTML is produced. They do not by themselves establish whether a URL is crawlable, indexable, fast, accurate, or useful.

Google documents a three-phase process for JavaScript pages: crawling, rendering, and indexing. It can execute JavaScript with its Web Rendering Service, but the initial HTML is parsed before the rendered HTML is available, and pages can wait in a rendering queue. Google still recommends server-side or pre-rendering because it improves access for users and crawlers, including bots that do not execute JavaScript. [Understand JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)[@rba01-google-js-basics]

## Mechanism {#how-it-works}

**SSR: HTML is assembled for the request**
A request reaches the application server, which loads the required data and returns HTML for that URL. Search crawlers can usually read the primary text, headings, links, canonical tag, robots directives, and structured data without waiting for client execution.

SSR can still fail in search-visible ways:

- The server can return a generic `200` shell when data lookup fails.
- A timeout can produce incomplete markup.
- Hydration can replace correct server HTML with an error state.
- Personalized output can accidentally vary by cookie, geography, or user agent.
- Canonical metadata can be generated from the wrong host or route context.

SSR is therefore not a certificate of SEO correctness. It simply makes important information available earlier when implemented well.

**SSG: HTML is assembled before the request**
A build process generates files for known routes. Those files can be served directly from an origin or CDN. For stable public content, SSG often reduces runtime dependencies and makes returned HTML easy to inspect.

The main risks shift from runtime rendering to build completeness and freshness:

- A route may be omitted from the build.
- Generated metadata may use stale configuration.
- Newly published content may not appear until the next build.
- A fallback route may return the wrong status code.
- Client-side navigation may behave differently from a fresh request.

Static output is only as complete as the route inventory and build contract that produced it.

**CSR: HTML is assembled mainly in the browser**
A crawler first receives the server response, often containing scripts, styles, and a root element. JavaScript then fetches data and changes the DOM.

Google can render this output, but its documentation identifies practical limitations: blocked resources are not rendered, permission-dependent features do not work for Googlebot, state is not retained across page loads, and unsupported APIs need fallbacks. Google recommends testing rendered HTML with Search Console URL Inspection or the Rich Results Test. [Fix search-related JavaScript problems](https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript)[@rba01-google-fix-js]

CSR becomes fragile when critical content depends on:

- User interaction such as clicking or scrolling
- WebSockets without an HTTP fallback
- Local storage, session storage, or retained cookies
- A slow or failed API call
- JavaScript bundles blocked by robots rules
- Fragment-based routes instead of crawlable URLs
- Client logic that cannot express a real `404` response

**Hybrid rendering is normal**
Modern sites frequently mix strategies. A product page may be statically generated, personalized inventory may hydrate on the client, and account pages may be fully client-rendered. The useful question is not “Which label does the framework use?” It is “What does this URL return, and what remains available when later stages fail?”

Google now describes dynamic rendering, where bots receive a separate pre-rendered version, as a workaround rather than a long-term solution. Its preferred alternatives are SSR, static rendering, or hydration. [Dynamic rendering as a workaround](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)[@rba01-google-dynamic-rendering]

## Examples
The useful comparison is not a framework label printed in a build configuration. It is a controlled observation of what each URL returns before and after browser execution. For every example below, capture the initial response, the rendered document, the final status, the canonical and robots signals, and the internal links. Then repeat the request with one realistic dependency disabled. This separates an architecture that merely works in a developer’s browser from one that continues exposing its primary content when an API, script bundle, cache entry, or hydration step fails.


| Situation | What to inspect |
| --- | --- |
| Server-rendered article | Confirm primary copy, canonical, robots directives, structured data, and internal links exist in the response body before hydration. |
| Statically generated catalog | Confirm every intended route was generated, stale routes are removed or redirected, and fallback behavior returns meaningful status codes. |
| Client-rendered single-page app | Compare raw HTML with rendered HTML, test direct requests to deep routes, disable JavaScript, and simulate API or bundle failure. |
| Hybrid ecommerce page | Separate stable indexable product information from personalized price, stock, or account components. |
| Framework migration | Compare old and new outputs URL by URL rather than assuming the new rendering mode is equivalent. |

A bounded test matrix should include:

1. Fresh HTTP request with redirects disabled
2. Final response with headers and status code
3. Raw response body
4. Rendered DOM after network idle
5. Page with JavaScript disabled
6. Page with a critical API request blocked
7. Direct request to a deep route
8. Mobile Googlebot rendering through URL Inspection

These examples should be tested on representative templates rather than one polished homepage. A site can render articles server-side while leaving product filters, pagination, or location pages dependent on fragile client behavior. Record differences by template and deployment. The result should be an evidence table showing which content exists in the response, which content appears only after rendering, and which elements disappear under failure. That evidence supports an engineering decision; the words SSR, SSG, and CSR alone do not.

## Boundaries

A rendering test can establish that content and signals were observable in a particular environment at a particular time. It cannot prove that Google selected the page as canonical, indexed it, or will rank it for a query.

Performance is also not determined solely by SSR, SSG, or CSR. Server work, cache design, JavaScript size, hydration cost, data dependencies, and layout behavior all matter. Web.dev notes that SSR can provide live request-specific data but can also increase server work, while heavy client processing after server HTML arrives can still harm responsiveness. [Rendering on the Web](https://web.dev/articles/rendering-on-the-web)[@rba01-webdev-rendering]

The operational standard is simple: the architecture passes when critical content, links, metadata, and status behavior remain correct across the raw response, rendered page, direct navigation, and realistic failure cases.
