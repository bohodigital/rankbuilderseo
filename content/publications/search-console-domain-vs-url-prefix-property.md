---
{
  "slug": "search-console-domain-vs-url-prefix-property",
  "title": "Search Console Domain Property vs. URL-Prefix Property",
  "description": "Choose the right Search Console property scope for protocols, subdomains, paths, migrations and team access without fragmenting or misreading performance data.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Use a Domain property when you need one view across all protocols and subdomains and can verify by DNS. Use a URL-prefix property when you need an exact protocol, host or path scope, or a non-DNS verification method.",
  "takeaways": [
    "Domain properties include all protocol and subdomain variations beneath the verified domain but cannot be limited to a path.",
    "URL-prefix properties include only the defined protocol, host and optional path.",
    "Domain properties require DNS verification; URL-prefix properties support several verification methods.",
    "Overlapping properties are useful for diagnosis, but their totals should not be added together."
  ],
  "claimLimits": [
    "Property type changes the reporting and permission boundary in Search Console; it does not change how Google crawls, indexes or ranks the site."
  ],
  "citations": [
    {
      "id": "gsc-property-domain",
      "title": "Domain property",
      "url": "https://support.google.com/webmasters/answer/10431861",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "gsc-property-prefix",
      "title": "URL-prefix property",
      "url": "https://support.google.com/webmasters/answer/10432366",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "gsc-property-verify",
      "title": "Verify your site ownership",
      "url": "https://support.google.com/webmasters/answer/9008080",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "gsc-property-performance",
      "title": "Performance report: Dimensions and data groupings",
      "url": "https://support.google.com/webmasters/answer/17011259",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "search-console-site-verification-methods",
    "search-console-users-permissions-owners",
    "search-console-performance-data-limits",
    "search-console-is-not-analytics"
  ]
}
---

## Definition

A Search Console property is the reporting and access boundary through which Google exposes search data and site-management tools. The two main website property types are **Domain properties** and **URL-prefix properties**. They can overlap, but they do not describe the same scope.

A Domain property is defined without a protocol and without a path. A property such as `example.com` includes HTTP and HTTPS plus subdomains such as `www.example.com`, `shop.example.com`, and `m.example.com`. Google’s documentation distinguishes this from a URL-prefix property, which includes a protocol and can include a path. [Domain property](https://support.google.com/webmasters/answer/10431861)[@gsc-property-domain]

A URL-prefix property is defined by the exact prefix entered. `https://www.example.com/` covers URLs beginning with that protocol and host. `https://www.example.com/blog/` covers only that path branch. It does not automatically include HTTP, a non-`www` host, a different subdomain, or sibling paths. [URL-prefix property](https://support.google.com/webmasters/answer/10432366)[@gsc-property-prefix]

The practical choice is therefore not “new property versus old property.” It is **broad DNS-controlled scope versus exact URL-controlled scope**.

## Mechanism

**Domain property scope**

A Domain property aggregates data for the verified domain and its subdomains across protocols. That makes it useful when the organization operates several public hosts or is migrating between protocol and hostname variations.

For `example.com`, the Domain property can include:

- `http://example.com/`
- `https://example.com/`
- `https://www.example.com/`
- `https://shop.example.com/`
- `https://docs.example.com/`

It does not let the owner restrict the property to `/blog/` or another path. Domain properties must be verified through the domain name provider because DNS is the mechanism that proves control of the wider namespace. Google identifies DNS verification as the only verification method for a Domain property. [Verify your site ownership](https://support.google.com/webmasters/answer/9008080)[@gsc-property-verify]

**URL-prefix property scope**

A URL-prefix property includes URLs that begin with the exact entered prefix.

| Property | Included | Excluded |
| --- | --- | --- |
| `https://example.com/` | HTTPS URLs on the bare host | HTTP and `www` |
| `https://www.example.com/` | HTTPS URLs on `www` | Bare host and other subdomains |
| `https://example.com/blog/` | HTTPS URLs under `/blog/` | Homepage and sibling paths |
| `http://example.com/` | HTTP URLs on the bare host | HTTPS |

URL-prefix properties are useful when a team controls a particular host or section, when DNS access is unavailable, or when an operator needs a narrow diagnostic view. They support verification methods such as an HTML file, HTML tag, Google Analytics, Google Tag Manager, and DNS, subject to each method’s requirements. [Verify your site ownership](https://support.google.com/webmasters/answer/9008080)[@gsc-property-verify]

**Reporting follows the property boundary**

A property determines which data and tools are visible to its users. It does not create a new crawling rule. Adding a path-level URL-prefix property does not instruct Google to prioritize that path. Adding a Domain property does not merge or redirect URLs.

Performance data is often credited to a canonical URL. If Google selects a canonical that falls outside a narrow URL-prefix property, the duplicate URL can receive little or no performance credit in that property even when users land on the alternate. Google documents canonical aggregation as a key reason page-level data can appear in another property. [Performance report dimensions and data groupings](https://support.google.com/webmasters/answer/17011259)[@gsc-property-performance]

**Overlapping properties are legitimate**

An organization can keep:

- One Domain property for complete ownership and broad monitoring
- One URL-prefix property for the production HTTPS host
- Additional URL-prefix properties for important subdomains or path teams

This creates multiple views of overlapping events. It does not create independent traffic. Never add the totals of overlapping properties and call the result “sitewide clicks.” That would count the same underlying search activity through multiple reporting windows, a spreadsheet ritual with no redeeming analytical value.

## Examples

**A site with several subdomains**

A company operates the following:

```text
www.example.com
support.example.com
shop.example.com
```

The Domain property `example.com` provides the broadest reporting and ownership boundary. The support team can also receive access to `https://support.example.com/` as a URL-prefix property without receiving the same practical view across the commerce and primary sites.

**A content team responsible only for a directory**

The editorial group manages:

```text
https://example.com/learn/
```

A URL-prefix property for that path can isolate reports and permissions for the section. The owner should still retain a Domain property or host-level property for sitewide governance.

**An HTTP-to-HTTPS migration**

During migration, the URL-prefix properties for HTTP and HTTPS remain separate. A Domain property can show the combined domain scope, while the two prefix properties help compare the old and new protocols. The property selection does not perform the migration; redirects, canonicals, internal links and sitemaps still do that work.

**A `www` consolidation**

The site redirects `https://example.com/` to `https://www.example.com/`. The Domain property includes both hosts. The two URL-prefix properties provide separate diagnostic views. Search performance will generally be credited according to Google’s canonical selection, not necessarily the URL that received the initial request.

**A hosted platform without DNS access**

An operator can edit the homepage but cannot modify DNS. A URL-prefix property verified with an allowed page-based method can be practical. A Domain property remains unavailable until someone with DNS control adds the required record.

## Boundaries

Property type is an administrative and reporting decision. It does not guarantee fuller indexing, faster crawling, higher rankings or more complete query rows. Search Console still applies privacy thresholds, row limits, canonical aggregation and report-specific processing inside either property type.

Use the broadest property the organization can securely govern, then add narrower properties only for a concrete operational reason. A narrow property can hide problems outside its prefix. A broad property can obscure host-specific failures when analysts never filter or compare. The useful architecture is usually one durable Domain property plus deliberately chosen URL-prefix properties, not a property for every folder someone has placed in a quarterly slide deck.

Before changing access, document which teams rely on each property and how ownership is verified. Continue with [Search Console Site Verification Methods](/articles/search-console-site-verification-methods) for token durability, [Search Console Users and Permissions](/articles/search-console-users-permissions-owners) for access design, and [Search Console Performance Data Limits](/articles/search-console-performance-data-limits) before comparing overlapping report totals.
