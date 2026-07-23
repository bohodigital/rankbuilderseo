---
{
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-07-22",
  "revisedAt": "2026-07-22",
  "correctionHistory": [],
  "slug": "google-search-console-url-inspection",
  "title": "How to Use Google Search Console URL Inspection to Diagnose Indexing",
  "description": "Read indexed data, run a live test, inspect rendered output, understand canonical fields, and request indexing without confusing eligibility with inclusion.",
  "directAnswer": "Use URL Inspection to record Google’s indexed data first, then compare it with a live test so you can distinguish stale reports, technical access, canonical selection, and content-selection issues.",
  "takeaways": [
    "Inspect the exact canonical URL and record the indexed result before running a live test.",
    "Use the last reported crawl time to assess whether the indexed inspection data may predate the latest deployment.",
    "Treat a successful live test as technical eligibility, not an indexing certificate."
  ],
  "claimLimits": [
    "URL Inspection reports and live tests are diagnostic evidence, not guarantees that Google will select a URL for the index or rank it for a query."
  ],
  "citations": [
    {
      "id": "google-technical-requirements",
      "title": "Google Search technical requirements",
      "url": "https://developers.google.com/search/docs/essentials/technical",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-url-inspection",
      "title": "URL Inspection Tool",
      "url": "https://support.google.com/webmasters/answer/9012289?hl=en-FM",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-inspect-troubleshoot",
      "title": "Inspect and troubleshoot a single page",
      "url": "https://support.google.com/webmasters/answer/12482179?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-page-indexing",
      "title": "Page indexing report",
      "url": "https://support.google.com/webmasters/answer/7440203?rd=1",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "gsc-missing-page",
      "title": "Why is my page missing from Google Search?",
      "url": "https://support.google.com/webmasters/answer/7474347?hl=en-EN",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-noindex",
      "title": "Block search indexing with noindex",
      "url": "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-canonicalization-overview",
      "title": "What is canonicalization?",
      "url": "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    }
  ],
  "relatedContent": [
    "why-google-isnt-indexing-your-page",
    "crawling-vs-indexing-vs-ranking",
    "technical-seo-baseline",
    "canonical-tags-when-they-work"
  ]
}
---

## Definition

Google Search Console’s URL Inspection tool answers two related but different questions:

1. **What does Google’s indexed system currently know about this URL?**
2. **What happens if Google tests the live URL now?**

Many bad diagnoses come from reading one answer as though it were the other.

The default inspection view is based on Google’s indexed information. The live test fetches the current page. A live test can show that a previous problem is fixed, but it cannot guarantee that the page will be indexed, predict the selected canonical, or reproduce every quality and policy decision.

**Short answer**

For an indexing diagnosis:

1. Inspect the exact intended canonical URL.
2. Record the default indexed verdict and last crawl date.
3. Expand Page indexing and record fetch, crawl, indexing, and canonical fields.
4. Run **Test live URL**.
5. Open **View tested page** and inspect the screenshot, HTML, resources, and response.
6. Compare live data with indexed data.
7. Fix the specific mismatch.
8. Request indexing once after the live page is ready.

Google describes URL Inspection as the tool for seeing indexed information about one URL, testing a live version, viewing rendered output, learning the selected canonical, and requesting indexing. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]

## Inspect the exact URL

Paste the complete URL into the inspection bar at the top of Search Console.

Use the URL form you actually intend to index:

- correct protocol;
- correct hostname;
- exact path;
- canonical trailing slash;
- no analytics parameters;
- no fragment.

If the URL redirects, the source and destination are not interchangeable. Inspect the final destination separately.

## Mechanism

**Read the indexed result first**

The default view reflects information from Google’s indexed systems. It is not a fresh test of the page.

Record:

- overall verdict;
- page indexing status;
- last crawl;
- crawler type;
- crawl allowed?;
- page fetch;
- indexing allowed?;
- user-declared canonical;
- Google-selected canonical;
- referring sitemap, if shown.

The last crawl date matters. If you changed the page after that date, the indexed report cannot yet reflect the change.

**Understand the overall verdict**

**URL is on Google**

This means the URL is eligible to appear based on Google’s indexed information. It is not a guarantee that the page appears for a particular query.

**URL is on Google, but has issues**

The page is indexed, but an enhancement or experience report identified a noncritical problem. Do not confuse a structured-data warning with an indexing failure.

**URL is not on Google**

Expand Page indexing and read the exact reason. The useful diagnosis is in the details, not the red headline.

**Read the Page indexing fields**

**Last crawl**

The `Last crawl` field records Google’s last reported crawl time in the indexed inspection data. It does not by itself prove current index inclusion, current canonical selection, or the result of the latest live fetch.

Use it to answer:

- Did Google see the latest deployment?
- Did the crawl happen before or after the fix?
- Is the report stale relative to the current page?

**Crawl allowed?**

This reports whether robots.txt allowed the crawl used for the indexed result.

If “No”:

- inspect the exact robots rule;
- check the correct hostname;
- check whether production inherited a staging rule;
- remember that robots.txt controls crawling, not reliable deindexing.

**Page fetch**

This reports whether Google successfully fetched the page.

Failures may point to:

- DNS;
- server errors;
- timeouts;
- authentication;
- network problems;
- invalid response behavior.

A successful fetch does not prove that the rendered main content was usable.

**Indexing allowed?**

This reports whether Google found a robots meta rule or HTTP header that prohibited indexing.

Check both:

```html
<meta name="robots" content="noindex">
```

and an HTTP response such as:

```http
X-Robots-Tag: noindex
```

A CDN, hosting platform, reverse proxy, or preview policy can add the header even when the HTML looks clean.

Google must be able to crawl the resource to see a `noindex` directive. Blocking the page in robots.txt can prevent Google from processing that instruction. [Block search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)[@google-noindex]

**User-declared canonical**

This is the canonical preference found on the page or otherwise declared by the site.

Confirm that it:

- uses the intended protocol and hostname;
- points to the intended URL;
- does not point to a redirect;
- is not copied from another template;
- matches the sitemap and internal links.

**Google-selected canonical**

This is the representative URL Google selected for the duplicate cluster.

The live test cannot predict this field. Canonical selection requires indexed processing and comparison with other pages.

If Google selected another URL:

- inspect that URL;
- decide whether consolidation is correct;
- compare content;
- align redirects, internal links, sitemap URLs, and canonical annotations.

Google treats canonical signals as preferences and may select a different representative. [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]

## Run a live test

Click **Test live URL** after recording the indexed result.

The live test fetches the current page and checks whether it appears technically available for indexing.

It can help verify:

- current fetch;
- current robots access;
- current `noindex` state;
- current response;
- rendered page;
- resources and errors.

It does not fully test:

- whether the URL is currently in the index;
- duplicate clustering;
- final canonical selection;
- every quality or spam-policy issue;
- manual actions and every removal condition;
- whether the page will rank.

A green live result means the URL can probably be processed. It is not an indexing certificate.

## Examples

**View the tested page**

After a successful live test, open **View tested page**.

Review four things.

**1. Screenshot**

Does the screenshot show the actual page?

Look for:

- blank main area;
- cookie or login wall;
- mobile layout hiding content;
- loading placeholders;
- generic error template;
- challenge page;
- missing images that carry essential meaning.

**2. HTML**

Search for:

- the H1;
- several distinctive sentences from the main content;
- canonical tag;
- robots meta tag;
- title;
- structured data;
- internal links.

If the visible browser page has an article but tested HTML contains only a generic shell, investigate rendering.

**3. More information and resources**

Look for failed resources required to render the content:

- scripts;
- styles;
- API calls;
- fonts only if their failure breaks readability;
- images only if they carry essential content.

Do not panic over every optional failed request. Focus on failures that change what Google can understand.

**4. HTTP response**

Confirm:

- final status;
- content type;
- robots headers;
- redirect behavior;
- caching or platform headers that change crawler treatment.

**Compare indexed data with live data**

This comparison produces the diagnosis.

| Indexed result | Live result | Interpretation |
|---|---|---|
| `noindex` | Indexing allowed | The live fix exists; Google has not recrawled it yet |
| robots blocked | Crawl allowed | The live robots rule changed after the indexed crawl |
| fetch failed | Fetch succeeds | The earlier failure may have been fixed or transient |
| selected canonical is another URL | Live URL is indexable | No contradiction; live tests do not determine canonical selection |
| crawled, not indexed | Live URL is indexable | Technical eligibility is not the missing decision; examine rendering, duplication, and value |
| URL unknown | Live URL succeeds | Google can fetch it now; strengthen discovery and request indexing once |

**Worked diagnosis**

Suppose the default result says:

- URL is not on Google;
- Excluded by `noindex`;
- last crawl: July 18.

The page was redeployed on July 21.

The live test says:

- crawl allowed;
- fetch successful;
- indexing allowed;
- screenshot contains the full article.

Diagnosis:

1. The indexed result is based on the July 18 version.
2. The July 21 live version no longer has `noindex`.
3. The fix is present.
4. Request indexing once.
5. Wait for Google to recrawl and update its indexed information.

Bad response:

- rewrite the article;
- change the slug;
- resubmit the sitemap every hour;
- add more schema;
- request indexing repeatedly.

Those actions do not address the evidence.

## Boundaries

**Use the Page Indexing report for patterns**

URL Inspection diagnoses one URL. The Page Indexing report helps identify a site-wide or section-wide pattern.

Use the report to answer:

- How many URLs share the status?
- Did the count change after a release?
- Is one template or directory affected?
- Are the excluded URLs intentional duplicates?
- Did a robots or canonical change affect a large section?

Google advises that not every known URL should be indexed. The goal is to get important canonical pages indexed, not to force every parameter, redirect, duplicate, feed, or utility URL into the index. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

**Request indexing carefully**

After fixing the identifiable problem:

1. run a live test;
2. confirm the page can be indexed;
3. verify the rendered content;
4. click **Request indexing**.

Google notes:

- submission does not guarantee indexing;
- a daily limit applies;
- processing can take days or longer;
- sitemaps are preferable for many new or updated URLs.

Request indexing is a notification that the URL is ready for another attempt. It is not an override.

**Diagnostic worksheet**

Record this for every investigated URL:

| Field | Value |
|---|---|
| Exact inspected URL | — |
| Intended canonical URL | — |
| Overall indexed verdict | — |
| Exact indexing reason | — |
| Last crawl | — |
| Crawl allowed? | — |
| Page fetch | — |
| Indexing allowed? | — |
| User-declared canonical | — |
| Google-selected canonical | — |
| Referring sitemap | — |
| Live test verdict | — |
| Live crawl allowed? | — |
| Live indexing allowed? | — |
| Screenshot shows main content? | — |
| Tested HTML contains main content? | — |
| Important failed resources | — |
| Final response status | — |
| Identified fix | — |
| Date indexing requested | — |
| Follow-up date | — |

**Common mistakes**

- inspecting a parameterized or redirecting URL instead of the canonical;
- reading indexed data as a live result;
- treating a live test as proof of inclusion;
- ignoring the last crawl date;
- failing to inspect the rendered screenshot;
- looking only for a meta `noindex` and missing `X-Robots-Tag`;
- assuming the user-declared canonical is the selected canonical;
- using the Page Indexing report’s aggregate data to diagnose one URL;
- requesting indexing before fixing the page;
- interpreting every excluded duplicate as an error.

## Sources

- [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]
- [Inspect and troubleshoot a single page](https://support.google.com/webmasters/answer/12482179?hl=en)[@gsc-inspect-troubleshoot]
- [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]
- [Why is my page missing from Google Search?](https://support.google.com/webmasters/answer/7474347?hl=en-EN)[@gsc-missing-page]
- [Block search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)[@google-noindex]
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]
- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)[@google-technical-requirements]

## Related guides

- [Why Google Isn’t Indexing Your Page](/articles/why-google-isnt-indexing-your-page/)
- [Crawling vs. Indexing vs. Ranking](/articles/crawling-vs-indexing-vs-ranking/)
- [Technical SEO Baseline Checklist](/articles/technical-seo-baseline/)
- [Canonical URL](/glossary/canonical-url/)
- [robots.txt](/glossary/robots-txt/)
