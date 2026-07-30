---
{
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-26",
  "revisedAt": "2026-07-26",
  "correctionHistory": [],
  "slug": "infinite-scroll-pagination-seo",
  "title": "Infinite Scroll and Pagination SEO: Make Every Item Crawlable",
  "description": "Make infinite scroll and Load More interfaces crawlable with persistent chunk URLs, sequential href links, stable pagination, canonicals, and direct-load testing.",
  "format": "Playbook",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "directAnswer": "Give every chunk of an infinite list a persistent URL, make each URL load its own stable content directly, and expose sequential anchor links. JavaScript can create the smooth scrolling experience, but important inventory must not depend exclusively on a click or scroll event that crawlers do not perform.",
  "takeaways": [
    "Every paginated chunk needs a persistent URL that can be loaded directly.",
    "Use ordinary anchor links between chunks even when JavaScript enhances navigation.",
    "Keep filter and sort variants under control so pagination does not create unlimited duplicate inventory."
  ],
  "claimLimits": [
    "Google can discover paginated content through other signals, but no implementation guarantees that every item will be crawled, indexed, or ranked."
  ],
  "citations": [
    {
      "id": "google-pagination",
      "title": "Pagination best practices for Google",
      "url": "https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-lazy-loading",
      "title": "Fix lazy-loaded website content",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-links",
      "title": "Link best practices for Google",
      "url": "https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-js-basics",
      "title": "Understand the JavaScript SEO basics",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-build-sitemap",
      "title": "Build and submit a sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    }
  ],
  "relatedContent": [
    "javascript-seo-crawling-rendering-indexing",
    "internal-links-vs-xml-sitemaps",
    "discovered-currently-not-indexed",
    "crawl-budget-when-it-matters",
    "sitemap-could-not-be-read",
    "internal-links-audit-by-template",
    "crawlable-javascript-links"
  ]
}
---

## Preconditions

![Spiral staircase viewed from above](/media/infinite-scroll-pagination-hero.jpg "An infinite interface still needs distinct, reachable steps underneath it.")

Define the inventory before choosing the interface.

Record the total number of products, posts, or results; the stable sort order; the number of items in each chunk; the URLs currently created by pagination, filtering, and sorting; which pages should be indexable; whether every item can be reached without JavaScript; and how the browser URL changes during scrolling.

Pagination, “Load more,” and infinite scroll are user-interface choices. Search discovery still depends heavily on URLs and crawlable links. Google says its crawlers generally do not click buttons or trigger user-action JavaScript to reveal additional results. [Pagination best practices for Google](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)[@google-pagination]

## Ordered process

1. **Divide the inventory into stable chunks.**

Use deterministic boundaries. A page URL should produce substantially the same set of items each time it is loaded under the same conditions.

Recommended:

```text
/articles/?page=1
/articles/?page=2
/articles/?page=3
```

Avoid relative windows that constantly shift:

```text
/articles/?after=20-items-from-now
```

Google’s infinite-scroll guidance recommends persistent unique URLs and stable contents for each chunk. Absolute page numbers are one common implementation. [Fix lazy-loaded website content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)[@google-lazy-loading]

2. **Make every chunk load directly.**

Paste the page-2 URL into a fresh browser.

It should return:

- a successful response;
- the page-2 items;
- a useful title and heading;
- navigation to adjacent pages;
- no dependency on first loading page 1;
- a stable canonical strategy.

A URL that works only after application state has accumulated is not a durable page.

3. **Expose sequential anchor links.**

Each chunk should link to the next chunk using a normal anchor.

```html
<nav aria-label="Pagination">
  <a href="?page=1">Previous</a>
  <a href="?page=3">Next</a>
</nav>
```

Google recommends linking paginated pages sequentially and generally discovers URLs from anchor `href` values. [Pagination best practices for Google](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)[@google-pagination] [Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en)[@google-links]

JavaScript can intercept the click and update the interface without a full navigation. The underlying link should remain valid when scripting fails.

4. **Enhance the interface rather than replacing navigation.**

A “Load more” button can fetch the next chunk and append it. Infinite scroll can fetch the next chunk when the user approaches the end. Keep the crawlable page links in the document or otherwise expose a real linked path.

Weak pattern:

```html
<button onclick="loadNextBatch()">Load more</button>
```

Better foundation:

```html
<a href="?page=2" class="load-more">Load more</a>
```

JavaScript may enhance the anchor into an asynchronous load. The destination still exists independently.

5. **Update browser history coherently.**

As a user scrolls into a new chunk, use the History API to update the visible URL without reloading the page.

The selected URL should correspond to the portion of content currently treated as the active chunk. Back and forward navigation should restore a meaningful position and state.

Do not use fragment routes such as:

```text
/articles/#page=3
```

Google’s JavaScript guidance recommends the History API for application routing rather than using fragments to represent separate page content. [Understand the JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)[@google-js-basics]

6. **Choose canonicals by page purpose.**

Paginated pages usually contain different items. Do not canonicalize every page to page 1 merely because they share a template.

A defensible pattern is:

```text
Page 1 canonical → Page 1
Page 2 canonical → Page 2
Page 3 canonical → Page 3
```

If a separate “view all” page is fast, complete, stable, and intentionally preferred, a different consolidation strategy may be justified. Do not create a giant view-all route that times out merely to simplify canonical tags.

7. **Control filters and sort orders.**

Pagination can multiply rapidly when combined with:

- price sorting;
- color and size filters;
- tags;
- date ranges;
- location;
- availability;
- tracking parameters.

Decide which combinations have independent search value.

| URL family | Typical action |
| --- | --- |
| Stable category pages | Crawl and index when useful |
| Paginated chunks | Crawlable; canonical by chunk purpose |
| Alternate sort orders | Often canonicalize or restrict |
| Empty filter combinations | Return a real empty or missing state |
| Unlimited parameter combinations | Reduce generation and internal links |
| Tracking parameters | Link to clean URLs and consolidate |

Do not use robots.txt blindly before deciding whether Google must crawl a URL to observe canonical or `noindex` signals.

8. **Keep item links crawlable.**

Every product or article card should contain an ordinary link to the item page.

```html
<a href="/products/blue-widget/">Blue widget</a>
```

Do not make the entire inventory depend on a JavaScript callback with no URL-bearing anchor.

9. **Use the sitemap as inventory support.**

List canonical item URLs. A sitemap can help reveal deeper products or articles, but it does not replace paginated links or site structure. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@google-build-sitemap]

Whether paginated listing URLs belong in the sitemap depends on whether they are important canonical pages. The individual destination pages are usually the primary inventory.

10. **Test direct loading and crawl paths.**

For page 2, page 5, and a deep item:

- disable JavaScript and inspect links;
- load the URL directly;
- verify status and canonical;
- inspect rendered HTML;
- follow next and previous anchors;
- test back and forward navigation;
- confirm the sitemap lists intended items;
- check for duplicate parameters;
- verify the deepest item has an inbound path.

11. **Monitor scale effects.**

Watch for:

- thousands of near-duplicate filter URLs;
- discovered-but-not-crawled inventory;
- internal links pointing to redirecting variants;
- slow list queries;
- repeated empty pages;
- unstable contents caused by relative cursors;
- crawl concentration on parameters rather than items.

A load-more interaction should preserve ordinary paginated destinations that render as real links. See [Crawlable JavaScript Links](/articles/crawlable-javascript-links) for the anchor and router contract.

## Failure cases

**The button is the only path.** Crawlers do not trigger it to discover deeper chunks.

**Page 2 requires page 1 state.** A direct request produces an empty shell.

**Every chunk canonicals to page 1.** Distinct items become harder to discover as separate listing pages.

**Page-number contents drift constantly.** The same URL no longer represents a stable chunk.

**Filters create unlimited linked URLs.** Crawl demand is spent on duplicate combinations.

**A sitemap is used as a substitute for navigation.** Items remain orphaned to users and weakly contextualized.

**History updates use fragments.** Separate content states lack durable crawlable URLs.

**The view-all page is too large.** It fails for users and crawlers while supposedly acting as the canonical.

## Completion criteria

The implementation is ready when:

- each chunk has a persistent direct-load URL;
- each URL returns stable content and a correct status;
- sequential pages are connected by anchor links;
- item cards contain crawlable destination links;
- JavaScript enhances rather than replaces navigation;
- browser history reflects meaningful chunks;
- canonicals match the intended page structure;
- filter and sort inventory is bounded;
- deep items can be reached through links and canonical sitemap entries;
- representative deep pages pass rendered-output testing;
- no user interaction is required to expose the only crawl path.

The interface may feel infinite. The underlying URL structure should remain finite, predictable, and testable.
