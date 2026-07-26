---
{
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-26",
  "revisedAt": "2026-07-26",
  "correctionHistory": [],
  "slug": "alternate-page-proper-canonical-tag",
  "title": "Alternate Page With Proper Canonical Tag: Is This an Error?",
  "description": "Learn why Search Console excludes an alternate page when its canonical tag works, how to confirm the selected canonical, and when no repair is needed.",
  "format": "Explainer",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "directAnswer": "“Alternate page with proper canonical tag” usually means Google found a duplicate or near-duplicate URL, recognized the canonical page you indicated, and indexed or evaluated the canonical instead. Confirm that Google selected the intended canonical and that the alternate URL is supposed to remain secondary. If both are true, there is normally nothing to fix.",
  "takeaways": [
    "The alternate URL is excluded because another URL represents the duplicate cluster.",
    "A correct canonical exclusion is usually expected behavior, not lost indexing.",
    "Investigate only when Google selected the wrong page or the two URLs should serve distinct intents."
  ],
  "claimLimits": [
    "A proper canonical signal does not guarantee that the canonical page will rank, and Search Console can show a historical status until Google recrawls the URLs."
  ],
  "relatedContent": [
    "google-chose-different-canonical",
    "duplicate-without-user-selected-canonical",
    "canonical-tags-when-they-work",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page",
    "crawled-currently-not-indexed",
    "shopify-canonical-urls-products-collections-variants"
  ],
  "citations": [
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-canonicalization-overview",
      "title": "What is canonicalization?",
      "url": "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-canonical-methods",
      "title": "Specify a canonical with rel=canonical and other methods",
      "url": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "gsc-url-inspection",
      "title": "URL Inspection Tool",
      "url": "https://support.google.com/webmasters/answer/9012289?hl=en-FM",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    }
  ]
}
---

## Definition

![Row of identical doors along a brick building facade](/media/alternate-page-proper-canonical-tag-hero.jpg "An alternate URL can remain accessible while one representative URL is selected for the duplicate group.")

“Alternate page with proper canonical tag” means Google considers the inspected URL an alternate version of another page and agrees that another URL should represent the group.

Search Console lists the alternate URL as not indexed because Google generally stores and serves the canonical representative instead of every duplicate. Google’s documentation describes this status as a duplicate page that correctly points to the recognized canonical. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

This is often the result you wanted.

Common examples include:

- a tracking URL that canonicals to the clean page;
- a printer-friendly page that canonicals to the main article;
- product parameters that canonicalize to the primary product URL;
- HTTP or hostname variants that resolve toward one preferred version;
- duplicate archive or sorting views that point to a canonical collection.

The important question is not, “Why is this URL excluded?” It is:

> **Did Google select the correct representative, and is the inspected URL genuinely an alternate?**

## Mechanism

Google groups duplicate or highly similar pages into a canonical cluster. It then chooses one representative URL. The canonical is normally the URL used in search results, while alternates remain outside the index as separate entries. [What is canonicalization?](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]

Your site can communicate a preferred representative through several signals:

| Signal | Relative role |
| --- | --- |
| Redirect to the preferred URL | Strong canonical signal |
| `rel="canonical"` pointing to the preferred URL | Strong canonical signal |
| Inclusion of the preferred URL in the sitemap | Weaker supporting signal |
| Internal links to the preferred URL | Sitewide consistency and discovery context |
| Stable, complete content on the preferred URL | Makes the preference easier to defend |

Google says redirects and canonical annotations are strong signals, while sitemap inclusion is weaker. Signals can reinforce one another when they agree. [How to specify a canonical URL with rel=canonical and other methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)[@google-canonical-methods]

A proper alternate page therefore looks like this:

```html
<link rel="canonical" href="https://example.com/preferred-page/">
```

The alternate can still return `200` and remain available to users. It simply tells search systems that another URL is the primary representative.

Use URL Inspection to compare:

- the inspected URL;
- the user-declared canonical;
- Google’s selected canonical;
- the last crawl;
- whether the selected canonical is accessible and indexable.

Google’s selected canonical comes from indexed information. A live test can confirm the current declaration but cannot predict which canonical Google will choose after processing. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]

## Examples

**Expected alternate**

Suppose these URLs show the same product:

```text
https://example.com/shoes/red-runner/
https://example.com/shoes/red-runner/?utm_source=email
```

The tracking URL declares the clean URL as canonical. Internal links and the sitemap also use the clean URL. Search Console labels the tracking version “Alternate page with proper canonical tag.”

That is normal. Do not try to force both URLs into the index.

**Canonical works, but links remain messy**

An alternate can have the correct tag while the site still links to it repeatedly.

| Signal | Current state | Better state |
| --- | --- | --- |
| Canonical tag | Points to preferred page | Keep |
| Sitemap | Lists preferred page | Keep |
| Navigation | Links to parameter URL | Change to preferred page |
| Related articles | Link to alternate URL | Change to preferred page |
| Structured data | Uses alternate URL | Change to preferred page |

The Search Console status is still expected, but cleaning internal links reduces unnecessary crawling and makes site architecture more coherent.

**The URLs should not be duplicates**

Two location pages may share a template but contain different local information, services, evidence, and user tasks. If one page canonicals to the other, Google may correctly treat it as an alternate even though the business intended separate pages.

In that case, the problem is not the Search Console label. The problem is the canonical strategy.

To support separate indexing:

1. Give each page a self-referential canonical.
2. Make each page serve a distinct search intent.
3. Include unique substantive information rather than replacing only a place name.
4. Link to each page in the appropriate context.
5. Include both canonical URLs in the sitemap.
6. Confirm that neither page redirects, blocks crawling, or carries `noindex`.

**Google selected an unexpected canonical**

If URL Inspection shows a different canonical than the tag declares, move to [Google Chose a Different Canonical](/articles/google-chose-different-canonical/). That is a different diagnosis.

The “proper canonical tag” status generally indicates agreement. “Google chose a different canonical than user” indicates disagreement.

**Canonical points to a weak target**

Even if the alternate points where you intended, inspect the target.

The canonical page should:

- return `200`;
- allow crawling;
- allow indexing;
- contain the complete main content;
- avoid another redirect;
- remain stable;
- self-canonicalize where appropriate.

A canonical annotation should not point to a `404`, a redirect chain, a `noindex` page, or a temporary stand-in page.

## Boundaries

Do not attempt to index every alternate URL. Duplicate consolidation is normal and helps prevent several URLs from competing as separate copies.

Do not remove a correct canonical tag merely to make the alternate count turn green. Search Console is reporting a classification, not awarding points for maximizing the number of indexed URLs.

Investigate when:

- the selected canonical is wrong;
- the canonical target is broken or prohibited;
- the alternate and canonical serve different user intents;
- internal links, sitemaps, redirects, and canonicals contradict one another;
- a template canonicalizes many unrelated pages to one URL;
- the status remains after a material canonical change and a later recrawl.

The diagnosis is complete when the inspected URL is genuinely secondary, the selected canonical is the intended representative, and sitewide signals consistently support that URL. When those conditions hold, “Alternate page with proper canonical tag” is evidence that consolidation worked rather than an error requiring repair.
