---
{
  "slug": "redirect-loop-debugging-playbook",
  "title": "Redirect Loop Debugging Playbook: Find the Rule That Sends the Request Back",
  "description": "Diagnose ERR_TOO_MANY_REDIRECTS by tracing each HTTP hop, separating browser state from edge and origin rules, and verifying the repaired canonical path.",
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
  "revisionNote": "Expanded required Playbook prose and added an explicit ordered process for native staging. Citation IDs were namespaced for the global RankBuilder registry.",
  "directAnswer": "Disable automatic redirect following, record each status and `Location` header, and stop at the first repeated URL or state. Then identify which layer produced each hop. Repair the narrowest conflicting rule, clear relevant caches and browser state, and retest the complete set of scheme, host, path, locale, and query variants.",
  "takeaways": [
    "A loop is a cycle, not merely a long chain.",
    "Automatic redirect following hides the evidence needed to diagnose the cycle.",
    "Most loops come from disagreement between layers, such as edge HTTPS enforcement versus an origin HTTP redirect.",
    "The repair is incomplete until direct requests, internal links, canonicals, and sitemaps all converge on the same final URL."
  ],
  "claimLimits": [
    "The playbook identifies HTTP and browser-visible redirect cycles. It does not replace provider-specific access to proprietary load balancers, application middleware, identity systems, or network appliances."
  ],
  "citations": [
    {
      "id": "rba03-rfc9110",
      "title": "HTTP Semantics, RFC 9110",
      "url": "https://www.rfc-editor.org/rfc/inline-errata/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba03-cf-loop",
      "title": "ERR_TOO_MANY_REDIRECTS",
      "url": "https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba03-cf-redirects",
      "title": "Redirects",
      "url": "https://developers.cloudflare.com/rules/url-forwarding/",
      "publisher": "Cloudflare",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rba03-google-redirects",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "compare-seo-proposals",
    "redirect-error-search-console",
    "page-with-redirect",
    "trailing-slash-seo"
  ]
}
---

## Preconditions
A redirect loop investigation must begin with a frozen observation, not an improvised sequence of configuration changes. The team needs a reproducible failing request, access to each layer that can issue a redirect, and authority to roll back one change at a time. Preserve headers, cookies, DNS answers, edge traces, and the exact browser state before clearing anything. Without that baseline, a loop can appear to vanish because a cache expired or a cookie changed while the conflicting rule remains in production. The objective is to identify the first repeated request state and the layer that produced it.


Before changing anything, preserve:

- The exact failing URL as entered
- Browser and operating-system details
- Whether the failure occurs in a private window
- DNS and proxy configuration
- Current edge, load balancer, web server, application, CMS, and plugin redirect rules
- Current TLS mode and HTTPS enforcement settings
- A rollback path for every edited rule
- A list of canonical variants to test

Do not begin by deleting redirects until the error disappears. That can hide the conflict while breaking legitimate migrations.

HTTP clients are expected to detect cyclical redirects and intervene. RFC 9110 notes that clients should detect cyclic redirections, but implementations can use different limits. [RFC 9110](https://www.rfc-editor.org/rfc/inline-errata/rfc9110.html)[@rba03-rfc9110]

## Ordered process
1. Reproduce the loop without retained browser state.
2. Follow every redirect hop manually.
3. Classify the scheme, host, path, locale, authentication, rewrite, or cache disagreement.
4. Attribute every hop to the layer that produced it.
5. Repair the narrowest conflicting rule.
6. Purge the relevant cached variants.
7. Retest the complete normalization matrix.
8. Verify the final search-facing signals.


**1. Reproduce without browser history or cookies**
Test in a private browser window. If the loop disappears, record the cookies, service worker, HSTS state, and authentication flow involved before clearing anything.

Then use an HTTP client with automatic redirect following disabled:

```bash
curl -sS -D - -o /dev/null https://example.com/path
```

Record:

- Status code
- `Location`
- `Set-Cookie`
- `Cache-Control`
- CDN cache headers
- Server identifiers where exposed

Do not use only `curl -L` at first. Following automatically can collapse the evidence into a final “too many redirects” error.

**2. Follow one hop manually**
Request the exact absolute URL from the `Location` header. Repeat until:

- A `200`, `404`, or other terminal response appears
- A previous URL repeats
- The same URL repeats with a different cookie or header state
- The redirect target is malformed or relative in an unexpected way

Create a table:

| Hop | Requested URL | Status | Location | Producing layer | State change |
| --- | --- | --- | --- | --- | --- |
| 0 | Initial URL | 301 | Target A | Unknown | None |
| 1 | Target A | 302 | Target B | Unknown | Cookie set |
| 2 | Target B | 301 | Target A | Unknown | None |

The first repeated state establishes the cycle.

**3. Classify the disagreement**
Common loop classes include:

**Scheme loop**  
The edge redirects HTTP to HTTPS while the origin redirects HTTPS back to HTTP. Cloudflare documents this exact failure pattern for “Always Use HTTPS,” HSTS, and incompatible encryption settings. [ERR_TOO_MANY_REDIRECTS](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/)[@rba03-cf-loop]

**Host loop**  
`www` redirects to the apex at one layer while another sends the apex back to `www`.

**Slash loop**  
The framework adds a trailing slash while a proxy or CMS removes it.

**Locale loop**  
Geolocation sends the visitor to `/us/`, while a preference cookie or application default sends the visitor back to `/`.

**Authentication loop**  
The application sends an unauthenticated request to login, but the identity callback returns to a route that still appears unauthenticated.

**Rewrite-versus-redirect confusion**  
An internal rewrite changes what the origin sees, while another layer redirects based on the rewritten path.

**Cached redirect loop**  
One layer has been fixed, but an edge or browser still reuses an older redirect.

**4. Attribute every hop to a layer**
Possible producers include:

- Browser HSTS or extension
- Service worker
- CDN or reverse proxy
- Cloud load balancer
- Web server configuration
- Framework middleware
- Application controller
- CMS setting or plugin
- Authentication provider

Use provider traces and response headers where available. Cloudflare recommends Trace for determining whether a redirect rule is triggering, and documents that terminating redirect actions stop further rule evaluation. [Cloudflare Redirects](https://developers.cloudflare.com/rules/url-forwarding/)[@rba03-cf-redirects]

Test the origin directly only when it can be done safely and without bypassing access controls. A different origin response is evidence of edge involvement, not permission to leave the origin publicly exposed.

**5. Repair the narrowest conflicting rule**
Choose one authoritative normalization policy for each dimension:

- HTTP or HTTPS
- Apex or `www`
- Slash or no slash
- Case normalization where applicable
- Locale routing
- Legacy path mapping
- Authentication entry and callback routes

Remove or narrow the competing rule. Avoid replacing a two-hop loop with a three-hop chain.

For permanent public URL moves, Google recommends server-side permanent redirects when the change will not be reverted. Permanent redirects are canonicalization signals; temporary redirects generally keep the source as the intended canonical signal. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)[@rba03-google-redirects]

**6. Purge only the relevant caches, then broaden if needed**
Purge the affected redirect response and all key variants. Clear browser state only after recording whether it participated in the loop.

If a custom cache key includes headers, cookies, or query components, a visible-URL purge may not remove every variant. Verify the provider’s purge semantics rather than clicking “purge” and declaring metaphysical closure.

**7. Retest the normalization matrix**
At minimum test:

```text
http://example.com/path
https://example.com/path
http://www.example.com/path
https://www.example.com/path
/path
/path/
uppercase or mixed-case variant where relevant
legacy path
query-string variant
locale variant
```

Each deprecated public variant should reach the preferred URL without cycling. Important internal links and sitemaps should point directly to the final URL rather than rely on redirects.

**8. Verify search-facing signals**
On the final URL, verify:

- Terminal `200` status for a valid page
- Self-consistent canonical
- No accidental `noindex`
- Crawlable internal links
- Correct sitemap inclusion
- No redirecting media or structured-data URLs where direct URLs are available
- Search Console URL Inspection after public deployment

## Failure cases
Failure handling should preserve attribution. If a test result changes after several rules, caches, or applications are edited together, the investigation no longer shows which condition caused the cycle. Restore the last known state and repeat with one bounded change. Browser-only success is also insufficient because HSTS, service workers, cookies, and extensions can produce a local result that differs from a crawler or external client. The team should stop when a redirect hop cannot be assigned to a known layer or when the rollback for the proposed edit is not verified.


- **Changing several layers at once:** You lose attribution and may create a different loop. Roll back and isolate one layer.
- **Testing only in one browser:** HSTS, cookies, or service workers can make the result browser-specific.
- **Following redirects automatically:** The client reports the symptom but hides the cycle.
- **Purging the wrong key:** An old redirect persists under another query, header, host, or cookie variant.
- **Fixing the loop with a catch-all homepage redirect:** The error disappears, but relevance and user intent are destroyed.
- **Leaving internal links on the source URL:** Crawlers and users continue to traverse avoidable redirects.
- **Changing permanent redirects to temporary without intent:** Search canonicalization signals become inconsistent.

The stop condition is simple: if you cannot identify which layer produced a hop, do not alter unrelated redirect rules merely because they look suspicious.

## Completion criteria
Completion requires more than making one browser load the page. The original cycle must be documented, the conflicting rules must be identified, and the repaired policy must produce the same preferred destination across scheme, host, slash, locale, legacy-path, and query variants. Public responses, internal links, canonical annotations, and sitemap entries should all converge on the preferred URL. Preserve the before-and-after hop table, the release identifier, the cache purge performed, and the tested rollback. Monitoring must also be able to detect the loop if a later deployment restores the conflict.


The playbook is complete only when:

1. The original cycle is documented hop by hop.
2. Every hop is attributed to a layer or bounded as unresolved.
3. The conflicting rule is changed with a recorded rollback.
4. The canonical variant matrix terminates predictably.
5. Valid final pages return the intended status and content.
6. Internal links, canonical tags, and sitemaps point directly to preferred URLs.
7. Edge, origin, private-window, and at least one external check agree.
8. Monitoring can detect recurrence after the next deployment or configuration change.
