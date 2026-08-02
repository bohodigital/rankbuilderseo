---
{
  "slug": "website-maintenance-503-seo",
  "title": "Website Maintenance SEO: Use 503 and Retry-After Without Deindexing the Site",
  "description": "Handle short maintenance windows with a lightweight 503 response and Retry-After header while keeping robots.txt available, avoiding noindex and removal tools, and preserving user guidance.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Keep the site online whenever possible and disable only the affected functionality. If the entire site must be unavailable for roughly one or two days, return a lightweight informational page with HTTP 503 Service Unavailable and a realistic Retry-After header, while keeping robots.txt accessible and avoiding noindex, 404, 410, or Search Console removal requests.",
  "takeaways": [
    "Limiting functionality is safer than taking the whole site offline.",
    "A 503 response communicates temporary unavailability; it should not become a weeks-long substitute for a functioning site.",
    "Robots.txt should continue returning normally so crawlers can understand site access.",
    "Maintenance pages should use static, low-dependency HTML and give users a clear status, return time, and contact path."
  ],
  "claimLimits": [
    "Correct maintenance responses reduce avoidable deindexing risk but cannot guarantee unchanged rankings, metadata freshness, crawl timing, or immediate recovery after a prolonged outage."
  ],
  "citations": [
    {
      "id": "maintenance-google",
      "title": "Temporarily pause or disable a website",
      "url": "https://developers.google.com/search/docs/crawling-indexing/pause-online-business",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "maintenance-http-rfc",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor / IETF",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "domain-migration-seo-playbook",
    "hosting-cdn-migration-seo",
    "url-migration-redirect-mapping",
    "search-console-change-of-address-tool"
  ]
}
---

## Preconditions

The first maintenance decision is whether the site truly needs to disappear.

Google recommends keeping the site online and limiting functionality when a temporary business or technical issue affects transactions. For example, disable checkout, display an accurate banner, update product availability, and preserve public pages. This minimizes search disruption and still lets users find product details, reviews, manuals, contact information, and business updates. [@maintenance-google]

Use a whole-site maintenance response only when the entire application cannot safely serve normal pages.

Classify the interruption:

```text
Feature outage
Read-only mode
Partial section outage
Brief deployment window
One-to-two-day emergency closure
Longer closure
Permanent shutdown
```

These states require different responses.

A `503 Service Unavailable` response means that the server is temporarily unable to handle the request because of overload or scheduled maintenance and is expected to recover after some delay. RFC 9110 permits a `Retry-After` header to indicate when the client should try again. [@maintenance-http-rfc]

Before maintenance, define:

- start time
- expected end time
- maximum allowed duration
- affected routes
- unaffected routes
- status code by route
- Retry-After value
- robots.txt behavior
- monitoring
- rollback trigger
- status communication
- customer support contact
- restoration checklist
- decision owner

Do not start with “show a maintenance page.” A maintenance page returned with `200`, `404`, or `503` has different machine meaning despite looking identical to a human.

## Ordered process

1. **Prefer degraded functionality over full shutdown.**

Keep informational pages accessible when possible.

For commerce:

- disable purchases
- mark products unavailable accurately
- update structured data
- update Merchant Center feeds
- display delivery or reopening information
- preserve wishlists and product research where safe

For services:

- disable booking or submissions
- explain delays
- preserve service descriptions
- provide contact alternatives
- update operating hours

Google strongly recommends this approach over disabling the whole site. [@maintenance-google]

2. **Scope maintenance narrowly.**

If only checkout is unavailable, do not return `503` for editorial pages, help documentation, and the homepage.

If one section is under maintenance, return temporary errors only for that section and keep the rest of the site serving normally.

A global edge rule is easy to deploy and easy to overapply. Exclude:

- robots.txt
- status page
- monitoring endpoints
- necessary support resources
- unaffected public content
- static assets needed by the maintenance page

3. **Use 503 for a short whole-site outage.**

Google recommends `503` for an urgent complete shutdown lasting roughly one or two days. Longer full closures can have significant search effects even when implemented correctly. [@maintenance-google]

Return:

```text
HTTP/1.1 503 Service Unavailable
Retry-After: 3600
Content-Type: text/html; charset=utf-8
```

The `Retry-After` value can be a delay in seconds or an HTTP date under the HTTP specification. Use a realistic value. Do not promise sixty seconds when the maintenance window is six hours.

4. **Keep robots.txt available.**

Do not return `503` for robots.txt. Google warns that an unavailable robots.txt can block crawling behavior. Do not replace it with a global disallow rule either; that changes crawl permission and can contribute to URLs disappearing from search. [@maintenance-google]

Serve the ordinary valid robots.txt with `200`, or an accurate `404` if the site intentionally has none.

Test it separately:

```text
GET /robots.txt
Expected: normal robots response
```

5. **Build a low-dependency maintenance page.**

Use static HTML and minimal resources.

The maintenance response should not depend on:

- the failed database
- the unavailable application API
- a complex JavaScript bundle
- third-party font servers
- several CSS files
- the same CDN function being deployed
- authenticated sessions
- runtime rendering

Google recommends static HTML and minimizing off-page resources. [@maintenance-google]

Include:

- plain-language status
- affected service
- expected next update or restoration time
- support contact
- status-page link
- emergency instructions where appropriate
- current date and timezone

Avoid a decorative animation that consumes more infrastructure than the application it is apologizing for.

6. **Do not use removal signals for temporary maintenance.**

Google explicitly advises against returning:

- `403`
- `404`
- `410`
- robots `noindex`
- `X-Robots-Tag: noindex`
- Search Console temporary removal requests

These mechanisms communicate blocking, absence, or removal rather than temporary service unavailability. [@maintenance-google]

Do not redirect every page to a single maintenance URL with a permanent redirect. That suggests the content moved. Even a temporary redirect can collapse useful route-level context and complicate monitoring. Returning the maintenance representation at each requested URL with `503` is usually clearer for a brief whole-site outage.

7. **Preserve the requested URL.**

When possible, let:

```text
/example-product
```

return a `503` maintenance response at that same URL.

This lets the crawler retry the original resource later. It also preserves browser bookmarks and avoids building a temporary redirect graph that must be removed perfectly.

8. **Test headers, not screenshots.**

Use a command-line client or monitoring system to verify:

```text
Status = 503
Retry-After present
Content-Type correct
robots.txt not 503
No noindex
No permanent redirect
No cache trapping
Maintenance page reachable without application dependencies
```

Check through:

- CDN
- origin
- IPv4
- IPv6
- `www`
- apex
- HTTP
- HTTPS
- regional edges
- authenticated and unauthenticated paths

A browser showing a maintenance message proves only that some route returned some HTML.

9. **Control caching.**

A CDN or browser can continue serving the maintenance response after the site recovers.

Set cache behavior so the `503` page is not stored for an excessive period. Purge relevant caches at restoration. Ensure the `Retry-After` value does not outlive the actual window.

At the same time, avoid sending every request to a fragile origin. A small controlled edge-served maintenance response can protect the application while preserving accurate status semantics.

10. **Monitor crawler and user behavior.**

Track:

- request volume
- status codes
- maintenance duration
- robots.txt requests
- Googlebot requests
- cache behavior
- regional variance
- error-page latency
- customer support volume
- restoration checks

Google cannot refresh titles, descriptions, metadata, or structured data while pages return `503`. [@maintenance-google] A short outage is one thing; an indefinite `503` prevents normal page processing.

11. **Escalate when the outage will be longer.**

If the site will be unavailable beyond a very short period, reconsider the architecture.

Google recommends an indexable `200` temporary homepage notice for a longer closure rather than serving the entire site as `503` for weeks. [@maintenance-google]

A longer-term notice should explain the business status and preserve contact information. It does not preserve every removed product or article URL, so the organization should restore informational content wherever possible.

12. **Restore in a controlled order.**

At reopening:

1. restore origin and application health
2. test representative pages directly
3. disable the maintenance rule
4. purge maintenance caches
5. confirm `200`, redirects, `404`, and other ordinary statuses
6. confirm robots.txt
7. confirm canonicals and robots directives
8. confirm structured data and availability
9. test forms and transactions
10. monitor crawler and user errors
11. update the public status message
12. remove temporary operational bypasses

Do not remove the maintenance layer before the application is ready, then re-enable it repeatedly. Flapping status creates inconsistent caches and user experiences.

## Failure cases

**The whole site closes for a checkout problem.** Searchable information disappears unnecessarily.

**The maintenance page returns 200.** Every URL appears to contain the same maintenance content and can be treated as a soft 404 or duplicate.

**The site returns 404 or 410.** Temporary unavailability is expressed as permanent absence.

**Robots.txt returns 503.** Crawlers cannot retrieve the site’s crawl policy.

**A global disallow is deployed.** The operator changes crawl permission instead of indicating temporary service failure.

**Noindex is added everywhere.** Pages are explicitly marked for removal during a temporary event.

**Retry-After is fiction.** Clients are told to retry at a time the service cannot meet.

**The maintenance page depends on the broken application.** It fails when needed.

**The CDN caches 503 for a day.** The recovered site remains unavailable at the edge.

**The outage lasts weeks.** A short-term status becomes a prolonged loss of crawlable content and metadata freshness.

**The removal tool is used for closure.** Users lose the ability to find the official explanation while third-party information may continue appearing.

## Completion criteria

The maintenance implementation is complete when unaffected functionality remains online where possible and affected routes return the intended temporary behavior.

For a full short outage, ordinary page URLs should return `503` with a realistic `Retry-After`, the maintenance HTML should be static and lightweight, and robots.txt should remain accessible with its normal status. No global `noindex`, removal request, permanent redirect, `404`, or `410` should be introduced.

At restoration, caches must be purged, representative URLs must return their normal status and content, robots.txt must be correct, and monitoring must show the disappearance of maintenance responses. The outage duration and recovery evidence should be preserved in the incident record.

Continue with [Domain Migration SEO](/articles/domain-migration-seo-playbook) when maintenance is part of a hostname cutover and [Hosting and CDN Migration SEO](/articles/hosting-cdn-migration-seo) when infrastructure is moving without public URL changes.
