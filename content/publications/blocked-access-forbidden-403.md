---
{
  "slug": "blocked-access-forbidden-403",
  "title": "Blocked Due to Access Forbidden 403: Fixing WAF and Bot-Protection Errors",
  "description": "Trace a Search Console 403 through CDN, WAF, bot protection, geography, middleware, and origin permissions without trusting spoofable user agents.",
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
  "directAnswer": "A 403 means the request reached a responding system but access was refused. Check CDN rules, web application firewalls, bot protection, geographic restrictions, signed requests, application middleware, and origin permissions.",
  "takeaways": [
    "Decide whether the URL should be public before changing a forbidden response.",
    "Compare edge and origin evidence to locate the layer that generates the 403.",
    "Verify Googlebot by IP ranges or forward-confirmed reverse DNS, not by user-agent text."
  ],
  "claimLimits": [
    "A public page can fail only at certain edges, networks, or request patterns, so one successful local request does not close the investigation."
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
      "id": "googlebot-verification",
      "title": "Verify requests from Google crawlers and fetchers",
      "url": "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "gsc-crawl-stats",
      "title": "Crawl Stats report",
      "url": "https://support.google.com/webmasters/answer/9679690?hl=en",
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
    "blocked-unauthorized-request-401",
    "blocked-other-4xx",
    "server-error-5xx",
    "url-blocked-by-robots-txt",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page"
  ]
}
---

## Preconditions

![No unauthorised access notice on a glass entrance](/media/blocked-access-forbidden-403-hero.jpg "A 403 response often reflects an explicit edge, firewall, application, or origin access rule.")

Confirm whether the URL is intended for the public internet. A private administrative route, paid resource, or network-restricted application may correctly refuse access. A public article that works for the owner but fails for Googlebot is a different problem.

Collect:

- the exact URL and response time;
- response headers and body;
- Search Console’s last crawl date;
- CDN, WAF, bot-management, and firewall events;
- application and origin access logs;
- geographic, network, and signed-request rules;
- a record of recent security or deployment changes.

Google’s Page Indexing report says a page returning `403` will not be indexed. If the page should be public, unauthenticated access or a safely verified crawler path must be restored. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

Keep a rollback path for every security-rule change and narrow the investigation to the affected public route, rule, and request class.

## Ordered process

1. **Verify the exact forbidden response.**

Run an uncached request through the public hostname. Record:

```text
HTTP/2 403
content-type: text/html
server: edge
x-request-id: example-incident-id
```

The body may name a challenge, policy, or blocked geography. Preserve request IDs for operational review without publishing sensitive logs.

2. **Decide whether the restriction is intentional.**

| URL state | Correct behavior |
| --- | --- |
| Public article or product page | Unauthenticated content is available |
| Admin, account, or confidential page | Access restriction remains |
| Staging environment | Restriction remains; discovery signals are removed |
| Public page with protected actions | Page remains public; sensitive actions enforce authorization separately |

Do not weaken private data exposure to satisfy indexing.

3. **Compare the edge and origin.**

| Observation | Likely owner |
| --- | --- |
| Edge returns `403`; authorized origin test returns `200` | CDN, WAF, bot rule, geography |
| Edge and origin both return `403` | application, web server, filesystem permission |
| Only one path or method fails | route or method policy |
| Only one network or region fails | geographic or IP rule |
| Browser gets a challenge and crawler gets `403` | bot-management policy |

Use safe, authorized origin checks. Do not expose or bypass an origin merely for diagnosis.

4. **Review CDN, WAF, and bot-protection events.**

Look for managed-rule matches, reputation scores, rate limits, JavaScript challenges, cookie requirements, IP lists, and automated security responses. A browser may pass a challenge and store a cookie, while Googlebot cannot complete that interactive flow.

5. **Check application and origin permissions.**

Review route middleware, access-control lists, file permissions, signed URL checks, referrer rules, and proxy authentication. A deployment can accidentally inherit a staging policy or restrict a newly created directory.

6. **Verify crawler identity safely.**

Do not trust a request merely because its user-agent contains “Googlebot.” Google documents two suitable methods: match the source IP against published crawler ranges, or perform reverse DNS and then forward DNS to confirm the hostname resolves back to the original address. [Verify requests from Google crawlers and fetchers](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)[@googlebot-verification]

Avoid broad crawler allowlists that bypass application authorization. Fix the rule that wrongly classifies legitimate public requests.

7. **Review geography, network, and request assumptions.**

Check whether access depends on:

- country or region;
- IPv4 versus IPv6;
- data-center network classification;
- missing cookies or JavaScript;
- request headers;
- method or content negotiation;
- signed query parameters;
- edge-versus-origin hostname.

One successful office-network request does not prove global public access.

8. **Restore the intended public response and retest.**

For public content, the final URL should return stable intended content without an interactive challenge. Ordinary `4xx` responses tell Google that content is unavailable and are not used for indexing. [How HTTP status codes affect Google's crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

Use Crawl Stats to see whether forbidden responses cluster in time and URL families. [Crawl Stats report](https://support.google.com/webmasters/answer/9679690?hl=en)[@gsc-crawl-stats] Then run live URL Inspection on representative routes. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en)[@gsc-url-inspection]

## Failure cases

- **A browser session passes a stored challenge.** Googlebot still receives `403`.
- **The user-agent is trusted.** Spoofed crawlers inherit the exception.
- **The entire WAF is disabled.** A narrow rule defect becomes an unnecessary security regression.
- **Only the origin is tested.** The production edge remains broken.
- **Only the edge is tested.** The CDN cache hides an origin permission problem.
- **Geographic restrictions are forgotten.** Testing from one location misses the affected path.
- **A public page requires signed parameters.** Search and internal links expose a URL that expires.
- **Rate limiting emits `403`.** Overload and forbidden access become indistinguishable.
- **A `robots.txt` change is used to fix access.** Crawl preferences do not repair the HTTP response.

The [401 playbook](/articles/blocked-unauthorized-request-401/) covers a credential challenge. The [Other 4xx explainer](/articles/blocked-other-4xx/) covers other client-error responses. If the edge cannot reach a healthy origin and emits a gateway failure, continue with [Server Error 5xx](/articles/server-error-5xx/).

Treat a security exception as a production change: identify the exact policy owner, preserve the prior rule, and verify that unrelated protected routes remain closed after the public route recovers.

When evidence differs between tools, prefer the response observed on the public production path at the recorded time. Then use edge and origin request identifiers to explain the difference instead of repeatedly loosening controls until one test becomes green.

## Completion criteria

The repair is complete when:

- the public-versus-restricted intent is documented;
- public pages return intended content without credentials or interactive challenges;
- private pages remain protected and are removed from public discovery;
- edge and origin responses agree;
- WAF and bot events no longer flag representative public routes;
- geographic and network variants were sampled;
- no user-agent-only trust rule was introduced;
- verified Googlebot evidence and live URL Inspection show successful access;
- Crawl Stats no longer shows a continuing 403 pattern after recrawl.

Do not promise an immediate indexing change. The live response can be fixed before the [Page Indexing report](/articles/google-search-console-page-indexing-report/) updates. Continue with the [robots.txt guide](/articles/url-blocked-by-robots-txt/) only if a separate crawl rule also applies.
