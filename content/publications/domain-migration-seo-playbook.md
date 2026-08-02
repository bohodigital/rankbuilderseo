---
{
  "slug": "domain-migration-seo-playbook",
  "title": "Domain Migration SEO: Move the Site Without Rebuilding Everything at Once",
  "description": "Plan and execute a domain migration with one-to-one redirects, preserved canonicals, updated internal links, sufficient server capacity, and measurable old-to-new URL transfer.",
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
  "directAnswer": "Treat a domain migration as a controlled URL move, not a simultaneous redesign, CMS replacement, content purge, and analytics reset. Inventory the old site, prepare equivalent new URLs, launch direct permanent redirects, update all internal signals, submit the appropriate Search Console change, and monitor both properties until the old URLs have transferred.",
  "takeaways": [
    "Change as few variables as possible during the domain move so traffic changes remain diagnosable.",
    "Redirect each valuable old URL to the closest relevant new URL rather than funneling everything to the home page.",
    "Update canonicals, hreflang, internal links, sitemaps, verification, analytics, and hosted media before launch.",
    "Keep redirects for at least a year and often indefinitely when old URLs still receive users or links."
  ],
  "claimLimits": [
    "A technically sound migration reduces avoidable losses but cannot guarantee stable rankings, immediate signal transfer, or identical search performance while Google recrawls and reassesses the moved URLs."
  ],
  "citations": [
    {
      "id": "domain-move-google",
      "title": "How to move a site",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "domain-redirects-google",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "domain-change-address-google",
      "title": "Change of Address tool",
      "url": "https://support.google.com/webmasters/answer/9370220",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "url-migration-redirect-mapping",
    "search-console-change-of-address-tool",
    "hosting-cdn-migration-seo",
    "website-maintenance-503-seo"
  ]
}
---

## Preconditions

A domain migration changes the public hostname of existing pages, such as moving from `old-example.com` to `new-example.com`. Google treats the move on a per-URL basis: the old URL must be crawled, its redirect followed, the new URL crawled, and the relationship processed. Google warns that ranking fluctuations are normal while this happens and says a medium-sized site may take several weeks for most pages to move, with larger sites taking longer. [@domain-move-google]

Do not start by writing redirect rules. Start by deciding what is and is not changing.

A migration is easier to diagnose when the move changes only the domain while preserving:

- page purpose
- information architecture
- content
- title and heading logic
- canonical structure
- internal-link relationships
- structured data
- media
- status behavior
- analytics continuity

Google specifically recommends changing one major thing at a time. Combining a domain move with a new CMS, new design, rewritten content, merged categories, and different URL paths creates a compound event in which every traffic change has several possible causes. [@domain-move-google]

Before launch, confirm:

- ownership of the old and new domains
- Search Console verification for all relevant variants
- clean history for the acquired destination domain
- valid TLS certificates
- a complete old-URL inventory
- a reviewed old-to-new mapping
- working new pages
- correct production robots rules
- removal plans for development `noindex` directives
- capacity for increased crawling
- analytics on both sites
- rollback authority and decision criteria

If the move also changes the hosting provider, complete and test the new infrastructure first. If possible, avoid combining the DNS infrastructure move and the public domain change into one opaque cutover.

## Ordered process

1. **Inventory the old site.**

Collect URLs from more than one source:

- XML sitemaps
- CMS exports
- server logs
- analytics
- Search Console landing pages
- internal crawls
- externally linked pages
- image, PDF, video, JavaScript, and CSS URLs
- campaign and profile links
- known legacy paths

A sitemap alone is not a full inventory. It often omits old but linked URLs, media files, parameter variants, and pages that were removed from navigation without being retired.

Classify each URL as:

```text
Move unchanged
Move to a new equivalent
Merge into another page
Retire with no replacement
Investigate
```

Do not leave ambiguous rows for launch day. “Investigate” is a prelaunch state, not a redirect target.

2. **Prepare the new site before exposing the move.**

The new site should return the final intended content and status codes at its production URLs. Transfer images, documents, downloads, and other hosted assets that receive links or search traffic. Configure robots rules for the new hostname and prepare to remove any development-only `noindex` rules. Google advises returning `404` or `410` for old content that will not move and has no relevant replacement. [@domain-move-google]

Check each representative template for:

- `200` on valid pages
- `404` or `410` on nonexistent pages
- self-referencing new-domain canonical
- updated hreflang URLs
- new-domain structured-data URLs
- new-domain internal links
- working forms and downloads
- correct image and asset hosts
- retained Search Console verification
- production analytics
- no staging references

3. **Build the redirect mapping.**

Each valuable old URL should resolve directly to the closest relevant new destination.

Good:

```text
old-example.com/services/technical-seo
→ new-example.com/services/technical-seo
```

Acceptable consolidation:

```text
old-example.com/guides/301
old-example.com/guides/308
→ new-example.com/guides/permanent-redirects
```

Bad:

```text
every old URL
→ new-example.com/
```

Google warns that redirecting many unrelated old URLs to one irrelevant destination can confuse users and may be treated as a soft 404. [@domain-move-google]

Use permanent server-side redirects, preferably `301` or `308`, when the move is intended to last. Google treats permanent redirects as signals that the destination should become canonical. Temporary `302`, `303`, and `307` redirects generally preserve the source URL as the expected search result. [@domain-redirects-google]

4. **Remove redirect chains before launch.**

Every old URL should point to the final new URL in one hop.

Do not preserve historical chains such as:

```text
HTTP old domain
→ HTTPS old domain
→ previous redesign path
→ new domain
→ normalized trailing slash
```

Rewrite the rule so each known old variant reaches the final canonical destination directly. Googlebot can follow multiple hops, but Google recommends keeping chains short and ideally redirecting directly. Chains add latency, consume crawl requests, complicate debugging, and fail more often in browsers, apps, and third-party crawlers. [@domain-move-google]

5. **Update the new site’s own signals.**

Redirects handle old requests. They do not excuse the new site from linking to itself correctly.

Update:

- internal anchors
- canonicals
- hreflang annotations
- structured-data URLs
- image and asset references
- form actions
- pagination
- feeds
- XML sitemaps
- social profiles
- advertising destinations
- email templates
- downloadable documents
- application configuration

A new page that self-canonicalizes to the old domain while redirecting the old URL back to the new page creates a contradictory loop of intent.

6. **Test before public cutover.**

Test at least:

- top landing pages
- highest-linked pages
- every major template
- media URLs
- HTTP and HTTPS variants
- `www` and non-`www` variants
- uppercase and lowercase variants where relevant
- query-string routes
- deleted pages
- merged pages
- deep pages
- robots.txt
- sitemaps
- Search Console verification paths

Automate the mapping test. For each row, record:

```text
Old URL
Expected status
Expected destination
Observed status
Observed destination
Hop count
Final canonical
Final indexability
```

A sample that passes is not evidence that a million-row mapping works.

7. **Launch redirects and new URLs together.**

The final new pages should already be available when old URLs begin redirecting. Avoid an interval where redirects point to pages that return `404`, maintenance HTML, or development `noindex`.

Ensure the new host can handle extra load. Google notes that migration crawling can increase because requests to the old site are redirected to the new site while the new site is also crawled directly. [@domain-move-google]

8. **Use the Change of Address tool when eligible.**

For a domain or subdomain move, use Search Console’s Change of Address tool after the site has moved and redirects are active. Do not use it for HTTP-to-HTTPS moves, path-only moves within the same site, `www` to non-`www` changes, or hosting changes without user-visible URL changes. [@domain-change-address-google]

Verify the old and new domain-level properties under the same Google account. Submit separate moves for relevant old subdomains and variants because the tool does not automatically infer every lower-level property.

9. **Submit and monitor sitemaps.**

Submit the new sitemap. During diagnosis, retaining a saved old-URL sitemap can help show the decline in indexed old URLs while the new sitemap gains indexed URLs, although Google’s current move guide says the old sitemap can be removed after the new one is submitted. [@domain-move-google]

Monitor:

- old and new Search Console properties
- indexing reports
- crawl errors
- impressions and clicks by URL
- server logs on both hosts
- redirect failures
- unexpected `404`, `5xx`, or blocked responses
- canonical selection
- high-value external links
- new-host latency and capacity

10. **Keep the old domain under control.**

Google recommends keeping redirects for at least one year and often as long as possible. Search Console’s Change of Address guidance also recommends retaining control of the old domain for at least a year so another party cannot acquire it and abuse its history. [@domain-move-google] [@domain-change-address-google]

Do not let the old certificate, DNS, hosting route, or redirect service expire while users and crawlers still request old URLs.

## Failure cases

**The migration is also a redesign.** Traffic falls, but no one can distinguish URL-transfer problems from changed content, navigation, rendering, or templates.

**The redirect map is based only on the current sitemap.** Valuable orphaned and externally linked URLs disappear.

**Everything redirects to the homepage.** The move manufactures irrelevant destinations and soft-404-like behavior.

**The new site still references the old domain.** Canonicals, hreflang, images, or internal links keep reinforcing the old URLs.

**Development blocks remain active.** The new site launches with `noindex` or a disallow rule.

**Redirects chain through historical migrations.** Each request takes several hops and accumulates failure points.

**The new infrastructure cannot absorb migration crawling.** Valid pages become slow or return `5xx` responses during the period when Google is trying to process the move.

**The old domain is abandoned too early.** Redirects vanish before old links, bookmarks, documents, and crawlers have stopped using them.

**A Change of Address request substitutes for redirects.** The tool supplements the move; it does not create page-level destinations.

## Completion criteria

The migration is complete operationally when every mapped old URL returns the intended permanent redirect, every new destination returns the expected content and canonical, internal signals use the new domain, and no development blocks remain.

The old property should show declining search and crawl activity while the new property gains impressions, clicks, and indexed URLs. Server logs should show fewer direct content responses from the old domain and successful final responses from the new one. High-value old URLs should no longer terminate in errors, irrelevant pages, or redirect chains.

Keep the old domain and redirect layer active beyond the point when charts look reassuring. A migration is not complete merely because the homepage appears under the new brand. It is complete when the long tail of old URLs has a durable, tested destination.

Continue with [URL Migration Redirect Mapping](/articles/url-migration-redirect-mapping) for the mapping artifact, [Search Console Change of Address](/articles/search-console-change-of-address-tool) for tool eligibility, [Hosting and CDN Migration SEO](/articles/hosting-cdn-migration-seo) for unchanged URLs, and [Website Maintenance 503 SEO](/articles/website-maintenance-503-seo) for short outages during cutover.
