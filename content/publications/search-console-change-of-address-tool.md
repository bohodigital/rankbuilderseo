---
{
  "slug": "search-console-change-of-address-tool",
  "title": "Search Console Change of Address: What the Tool Does and Does Not Do",
  "description": "Use Search Console’s Change of Address tool correctly for domain and subdomain moves, understand its 180-day scope, and avoid using it for HTTPS, path, hosting, or www-only changes.",
  "format": "Explainer",
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
  "directAnswer": "Use the Change of Address tool only after a domain or subdomain move is live and permanent redirects are working. It tells Google to emphasize the new property and forward site-move signals for 180 days, but it does not create redirects, map individual pages, move path-only URLs, handle HTTP-to-HTTPS changes, or replace migration monitoring.",
  "takeaways": [
    "The tool is for eligible domain-level or subdomain-level moves, not every URL change.",
    "Both old and new properties must be verified under the same Google account.",
    "Redirects and page-level mappings must exist before the request is submitted.",
    "The tool’s move relationship lasts 180 days, while redirects should remain for at least a year and often longer."
  ],
  "claimLimits": [
    "Submitting a valid Change of Address request helps Google process a move but does not guarantee traffic preservation, immediate indexing, correct page mapping, or recovery from broken redirects and conflicting canonical signals."
  ],
  "citations": [
    {
      "id": "coa-help-google",
      "title": "Change of Address tool",
      "url": "https://support.google.com/webmasters/answer/9370220",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-02"
    },
    {
      "id": "coa-move-google",
      "title": "How to move a site",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-02"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "hosting-cdn-migration-seo",
    "domain-migration-seo-playbook",
    "url-migration-redirect-mapping",
    "website-maintenance-503-seo"
  ]
}
---

## Definition

Search Console’s Change of Address tool is a domain-migration signal. It tells Google that an old domain-level property has moved to a new domain-level location and helps transfer Search signals from the old property to the new one.

Use it after the site move has been implemented and old URLs redirect to their new destinations. Google says the request causes its systems to emphasize crawling and indexing the new site, forward various signals, and prefer the new site when determining canonicals. The relationship remains active for 180 days. [@coa-help-google]

The tool does not perform the migration. It does not:

- configure DNS
- create redirects
- create an old-to-new URL map
- copy content
- remove `noindex`
- update canonicals
- update sitemaps
- rewrite internal links
- preserve analytics
- repair server errors
- guarantee rankings

It supplements a technically complete move.

## Mechanism

**Eligible moves**

Use the tool when moving:

```text
example.com → example.net
shop.example.com → store.example.org
example.com → example.org/new/location/
```

The source property must be at the domain or hostname level rather than a path-level property. The destination may include a path when an entire source site is moving there. [@coa-help-google]

**Moves that do not use the tool**

Do not use it for:

```text
HTTP → HTTPS
www.example.com → example.com
example.com/old-path → example.com/new-path
hosting provider A → hosting provider B with unchanged URLs
CDN changes with unchanged URLs
individual page moves
```

For HTTP-to-HTTPS, Google detects the URL move through redirects and normal site-move signals. For internal path changes, use redirects and updated sitemaps. For unchanged URLs, follow the hosting-move process. [@coa-help-google]

This distinction matters because the tool operates at property scope. It cannot express that only 417 selected pages moved while the rest stayed behind.

**Verification requirements**

The same Google account must be an owner of both the old and new properties. Verify all relevant variants before migration.

For a real-world domain, that may include:

```text
example.com
www.example.com
en.example.com
m.example.com
new-example.net
www.new-example.net
```

The tool does not automatically move all lower-level subdomains beneath a property. Google recommends submitting requests for relevant old subdomains and `www` or non-`www` variants, even when some are not actively used, and ensuring those properties are verified. [@coa-help-google] [@coa-move-google]

**Pre-move checks**

The tool performs checks such as:

- ownership of source and destination
- eligibility of property scope
- presence of redirects on sampled URLs
- apparent destination consistency

Critical failures must be fixed. Noncritical findings may appear as warnings.

Passing the tool’s sample checks does not certify the entire redirect matrix. A homepage redirect can pass while thousands of deep URLs fail. Full mapping validation remains the site owner’s job.

**The 180-day signal window**

After submission, Search Console displays move notifications for 180 days. During that period, Google treats the old and new properties as related for the requested move and directs processing toward the new site. [@coa-help-google]

This does not mean redirects should be removed on day 181. Google’s site-move guide recommends keeping redirects for at least one year, and users may continue following old links indefinitely. [@coa-move-google]

Think of the tool as a time-bounded explicit signal layered on top of durable HTTP behavior.

**Old URLs can remain visible**

The tool does not erase the old site from Google’s index. Old URLs can continue appearing when they remain available or when no equivalent new page exists. Redirects and coherent canonicals reduce old-URL appearances when a replacement exists. [@coa-help-google]

That behavior is rational: a property-level request cannot invent page equivalence. If an old article was not moved, Google may still regard the old URL as the only available source.

**Multiple and chained moves**

Google advises against chained address changes such as:

```text
A → B
then immediately B → C
```

It also advises caution when combining several old sites into one new site. Move sites separately and allow signals to stabilize where practical. [@coa-help-google]

The tool cannot turn an organizational consolidation into a clean page graph when several source domains contain duplicates, conflicts, or unrelated content.

**Cancellation**

A Change of Address request can be canceled during its 180-day period.

Google’s documented cancellation sequence includes:

1. remove old-to-new permanent redirects
2. add permanent redirects from the new site back to the old site
3. cancel the move in the old property
4. repeat for each affected source property

Cancellation is therefore another migration, not an undo button that restores the previous world without routing changes. [@coa-help-google]

## Examples

**Eligible domain move**

A company changes from `oldbrand.com` to `newbrand.com`. Every old canonical page redirects directly to its new equivalent. Both properties are verified.

Submit Change of Address from the old domain after launch. Continue monitoring both properties and keep redirects active well beyond the tool window.

**HTTP to HTTPS**

A site changes:

```text
http://example.com/page
→ https://example.com/page
```

Do not use Change of Address. Configure permanent redirects, update canonicals and internal links, verify both protocol properties when relevant, and monitor the move.

**Path-only redesign**

A documentation site changes:

```text
example.com/docs/v1/page
→ example.com/guides/page
```

Do not use the tool. The property hostname is unchanged. Use page-level redirects and a tested URL mapping.

**Hosting provider move**

The visible URLs remain identical, but DNS points to a new infrastructure provider.

Do not use Change of Address. Prepare the new host, lower DNS TTL in advance, move traffic, and monitor both old and new servers.

**Several subdomains move**

The old estate includes:

```text
www.old.com
shop.old.com
fr.old.com
```

The move is not fully described by one casual request from `old.com`. Verify the relevant properties and submit eligible moves for the actual source hosts according to Search Console’s requirements.

**One domain absorbed into a section**

An entire microsite at `campaign.example` moves into `main.example/archive/campaign/`.

This can qualify because a domain-level source is moving to a path within another domain. The underlying page redirects and mappings still must be correct.

## Boundaries

Change of Address is a Google Search tool. Other search engines, browsers, users, link checkers, applications, and bookmarks rely on HTTP redirects and updated links.

The tool does not make a bad migration good. Irrelevant redirects, blocked destination pages, conflicting canonicals, missing content, and server errors remain bad after a successful submission.

Do not submit the request before redirects are active. Do not submit it merely because the new domain has been purchased. Do not assume one request covers all subdomains. Do not remove redirects when the 180-day notification disappears.

The correct model is:

```text
Mapping + redirects + updated site signals + verification + Change of Address + monitoring
```

The tool is one term in that expression, not the expression itself.

Continue with [Hosting and CDN Migration SEO](/articles/hosting-cdn-migration-seo) for unchanged URLs, [Domain Migration SEO](/articles/domain-migration-seo-playbook) for the full move, and [URL Migration Redirect Mapping](/articles/url-migration-redirect-mapping) for page-level equivalence.
