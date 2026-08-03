---
{
  "slug": "http-304-not-modified-seo",
  "title": "HTTP 304 Not Modified and SEO: What Googlebot Reuses",
  "description": "A 304 response can reduce unnecessary transfer when Google already has the current version, but inaccurate validators can preserve stale content.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-02",
  "revisedAt": "2026-08-02",
  "directAnswer": "HTTP 304 means the requested representation has not changed since Google’s validated copy. Google can reuse the previously crawled content instead of downloading a new response body. It is cache validation, not a redirect or ranking signal.",
  "takeaways": [
    "A correct 304 response contains no new page body.",
    "Google may reuse its last crawled representation when a validator confirms that nothing changed.",
    "Incorrect ETags or modification dates can cause crawlers and browsers to retain stale content."
  ],
  "claimLimits": [
    "A 304 response does not guarantee faster indexing, higher rankings, or a larger crawl allocation.",
    "Crawl efficiency depends on site size, change frequency, server behavior, and Google’s own scheduling.",
    "This article explains standards-compliant behavior, not every CDN implementation."
  ],
  "citations": [
    {
      "id": "gsc-crawl-errors",
      "title": "Troubleshoot Google Search crawling errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "google-caching",
      "title": "Crawling December: HTTP caching",
      "url": "https://developers.google.com/search/blog/2024/12/crawling-december-caching",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rfc9110",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "rfc9111",
      "title": "RFC 9111: HTTP Caching",
      "url": "https://www.rfc-editor.org/rfc/rfc9111.html",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "vary-header-seo-dynamic-serving",
    "server-error-5xx",
    "crawl-budget-when-it-matters"
  ]
}
---

## Definition

An HTTP `304 Not Modified` response tells a requester that the representation it already holds is still current. The response is part of HTTP cache validation. It is not a redirect, because it does not identify a different destination. It is not a replacement page, because it contains no new representation body. It is also not an indexing command or ranking signal. The client is expected to combine the 304 response metadata with the representation stored from an earlier successful request. [@rfc9110] [@rfc9111]

For search crawling, that distinction matters. A server normally sends the full document when the crawler does not possess a validated copy or when the document has changed. A truthful 304 response is appropriate only when the server can establish that the crawler’s validator still describes the current representation. Sending 304 merely because a page is expensive to generate is incorrect. The status code asserts that the old content remains valid, not that the server would prefer to avoid doing work.

## Mechanism {#how-it-works}

The sequence usually begins with `200 OK`. That response includes the page body and may include an `ETag`, a `Last-Modified` value, or both. On a later request, the client can send the known validator through `If-None-Match` or `If-Modified-Since`. The origin or cache compares the request condition with the current resource state. If the condition still matches, it can return 304 without the page body. If the resource changed, it should return the updated representation and a validator that reflects the new state.

Google says its crawlers generally support both conditional headers, although those headers are not sent on every crawl attempt. When Google receives a bodyless 304 for unchanged content, it can reuse the version crawled previously. Google also says accurate conditional responses can save server processing and transfer resources and may indirectly improve crawl efficiency. [@gsc-crawl-errors] Google’s HTTP caching guidance describes the same ETag and modification-date sequence and emphasizes that a 304 response should not include the representation body. [@google-caching]

The validator therefore becomes part of the delivery system’s truth. If a page changes while its ETag remains frozen, a crawler may reuse stale content. If the ETag changes on every request despite identical output, validation cannot eliminate unnecessary downloads. CDNs add another layer because they may normalize, remove, or independently generate validators. Testing only the application origin cannot establish what the public hostname actually serves.

## Examples

A useful test starts with the real production URL, not a development hostname. Request the headers, record any ETag or modification date, then repeat the request conditionally. An unchanged resource should validate with 304. After a material content change, the old validator should no longer produce 304. The response should instead include the current representation and updated validation metadata.

```bash
curl -I https://example.com/page/
curl -I -H 'If-None-Match: "recorded-etag"' https://example.com/page/
```

Several contrasting cases reveal common failures. A page that changes visibly but still returns 304 probably has stale validator logic or an edge cache that did not receive the deployment. A page that is byte-for-byte stable but always returns 200 may lack validators or generate unstable ETags. An origin that validates correctly while the public CDN serves old content indicates a cache-layer problem rather than a Google-specific problem. A localized URL may also require separate tests for each representation because one URL can vary by request context.

The strongest verification records the initial response, the conditional response, the deployed change, and the post-change response. That sequence shows whether the server distinguishes unchanged content from changed content instead of merely producing a desirable status code during one isolated request.

## Boundaries

A 304 response can reduce unnecessary transfer, but it does not guarantee more crawling, faster indexing, better rankings, or a larger crawl allocation. Google controls crawl scheduling, and a truthful validator only affects what happens after a conditional request is made. Crawl efficiency also depends on site scale, response time, internal linking, crawl demand, and the wider health of the host. A small site may receive no meaningful operational benefit even when validation is perfectly implemented.

Framework, reverse-proxy, and CDN behavior can differ. Personalized, authenticated, and locale-adaptive representations require special care because the same URL may legitimately produce different output. The article also cannot determine whether a particular crawler currently holds a usable cached copy. Server logs can show conditional requests and responses, but they do not reveal every downstream indexing decision.

> [!NOTE]
> The defensible objective is not to maximize the number of 304 responses. It is to make them accurate. Unchanged content should validate without a body, while changed content should return the fresh representation. Anything else trades bandwidth savings for uncertainty about which version users and crawlers are actually receiving.
