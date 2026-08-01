---
{
  "slug": "meta-description-not-used",
  "title": "Meta Description Not Used: How Google Builds Search Snippets",
  "description": "Why Google may replace a meta description, how query-specific snippets are generated, and when snippet-control directives help or cause collateral damage.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Google primarily builds snippets from page content and may use the meta description when it better summarizes the page for a particular query. A different snippet is not necessarily an error; improve page-specific descriptions, visible answer passages, and snippet controls rather than trying to force one universal description.",
  "takeaways": [
    "Meta descriptions are candidate summaries, not guaranteed verbatim snippets.",
    "Google can show different snippets for different searches because it emphasizes query-relevant page text.",
    "Unique, accurate descriptions remain useful, especially for important or database-driven pages.",
    "nosnippet, max-snippet, and data-nosnippet control eligibility or extraction but can reduce useful search presentation."
  ],
  "claimLimits": [
    "A well-written meta description can influence search presentation and click decisions, but it does not directly guarantee ranking, display, length, or query-specific wording."
  ],
  "citations": [
    {
      "id": "snippet-google",
      "title": "Control your snippets in search results",
      "url": "https://developers.google.com/search/docs/appearance/snippet",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "snippet-robots",
      "title": "Robots meta tag, data-nosnippet, and X-Robots-Tag specifications",
      "url": "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-search-site-name",
    "google-title-link-rewrites",
    "google-sitelinks-how-they-work"
  ]
}
---

## Definition

A search snippet is the description or summary shown beneath a result’s title link. It is not synonymous with the page’s meta description.

Google says snippets are created automatically and primarily from page content. The system may use the meta description when that element provides a more accurate summary for the particular result. Because snippets are designed to emphasize content relevant to a user’s query, the same page can legitimately show different summaries for different searches. [@snippet-google]

The meta description remains important because it provides a concise candidate summary that is under the publisher’s control. It is simply not a command requiring Google to display the exact string.

That makes the useful question different from “Why did Google ignore my description?” The better question is “Which page text better matched this query, and does the result accurately represent the page?”

## Mechanism

Google’s snippet system evaluates the page in the context of the query.

If a user searches for a narrow issue addressed in the third section of a long guide, a passage from that section may be more useful than the general meta description. If the description is generic, duplicated, keyword-stuffed, stale, or inconsistent with the page, visible content becomes the stronger candidate.

A strong meta description should be:

- Specific to the page
- Accurate
- Human-readable
- Informative without pretending to be a ranking field
- Consistent with visible content
- Distinct from template boilerplate
- Generated from reliable page data when manual writing is impractical

Google explicitly supports programmatic descriptions for large database-driven sites when the generated output is readable, diverse, and based on page-specific information. Long keyword strings are less useful and less likely to be selected. [@snippet-google]

There is no fixed maximum length for the meta description element. Search-result snippets are truncated as needed for the device and presentation. Writing to an imaginary universal character count can produce incomplete summaries on one page and wasted generic text on another.

**Snippet controls**

Google supports several serving controls:

- `nosnippet` prevents a text snippet and video preview.
- `max-snippet:[number]` limits the maximum characters Google may use.
- `data-nosnippet` prevents text inside eligible `span`, `div`, or `section` elements from being used in snippets.
- `max-image-preview` and `max-video-preview` separately control preview sizes or durations.

These controls apply only when Google can crawl and read them. Conflicting rules resolve toward the more restrictive result. Google’s current documentation also states that `nosnippet` prevents page content from being used as a direct input for AI Overviews and AI Mode, while `max-snippet` limits the amount that may be used, subject to separately granted permissions. [@snippet-robots]

The diagnostic workflow is:

1. Capture the query and displayed snippet.
2. Compare it with the meta description.
3. Find the source passage on the page.
4. Decide whether that passage better answers the query.
5. Check for duplicate or stale descriptions across the template.
6. Confirm the page is crawlable and the indexed version is current.
7. Review snippet-control directives.
8. Improve the page and description only where the current result is inaccurate or unhelpful.

## Examples

**Generic article description**

Meta description:

```text
Read our latest helpful article from Example Company.
```

Page content contains a direct answer about migrating a domain. Google selects the direct answer. The repair is to write a page-specific summary, not to hide the useful passage.

**Large product catalog**

Manually writing ten million descriptions is unrealistic. Generate descriptions from verified fields such as product name, manufacturer, core specification, price state, and availability, while preventing empty or repeated output. The visible page and description must draw from the same source of truth.

**Navigation text appears in snippets**

A cookie banner, account notice, or repetitive shipping block appears frequently. Use better page structure first. When the text must remain visible but should not be extracted, wrap the eligible region in a valid `data-nosnippet` element. Google warns that extraction may occur before or after rendering, so do not depend on JavaScript that toggles the attribute late. [@snippet-robots]

**Description changes by query**

For a broad query, Google may use the meta description. For a narrow query, it may use the paragraph containing the exact concept. Both can be correct. Measure click and impression behavior by query rather than treating variation as corruption.

## Boundaries

A meta description is not a hidden ranking paragraph. Repeating keywords, location lists, or every product feature does not create a ranking advantage and can produce a poor result summary.

`nosnippet` is a blunt restriction. It can remove useful context that helps users decide whether to click. `max-snippet` can also constrain AI and search presentation. Apply these controls because of a documented content-sharing policy, not because one dynamically generated snippet annoyed someone in a screenshot review.

Do not hide misleading page content from snippets while leaving it visible to users. `data-nosnippet` is a presentation control, not a license to create contradictory summaries.

Use [Google Rewrote Your Title Link](/articles/google-title-link-rewrites) for the clickable result title and [Google Site Name Wrong or Missing](/articles/google-search-site-name) for the source label. A good snippet strategy gives Google accurate visible passages and one strong candidate description, then accepts that query-specific selection is part of the system rather than a personal insult from a search engine.
