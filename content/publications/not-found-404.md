---
{
  "slug": "not-found-404",
  "title": "Not Found 404: When It Is Correct and When It Is a Problem",
  "description": "Decide when a 404 is the correct response, when to use 410 or a redirect, and which broken links or sitemap entries actually need repair.",
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
  "publishedAt": "2026-07-25",
  "revisedAt": "2026-07-25",
  "directAnswer": "A 404 is correct when a page is genuinely gone and has no replacement. Fix 404s caused by broken internal links, sitemap errors, misspelled routes, or moved content with a clear replacement.",
  "takeaways": [
    "Do not treat every reported 404 as an SEO emergency.",
    "Use a permanent redirect only when a relevant replacement exists.",
    "Remove site-controlled links and sitemap entries that keep sending crawlers to missing URLs."
  ],
  "claimLimits": [
    "Returning a correct 404 resolves the resource state; it does not make every historic or external reference disappear immediately."
  ],
  "citations": [
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-http-status-codes",
      "title": "How HTTP status codes affect Google's crawlers",
      "url": "https://developers.google.com/crawling/docs/troubleshooting/http-status-codes",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "google-crawling-errors",
      "title": "Troubleshoot Google Search crawling errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    },
    {
      "id": "gsc-crawl-stats",
      "title": "Crawl Stats report",
      "url": "https://support.google.com/webmasters/answer/9679690?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-25"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "soft-404",
    "page-with-redirect",
    "seo-migration-launch-checklist",
    "internal-links-audit-by-template",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page"
  ]
}
---

## Definition

![Closed construction-site entrance with a barrier gate and warning notices](/media/not-found-404-hero.jpg "A correct 404 closes one missing route while still giving visitors a useful way forward.")

`404 Not Found` means the server did not find a current resource for the requested URL. It is often the correct response. A deleted page with no close replacement should not pretend to exist, and it should not redirect visitors to an irrelevant homepage.

Google says 404 responses are not necessarily problems. Its Page Indexing guidance recommends fixing primarily the missing URLs that the site itself links to or lists in a sitemap. If content moved, redirect to the new location. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

The task is therefore not “eliminate all 404s.” It is “make each important URL tell the truth.”

## Mechanism

Google does not use content returned with ordinary `4xx` responses for indexing. A newly discovered missing URL is not processed as a page, and a previously indexed URL is removed over time. Crawl frequency gradually decreases, although known URLs can still be checked again. [How HTTP status codes affect Google's crawlers](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)[@google-http-status-codes]

Use the resource state to select the response:

| Situation | Response | Reason |
| --- | ---: | --- |
| Page is gone; no relevant replacement | `404` | The resource is not found |
| Page is deliberately and permanently gone | `410` | The resource is gone |
| Page moved to a close replacement | `301` or `308` | Preserve the route to the replacement |
| Page still exists | `200` after repair | Serve the intended content |
| Page is temporarily failing | Diagnose availability | Do not mislabel an outage as deletion |

Google treats ordinary `404` and `410` responses similarly for indexing purposes. `410` can communicate a more explicit resource state to other clients and operators, but it is not a magical “remove instantly” button.

When a route is missing because of a typo, broken template, deployment omission, or bad rewrite, the status is technically honest but operationally wrong. Restore the page or correct the site-controlled reference.

## Examples

**Correct 404**

A discontinued event page has no successor, no useful historical content, and no meaningful external traffic. It returns a branded, helpful `404` page. The sitemap and navigation no longer include it. No redirect is needed.

**Moved article**

`/blog/technical-audit` moved to `/articles/technical-audit`. The old URL has links and a clear one-to-one replacement. Return a permanent redirect and update internal links to the destination.

**Broken internal route**

A card template generates `/products/blue-widget/`, but the real route is `/product/blue-widget/`. Repair the template, not each rendered card. The [template-level internal-links audit](/articles/internal-links-audit-by-template/) is the scalable approach.

**Removed URL still in the sitemap**

The `404` is intentional, but the sitemap keeps asking Google to crawl it. Remove the URL from the sitemap and keep the missing response. Google’s Crawl Stats report notes that 404s may be correct even though broken site-controlled references should be reviewed. [Crawl Stats report](https://support.google.com/webmasters/answer/9679690?hl=en)[@gsc-crawl-stats]

**Custom page with the wrong status**

The page says “not found” but returns `200`. That is a [soft 404](/articles/soft-404/), not a real 404. Configure the server or routing layer to preserve the missing status while rendering the helpful interface.

## Boundaries

Fix a 404 when:

- a current internal link points to it;
- the sitemap lists it;
- a canonical or structured-data URL names it;
- an important page moved to a known replacement;
- the route is misspelled or incorrectly generated;
- a deployment accidentally omitted the content;
- valuable external links point to a page that has a close successor.

Leave the 404 in place when the URL is genuinely gone and no replacement satisfies the same intent. You do not need to redirect random scanner requests, invented paths, or every historical typo.

A helpful custom 404 page should:

- clearly say the requested page was not found;
- preserve the real `404` status;
- use the site’s normal navigation and visual language;
- link to the home page or useful categories;
- avoid claiming that unrelated content is a replacement;
- offer a correction path for a broken site link.

Google recommends a custom missing page that helps people continue while preserving the correct response. [Troubleshoot Google Search crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)[@google-crawling-errors]

Do not redirect every missing URL to the homepage. The homepage rarely answers the original request, and a success response containing irrelevant content can be treated as a soft error. Do not block missing URLs in `robots.txt` either; allowing the crawler to see the missing response provides the relevant resource signal.

**Completion checklist**

- The exact URL’s intended state is documented.
- Gone URLs return `404` or `410`.
- Moved URLs redirect directly to a close replacement.
- The custom missing page preserves the missing status.
- Current internal links no longer point to removed URLs.
- The sitemap contains only intended canonical pages.
- Canonicals and structured data do not name missing URLs.
- Important external-link destinations were reviewed for a real replacement.
- The source and destination are checked separately after any redirect.

Search Console may retain a recent 404 example while Google recrawls and updates its reporting. That is not evidence that the correct response failed. Use the [Page Indexing report](/articles/google-search-console-page-indexing-report/) to distinguish expected exclusions from site-controlled defects, and the [migration checklist](/articles/seo-migration-launch-checklist/) when URL changes happen at scale.
