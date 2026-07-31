---
{
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-29",
  "revisedAt": "2026-07-29",
  "correctionHistory": [],
  "slug": "crawlable-javascript-links",
  "title": "Crawlable JavaScript Links: Anchors, Buttons, Routers, and Googlebot",
  "description": "Learn why important destinations need resolvable anchor href values and how to test framework routers, click handlers, dynamic links, and History API navigation.",
  "format": "Explainer",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "directAnswer": "Important destinations should render as anchor elements with resolvable href values. JavaScript can enhance the interaction, but buttons, spans, click handlers, and framework attributes are not dependable substitutes unless the final output contains a normal crawlable link.",
  "takeaways": [
    "Judge the final HTML output rather than the name of a framework routing component.",
    "Use links for destinations and buttons for actions.",
    "Distinct content states need stable resolvable URLs.",
    "Test initial HTML, rendered HTML, crawl discovery, destination responses, and server logs."
  ],
  "claimLimits": [
    "Search crawlers can sometimes infer or discover URLs through other mechanisms, but script-only navigation is not a dependable internal-link contract."
  ],
  "citations": [
    {
      "id": "b7-google-crawlable-links",
      "title": "SEO link best practices for Google",
      "url": "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
      "publisher": "Google",
      "accessedAt": "2026-07-29"
    },
    {
      "id": "b7-google-javascript-history",
      "title": "Understand the JavaScript SEO basics",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      "publisher": "Google",
      "accessedAt": "2026-07-29"
    }
  ],
  "relatedContent": [
    "javascript-seo-crawling-rendering-indexing",
    "rendered-html-missing-content",
    "infinite-scroll-pagination-seo",
    "nextjs-page-visible-browser-missing-google",
    "orphan-pages-seo",
    "internal-links-vs-xml-sitemaps"
  ]
}
---

## Definition

![Flowchart showing a crawlable anchor link surviving HTML extraction, JavaScript enhancement, and destination requests](/media/crawlable-javascript-link-lifecycle.png "A dependable internal link exposes a resolvable destination before JavaScript enhancement is required.")

A clickable interface element is not automatically a web link.

A human can click a button, a styled `div`, a router component, a card, or a span with a JavaScript event. A crawler needs a dependable destination it can extract and request.

Google says it can generally crawl links implemented as `<a>` elements with `href` attributes that resolve to actual web addresses. It cannot reliably extract destinations from anchors without `href`, tags pretending to be links, or script-event navigation. [SEO link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)[@b7-google-crawlable-links]

Use this as the base contract:

```html
<a href="/products/shoes">Shoes</a>
```

JavaScript may intercept the click for client-side navigation, preload data, animate the transition, update application state, or record an event. The destination must still exist as an ordinary URL.

## Mechanism

Google can discover links during more than one processing stage.

A simplified path is:

```text
Fetch initial HTML
        ↓
Extract links
        ↓
Render JavaScript when needed
        ↓
Extract links from rendered output
        ↓
Request discovered destinations
```

A link present in the initial server response can be discovered before rendering. A link added during rendering may also be discovered, but now discovery depends on successful script fetching, execution, rendering, and final markup.

That creates a reliability hierarchy.

**Reliable anchor**

```html
<a href="/products/shoes">Shoes</a>
```

The destination is visible in markup and remains usable without JavaScript.

**Progressively enhanced anchor**

```html
<a href="/products/shoes" onclick="enhanceNavigation(event)">
  Shoes
</a>
```

The browser can follow the URL normally. JavaScript improves the experience when available.

**Framework component with valid output**

A component such as:

```jsx
<Link href="/products/shoes">Shoes</Link>
```

is acceptable when the actual server or rendered output is:

```html
<a href="/products/shoes">Shoes</a>
```

Do not approve a component because its name contains `Link`. Inspect the resulting DOM and server output.

**Unreliable navigation imitations**

```html
<button onclick="go('/products/shoes')">Shoes</button>
```

```html
<span onclick="go('/products/shoes')">Shoes</span>
```

```html
<a onclick="go('/products/shoes')">Shoes</a>
```

```html
<a href="javascript:go('/products/shoes')">Shoes</a>
```

These may work for a user in one browser state. They do not create the same dependable URL-bearing link contract.

## Examples

**Links versus buttons**

Use a link when activation navigates to another resource.

```html
<a href="/pricing">View pricing</a>
```

Use a button when activation performs an action in the current interface.

```html
<button type="button" aria-expanded="false">
  Show filters
</button>
```

A button can open a menu containing links. The destinations inside the menu should still use anchors.

**Single-page applications**

For distinct content views, use stable paths and the History API.

Google recommends ordinary path URLs rather than fragment-based routes for content that must be discovered. [Understand the JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)[@b7-google-javascript-history]

Preferred:

```html
<a href="/products">Products</a>
<a href="/services">Services</a>
```

Avoid treating fragments as independent pages:

```html
<a href="#/products">Products</a>
<a href="#/services">Services</a>
```

Client-side code can intercept the first pattern and call `history.pushState`, but the server must also return a meaningful response when `/products` is requested directly.

**Load more and infinite scroll**

A load-more button can improve the interface. It should not be the only route to inventory that needs crawling.

Provide a paginated sequence:

```html
<a href="/articles?page=2">Next page</a>
```

Then enhance the interaction with JavaScript if desired.

See [Infinite Scroll and Pagination SEO](/articles/infinite-scroll-pagination-seo) for the complete inventory pattern.

**Card components**

This is dependable:

```html
<article>
  <h2><a href="/articles/example-guide">Example guide</a></h2>
  <p>A concise description of the destination.</p>
</article>
```

Making the whole card clickable with JavaScript is optional enhancement. Preserve a visible anchor containing meaningful text.

## Boundaries

Test links at every relevant layer.

**View the initial response**

Use view source or an HTTP client.

Ask:

- Is the destination present?
- Is it inside an anchor?
- Does the anchor contain `href`?
- Is the URL resolvable?

**Inspect rendered HTML**

Check the final DOM after scripts execute.

Ask:

- Did hydration remove or replace the anchor?
- Did the router emit a real link?
- Does the destination change only after user interaction?
- Did an error prevent the navigation component from rendering?

**Disable JavaScript**

A fully interactive application may not function without JavaScript. Important navigation should still expose meaningful URLs where practical.

**Crawl the site**

Use a crawler that can compare:

- Initial HTML links
- Rendered links
- Status responses
- Redirect targets
- Canonicals

**Inspect the destination**

A perfect anchor to a `404`, redirect loop, blocked page, or empty client shell is not a successful link.

**Check request logs**

Logs can show whether a crawler requested the destination. They cannot prove indexing or ranking.

Common failure cases include:

- Navigation emitted only after a click
- Links hidden behind authentication
- Router components rendering spans
- `href` values added after delayed API responses
- Broken hydration removing server-rendered anchors
- Blocked JavaScript preventing link generation
- Fragment routes representing distinct content
- Link destinations returning the same empty application shell
- Canonicals rewritten incorrectly after client navigation

Use [JavaScript SEO: Crawling, Rendering, and Indexing](/articles/javascript-seo-crawling-rendering-indexing) for the broader lifecycle, [Rendered HTML Missing Content](/articles/rendered-html-missing-content) for rendering failures, and [Orphan Pages SEO](/articles/orphan-pages-seo) when pages appear in a CMS or sitemap but receive no crawlable internal links.

A resilient navigation system begins with the web’s least glamorous and most durable component: an anchor containing a URL.
