---
{
  "slug": "redirect-error-search-console",
  "title": "Redirect Error in Search Console: How to Find the Failed Hop",
  "description": "Trace a Search Console redirect error through every response, locate loops or malformed targets, and replace fragile chains with one direct redirect.",
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
  "directAnswer": "Trace every response from the exact source URL to the intended destination. The failed hop is usually a loop, excessive chain, malformed or empty Location value, unstable protocol or hostname rule, or a destination that grows beyond a usable URL length.",
  "takeaways": [
    "Record each status and Location value without assuming the browser's address bar shows the whole chain.",
    "Check application, CDN, proxy, and origin rules because several layers can each add a hop.",
    "Replace a chain with one direct redirect to the final relevant destination."
  ],
  "claimLimits": [
    "A successful command-line trace does not prove that every geographic edge, device path, or crawler request receives the same response."
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
    "page-with-redirect",
    "google-chose-different-canonical",
    "seo-migration-launch-checklist",
    "server-error-5xx",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page",
    "cloudflare-pages-workers-seo"
  ]
}
---

## Preconditions

![Aerial view of roads converging at a large highway interchange](/media/redirect-error-search-console-hero.jpg "Redirect errors become understandable when every hop is recorded rather than hidden behind the final browser location.")

Begin with the exact source URL reported by Search Console and the destination that the site owner intends. Do not start from a shortened URL, a browser bookmark, or a manually normalized variant.

Collect:

- the full protocol, hostname, path, and query;
- the intended final URL;
- access to application, proxy, CDN, and origin redirect rules;
- response headers from more than one request;
- the time and deployment associated with the reported error.

Google lists four common redirect-error families: a chain that is too long, a loop, a resulting URL that becomes too long, or a bad or empty URL in the chain. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

A normal “Page with redirect” is not the same thing. It means the redirect could be evaluated. A redirect error means Google could not complete the path reliably.

## Ordered process

1. **Capture the first response without following it.**

Use a header request or a debugging client that exposes status and `Location`:

```text
$ curl -sS -I https://example.com/old
HTTP/2 301
location: https://www.example.com/legacy
```

Record the response exactly. An empty header, invalid scheme, whitespace, control character, or unintended relative path can break the next request.

2. **Trace the complete chain one hop at a time.**

Do not rely only on the final browser address. Build a table:

| Hop | Requested URL | Status | Location |
| ---: | --- | ---: | --- |
| 0 | `http://example.com/old` | `301` | `https://example.com/old` |
| 1 | `https://example.com/old` | `302` | `https://www.example.com/legacy` |
| 2 | `https://www.example.com/legacy` | `301` | `https://example.com/new` |
| 3 | `https://example.com/new` | `200` | — |

Google’s crawlers generally follow a bounded number of redirects, while inspection tools can behave differently. A short, direct path is easier for every client to process. [How HTTP status codes affect Google's crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

3. **Distinguish a loop from a long chain.**

A loop repeats a URL or state:

```text
/old -> /new -> /old
```

It can also alternate protocol, hostname, slash style, locale, or authentication state. A long chain reaches a destination eventually but passes through unnecessary historical rules. Detect loops by recording normalized URLs, not merely counting visible pages.

4. **Inspect every Location value.**

Look for:

- an empty value;
- a missing hostname after `https://`;
- an unintended space or encoded control character;
- repeated query-string appends;
- an unescaped template value;
- a relative path resolved against the wrong directory;
- a destination that grows on every request.

For example, `/login?return=/login?return=...` may eventually exceed practical URL limits without repeating an identical string.

5. **Check protocol, hostname, and path normalization together.**

Several individually reasonable rules can form a loop. The CDN enforces HTTPS, the application adds `www`, and the origin removes `www`. A framework adds a trailing slash while the proxy removes it. Define one preferred state, then make every rule converge on it.

6. **Identify the layer that emitted each hop.**

Compare distinctive headers, logs, and configuration:

| Layer | Common clues | Typical defect |
| --- | --- | --- |
| CDN or edge | cache, ray, or edge headers | hostname or HTTPS rule conflicts |
| Reverse proxy | proxy server header and access log | slash or path rewrite |
| Application | framework cookies or route headers | locale, auth, or content redirect |
| Origin server | direct-origin behavior differs from edge | legacy rewrite remains active |

Change the owning rule, not a downstream symptom.

7. **Replace the chain with one direct redirect.**

| Fragile path | Preferred path |
| --- | --- |
| `/a` → `/b` → `/c` → `/final` | `/a` → `/final` |
| HTTP → HTTPS → www → no-www | every variant → preferred HTTPS host |
| old slug → intermediate taxonomy → new slug | old slug → current canonical |

For a permanent move, use a permanent server-side redirect when possible. Temporary redirects should be reserved for genuinely temporary routing. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)[@google-redirects]

8. **Retest user and crawler-facing behavior.**

Test the source, each important variant, and the final URL. Inspect the final destination separately in Search Console. URL Inspection can show whether current fetching succeeds, but indexed reporting may still reflect the earlier crawl until Google processes the repair. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en)[@gsc-url-inspection]

## Failure cases

- **The browser is treated as a trace.** It may hide intermediate hops and cached redirects.
- **Only one hostname is tested.** The loop may require a specific protocol, host, slash, locale, or parameter.
- **The last rule is fixed instead of the first wrong hop.** Another layer continues generating the defect.
- **A crawler exception is added by user-agent string.** Spoofable routing increases inconsistency and can become cloaking.
- **A redirect chain ends at `404`, `403`, or `5xx`.** The redirect works, but the destination does not.
- **Old links remain in navigation and sitemaps.** Crawlers keep entering through obsolete sources.
- **A temporary redirect is left indefinitely.** The response no longer describes the intended URL relationship.
- **All missing URLs go to the homepage.** Relevance is lost and the result may be treated as a soft 404.

If the source cleanly reaches the target and Search Console reports “Page with redirect,” use the [status explainer](/articles/page-with-redirect/) instead. If the final response fails at the server layer, continue with [Server Error 5xx](/articles/server-error-5xx/).

When separate tools disagree, compare the exact requested URL, request time, resolved IP or edge, cache state, and complete response headers. A cached browser redirect, a region-specific edge rule, or a recently deployed application route can each produce a truthful but incomplete observation.

Preserve the failing trace before changing configuration. It is the evidence needed to show which rule owned the defect and whether the direct replacement actually removed it.

## Completion criteria

The repair is complete when:

- every source variant reaches the intended final URL;
- no URL or normalized state repeats;
- the path is direct rather than historically chained;
- every `Location` value is valid and stable;
- protocol, hostname, slash, locale, and query rules agree;
- the final URL returns a usable response and intended content;
- internal links, canonicals, and sitemaps use the final URL;
- representative edge and origin requests agree;
- the destination passes a current live inspection.

Google’s next report update may lag the live repair. Record the fix time, last crawl time, and exact source so that stale reporting is not mistaken for a new failure. The same evidence also supports the [migration checklist](/articles/seo-migration-launch-checklist/), the [canonical review](/articles/google-chose-different-canonical/), and the broader [indexing diagnostic flow](/articles/why-google-isnt-indexing-your-page/).
