---
{
  "slug": "http-423-locked-seo",
  "title": "HTTP 423 Locked and SEO: The Resource Exists but Cannot Be Changed",
  "description": "Understand HTTP 423 Locked across WebDAV, lock tokens, CMS publishing, file management, public GETs, retries, caches, and Google crawler behavior.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "draft",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "423 Locked means the source or destination resource of the request is locked.",
  "takeaways": [
    "A lock can prevent conflicting changes to documents, CMS records, media files, redirect maps, publishing packages, shared folders, and configuration.",
    "RFC 4918 says a 423 response should contain an appropriate precondition or postcondition code, such as lock-token-submitted or no-conflicting-lock .",
    "A content platform can use 423 when another editor holds the record lock, a migration freezes a content type, a release process locks a redirect map, or a publishing job owns the package."
  ],
  "claimLimits": [
    "RFC 4918 defines WebDAV lock semantics. Non-WebDAV applications can adopt 423, but their lock contracts are application-specific. Google publishes broad 4xx behavior rather than a 423-specific indexing rule."
  ],
  "citations": [
    {
      "id": "rb24-05-source-1",
      "title": "RFC 4918: WebDAV",
      "url": "https://www.rfc-editor.org/rfc/rfc4918",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-05-source-2",
      "title": "HTTP status codes for Google crawlers",
      "url": "https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
      "publisher": "Google Crawling Infrastructure",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "blocked-other-4xx",
    "server-error-5xx",
    "website-maintenance-503-seo"
  ]
}
---

## Definition

**Direct answer.**

`423 Locked` means the source or destination resource of the request is locked.[@rb24-05-source-1]

It originated in WebDAV, where clients can lock resources before modifying them.

```text
DELETE /documents/report.docx
→ 423 Locked
```

The file exists. A lock prevents the operation.

For SEO, the distinction is simple:

```text
423 on a write, move, or delete operation
→ can be correct workflow behavior

423 on an ordinary public GET page
→ usually an availability or routing defect
```

**What a lock protects.**

A lock can prevent conflicting changes to documents, CMS records, media files, redirect maps, publishing packages, shared folders, and configuration.

The server can require a valid lock token before a change succeeds. This is different from authentication. A user can be authorized to edit while lacking the active lock token.

## Mechanism

**WebDAV context.**

RFC 4918 says a 423 response should contain an appropriate precondition or postcondition code, such as `lock-token-submitted` or `no-conflicting-lock`.[@rb24-05-source-1]

A useful response can identify the locked resource, scope, token requirement, expiration, and recovery route. Do not expose confidential user details in a public error body.

**CMS publishing.**

A content platform can use 423 when another editor holds the record lock, a migration freezes a content type, a release process locks a redirect map, or a publishing job owns the package.

The editor interface should preserve the draft and explain the next action. Do not retry the same update automatically until the lock expires. Blind retries add load without changing the precondition.

**Public page retrieval.**

A reader requesting:

```text
GET /guides/canonical-tags/
```

should normally receive 200.

If it returns 423, investigate lock middleware applied to every method, a file lock leaking into delivery, a WebDAV handler intercepting GET, a deployment freeze rule, a storage mount, CDN cache, or a bot-specific security rule.

Public reading should not require an editing lock token.

## Examples

**Google crawling.**

Google says persistent 4xx responses, except 429, are treated as unavailable content. Google does not use the body for indexing, and previously indexed URLs can be removed over time.[@rb24-05-source-2]

There is no public 423-specific exception. If a public page temporarily returns 423 during publishing, restore the stable response quickly. Do not use 423 as a generic maintenance status.

**423 versus 409.**

Use 423 when a lock specifically prevents the operation. Use 409 for a broader conflict with current resource state.

```text
Active WebDAV lock → 423
Slug already belongs to another article → 409
```

**423 versus 412.**

Use 412 when an HTTP precondition such as `If-Match` fails. Use 423 when lock state blocks the action. An edit can encounter both a stale ETag and an active lock. Return the most specific useful response under the client contract.

## Boundaries

**Cache behavior.**

Do not cache 423 as the public page representation. Review CDN error caching, reverse proxies, service workers, API client caches, and regional edges. A lock can expire while a cached error remains.

**Monitoring.**

Track:

```text
METHOD:
RESOURCE:
LOCK_TYPE:
TOKEN_PRESENT:
LOCK_CREATED:
LOCK_EXPIRES:
FINAL_STATUS:
```

Segment expected editing conflicts from public GET failures.

**Recovery checklist.**

- Method confirmed.
- Locked resource identified.
- Lock token checked.
- Expiration checked.
- User draft preserved.
- Public GET tested.
- 409 and 412 distinguished.
- Cache purged.
- Repeated retries bounded.
- Google-facing route restored.
- Lock telemetry monitored.

**Evidence limits.**

RFC 4918 defines WebDAV lock semantics. Non-WebDAV applications can adopt 423, but their lock contracts are application-specific. Google publishes broad 4xx behavior rather than a 423-specific indexing rule.
