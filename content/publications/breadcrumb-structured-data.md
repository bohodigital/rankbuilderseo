---
{
  "slug": "breadcrumb-structured-data",
  "title": "Breadcrumb Structured Data: Build and Debug BreadcrumbList",
  "description": "Build BreadcrumbList markup from real navigation, validate ordered ListItem positions and canonical URLs, and diagnose mismatches between visible and structured paths.",
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
  "directAnswer": "Create a BreadcrumbList with at least two ordered ListItem entries that represent a typical visible user path. Keep positions sequential, ancestor URLs canonical and crawlable, and the structured trail consistent with navigation.",
  "takeaways": [
    "Breadcrumb markup should describe meaningful user navigation rather than mechanically mirror URL folders.",
    "Google requires at least two ListItem entries for breadcrumb eligibility.",
    "Linked ancestor items should resolve directly to useful canonical pages.",
    "Multiple breadcrumb trails are appropriate only when the page genuinely belongs to multiple user paths."
  ],
  "claimLimits": [
    "Breadcrumb structured data can clarify hierarchy and rich-result eligibility, but it does not repair weak navigation or guarantee that Google will display the submitted trail."
  ],
  "citations": [
    {
      "id": "sd-breadcrumb-google",
      "title": "Breadcrumb structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-breadcrumb-general",
      "title": "General structured data guidelines",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "organization-structured-data",
    "json-ld-vs-microdata-rdfa",
    "internal-links-vs-xml-sitemaps",
    "crawlable-javascript-links"
  ]
}
---

## Definition

Breadcrumb structured data describes a page’s position within one or more meaningful site paths.

Google uses the `BreadcrumbList` type with ordered `ListItem` entries. Current feature documentation requires at least two list items for eligibility and recommends representing a typical user path rather than mechanically copying the URL structure. The site root and the current page are not always required as list items. [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)[@sd-breadcrumb-google]

A breadcrumb trail can serve three related functions:

- Help users understand where the page sits
- Provide navigational links to broader sections
- Give search systems explicit hierarchy information

The visible breadcrumb and structured data should describe the same practical route.

## Mechanism

A JSON-LD representation can be modeled as:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Technical SEO",
      "item": "https://www.example.com/topics/technical-seo"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Structured Data",
      "item": "https://www.example.com/topics/structured-data"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Breadcrumb Markup"
    }
  ]
}
```

This sample describes the sequence:

```text
Technical SEO
  → Structured Data
    → Breadcrumb Markup
```

**Positions must form an ordered path**

Use integer positions beginning with one and increasing by one.

Avoid:

- Duplicate positions
- Missing middle positions
- Reversed order
- Several unrelated roots in one list
- Position values based on URL depth rather than breadcrumb order

**Names should match the navigational meaning**

A breadcrumb label can be shorter than the page title, but it should accurately identify the destination.

Good:

```text
Home → Technical SEO → Breadcrumb Markup
```

Weak:

```text
Home → Category 8 → Page 417
```

The markup should help explain the page, not merely expose database structure.

**Items should resolve to the intended pages**

For linked ancestors, use absolute canonical URLs that return useful responses.

Check:

- Successful status
- Preferred protocol and hostname
- No redirect chain
- Correct language
- Correct canonical
- Crawlable internal link
- No staging hostname

Google’s documentation allows the final breadcrumb item to omit `item` when it represents the current page. Keep the implementation consistent across the template. [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)[@sd-breadcrumb-google]

**One page can have more than one valid path**

A page about an award-winning science-fiction book could belong to:

```text
Books → Science Fiction → Award Winners
```

and:

```text
Literature → Award Winners
```

Google documents multiple breadcrumb trails as a supported pattern. Use multiple lists only when both paths reflect real user navigation. Do not emit every taxonomy combination the database can generate.

**Structured data should follow visible navigation**

Google’s general quality rules require markup to describe content visible to users and avoid misleading representations. A hidden hierarchy invented only for search is weaker than a useful visible breadcrumb. [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)[@sd-breadcrumb-general]

## Examples

**Article inside a controlled topic**

Visible trail:

```text
Topics → Google Indexing → Crawl Stats
```

Structured trail:

- Topics, position 1
- Google Indexing, position 2
- Crawl Stats, position 3

The article URL does not need to contain `/topics/google-indexing/`. Breadcrumbs express conceptual navigation, not a required URL-folder relationship.

**Product with category and brand paths**

The same shoe could be reached through:

```text
Shoes → Running Shoes → Model X
```

or:

```text
Brands → Example Brand → Model X
```

Both can be valid if the site truly supports both navigational paths. Keep each list internally coherent.

**Breadcrumb shows a redirecting category**

Visible link:

```text
/old-category
```

which redirects to:

```text
/new-category
```

Update the visible link and structured-data item to the final canonical URL. Breadcrumbs should not preserve migration debris as a lifestyle choice.

**Single-item breadcrumb**

A list containing only the current page does not provide a hierarchy and does not meet Google’s documented minimum of two list items. Add a meaningful parent path or omit the feature.

**URL-folder mirroring creates nonsense**

URL:

```text
/store/index.php?id=84&ref=menu
```

A breadcrumb should not become:

```text
Store → index.php → id 84 → ref menu
```

Model the user-facing hierarchy instead.

## Boundaries

Validate with this sequence:

1. Inspect the visible breadcrumb.
2. Confirm that every ancestor link works.
3. Compare labels with the linked page.
4. Verify canonical host and protocol.
5. Check list positions.
6. Confirm at least two list items.
7. Test the live URL in the Rich Results Test.
8. Inspect the rendered page if JavaScript generates the data.
9. Monitor the breadcrumb enhancement report.
10. Recheck after navigation-template changes.

Common failure modes include:

- Markup exists but visible breadcrumbs do not
- Structured path differs from navigation
- Position values repeat
- Item URL is relative, malformed, redirected, or blocked
- Breadcrumb points to staging
- Current page is represented as an unrelated parent
- Every taxonomy path is emitted
- Only one item is present
- Mobile and desktop templates disagree
- JavaScript removes or replaces the object
- A plugin emits a second conflicting list

Breadcrumb markup does not repair poor architecture by itself. The parent pages should remain useful, linked, indexable when intended, and contextually related.

Use [JSON-LD vs. Microdata vs. RDFa](/articles/json-ld-vs-microdata-rdfa) when deciding how to encode the list. Use [Organization Structured Data](/articles/organization-structured-data) for stable entity identifiers and [Internal Links vs. XML Sitemaps](/articles/internal-links-vs-xml-sitemaps) for the distinction between navigation and discovery support.

A reliable breadcrumb implementation begins with an honest user path. The structured object should document that path, not manufacture one after the interface has failed to provide it.
