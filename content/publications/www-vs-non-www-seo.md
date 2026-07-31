---
{
  "slug": "www-vs-non-www-seo",
  "title": "WWW vs. Non-WWW for SEO: Choose One Host and Enforce It",
  "description": "Choose a preferred public hostname, serve both variants securely, redirect the alternate host and align internal links, canonicals, sitemaps and structured data.",
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
  "publishedAt": "2026-07-30",
  "revisedAt": "2026-07-30",
  "directAnswer": "Neither www nor non-www has an inherent SEO advantage. Choose the hostname that fits the site's infrastructure, permanently redirect the alternate hostname, cover both with valid certificates, and use the preferred host consistently in links, canonicals, sitemaps and metadata.",
  "takeaways": [
    "WWW and non-WWW are separate hostnames even when they serve the same site.",
    "Both hostname styles can perform normally in search.",
    "The alternate hostname should redirect directly to the preferred hostname.",
    "The Change of Address tool is not used for a www-to-non-www move."
  ],
  "claimLimits": [
    "Hostname choice can affect DNS and infrastructure design, but it does not create a universal ranking advantage for either www or non-www."
  ],
  "citations": [
    {
      "id": "b8-gsc-change-address",
      "title": "Change of Address tool",
      "url": "https://support.google.com/webmasters/answer/9370220?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-30"
    },
    {
      "id": "b8-google-canonical",
      "title": "How to specify a canonical URL with rel=canonical and other methods",
      "url": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
      "publisher": "Google",
      "accessedAt": "2026-07-30"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "http-to-https-seo-migration",
    "trailing-slash-seo",
    "domain-migration-seo",
    "canonical-vs-redirect-vs-noindex"
  ]
}
---

## Definition

![Diagram comparing www and non-www host variants and selecting one preferred host](/media/www-vs-non-www-seo-hero.png "Both host styles can work; the technical requirement is to choose one public form and enforce it consistently.")

These are separate hostnames:

```text
https://www.example.com/
https://example.com/
```
They can serve the same site; different sites; a redirect; an error; or different infrastructure.

Search systems do not receive a mystical certificate stating that the two must be equivalent merely because humans refer to both as “the domain.”

Neither form has an inherent SEO advantage.

The hostname is part of the URL’s origin. DNS, TLS and the web server can therefore make the two forms behave differently even when the page paths look identical. Equivalence must be implemented and tested; it is not inferred from branding.

The choice is primarily architectural: DNS management; cookie scope; CDN configuration; existing links; brand conventions; application routing; subdomain strategy; and historical canonical signals.

Once selected, the site should consistently expose one public form.

## Mechanism

Choose either:

```text
Preferred: https://www.example.com/
Alternate: https://example.com/
```

or:

```text
Preferred: https://example.com/
Alternate: https://www.example.com/
```

Then align these systems.

**DNS**

Both hostnames must resolve to infrastructure capable of producing the intended response.

The alternate host cannot redirect reliably if it does not resolve.

**TLS certificates**

The certificate must cover both hostnames.

A user may request the alternate HTTPS hostname before receiving the redirect. TLS negotiation occurs before the browser can receive an HTTP response.

**Permanent redirect**

Redirect every alternate-host path to the corresponding preferred-host path.

```text
https://example.com/about
    → https://www.example.com/about
```

Do not redirect every alternate-host page to the homepage.

Google describes redirects as strong canonicalization signals and recommends linking internally to the canonical form. [How to specify a canonical URL with rel=canonical and other methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)[@b8-google-canonical]

**Self-canonical**

Preferred-host pages should use absolute self-canonicals:

```html
link rel="canonical" href="https://www.example.com/about"
```

Do not serve a preferred `www` page that canonicalizes to non-`www`.

**Internal links**

Generate only the preferred host in:

- Navigation
- Breadcrumbs
- Article links
- Structured data
- Hreflang
- Open Graph
- Feeds
- Sitemaps
- Downloads
- Forms

Root-relative internal links are also acceptable when the application guarantees the correct preferred host.

**Search Console**

Verify relevant variants for troubleshooting and historical comparison.

Do not use Change of Address for a move between `www` and non-`www`. Google’s current tool documentation excludes that case and instructs sites to use redirects and canonical signals instead. [Change of Address tool](https://support.google.com/webmasters/answer/9370220?hl=en)[@b8-gsc-change-address]

## Examples

**Keep existing `www`**

A mature site already has most links and indexed URLs on:

```text
https://www.example.com/
```

Keeping `www` avoids an unnecessary sitewide URL change.

Configure:

```text
https://example.com/path
    → https://www.example.com/path
```

**Move to non-`www`**

A site standardizes on:

```text
https://example.com/
```

Configure:

```text
https://www.example.com/path
    → https://example.com/path
```

Update all internal and metadata references.

**Both hosts return `200`**

This creates duplicate accessible URLs:

```text
https://example.com/page
https://www.example.com/page
```

A canonical may help consolidate them, but a direct redirect produces a clearer single-host system when the alternate host has no independent purpose.

**Different content on each host**

If the two hosts intentionally serve different sites, do not canonicalize or redirect them merely because their names are related.

Each host needs:

- Distinct purpose
- Accurate canonicals
- Appropriate navigation
- Independent content identity

Document the host decision where DNS, CDN and application owners will find it. The record should name the preferred hostname, all alternate hostnames, certificate coverage, redirect ownership and the systems allowed to generate public URLs. Without that record, a later infrastructure change can quietly restore duplicate `200` responses even though the application’s canonical tags remain correct.

Test the decision from outside the production network and after caches expire. For representative paths, request every HTTP and HTTPS host variant, retain the path and query string, and confirm that each alternate reaches the preferred URL without a loop or intermediate hop. Repeat the check for a missing page and a static asset so catch-all rules do not disguise incorrect behavior. Then search templates, feeds, sitemaps, structured data and outbound notifications for the alternate hostname. This turns “we prefer www” or “we prefer the apex” from a convention into a verifiable routing contract.

Include host normalization in routine monitoring. A small synthetic test can request both variants of several stable paths and alert when the alternate stops redirecting or the preferred host stops serving the expected page. Also review newly created DNS records and CDN aliases before they become public. These controls matter because hostname duplication often returns through infrastructure work long after the original SEO project closes. The lasting outcome is one documented, observable public host, not a one-time redirect that happened to pass on launch day.

## Boundaries

Do not combine a host normalization project with an unrelated domain migration unless the combined mapping has been deliberately tested.

Check HTTP `www`; HTTP non-`www`; HTTPS `www`; HTTPS non-`www`; alternate ports; subdomains; international hosts; mobile hosts; CDN aliases; and preview hostnames.

The ideal result for one page is:

```text
http://example.com/page
http://www.example.com/page
https://example.com/page
        ↓
https://www.example.com/page
```

with no chain.

Use [HTTP to HTTPS SEO Migration](/articles/http-to-https-seo-migration) for protocol cleanup and [Trailing Slash SEO](/articles/trailing-slash-seo) for path normalization.

The important decision is not whether `www` looks modern. It is whether every system agrees on one public hostname.
