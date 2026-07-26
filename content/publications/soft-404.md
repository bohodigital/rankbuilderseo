---
{
  "slug": "soft-404",
  "title": "Soft 404: Why Google Treats a Working Page as Missing",
  "description": "Diagnose a soft 404 by comparing HTTP success with rendered content, then return a real missing status, redirect, or restore the intended page.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-25",
  "revisedAt": "2026-07-25",
  "directAnswer": "A soft 404 usually means the URL returns a success response while displaying missing, empty, broken, or error-like content. Return 404 or 410 if the page is gone, redirect to a real replacement if it moved, or restore the intended content if it should exist.",
  "takeaways": [
    "Compare the HTTP response with the fully rendered page rather than trusting either one alone.",
    "Choose the repair from the content state: gone, moved, or broken.",
    "Do not redirect missing pages to an irrelevant homepage or category."
  ],
  "claimLimits": [
    "Google's soft-404 classification is algorithmic, so a page can need content and rendering review even when its server status is technically successful."
  ],
  "citations": [
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-http-status-codes",
      "title": "How HTTP status codes affect Google's crawlers",
      "url": "https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-crawling-errors",
      "title": "Troubleshoot Google Search crawling errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-js-troubleshooting",
      "title": "Fix Search-related JavaScript problems",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "gsc-url-inspection",
      "title": "URL Inspection Tool",
      "url": "https://support.google.com/webmasters/answer/9012289?hl=en-FM",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "not-found-404",
    "server-error-5xx",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page",
    "page-with-redirect",
    "crawled-currently-not-indexed",
    "rendered-html-missing-content",
    "nextjs-page-visible-browser-missing-google"
  ]
}
---

## Preconditions

![Empty storefront with glass doors and no merchandise](/media/soft-404-hero.jpg "A URL can look structurally open while providing none of the content the visitor expected.")

Collect the exact URL, its raw HTTP status, its rendered HTML, and the content that should appear. A soft 404 is not simply a custom error page. It is a mismatch between a success-like response and a page that Google interprets as missing, empty, broken, or error-like.

Google says a `2xx` response can move content into processing, but an empty page or visible error message can still be classified as a soft 404. [How HTTP status codes affect Google's crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

Before editing, decide which state is true:

- The page and content are permanently gone.
- The content moved to a clear replacement.
- The page should exist, but its content failed.

That decision controls the response. Cosmetic changes to an error template do not resolve a wrong status.

## Ordered process

1. **Compare a real 404 with the reported page.**

| Condition | HTTP response | Visible result | Correct interpretation |
| --- | ---: | --- | --- |
| Missing page | `404` or `410` | Helpful not-found page | Real missing response |
| Soft 404 | `200` | “Not found,” empty, or error-like content | Success and content disagree |
| Broken live page | `200` | Intended shell but missing primary content | Restore the page |
| Moved page | `301` or `308` | Relevant replacement | Redirect |

Search Console describes a soft 404 as a request that returns a user-friendly not-found message without a real `404` response. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

2. **Inspect the raw response before rendering.**

Confirm whether the server returns `200`, `204`, a redirect, or a real error. Check both the first and final response. A route can redirect to an error template that then returns `200`.

3. **Inspect the rendered main content.**

Use URL Inspection’s tested page, rendered HTML, screenshot, and resource list. Look for:

- an empty application shell;
- a database or API error;
- a “no results” message with no useful alternative;
- a missing server-side include;
- a consent layer hiding the page;
- primary content loaded only after a failed script;
- a title and navigation surrounding no main content.

Google specifically lists empty internal search results, missing JavaScript files, database failures, and missing includes as common soft-404 sources. [Troubleshoot Google Search crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)[@google-crawling-errors]

4. **Classify the page as gone, moved, or broken.**

| Page state | Correct repair | Avoid |
| --- | --- | --- |
| Gone with no replacement | Return `404` or `410` | `200` error template |
| Moved to a close replacement | Permanent redirect | redirect to generic homepage |
| Temporarily unavailable | Restore content; use a truthful temporary server response only when operationally appropriate | permanent removal signal |
| Should exist but rendering failed | Fix data, rendering, or resource delivery | adding filler around the error |

5. **Repair internal search and expired inventory deliberately.**

An internal search with zero matches can be useful to a person, but it is usually not a standalone search landing page. Keep it out of indexable inventory and avoid generating crawlable combinations without distinct value.

For expired products, events, jobs, or listings, decide whether the page retains lasting information. A page with useful specifications, documentation, or historical context may remain a real page. A shell that only says “unavailable” may be better removed or redirected to a genuinely equivalent successor.

6. **Avoid irrelevant homepage redirects.**

Redirecting every removed URL to the homepage obscures whether the content moved. It can confuse visitors and may be interpreted as a soft error. Redirect only when the destination is a close replacement.

7. **Test JavaScript routes under failure conditions.**

Single-page applications often return `200` for every route because the server serves one shell. If the client later discovers that the item does not exist, the rendered page becomes an error while the response remains successful. Google’s JavaScript guidance recommends routing to a server URL that returns `404`, or applying `noindex` to the error view when a meaningful HTTP status is impractical. [Fix Search-related JavaScript problems](https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript?hl=en)[@google-js-troubleshooting]

8. **Retest the final response and rendering.**

Use an uncached request, a normal browser, and a current live URL test. URL Inspection separates indexed data from live-test data, so record the last crawl date before expecting the report to clear. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en)[@gsc-url-inspection]

## Failure cases

- **The server status alone is trusted.** A `200` only says the request succeeded; the returned content may still be empty or erroneous.
- **The screenshot alone is trusted.** A polished custom error page can still carry the wrong status.
- **Every expired item redirects to a category.** The destination may not answer the original intent.
- **Text is added to disguise a missing page.** Decorative copy does not restore the expected resource.
- **A client-side router owns every error.** The origin never emits a meaningful missing response.
- **Crawler requests receive a different application state.** Bot protection, cookies, geography, or failed APIs can change rendering.
- **A transient backend failure is treated as permanent removal.** Fix the availability layer before returning a lasting `404` or `410`.

If the page is genuinely gone, follow the [Not Found 404 decision guide](/articles/not-found-404/). If the failure is caused by an unstable backend, continue with [Server Error 5xx](/articles/server-error-5xx/).

When a live test and ordinary browser disagree, compare the exact rendered main content, resource failures, response time, and cache state. The correct repair follows the resource’s intended state, not whichever tool produced the more convenient label.

Preserve a failing example before the change and retest the same URL afterward. This distinguishes a repaired template from an unrelated page that happened to render correctly.

## Completion criteria

The diagnosis is complete when the raw response, rendered page, and intended content state agree.

The repair is complete when:

- a gone page returns `404` or `410`;
- a moved page redirects directly to a relevant replacement;
- a live page renders its primary content without critical resource failures;
- internal search and expired inventory do not create empty indexable shells;
- the custom missing page remains useful to people;
- internal links and sitemaps exclude removed URLs;
- live URL Inspection shows the intended response and rendered result.

The Page Indexing report may continue showing the earlier classification until Google recrawls the URL. Use the report as inventory, not as an instant deployment monitor. The broader [Page Indexing guide](/articles/google-search-console-page-indexing-report/) and [indexing flow](/articles/why-google-isnt-indexing-your-page/) provide the next diagnostic context.
