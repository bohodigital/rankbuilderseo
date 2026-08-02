---
{
  "slug": "url-migration-redirect-mapping",
  "title": "URL Migration Redirect Mapping: Build a Testable One-to-One Matrix",
  "description": "Build a migration redirect matrix from sitemaps, logs, analytics, CMS exports, and link data, then test relevance, hop count, final status, canonical, and indexability.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Create a row-level mapping from every meaningful old URL to a final relevant destination or explicit retirement state. Derive the inventory from several sources, normalize variants without destroying evidence, review mappings by page intent, and test the entire matrix for status, destination, hop count, canonical, and indexability before and after launch.",
  "takeaways": [
    "A redirect matrix is both a migration plan and an executable acceptance-test dataset.",
    "Old URLs must be collected from logs, analytics, CMS data, sitemaps, crawls, links, and media inventories rather than one source.",
    "Permanent redirects should point directly to final relevant destinations, not intermediate URLs or a universal homepage.",
    "Deleted pages without a relevant replacement should return 404 or 410 instead of being forced into an unrelated mapping."
  ],
  "claimLimits": [
    "A complete mapping cannot preserve traffic for content that has no meaningful successor, nor can it guarantee how quickly search systems process redirects or choose new canonical URLs."
  ],
  "citations": [
    {
      "id": "mapping-move-google",
      "title": "How to move a site",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "mapping-redirects-google",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "mapping-http-rfc",
      "title": "RFC 9110: HTTP Semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
      "publisher": "RFC Editor / IETF",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "search-console-change-of-address-tool",
    "domain-migration-seo-playbook",
    "hosting-cdn-migration-seo",
    "website-maintenance-503-seo"
  ]
}
---

## Preconditions

A redirect matrix records what should happen to every old URL when a site changes domains, paths, platforms, or information architecture.

The minimum useful row is:

```text
Old URL → intended final state
```

A production-grade row should usually include:

```text
Old URL
Source of discovery
Page type
Historical status
Traffic or priority
Inbound-link evidence
New URL or retirement state
Redirect class
Expected status
Observed first status
Observed final URL
Hop count
Final status
Final canonical
Final robots state
Owner
Review status
Notes
```

Google recommends preparing a URL mapping before a move, starting with important URLs from sitemaps, logs, analytics, Search Console link data, and the CMS, while also including hosted images, videos, JavaScript, CSS, and downloads. [@mapping-move-google]

Do not normalize the evidence so aggressively that distinct old URLs disappear. The following may represent different historical resources:

```text
/page
/page/
/Page
/page?print=1
/page?id=17
/http://example.com/page
/https://www.example.com/page
```

They may ultimately share one destination, but they should remain separate input rows until their behavior is understood.

Before mapping begins, define the allowed terminal states:

```text
Permanent redirect to relevant replacement
Permanent redirect to consolidated replacement
Retire with 404
Retire with 410
Remain unchanged
Temporary redirect
Manual investigation
```

“Homepage” is not a terminal class. It is a destination that must independently pass the relevance test.

## Ordered process

1. **Assemble the old-URL inventory.**

Combine:

- every submitted sitemap
- CMS and database exports
- internal crawl results
- server access logs
- analytics landing pages
- Search Console pages and link reports
- backlink exports
- paid campaign URLs
- profile and directory URLs
- media and download paths
- feeds and API routes used publicly
- archived route lists from prior migrations
- customer support documents
- browser bookmarks or app deep links where available

Record the source for each URL. A URL found in logs and external-link data deserves different review priority from a URL generated only by an obsolete crawler trap.

2. **Capture the current behavior.**

Before changing anything, request each old URL and store:

```text
Status
Location header
Final destination
Hop count
Canonical
Robots directive
Content fingerprint
Title
```

This baseline reveals existing redirects and errors that would otherwise be mistaken for migration defects.

A previous path may already redirect:

```text
/old-a → /old-b → /current-c
```

The new rule should usually send `/old-a`, `/old-b`, and `/current-c` directly to the final new-domain URL.

3. **Normalize for analysis, not deletion.**

Create normalized helper fields:

- lowercase hostname
- standardized scheme
- decoded or encoded path
- trailing-slash class
- parameter names
- fragment removed
- content identifier
- template family

Keep the original raw URL. Normalization supports grouping; it should not erase the ability to configure a redirect for the exact request users still make.

4. **Match by page purpose.**

Use the closest relevant destination.

A mapping decision should compare:

- subject
- user intent
- product or entity identity
- language
- region
- transaction state
- content depth
- replacement availability
- legal or historical continuity

A retired product may map to a successor model when the page clearly explains the relationship. It should not map to the store homepage merely because both belong to the same company.

Google says redirects are useful for moved or merged content but warns against redirecting many old URLs to one irrelevant destination. [@mapping-move-google] [@mapping-redirects-google]

5. **Separate exact moves from consolidations.**

Mark:

```text
Exact equivalent
Near equivalent
Consolidation
No replacement
```

Exact equivalents can usually be approved programmatically after template and identifier checks.

Near equivalents and consolidations need editorial review. The destination should satisfy the old intent and ideally explain what changed.

No-replacement pages should return `404` or `410`. Forcing them into weak destinations damages users, pollutes metrics, and can produce soft 404 classifications.

6. **Choose the correct redirect class.**

For a permanent move, use a server-side `301` or `308` where possible. Google treats permanent redirects as canonicalization signals. Temporary `302`, `303`, and `307` redirects indicate that the source may return and generally do not tell Google to replace it with the target as canonical. [@mapping-redirects-google]

HTTP semantics distinguish method handling. RFC 9110 defines `307` and `308` as method-preserving redirects, while historical handling of `301` and `302` may allow a POST to be changed to GET. [@mapping-http-rfc]

For ordinary GET-based page migrations, `301` is widely supported and appropriate. For endpoints where preserving the request method matters, application engineers should select status behavior deliberately rather than treating all 3xx responses as interchangeable.

7. **Generate rules from the matrix.**

Where the mapping follows a safe, exact pattern, generate rules:

```text
old host + unchanged path
→ new host + unchanged path
```

Where paths changed irregularly, use explicit rows.

Do not let a broad wildcard rule override exceptions. Apply specific rules before general patterns and include automated tests for precedence.

8. **Test the prelaunch candidate.**

Against the new configuration, verify every row:

```text
Observed first status = expected redirect status
Observed final URL = mapped destination
Hop count = 1 where possible
Final status = 200 for live replacements
Final canonical = final URL
Final robots = indexable when intended
No loop
No unexpected hostname
No staging domain
No authentication wall
```

For retirement rows:

```text
Final status = 404 or 410
No redirect to irrelevant page
Custom error page still returns error status
```

9. **Run semantic spot checks.**

Automated URL equality cannot determine relevance. Review samples by:

- highest traffic
- strongest external links
- revenue
- major template
- consolidation group
- language and region
- media type
- historical errors
- wildcard rule
- retirement state

Open the old archived content beside the new destination. Ask whether a user following the old link would regard the result as a continuation rather than a bait-and-switch.

10. **Launch the matrix as a versioned artifact.**

Store:

- version
- generation time
- source exports
- reviewer
- rule build
- test results
- exceptions
- checksum
- rollback version

The mapping is not a disposable spreadsheet. It is the migration’s routing specification and should survive staff turnover, platform changes, and later audits.

11. **Retest production continuously.**

Immediately after launch, test the full matrix again. Then retest:

- after configuration changes
- after CDN changes
- after CMS updates
- after certificate or hostname changes
- after old-host decommissioning
- after new redirects are added

Monitor logs for unmapped old URLs. Append discovered URLs to the matrix and route them according to the same review policy.

12. **Update links so redirects become a compatibility layer.**

Change internal links, high-volume external links, advertising destinations, profiles, feeds, and documents to use the final URLs.

Redirects should preserve old references. The current site should not route its own users through the old host on every click.

## Failure cases

**The sitemap is treated as the complete inventory.** Orphaned, linked, and historical URLs are missed.

**Normalization destroys distinct inputs.** Case, scheme, parameters, and trailing-slash variants vanish before rules are created.

**Automated keyword matching chooses destinations.** Similar words conceal different user intent.

**Every retired page maps to a category or homepage.** No-replacement content is forced into irrelevant destinations.

**The matrix contains intermediate URLs.** New rules preserve old redirect chains.

**Testing checks only the first status.** A `301` can still lead to a `404`, `noindex`, wrong canonical, or staging page.

**A wildcard shadows specific rules.** High-value exceptions are captured by a broad pattern.

**The spreadsheet is edited after rules are deployed.** The planning artifact and production behavior diverge.

**Method-sensitive endpoints use an arbitrary redirect.** POST, upload, or API behavior changes unexpectedly.

**No one monitors unmapped requests.** Long-tail old URLs continue failing after launch.

## Completion criteria

The matrix is complete when every known old URL has an approved destination or explicit retirement state, no unresolved rows remain, and the production rules are generated or reviewed against the same versioned dataset.

Every live mapping should reach its final relevant URL without loops and preferably in one hop. Final pages should return successful responses, self-canonicalize correctly, and remain indexable when intended. Retired URLs should return accurate `404` or `410` responses.

The matrix should be reproducible from stored source inventories and should function as an automated regression suite. New old-URL requests discovered in logs should enter the same process rather than being patched with improvised homepage redirects at three in the morning, the traditional hour of infrastructure folklore.

Continue with [Search Console Change of Address](/articles/search-console-change-of-address-tool) after domain redirects are active and [Domain Migration SEO](/articles/domain-migration-seo-playbook) for the full launch sequence.
