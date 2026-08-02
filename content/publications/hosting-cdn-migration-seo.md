---
{
  "slug": "hosting-cdn-migration-seo",
  "title": "Hosting and CDN Migration SEO: Change Infrastructure Without Changing URLs",
  "description": "Move a site to a new host or CDN without changing public URLs by testing the new stack, lowering DNS TTL, preserving verification, monitoring both infrastructures, and delaying shutdown.",
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
  "directAnswer": "Copy and test the site on the new infrastructure, confirm Googlebot access, lower DNS TTL in advance, preserve the exact public URLs and metadata, remove temporary crawl blocks, update DNS, monitor traffic on both old and new hosts, and retire the old stack only after its traffic reaches zero.",
  "takeaways": [
    "An infrastructure move with unchanged public URLs does not use Search Console’s Change of Address tool.",
    "DNS propagation creates a period when different users and crawlers may reach different infrastructures.",
    "Firewalls, bot protection, TLS, redirects, headers, and rendering must behave consistently on the new stack.",
    "The old host should remain available until logs show that traffic has fully moved."
  ],
  "claimLimits": [
    "Preserving URLs avoids a page-level address migration, but DNS, network, CDN, cache, security, application, and rendering failures can still affect crawling and search performance."
  ],
  "citations": [
    {
      "id": "hosting-move-google",
      "title": "Changing your hosting",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "hosting-domain-move-google",
      "title": "How to move a site",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "website-maintenance-503-seo",
    "domain-migration-seo-playbook",
    "search-console-change-of-address-tool",
    "url-migration-redirect-mapping"
  ]
}
---

## Preconditions

A hosting or CDN migration changes where requests are served without changing the user-visible URLs.

Examples:

```text
Provider A → Provider B
Single origin → CDN plus origin
Old CDN → new CDN
Physical server → cloud platform
One region → multi-region infrastructure
```

If a page remains `https://example.com/page` before and after the move, there is no old-to-new page URL relationship to communicate. Google’s hosting-move guidance uses a four-part process: prepare the new infrastructure, update DNS, monitor traffic, and shut down the old infrastructure only after users and Googlebot have moved. [@hosting-move-google]

Do not use Search Console’s Change of Address tool for this move. That tool is for eligible domain-level address changes. Do not add page redirects merely because the origin IP changed. [@hosting-domain-move-google]

Before the cutover, document:

- DNS records and TTL values
- current and new origin addresses
- CDN configuration
- TLS certificates
- redirect rules
- response headers
- cache policy
- firewall and bot-management rules
- Search Console verification
- analytics
- robots.txt
- sitemaps
- application dependencies
- media and download behavior
- old and new server logs
- rollback DNS records
- on-call authority

Define what “same site” means in measurable terms. Identical URLs alone are insufficient if the new host returns different content, canonicals, robots directives, cookies, or status codes.

## Ordered process

1. **Copy the application and content.**

Replicate:

- application code
- databases
- uploaded media
- documents
- redirects
- error pages
- scheduled jobs
- environment configuration
- search indexes
- cache rules
- security headers
- structured-data output
- verification files
- analytics tags

For stateful applications, define the final synchronization method. A database copied one week before cutover is not current merely because the theme looks correct.

2. **Create a controlled test route.**

Google recommends testing through an IP-restricted environment or a temporary hostname. A temporary public hostname can help verify browser and crawler access, but it should use `noindex` so the duplicate test copy does not enter search results. [@hosting-move-google]

Do not block only through robots.txt when the test content is public and duplicate. A robots block prevents crawling but does not provide an indexing directive. Use authentication, IP restriction, or crawlable `noindex` according to the test design.

3. **Test the new infrastructure with the production hostname.**

A temporary hostname does not expose every production-host problem. Test the new IP or CDN while sending the real `Host` header and using valid TLS.

Compare old and new responses for:

```text
Status
Redirect chain
Title
Canonical
Robots meta
X-Robots-Tag
Content hash
Structured data
Hreflang
Cache headers
Vary
Compression
Content type
Cookies
Security headers
Response time
```

Test pages, images, forms, PDFs, feeds, API calls, and downloads. Google’s guidance explicitly includes reviewing pages, images, forms, and downloadable files. [@hosting-move-google]

4. **Confirm crawler access.**

Check firewall, web application firewall, rate limiting, CDN bot policy, DNS, and origin rules. Google warns that denial-of-service protections and firewalls can block Googlebot from the new infrastructure. [@hosting-move-google]

Verify crawler identity before granting exemptions. Do not trust a user-agent string alone. The goal is not unlimited crawler access; it is preventing the new stack from accidentally classifying legitimate crawling as an attack.

5. **Preserve Search Console verification.**

Copy the current HTML verification file or retain the relevant meta-tag or analytics-based verification method. A hosting move should not silently revoke the operator’s ability to inspect crawl and indexing behavior.

Confirm verification after cutover rather than discovering its absence during an incident.

6. **Lower DNS TTL in advance.**

Google recommends lowering relevant DNS TTL values to a conservative low period, such as a few hours, at least a week before the move. This helps cached records expire sooner when the destination changes. [@hosting-move-google]

Do not lower the TTL five minutes before cutover and expect resolvers that already cached a multi-day value to forget it.

Record the original TTL so it can be restored after the migration stabilizes.

7. **Plan for dual serving.**

DNS changes do not reach every resolver simultaneously. During propagation, some clients will reach the old stack and others the new one.

Both must serve correct content during the overlap.

For stateful systems, decide how to handle:

- writes
- sessions
- carts
- uploads
- comments
- account changes
- inventory
- webhooks
- background jobs
- cache invalidation

A read-only static site can tolerate dual serving easily. A transactional application may need shared storage, replication, write routing, or a brief controlled maintenance window.

8. **Remove temporary launch blocks.**

Before the DNS change, remove development `noindex`, restrictive robots rules, authentication, test banners, staging canonicals, and temporary host references.

Google specifically warns that temporary crawl and indexing blocks must be removed when the move begins. [@hosting-move-google]

Automate this as a release gate. Humans are exceptionally talented at remembering the entire migration except the one header that removes the site from search.

9. **Update DNS.**

Change the relevant records to point to the new provider or CDN.

Avoid unrelated DNS cleanup during the cutover. Do not rewrite mail, verification, and service records merely because the zone file is already open.

Confirm:

- authoritative nameservers
- A and AAAA records
- CNAME targets
- CDN validation records
- certificate issuance
- IPv4 and IPv6 behavior
- apex and `www`
- regional resolution
- DNSSEC where used

10. **Monitor both sides.**

Google recommends watching logs on old and new servers. As propagation proceeds, traffic should decline on the old infrastructure and increase on the new. [@hosting-move-google]

Monitor:

- request volume
- Googlebot requests
- status distribution
- latency
- application errors
- cache hit ratio
- origin load
- TLS errors
- DNS resolution
- crawler rate
- index coverage
- rendering failures
- blocked requests
- content mismatch

Google notes that crawler activity may briefly drop after a hosting change and then increase over the next few days as its systems learn the new serving conditions. Serious slowdowns and errors can prevent that recovery. [@hosting-move-google]

11. **Use regional DNS checks carefully.**

Public DNS tools can show whether resolvers in different regions have updated. They do not prove that every user reaches the correct application response.

Combine DNS checks with HTTP requests from multiple networks and direct log evidence.

12. **Keep the old infrastructure alive.**

Do not shut down the old host when the operator’s laptop resolves the new address. Check old-host logs and wait until meaningful traffic reaches zero. Google explicitly makes this the shutdown condition. [@hosting-move-google]

Retain a rollback window. If the new provider develops a severe issue, the old stack must still contain sufficiently current data and configuration to serve safely.

13. **Restore ordinary operating values.**

After stabilization:

- restore an appropriate DNS TTL
- remove temporary migration monitoring
- update runbooks
- revoke obsolete provider access
- archive old logs
- preserve rollback evidence
- verify Search Console
- confirm backups
- confirm certificate renewal
- decommission the old host

Do not leave a low TTL indefinitely without purpose. It increases resolver traffic and reduces caching efficiency.

## Failure cases

**The move also changes URLs.** Teams follow an infrastructure-only checklist while paths, protocol, or hostnames actually change.

**The temporary hostname is indexed.** The test environment is public without authentication or `noindex`.

**Only the homepage is compared.** Forms, PDFs, media, APIs, and error routes fail after cutover.

**The new WAF blocks Googlebot.** Browsers work while legitimate crawler traffic receives challenges or denials.

**The TTL is lowered too late.** Cached old records persist throughout the planned migration window.

**The old host is shut down immediately.** Clients with cached DNS reach a dead server.

**State diverges during dual serving.** Orders, uploads, and user changes land on two unsynchronized systems.

**Staging metadata ships to production.** The new host returns staging canonicals or `noindex`.

**IPv6 is forgotten.** Some clients reach a stale or broken AAAA destination.

**The operator misreads a crawl-rate dip as a penalty.** Normal temporary adjustment triggers unnecessary platform changes.

## Completion criteria

The migration is complete when the public URLs remain unchanged, representative old and new responses are equivalent, all major features work, Search Console verification persists, and Googlebot can access the new infrastructure without special content differences.

DNS checks should show the new destination broadly, new-host logs should contain normal user and crawler traffic, and old-host traffic should reach zero before decommissioning. Error rates and latency should remain within defined limits. No temporary block, staging canonical, or test hostname should remain in production output.

Continue with [Website Maintenance 503 SEO](/articles/website-maintenance-503-seo) when a short outage is unavoidable, [Domain Migration SEO](/articles/domain-migration-seo-playbook) when the public hostname changes, and [Search Console Change of Address](/articles/search-console-change-of-address-tool) to understand why unchanged URLs do not use that tool.
