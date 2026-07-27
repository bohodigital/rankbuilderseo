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
  "slug": "cloudflare-pages-workers-seo",
  "title": "Cloudflare Pages and Workers SEO: Redirects, Headers, Preview URLs, and Caching",
  "description": "Diagnose Cloudflare edge SEO by checking Pages, Functions and Workers routing, redirects, headers, preview noindex, custom domains, cache state, statuses, and canonical output.",
  "format": "Playbook",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "directAnswer": "Inspect the final Cloudflare edge response rather than only repository or origin files. Determine whether Pages, a Pages Function, or a Worker owns the route; then verify redirects, header precedence, preview-domain noindex, custom-domain normalization, cache state, status codes, and canonical URLs on the exact public deployment.",
  "takeaways": [
    "Pages _redirects rules do not apply to routes served by Pages Functions, so route ownership must be established first.",
    "Cloudflare evaluates redirects before matching Pages _headers rules.",
    "Preview deployments should remain noindexed or redirected so temporary and immutable URLs do not compete with the production domain."
  ],
  "claimLimits": [
    "Cloudflare behavior depends on account-level rules, Workers routes, Pages Functions, framework adapters, and current platform configuration; repository files alone cannot prove the final edge response."
  ],
  "citations": [
    {
      "id": "cf-pages-redirects",
      "title": "Redirects",
      "url": "https://developers.cloudflare.com/pages/configuration/redirects/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "cf-pages-headers",
      "title": "Headers",
      "url": "https://developers.cloudflare.com/pages/configuration/headers/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "cf-pages-preview",
      "title": "Preview deployments",
      "url": "https://developers.cloudflare.com/pages/configuration/preview-deployments/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "cf-pages-serving",
      "title": "Serving Pages",
      "url": "https://developers.cloudflare.com/pages/configuration/serving-pages/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "cf-pages-custom-domain",
      "title": "Redirecting pages.dev to a custom domain",
      "url": "https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-http-status-codes",
      "title": "How HTTP status codes affect Google's crawlers",
      "url": "https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    }
  ],
  "relatedContent": [
    "page-with-redirect",
    "redirect-error-search-console",
    "server-error-5xx",
    "blocked-access-forbidden-403",
    "excluded-by-noindex",
    "nextjs-page-visible-browser-missing-google",
    "page-indexing-report-not-updating"
  ]
}
---

## Preconditions

![Rack of servers and network equipment in a data center](/media/cloudflare-pages-workers-seo-hero.jpg "Cloudflare can change routing, headers, status codes, and cache behavior at the edge after application code has finished its work.")

Map the request before editing configuration.

Record the production custom domain; Pages project and production branch; immutable or preview URL; Workers routes; Pages Functions routes; framework adapter output; `_redirects` and `_headers` files; account-level Redirect Rules or Bulk Redirects; final response status and headers; cache status and deployment identity; and canonical URL in rendered HTML.

A correct origin response does not prove the edge serves it unchanged.

A request may be handled by static Pages assets; a Pages Function; a Worker or framework-generated Worker; a proxy rewrite; an account-level redirect before Pages; or a custom-domain rule.

## Ordered process

1. **Fetch every relevant hostname.**

Test:

- apex domain;
- `www` hostname;
- stable `pages.dev` project hostname;
- immutable deployment hostname;
- any branch preview alias;
- old domains involved in redirects.

For each, record:

| Host | Status | Location | X-Robots-Tag | Canonical | CF cache |
| --- | ---: | --- | --- | --- | --- |
| Apex | — | — | — | — | — |
| `www` | — | — | — | — | — |
| Stable Pages | — | — | — | — | — |
| Preview | — | — | — | — | — |

Do not evaluate only the URL that happens to work in your browser.

2. **Identify route ownership.**

Cloudflare documents that `_redirects` rules do not apply to routes served by Pages Functions. If a Function owns the path, implement or exclude the redirect at the correct layer. [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)[@cf-pages-redirects]

A file can be perfectly written and completely irrelevant to the route.

3. **Review `_redirects`.**

A Pages `_redirects` entry follows this general shape:

```text
/old-path /new-path 301
/docs/* /guides/:splat 301
```

Check:

- rule order;
- default status when omitted;
- wildcard and named-token behavior;
- redirect chains;
- query preservation;
- trailing-slash normalization;
- collisions with Functions;
- limits on static and dynamic rules.

Cloudflare evaluates the first matching redirect and applies redirects before matching `_headers`. [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)[@cf-pages-redirects]

A redirect response does not inherit a header you expected to add later through `_headers`.

4. **Review `_headers`.**

A Pages header rule can target paths or Pages hostnames:

```text
https://:project.pages.dev/*
  X-Robots-Tag: noindex

/articles/*
  X-Content-Type-Options: nosniff
```

Cloudflare allows several matching rules to contribute headers and supports removing a broader header with the documented detach syntax. [Headers](https://developers.cloudflare.com/pages/configuration/headers/)[@cf-pages-headers]

Check for:

- accidental `noindex` on the custom domain;
- missing `noindex` on previews;
- duplicated robots directives;
- stale cache headers;
- CSP blocking required resources;
- header patterns that miss extensionless routes;
- rules that never run because a redirect wins first.

5. **Protect preview deployments.**

Cloudflare says Pages preview deployments include `X-Robots-Tag: noindex` by default. Verify the actual response. [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)[@cf-pages-preview]

Do not assume every `pages.dev` URL has identical treatment. Distinguish:

- production project hostname;
- branch preview;
- immutable deployment;
- custom domain.

A site may choose to redirect the stable project hostname to the custom domain, while retaining immutable previews for QA with `noindex`.

6. **Normalize custom domains.**

Choose the canonical host and redirect alternatives directly.

Examples:

```text
http://example.com → https://example.com
https://www.example.com → https://example.com
https://project.pages.dev → https://example.com
```

Cloudflare documents using Bulk Redirects to send a project `pages.dev` hostname to the custom domain when that is the intended architecture. [Redirecting pages.dev to a custom domain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)[@cf-pages-custom-domain]

Avoid chains such as:

```text
http → www HTTPS → pages.dev → apex HTTPS
```

7. **Understand Pages route normalization.**

Cloudflare Pages can serve extensionless routes for HTML files and redirect file-style forms such as `/about/index.html` or `/contact.html` toward extensionless paths. [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)[@cf-pages-serving]

Check that framework routing and canonical output agree with the edge’s actual route behavior.

A canonical to `/contact.html` is poor if Cloudflare always redirects it to `/contact`.

8. **Check not-found and SPA fallback behavior.**

Pages serves custom `404.html` behavior for missing static files. Framework adapters and Workers can take over this path.

Verify that:

- nonexistent routes return `404`;
- SPA fallbacks do not convert every unknown route into `200`;
- error pages carry appropriate indexing controls;
- the Worker does not swallow framework not-found statuses;
- assets missing from one deployment do not return HTML with `200`.

Google treats status codes as primary crawling signals. [How HTTP status codes affect Google crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

9. **Inspect edge-versus-origin differences.**

Compare:

| Field | Origin or local build | Cloudflare edge |
| --- | --- | --- |
| Status | — | — |
| Location | — | — |
| X-Robots-Tag | — | — |
| Cache-Control | — | — |
| Canonical | — | — |
| Content | — | — |

Differences can come from Workers, Transform Rules, cache, Pages defaults, or account-level redirects.

Use the [Redirect Chain Visualizer to confirm the public edge path rather than the repository's intended path](/tools/redirect-chain-visualizer/).

10. **Verify cache state.**

Record response headers such as cache status, age, ETag, and deployment-specific markers where available.

Look for:

- old HTML after a canonical change;
- old `noindex` after a production release;
- one hostname serving a previous deployment;
- HTML and JavaScript from different builds;
- cached redirects after rules changed;
- immutable assets removed before cached HTML expires.

Purge only what is necessary. A global purge is not a substitute for understanding the cache key and route owner.

11. **Check framework and Worker output.**

For a framework deployment, inspect the generated Worker and routing artifacts rather than assuming static Pages rules control everything.

Verify:

- the expected commit was built;
- the Worker responds with correct statuses;
- redirects occur at one layer;
- application headers are not overwritten;
- environment variables identify production correctly;
- preview hostnames do not become canonical URLs;
- sitemap and robots routes come from the intended handler.

12. **Run final public checks.**

For representative routes:

- follow redirect chains;
- confirm one final canonical;
- confirm indexability on production;
- confirm `noindex` on previews where intended;
- confirm `404` for missing routes;
- confirm images and scripts return correct MIME types;
- inspect browser console and failed resources;
- compare mobile and desktop rendering;
- verify sitemap and feed hosts;
- record the rollback deployment.

## Failure cases

**`_redirects` is edited for a Function route.** The rule never runs.

**A header is expected on a redirect response.** Redirect precedence prevents the `_headers` match from applying.

**Preview noindex is assumed.** One preview hostname is indexable.

**The production domain inherits preview `noindex`.** Host patterns are too broad.

**Every missing path returns the SPA shell with `200`.** Soft 404s multiply.

**The canonical uses `pages.dev`.** Custom-domain pages point away from production.

**Only origin output is tested.** Edge rules change the response.

**A stale cached response is mistaken for current code.** The wrong layer is debugged.

**Several redirect systems overlap.** Chains and loops appear only in production.

## Completion criteria

The Cloudflare release is search-ready when:

- route ownership is known for each tested path;
- redirects occur at one intended layer;
- alternate hosts reach the canonical host directly;
- production responses are indexable;
- preview responses are noindexed or redirected as intended;
- `_headers` and application headers do not conflict;
- missing routes return real `404` responses;
- cache state matches the accepted deployment;
- canonical URLs use the production custom domain;
- sitemap, feed, robots, and assets use correct hosts and MIME types;
- browser and HTTP checks pass on representative routes;
- the exact production commit and rollback target are recorded.

Cloudflare is not merely a pipe in front of the application. It is part of the observable search response and must be audited as such.
