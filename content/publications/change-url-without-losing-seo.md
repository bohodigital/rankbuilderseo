---
{
  "slug": "change-url-without-losing-seo",
  "title": "How to Change a URL Without Losing SEO Signals",
  "description": "Move one page or section by mapping the old URL to a real replacement, using a permanent redirect and updating links, canonicals, sitemaps and metadata.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-30",
  "revisedAt": "2026-07-30",
  "directAnswer": "When a public URL must change, permanently redirect the old address to the closest equivalent new address, update every controllable reference to the new URL, remove contradictory canonical and sitemap signals, and verify both the redirect and the new page.",
  "takeaways": [
    "Change a URL only when the long-term benefit justifies migration work.",
    "Map one old page to its closest useful replacement rather than the homepage.",
    "Update internal links and metadata so the redirect becomes a fallback rather than the site's normal navigation.",
    "Return 404 or 410 when no meaningful replacement exists."
  ],
  "claimLimits": [
    "A technically correct redirect transfers strong signals, but it cannot guarantee identical rankings when the destination, content, intent or surrounding site structure also changes."
  ],
  "citations": [
    {
      "id": "b8-google-site-move",
      "title": "How to move a site",
      "url": "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
      "publisher": "Google",
      "accessedAt": "2026-07-30"
    },
    {
      "id": "b8-google-redirects",
      "title": "Redirects and Google Search",
      "url": "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
      "publisher": "Google",
      "accessedAt": "2026-07-30"
    },
    {
      "id": "b8-google-recrawl",
      "title": "Ask Google to recrawl your URLs",
      "url": "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl",
      "publisher": "Google",
      "accessedAt": "2026-07-30"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "domain-migration-seo",
    "redirect-mapping-site-migration",
    "trailing-slash-seo",
    "page-with-redirect"
  ]
}
---

## Definition

![Diagram showing signals aligned when one page URL changes](/media/change-url-without-losing-seo-hero.png "A changed URL needs one replacement destination and consistent supporting signals.")

Changing a public URL creates a new address.

Even when the visible content remains identical, these are different URLs:

```text
https://www.example.com/old-guide
https://www.example.com/new-guide
```
The old URL may already have:

- Search history
- External links
- Internal links
- Bookmarks
- Analytics records
- Sitemap inclusion
- Canonical signals
- Social shares
- Cached copies

The new URL begins without that exact address history.

A permanent redirect connects the old address to the new one. Google describes permanent server-side redirects as strong signals that the target should become canonical. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)[@b8-google-redirects]

Do not change URLs for cosmetic reasons every time an editor improves a title. Stable addresses are operational assets.

## Mechanism

A controlled URL change aligns six systems:

1. Old URL
2. Redirect
3. New URL
4. Internal links
5. Canonical metadata
6. Sitemap and discovery sources

The preferred state is:

```text
Old URL
  └─ 301 or 308 → New URL
                    ├─ 200 response
                    ├─ Self-canonical
                    ├─ Internal links
                    └─ Sitemap inclusion
```

**Choose a real replacement**

The destination should satisfy substantially the same user need.

Good mapping:

```text
/guides/old-widget-setup
    → /guides/widget-installation
```

Poor mapping:

```text
/guides/old-widget-setup
    → /
```

Google advises against redirecting many unrelated old URLs to one irrelevant destination because the result can confuse users and be treated as a soft 404. [How to move a site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)[@b8-google-site-move]

**Use a permanent server-side redirect**

Use `301` or `308` when the move is intended to remain permanent. [@b8-google-redirects]

The new URL should return its final content directly. Avoid:

```text
Old URL
  → intermediate URL
  → alternate hostname
  → final URL
```

A chain creates extra requests, latency and additional failure points.

**Update controllable references**

Replace the old URL in:

- Navigation
- Body links
- Breadcrumbs
- Related content
- Canonicals
- Structured data
- Hreflang
- XML sitemaps
- Feeds
- Social metadata
- Forms
- Documentation
- Advertising destinations

Internal links should point directly to the new URL rather than relying on the redirect forever.

**Keep the content relationship clear**

A URL change is easiest to process when the destination remains equivalent.

If the page simultaneously changes topic, language, purpose and content, the redirect still routes users, but equivalent ranking behavior should not be assumed.

**Request recrawling proportionately**

For a small number of high-value changed URLs, use URL Inspection after verifying the redirect and destination.

For many changed URLs, submit an accurate sitemap containing the new canonical URLs. Repeatedly requesting the same URL does not make crawling faster. [Ask Google to recrawl your URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)[@b8-google-recrawl]

## Examples

**Rename one article**

Old:

```text
/articles/basic-widget-tips
```

New:

```text
/articles/widget-maintenance-guide
```

Implementation:

- Permanent redirect old to new
- New page returns `200`
- New page self-canonicalizes
- Internal links use new slug
- Sitemap contains new URL
- Old URL removed from sitemap

**Move a section**

Old:

```text
/blog/*
```

New:

```text
/articles/*
```

Do not use one wildcard redirect that blindly preserves every suffix until the mapping has been tested.

Some pages may be:

- Renamed
- Consolidated
- Removed
- Already redirecting
- Missing a replacement

Build a row-level map with [Redirect Mapping for Site Migrations](/articles/redirect-mapping-site-migration).

**Consolidate several pages**

Old:

```text
/guides/widget-cleaning
/guides/widget-storage
/guides/widget-inspection
```

New:

```text
/guides/widget-maintenance
```

Several old pages may redirect to one consolidated guide when the new guide genuinely replaces each one.

The destination should contain the useful substance readers expected from all three sources.

**Remove a page**

When no useful replacement exists:

```text
/obsolete-event-2021 → 410
```

or:

```text
/obsolete-event-2021 → 404
```

Do not send every removed page to a category merely to avoid an error response.

## Boundaries

A redirect is not required when both URLs should remain independent pages.

Use a canonical instead when:

- Both versions must remain accessible
- Their primary content is duplicate or substantially similar
- One should be the preferred search representative

Use a temporary redirect when the alternate destination is genuinely temporary.

Use authentication when the content is private.

Use `noindex` when the page remains public but should not appear in search.

See [Page With Redirect](/articles/page-with-redirect) when Search Console reports the old URL as redirecting. That status is expected when the redirect is intentional.

Check these failure patterns:

- Redirect loop
- Redirect chain
- Redirect to unrelated homepage
- New URL returning `404`
- New URL canonicalizing to old URL
- Old URL still in sitemap
- Internal links still use old URL
- Redirect present only in client-side JavaScript
- Mobile and desktop variants disagree
- Query parameters are dropped incorrectly
- Alternate languages map to the wrong language
- Redirect removed after several weeks

A URL change is complete when the new address owns the content, the old address routes directly to it, and every controllable signal refers to the new address.
