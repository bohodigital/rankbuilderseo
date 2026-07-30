---
{
  "slug": "page-with-redirect",
  "title": "Page With Redirect: What Search Console Is Reporting",
  "description": "Learn why Search Console excludes a redirected source URL, how to inspect its destination, and when a Page with redirect status needs cleanup.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-25",
  "revisedAt": "2026-07-25",
  "directAnswer": "“Page with redirect” means the inspected source URL sends Google somewhere else and normally will not be indexed as its own page. Inspect the final destination separately because the target may or may not be indexed.",
  "takeaways": [
    "Judge the source redirect and the final destination as two different URLs.",
    "A deliberate redirect is often expected; a wrong target, unnecessary chain, or stale internal link needs repair.",
    "Point canonicals, sitemaps, and internal links directly at the preferred final URL."
  ],
  "claimLimits": [
    "A technically correct redirect is a canonicalization signal, not a guarantee that Google will index or rank its destination."
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
      "id": "google-redirects",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
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
    "redirect-error-search-console",
    "google-chose-different-canonical",
    "seo-migration-launch-checklist",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page",
    "not-found-404",
    "cloudflare-pages-workers-seo",
    "nextjs-page-visible-browser-missing-google",
    "canonical-vs-redirect-vs-noindex"
  ]
}
---

## Definition

![Aerial view of a highway interchange crossing an urban area](/media/page-with-redirect-hero.jpg "A redirect changes the route from a requested source URL to a different destination.")

“Page with redirect” is normally a description, not a failure. Google requested one URL, received a redirect response, and followed or evaluated the destination instead. Search Console therefore reports the source URL as noncanonical and does not expect to index that source as a separate page. The redirect target has its own crawl, indexing, canonical, and quality state. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

For example, requesting an obsolete product URL might return `301 Moved Permanently` with a `Location` header pointing to its replacement. The old URL belongs in the redirect report. The replacement belongs in URL Inspection and may be indexed, excluded, canonicalized elsewhere, or not yet processed.

The important distinction is:

- **Source URL:** the address that returns the redirect.
- **Destination URL:** the next address named by the redirect.
- **Final URL:** the last address after every hop.

Do not read the source status as proof that the final URL is indexed.

## Mechanism

Google’s crawlers generally follow redirects and process the content received at the final target rather than content attached to the redirecting response. A `301` or `308` is a strong signal that the destination should be processed as the replacement. A `302`, `303`, or `307` is a weaker, temporary signal. Google recommends choosing the redirect that truthfully describes whether the move is permanent or temporary. [How HTTP status codes affect Google's crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

| Requested URL | Status | Location | Final URL |
| --- | ---: | --- | --- |
| `https://example.com/old-guide` | `301` | `/new-guide` | `https://example.com/new-guide` |
| `http://example.com/new-guide` | `301` | `https://example.com/new-guide` | `https://example.com/new-guide` |
| `https://www.example.com/new-guide` | `301` | `https://example.com/new-guide` | `https://example.com/new-guide` |

This trace is functional, but it reveals three different source URLs converging on one final page. Each source can appear as “Page with redirect.” That is expected if the redirects are intentional.

Trace every HTTP hop with the [Redirect Chain Visualizer](/tools/redirect-chain-visualizer).

Permanent redirects tell Google that the new target should normally be shown in search. Temporary redirects tell Google that the source may remain the preferred search URL. Server-side redirects are the clearest method when the platform permits them. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)[@google-redirects]

URL Inspection does not make the source and destination interchangeable. Inspect the final destination directly. Review its page fetch, indexing permission, user-declared canonical, and Google-selected canonical. The live test is useful for confirming current access, but it does not reproduce every indexed-data decision. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en)[@gsc-url-inspection]

## Examples

**Expected migration redirect**

An article moved from `/blog/site-audit` to `/articles/site-audit`. The old URL returns one permanent redirect to the new URL. All navigation and sitemap entries now use the new address. “Page with redirect” for the old URL is correct. Continue by inspecting the new article and monitoring the migration.

**Wrong destination**

A deleted product redirects to the store homepage even though a direct successor exists. The response works, but it does not satisfy the original intent. Map the old product to the real successor or return a genuine not-found response if no replacement exists.

**Canonical contradiction**

A page returns `200`, declares itself canonical, but a routing rule redirects it for some devices or hostnames. Test the exact protocol, hostname, path, query, and user-facing route. Then align the redirect with the [canonical decision](/articles/google-chose-different-canonical).

**Stale site-controlled links**

The redirect is correct, but menus, body links, and the sitemap still point to the source. Browsers and crawlers must take an unnecessary hop. Update those controlled references to the final URL. Keep the redirect for external links and old bookmarks.

## Boundaries

The status becomes a problem when the redirect:

- points to the wrong or irrelevant destination;
- enters a loop or an excessive chain;
- produces an empty or malformed `Location` value;
- changes unpredictably by request;
- ends at a blocked, missing, or failing page;
- contradicts canonicals, sitemap entries, or internal links;
- exists accidentally on a page intended to return its own content.

Do not remove a valid redirect merely to make the report row disappear. Search Console includes many intentionally excluded URLs. The goal is a coherent URL system, not an all-green inventory.

Use the [Redirect Error playbook](/articles/redirect-error-search-console) when Google cannot complete the path. Use the [migration checklist](/articles/seo-migration-launch-checklist) when many URLs are moving together. Return a true `404` or `410` when content is gone without a replacement instead of sending every missing URL to the homepage.

**Completion checklist**

- The source returns the intended permanent or temporary status.
- The `Location` value is absolute or safely resolvable.
- The path reaches one relevant final URL without a loop.
- The final URL returns usable content.
- URL Inspection has been run on the destination itself.
- Internal links and sitemap entries point directly to the final URL.
- The final page’s canonical agrees with the intended destination.
- The redirect remains available for old external links where appropriate.

Once those conditions hold, “Page with redirect” can remain an expected report status. The destination’s indexing outcome belongs to the broader [indexing diagnostic flow](/articles/why-google-isnt-indexing-your-page) and the [Page Indexing report](/articles/google-search-console-page-indexing-report).

A redirect is appropriate only when the source URL should yield to another destination. Compare that outcome with canonicals, noindex, robots.txt, authentication, and not-found responses in the [URL control decision guide](/articles/canonical-vs-redirect-vs-noindex).
