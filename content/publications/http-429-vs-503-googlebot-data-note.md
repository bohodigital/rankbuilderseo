---
{
  "slug": "http-429-vs-503-googlebot-data-note",
  "title": "HTTP 429 vs. 503 for Googlebot: A Response-Code Decision Note",
  "description": "Compare HTTP 429 and 503 for Googlebot using standards semantics, crawl-rate effects, index limits, Retry-After, robots.txt behavior, duration, and recovery.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Use 429 when the requester exceeded a rate limit and 503 when the service is temporarily unavailable more generally. Google treats 429 as a server-overload signal alongside 5xx responses and reduces crawl rate for both. Either code is an emergency measure measured in hours or roughly one to two days, not a permanent crawl-control strategy.",
  "takeaways": [
    "429 means too many requests; 503 means temporary service unavailability.",
    "Google groups 429 with server errors for crawl-rate behavior.",
    "A significant number of 429 or 5xx responses can reduce crawling across the hostname.",
    "Persistent responses can cause indexed URLs to be dropped."
  ],
  "claimLimits": [
    "Google does not publish an exact response-count threshold or retry schedule for every crawler.",
    "Other clients, caches, CDNs, and search engines can treat the codes differently.",
    "This note does not replace capacity planning, rate-limit design, or incident response."
  ],
  "citations": [
    {
      "id": "over-google-status",
      "title": "How HTTP status codes affect Google's crawlers",
      "url": "https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "over-google-rate",
      "title": "Reduce Google crawl rate",
      "url": "https://developers.google.com/crawling/docs/crawlers-fetchers/reduce-crawl-rate",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "over-google-budget",
      "title": "Optimize your crawl budget",
      "url": "https://developers.google.com/crawling/docs/crawl-budget",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "over-google-robots",
      "title": "How Google interprets the robots.txt specification",
      "url": "https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "over-rfc6585",
      "title": "RFC 6585: Additional HTTP Status Codes",
      "url": "https://www.rfc-editor.org/rfc/rfc6585.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "over-rfc9110",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "ga4-cross-domain-organic-conversion-checklist",
    "http3-google-ranking-claim-check",
    "discover-ranking-systems-claim-check"
  ]
}
---

## Dataset and period

The source set consists of Google’s current HTTP status-code handling, emergency crawl-rate, crawl-budget, and robots.txt documentation plus RFC 6585 for `429 Too Many Requests` and RFC 9110 for `503 Service Unavailable`. All records were checked on 2026-08-03.

The decision note evaluates temporary responses to overload. It does not treat either status as a permanent SEO control or a substitute for fixing an unbounded URL generator. The comparison is limited to publicly documented protocol semantics and Google crawler behavior. It does not attempt to infer an unpublished failure threshold, exact retry timer, or the behavior of every other crawler, CDN, proxy, cache, browser, and API client that can receive the same response.

## Methodology

The comparison treats protocol semantics and crawler behavior as separate evidence layers. First, RFC definitions establish what each response tells a general HTTP client. Second, Google’s crawler documentation establishes the publicly described effects on crawl rate, indexed URLs, response bodies, and robots.txt handling. Third, operational examples test whether the chosen status accurately describes the actual failure rather than merely producing a desired crawler reaction.

Five dimensions are recorded for every case: the requester or service condition, response status, duration, affected hostname and paths, and recovery evidence. The analysis also checks whether `Retry-After` is present, whether the response reaches the public hostname through the CDN, whether robots.txt remains available, and whether successful content returns immediately after recovery. The method deliberately excludes ranking speculation and treats permanent crawl control, URL-inventory repair, and capacity planning as separate work.

The goal is not to identify a code that “protects SEO.” The goal is to send an honest temporary availability signal while restoring capacity. A correct status code communicates the current condition to every compliant client, not only Googlebot. Crawler effects matter, but they should not cause the server to lie about why a request failed.

## Result

**Protocol meaning.** RFC 6585 defines `429 Too Many Requests` as a response indicating that the user sent too many requests in a given amount of time. The response may include `Retry-After`. [@over-rfc6585]

Use 429 when the condition is specifically rate limiting:

```text
this requester or request class exceeded an allowed rate
```

The limit may be associated with an account, IP address, API key, user, route, or another defined request class. The server should document the scope because “too many” has no operational meaning without a limit.

RFC 9110 defines `503 Service Unavailable` for temporary inability to handle a request because of overload or scheduled maintenance. A server may include `Retry-After`. [@over-rfc9110]

Use 503 when:

```text
the service is temporarily unavailable more broadly
```

The database may be down, the application may be overloaded, or planned maintenance may prevent normal service. The condition is not necessarily caused by the individual requester.

**Google crawler treatment.** Google’s HTTP status documentation says ordinary `4xx` responses are treated as nonexistent content except `429`. Google treats 429 as a signal that the server is overloaded and considers it a server error. [@over-google-status]

For `5xx` and `429` responses, Google temporarily slows crawling. Already indexed URLs are preserved initially but can eventually be dropped if the error persists. Content returned with the error is ignored.

```text
429 and 503 both reduce crawl capacity
```

The codes remain semantically different even when the crawler-control effect overlaps.

A page should not return a full successful article body with 429 or 503 and expect the body to be indexed. The status tells the crawler that the request did not produce a normal usable representation.

**Hostname scope.** Google’s crawl-rate guidance says a significant number of `500`, `503`, or `429` responses can reduce crawl rate across the entire hostname, affecting URLs that return errors and URLs that still return content. [@over-google-rate]

This matters when a rate limiter returns 429 to a narrow path. Enough failures can influence broader crawling. The effect can be desirable during a genuine emergency because reducing requests protects the service. It can be harmful when a faulty rule blocks Googlebot while the server remains healthy.

**Duration.** Google recommends 429 or 503 only temporarily when Googlebot is overwhelming a server. Its current guidance describes an emergency window of a couple of hours or one to two days and warns that longer use may cause URLs to be dropped. [@over-google-rate]

The status code should stop when capacity recovers. Do not schedule a permanent daily 503 window as an informal crawl budget. Repeated availability failures become part of the host’s observed reliability.

**Retry-After.** Both codes can carry `Retry-After` under HTTP semantics. The header can use a date or delay value under the relevant specification.

Do not rely on the header as a precise Googlebot scheduling command. Google’s public crawler guidance focuses on status and recovery pattern, not a promise to recrawl at the exact value.

The header remains useful to clients and operators because it communicates an expected minimum recovery period. Keep it realistic. A value of several years is not a maintenance estimate; it is a retirement announcement with unusual syntax.

**Robots.txt special case.** A 503 on `robots.txt` triggers separate handling. Google can temporarily stop crawling, use a last good cached robots file, and continue retrying under documented periods. [@over-google-robots]

Do not apply an application-wide rate limiter to `robots.txt` without understanding this behavior. A 429 or 503 on content URLs and an unavailable robots file can create different effects.

A successful robots file that blocks a path also differs from an overloaded server. Robots rules express crawler permissions. They do not say the server failed.

**Crawl budget context.** Google’s crawl-budget documentation treats server availability, latency, URL inventory, and crawl demand as interacting constraints. [@over-google-budget] A site generating millions of low-value parameter URLs should not rely on 429 as the primary repair. Bound the URL space, improve internal links, and remove duplicate generators.

Rate limiting is an operational safety control. It is not content architecture.

## Decision table

| Condition | Better semantic fit | Notes |
| --- | --- | --- |
| One client exceeded request quota | 429 | Rate-limit condition |
| Whole application overloaded | 503 | General temporary unavailability |
| Planned maintenance | 503 | Include honest maintenance behavior |
| Permanent removal | Neither | Use 404 or 410 |
| Private content | Neither | Use authentication and correct access controls |
| Long-term crawl reduction | Neither | Fix URL inventory and capacity |
| Unsupported request method | Neither | Use the applicable 4xx response |
| Origin healthy, CDN rule broken | Fix rule | Do not preserve a false overload response |

**Burst rate limit.** A crawler requests 500 filter URLs in one minute and crosses a defined per-client threshold. The service remains healthy for ordinary users. A temporary 429 can truthfully describe the condition. The underlying SEO repair may still be to control the filter URL generator. Rate limiting treats the symptom.

**Database outage.** All page requests fail because the database is unavailable. A 503 is the better representation. Returning 429 would imply that the requester caused the problem.

**Planned maintenance.** A deployment requires a short period during which normal pages cannot be served. Return a lightweight 503 response, keep the outage short, monitor the public hostname, and restore 200 responses immediately after completion.

**Permanent block.** A provider returns 429 to Googlebot for months because the owner dislikes crawling. Google can reduce or stop crawling and eventually drop URLs. Robots controls and URL-inventory design are the appropriate long-term tools.

**False-positive bot rule.** A CDN identifies verified Googlebot as abusive and returns 429 while users receive 200. The site may lose crawl capacity without real origin overload. Verify crawler identity, review the rule, and monitor status distribution by route and requester class.

## Operational record

```text
start time
affected hostname
affected paths
status code
request class
threshold
Retry-After
Googlebot verification method
error percentage
crawl-rate change
recovery time
stop time
index monitoring
root cause
```

Verify crawler identity before applying Googlebot-specific behavior. User-agent strings alone can be spoofed.

A successful recovery returns intended content and status. A declining error count caused only by Googlebot giving up is not success.

## Limitations

Google does not publish the exact number or percentage of failures that produces each crawl-rate adjustment. Current guidance uses terms such as “significant number” and provides approximate emergency durations.

Crawl behavior also depends on URL demand, site size, prior health, latency, other Google crawlers, and duration. Other crawlers may ignore Retry-After, retry aggressively, or interpret rate limits differently. Application and CDN implementations can also cache or replace errors incorrectly.

The response decision should be truthful semantics plus short duration, broad monitoring, and root-cause repair. There is no secret crawl-budget lever. There is only a server admitting, with varying precision, that it cannot deal with another request right now.
