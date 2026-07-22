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
  "slug": "why-google-isnt-indexing-your-page",
  "title": "Why Google Isn’t Indexing Your Page: A Complete Diagnostic Flow",
  "description": "Diagnose why a page is missing from Google by checking discovery, crawling, indexability, canonicalization, rendering, and content selection in the correct order.",
  "directAnswer": "Diagnose a missing page by identifying the exact stage where it stopped progressing: discovery, crawling, indexability, canonical selection, rendering, or content selection.",
  "takeaways": [
    "Inspect the exact canonical URL before drawing conclusions from a query or site search.",
    "Compare Google’s indexed information with a live test before changing the page.",
    "Treat sitemaps, canonicals, internal links, and indexing requests as signals, not commands."
  ],
  "claimLimits": [
    "Meeting Google’s technical requirements makes a page eligible for indexing; it does not guarantee indexing or rankings for any query."
  ],
  "citations": [
    {
      "id": "google-how-search-works",
      "title": "In-depth guide to how Google Search works",
      "url": "https://developers.google.com/search/docs/fundamentals/how-search-works",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
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
    },
    {
      "id": "google-links",
      "title": "Link best practices for Google",
      "url": "https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-crawl-budget",
      "title": "Optimize your crawl budget",
      "url": "https://developers.google.com/crawling/docs/crawl-budget",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-canonical-methods",
      "title": "Specify a canonical with rel=canonical and other methods",
      "url": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    },
    {
      "id": "google-sitemap",
      "title": "Build and submit a sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google",
      "accessedAt": "2026-07-22"
    }
  ],
  "relatedContent": [
    "crawling-vs-indexing-vs-ranking",
    "google-search-console-url-inspection",
    "technical-seo-baseline",
    "canonical-tags-when-they-work"
  ]
}
---

## Definition

A missing page does not have one universal “indexing problem.” The failure can happen before Google discovers the URL, while Google tries to fetch it, when Google evaluates whether indexing is allowed, during canonical selection, or after Google has processed the page and chosen not to retain that URL in the index.

The useful question is not merely, “Why is this page not indexed?” It is:

> **At which stage did this URL stop progressing, and what evidence identifies that stage?**

Start with the exact URL in Google Search Console’s URL Inspection tool. Compare Google’s indexed information with a live test, then move through the checks below in order. Do not begin by randomly rewriting the article, resubmitting it every morning, or installing another SEO plugin. Those actions may change the page without identifying the actual failure.

**Short answer**

Use this diagnostic order:

1. Confirm that the exact URL is actually missing.
2. Check whether the page is new or the Search Console report is stale.
3. Inspect Google’s indexed version of the URL.
4. Run a live test and inspect the rendered page.
5. Confirm that the URL returns a usable `200` response and does not require authentication.
6. Check robots controls and `noindex`.
7. Compare the declared canonical with Google’s selected canonical.
8. Verify crawlable internal links and sitemap inclusion.
9. If Google crawled the page but did not index it, evaluate duplication, distinct value, rendering, and site-wide patterns.
10. Request indexing only after the evidence shows the page is ready.

Google’s minimum technical requirements are modest: Googlebot must not be blocked, the page must work with an HTTP `200` response, and the page must contain indexable content. Meeting those requirements makes a page eligible for indexing; it does not guarantee that Google will index it. [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)[@google-technical-requirements]

**First: make sure the page is actually missing**

People often mix up three different observations:

- The page does not rank for the keyword they expected.
- A `site:` search does not show the page.
- Search Console says the exact URL is not indexed.

Only the third is a direct diagnosis of the URL’s index status.

A page can be indexed and still appear nowhere near the first page for a particular query. Google also warns that the `site:` operator does not necessarily return every indexed URL. Use URL Inspection for the exact page rather than treating a casual search as an index database. [Inspect and troubleshoot a single page](https://support.google.com/webmasters/answer/12482179?hl=en)[@gsc-inspect-troubleshoot]

Check the complete canonical-looking URL, including:

- `https` rather than `http`
- the intended hostname
- the exact path
- the intended trailing-slash form
- no tracking parameters
- no fragment

If `/guide`, `/guide/`, and `/guide?source=email` resolve differently, inspecting the wrong form can produce a technically correct but practically useless answer.

## Mechanism

**The indexing pipeline**

Google describes Search as three broad stages:

1. **Crawling:** Google discovers and fetches a page.
2. **Indexing:** Google processes the page, evaluates its content and metadata, groups duplicates, and selects a canonical representative.
3. **Serving search results:** Google chooses indexed material that appears relevant and useful for a particular query.

Discovery and rendering fit inside that broader process. A URL can be known but not yet crawled. A page can be fetched but render badly. A crawled document can be excluded as a duplicate. An indexed page can fail to rank for the query you care about.

See [Crawling vs. Indexing vs. Ranking](/articles/crawling-vs-indexing-vs-ranking/) for the full distinction.

![Flowchart for diagnosing a page missing from Google: verify the exact URL, inspect indexed data, run a live test, check HTTP access, robots and noindex, compare canonicals, verify internal links and sitemap, then evaluate rendering, duplication, and distinct value.](/media/indexing-diagnostic-flow.svg "Indexing diagnosis follows the pipeline. Confirm the URL, compare indexed and live data, verify access and directives, review canonical selection and discovery, then evaluate why a crawled page was not selected.")

**Diagnostic flow**

**Step 1: Is the page new?**

Google says new or updated pages can take time to be indexed and recommends allowing at least a week after submitting a sitemap or indexing request before assuming that something is wrong. That is a guideline, not a deadline or guarantee. [Why is my page missing from Google Search?](https://support.google.com/webmasters/answer/7474347?hl=en-EN)[@gsc-missing-page]

For a new page:

- confirm it is linked from an already crawlable page;
- confirm it appears in the generated sitemap;
- confirm the sitemap has been submitted or is discoverable;
- inspect the URL once;
- request indexing once if the live test succeeds;
- then allow the system time to process it.

A new page remaining absent for a few hours is not diagnostic evidence. A whole new section remaining absent while older pages are crawled normally is more meaningful.

**Step 2: What does URL Inspection say about Google’s indexed version?**

The default URL Inspection view reports what Google knows from its indexed systems. It is not a live fetch of the page currently on your server.

Record these fields:

- Page indexing verdict
- Last crawl
- Page fetch
- Crawl allowed?
- Indexing allowed?
- User-declared canonical
- Google-selected canonical
- Referring sitemap, when shown

Then record the exact stated reason, not your paraphrase of it.

A status such as “Blocked by robots.txt,” “Excluded by noindex,” “Duplicate without user-selected canonical,” “Crawled – currently not indexed,” or “Discovered – currently not indexed” identifies different stages and requires different evidence.

The Page Indexing report is useful for patterns across the site. URL Inspection is the better instrument for one exact URL. [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]

**Step 3: Does the live page pass a live test?**

Run **Test live URL** and compare the result with the indexed data.

The live test helps answer:

- Can Google fetch the current page?
- Is crawling currently allowed?
- Is indexing currently allowed?
- What HTML did Google receive?
- What did the rendered screenshot show?
- Which resources failed to load?

The live test does **not** prove that the URL is indexed, does not predict Google’s final canonical choice, and does not evaluate every quality, policy, or duplication issue. A positive live test means the current URL appears technically eligible for processing, not that Google has selected it for the index. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]

If the indexed result shows an old problem but the live test passes, your fix may simply not have been recrawled yet. If both the indexed result and live test show the same failure, fix that failure before requesting indexing.

**Step 4: Does the exact URL return a useful `200` response?**

Google’s technical requirements say a page intended for indexing should work and return HTTP `200 (success)`. A redirect, client error, server error, authentication screen, or soft error page is not the same thing as an indexable article.

Check:

- final HTTP status;
- redirect chain;
- response body;
- whether the response changes by user agent;
- whether the page is publicly accessible in a private browser window;
- whether the requested URL silently lands on a generic homepage or error template.

Common failures include:

- `301` or `302` redirecting to a different URL;
- `404` or `410`;
- intermittent `5xx` responses;
- a `200` response containing “not found” or almost no page-specific content;
- a login or challenge page;
- a JavaScript shell whose main content fails to render.

If the page redirects, inspect the final destination separately. Do not diagnose the redirecting source as though it were the page you expect Google to index.

**Step 5: Is crawling blocked?**

A `robots.txt` rule controls fetching. It does not provide a reliable instruction to remove a URL from the index.

Check the rule that applies to Googlebot and the exact path. Watch for:

- a broad `Disallow: /`;
- a section-level rule;
- wildcard rules that match more URLs than intended;
- staging rules copied into production;
- CDN or platform-generated robots responses;
- different robots files on different hostnames.

If you want Google to process a `noindex` instruction, Google must be able to crawl the page and see that instruction. Google explicitly warns that a page blocked by robots.txt may remain represented by its URL because the crawler cannot read the `noindex` rule. [Block search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)[@google-noindex]

Use:

- `robots.txt` to control crawling;
- `noindex` to prevent indexing while allowing the crawler to read the directive;
- authentication for genuinely private material.

See [robots.txt](/glossary/robots-txt/) for the control itself.

**Step 6: Is indexing explicitly prohibited?**

Inspect both:

- the HTML robots meta tag;
- the `X-Robots-Tag` HTTP response header.

A page may have no visible `noindex` tag in its source but still receive `X-Robots-Tag: noindex` from a hosting platform, proxy, CDN rule, preview-environment policy, or deployment header configuration.

Check the final response after redirects. Also check whether JavaScript modifies the robots meta tag.

If `Indexing allowed?` is “No,” remove the directive only if the page is genuinely intended for search. Some URLs should remain excluded, including private utilities, internal search results, duplicates, preview deployments, and low-value generated variants.

**Step 7: Did Google choose a different canonical?**

Google groups duplicate and strongly similar URLs, then selects a representative canonical. The canonical annotation is a preference signal, not an absolute command. Redirects, sitemap inclusion, internal links, HTTPS, and `rel="canonical"` can all contribute to canonical selection. [What is canonicalization?](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview]

Compare:

- the exact inspected URL;
- the page’s self-declared canonical;
- Google’s selected canonical;
- redirect destinations;
- sitemap URLs;
- internal-link targets;
- hostname and protocol variants;
- trailing-slash variants;
- parameterized versions;
- substantially similar pages.

If Google selected the intended canonical, the inspected alternate may correctly remain unindexed. Fixing that “error” would create duplicate index entries you do not need.

If Google selected the wrong canonical, make the signals consistent:

- link internally to the preferred URL;
- include only the preferred URL in the sitemap;
- use a self-referencing canonical on the preferred page;
- redirect obsolete duplicates where appropriate;
- remove accidental near-duplicate routes;
- ensure the preferred page is at least as complete and useful as its alternatives.

See [Canonical URL](/glossary/canonical-url/) for the underlying concept.

**Step 8: Can Google discover the page through crawlable links?**

Google usually discovers pages by following links from known pages or by reading submitted sitemaps. Its link guidance says reliably crawlable links are ordinary anchor elements with an `href` that resolves to a web address. [Link best practices for Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en)[@google-links]

Check whether:

- at least one indexed or crawlable page links to the URL;
- the link exists in rendered HTML;
- the link is a real anchor with `href`;
- the destination is the canonical URL;
- the anchor text explains the relationship;
- the page is reachable through the site’s topic structure rather than only from a footer dump;
- no script interaction, search form, or dropdown is required to reveal the URL.

A sitemap can help Google discover preferred URLs, but it does not replace internal navigation and does not guarantee indexing. Include complete, absolute canonical URLs that you want shown in search. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)[@google-sitemap]

See [Sitemap](/glossary/xml-sitemap/) for the file’s role.

**Step 9: Was the page discovered but not crawled?**

“Discovered – currently not indexed” means Google knows the URL but has not crawled it yet. The Page Indexing documentation explains that Google may have rescheduled crawling. The useful diagnosis depends on scale.

For one recent URL on a small healthy site:

- wait;
- verify a crawlable internal link;
- verify sitemap inclusion;
- confirm the site is available and stable.

For a persistent pattern affecting a section:

- check whether the section creates many redundant URLs;
- inspect server response time and errors;
- check whether internal links signal that the section matters;
- confirm the sitemap does not contain redirects, duplicates, or retired URLs;
- review whether large quantities of thin pages were published at once.

Do not invoke “crawl budget” as a magical explanation for every small site. Google’s dedicated crawl-budget guidance is aimed mainly at very large, rapidly changing, or heavily affected sites. It does, however, explain the relevant mechanisms: crawl capacity, crawl demand, duplicate URL inventory, server health, popularity, staleness, uniqueness, and user value. [Optimize your crawl budget](https://developers.google.com/crawling/docs/crawl-budget)[@google-crawl-budget]

**Step 10: Was the page crawled but not indexed?**

“Crawled – currently not indexed” means Google fetched the URL but did not index it at that time. Repeatedly requesting another crawl does not identify why the page was not selected.

Investigate four categories.

**A. The report is behind the URL’s current state**

The Page Indexing report and the per-URL indexed result may reflect an earlier crawl. Compare the last crawl date with your latest changes and run a live test.

**B. The page rendered poorly**

A fetch can succeed while the meaningful content fails during rendering.

Check:

- rendered screenshot;
- rendered HTML;
- blocked JavaScript or CSS;
- failed API requests;
- content that appears only after interaction;
- client-side errors;
- empty or generic initial HTML.

**C. The page is duplicate or weakly differentiated**

Compare the page with:

- category and tag pages;
- alternate URL forms;
- previous articles;
- templated location pages;
- manufacturer or source material;
- other pages targeting nearly the same task.

“Unique wording” is not the same as a distinct purpose. A page can use different sentences while adding no separate decision, explanation, evidence, tool, example, or outcome.

**D. The page or section provides limited value**

Ask:

- Does the page complete a real task?
- Does it contain evidence, examples, or analysis unavailable from the surrounding pages?
- Is the title’s promise fulfilled?
- Is the page materially more useful than the pages already indexed on the site?
- Does the page exist because a reader needs it, or because a keyword list contained another phrase?
- Is the page internally positioned as important?

This is not a demand to inflate the word count. It is a demand for a reason the page should exist separately.

## Common Search Console statuses

| Status | What it usually means | First evidence to check | Do not assume |
|---|---|---|---|
| URL is unknown to Google | Google has no indexed information for that exact URL | Internal links, sitemap, exact URL form | That the page is blocked |
| Discovered – currently not indexed | Google knows the URL but has not crawled it yet | Discovery path, server health, section-wide pattern | That rewriting one paragraph will trigger crawling |
| Crawled – currently not indexed | Google fetched the URL but did not index it at that time | Last crawl, rendered output, duplication, distinct value | That another indexing request is a fix |
| Blocked by robots.txt | Google could not crawl because of a robots rule | Exact robots rule and hostname | That robots.txt is a reliable removal method |
| Excluded by `noindex` | Google saw an indexing prohibition | Meta robots and `X-Robots-Tag` | That an SEO plugin is the only possible source |
| Duplicate / alternate | Google consolidated the inspected URL with another URL | Google-selected canonical and signal consistency | That every unindexed duplicate is a problem |
| Redirect | The inspected URL sends users and crawlers elsewhere | Final destination and redirect chain | That the redirect source should also be indexed |
| Not found / soft 404 | The URL is missing or behaves like an error page | Status code and page-specific content | That returning `200` makes an empty page indexable |
| Server error | Google could not retrieve a usable response | Logs, platform health, DNS, timeouts | That content editing will solve availability |

## Examples

**What requesting indexing actually does**

URL Inspection can submit an eligible URL to Google’s indexing queue. Google states that:

submission does not guarantee inclusion;
there are daily limits;
indexing can take days or longer;
for many new or updated pages, a sitemap is the better submission mechanism.

Request indexing after:

the live test succeeds;
the intended canonical is clear;
the page is internally linked;
the page belongs in the sitemap;
any robots, response, rendering, or `noindex` problem is fixed.

Do not submit the same unchanged URL repeatedly. That produces activity, not diagnosis.

## Boundaries

**Three worked examples**

**Example 1: The page is fine, but the inspected URL is not canonical**

A site publishes:

- `/seo-audit`
- `/seo-audit/`
- `/seo-audit?ref=nav`

The sitemap lists `/seo-audit/`, internal links point to both slash forms, and the no-slash URL redirects. The owner inspects the parameterized version and sees that it is not indexed.

The correct conclusion is not “Google refuses to index the article.” The content is consolidated under the canonical URL. Normalize internal links and inspect the canonical destination.

**Example 2: The live test passes after an accidental `noindex`**

A production template shipped with `noindex`. The indexed result still reports exclusion, but the current live test shows:

- crawl allowed;
- indexing allowed;
- successful fetch;
- correct rendered content.

The fix exists on the live site, but Google’s indexed data reflects the previous crawl. Request indexing once and wait for recrawling. Do not keep changing the page while the system catches up.

**Example 3: Google crawled a thin programmatic section**

A site publishes 600 pages that differ only by city name. All return `200`, self-canonicalize, and appear in the sitemap. Many are “Crawled – currently not indexed.”

The technical controls are not necessarily broken. The section may lack enough distinct local value to justify hundreds of separate pages. Consolidation, genuine local evidence, and a smaller intentional inventory are more plausible remedies than resubmitting 600 URLs.

**What not to do**

Avoid these common responses:

- submitting the same URL every day;
- changing publication dates without meaningful updates;
- adding arbitrary paragraphs to reach a word count;
- blocking a page in robots.txt while expecting Google to process `noindex`;
- placing every URL in the footer;
- generating more near-duplicate pages to “build topical authority”;
- changing canonicals without checking the selected canonical;
- treating all excluded URLs as errors;
- assuming a sitemap guarantees indexing;
- paying for an “instant indexing” guarantee.

Google does not guarantee crawling, indexing, or serving even when a page follows its technical requirements. A sound diagnosis improves the page and its signals; it does not manufacture a guarantee.

**Final checklist**

Before you call an indexing problem unresolved, verify:

- I inspected the exact intended canonical URL.
- I distinguished not ranking from not being indexed.
- I recorded the exact Search Console status and last crawl date.
- I compared indexed data with a live test.
- The final URL returns a stable `200` response.
- The page is publicly accessible without login or challenge.
- robots.txt allows the required crawl.
- No meta or HTTP `noindex` directive remains.
- The declared canonical matches the intended URL.
- Google’s selected canonical has been reviewed.
- Internal links point directly to the canonical URL.
- The page appears in the sitemap if it belongs in search.
- The rendered screenshot and HTML contain the main content.
- The page has a distinct task and value.
- Site-wide patterns were checked before blaming one URL.
- I requested indexing only after fixing identifiable problems.

## Sources and notes

This guide relies primarily on Google’s current documentation:

- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)[@google-technical-requirements]
- [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)[@google-how-search-works]
- [Inspect and troubleshoot a single page](https://support.google.com/webmasters/answer/12482179?hl=en)[@gsc-inspect-troubleshoot]
- [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]
- [Page indexing report](https://support.google.com/webmasters/answer/7440203?rd=1)[@gsc-page-indexing]
- [Why is my page missing from Google Search?](https://support.google.com/webmasters/answer/7474347?hl=en-EN)[@gsc-missing-page]
- [Block search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)[@google-noindex]
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)[@google-canonicalization-overview][@google-canonical-methods]
- [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en)[@google-links]
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=en)
- [Crawl budget management](https://developers.google.com/crawling/docs/crawl-budget)[@google-crawl-budget]

## Related guides

- [Technical SEO Baseline Checklist](/articles/technical-seo-baseline/)
- [Crawling vs. Indexing vs. Ranking](/articles/crawling-vs-indexing-vs-ranking/)
- [How to Use Google Search Console URL Inspection](/articles/google-search-console-url-inspection/)
- [Canonical URL](/glossary/canonical-url/)
- [robots.txt](/glossary/robots-txt/)
- [Sitemap](/glossary/xml-sitemap/)
