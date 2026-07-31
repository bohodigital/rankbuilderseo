---
{
  "slug": "redirect-mapping-site-migration",
  "title": "Redirect Mapping for Site Migrations: Build a One-to-One Plan",
  "description": "Create a migration redirect map that assigns every old URL to an equivalent replacement, consolidated destination, retained resource or truthful removal response.",
  "format": "Playbook",
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
  "directAnswer": "Build a redirect map from a merged inventory of canonical pages, sitemaps, crawls, analytics, logs and backlinks, then assign each old URL to one equivalent replacement, a justified consolidation target, a retained route or a truthful 404 or 410 response.",
  "takeaways": [
    "A redirect map must cover more than the URLs found by one crawler.",
    "One-to-one equivalent replacements are preferable to broad pattern guesses.",
    "Removed pages without replacements should not be forced to unrelated destinations.",
    "Every mapping should be tested for status, destination, chain length, query handling and final content."
  ],
  "claimLimits": [
    "A redirect map can preserve routing and strong migration signals, but it cannot make a materially different destination equivalent to the removed source."
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
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "domain-migration-seo",
    "change-url-without-losing-seo",
    "post-migration-seo-monitoring",
    "page-with-redirect"
  ]
}
---

## Preconditions

![Redirect map assigning each old URL to a replacement or truthful removal response](/media/redirect-mapping-site-migration-hero.png "A redirect map gives every old URL a deliberate destination or removal outcome.")

Collect the broadest defensible old-URL inventory.

Use the canonical content registry; XML sitemaps; an internal crawler; analytics landing pages; Search Console pages; server logs; backlinks; historical sitemaps; redirect configuration; images and documents; marketing campaigns; application routes; and archived CMS exports.

Normalize URLs while preserving the raw originals.

Record the protocol; host; path; query; status; canonical; content type; page template; traffic; backlinks; current lifecycle; and intended destination.

Google’s site-move process explicitly requires a URL mapping before redirects are launched. [How to move a site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)[@b8-google-site-move]

Preserve the source of every discovered URL. A row found in logs carries different evidence from a row found only in an obsolete sitemap, and the same raw URL can appear in several inventories. Source attribution helps reviewers decide whether a malformed address needs a redirect, a truthful error response or no special rule at all.

Define the map’s change-control owner before implementation. The owner should resolve ambiguous intent, approve consolidation decisions, prevent broad regular expressions from replacing reviewed rows, and retain the tested version that corresponds to the release. A mapping spreadsheet without version ownership can drift away from the configuration that actually reaches production.

## Ordered process

1. **Merge inventories.**

   Deduplicate exact URL records but retain every source in which each URL appeared.

   A URL found in backlinks but not the current crawl may still need a redirect.

2. **Resolve current behavior.**

   Request representative URLs and record:

- `200`
- Redirect
- `404`
- `410`
- Authentication
- Server error
- Blocked response
- Canonical target

   Do not map historical URLs based only on filenames.

3. **Classify the old content.**

   Use:

- Direct equivalent
- Consolidated into another page
- Still retained
- Permanently removed
- Private
- Malformed
- Duplicate
- Unknown

4. **Assign one-to-one replacements first.**

   Good:

   ```text
   /old/widget-installation
       → /guides/widget-installation
```
The destination should satisfy the same primary intent.

5. **Map justified consolidations.**

   Several old pages can redirect to one new page when the new page genuinely absorbs them.

   Example:

   ```text
   /widget-cleaning
   /widget-storage
   /widget-inspection
       → /widget-maintenance
   ```

   Confirm that the consolidated page contains the useful substance expected by visitors to each old page.

6. **Assign truthful removal responses.**

   Use `404` or `410` when:

- Content is gone
- No replacement serves the same purpose
- The URL was invalid
- The page should not remain public

   Do not redirect unrelated removed pages to the homepage.

7. **Normalize destination URLs.**

   Every destination should already use:

- Preferred protocol
- Preferred hostname
- Preferred trailing-slash policy
- Preferred parameter form
- Final path
- Correct language

   The redirect map should point directly to final canonical URLs.

8. **Preserve meaningful query parameters.**

   Decide explicitly which values are:

- Required identity
- Filtering
- Pagination
- Tracking
- Session
- Presentation

   Do not drop a product ID while preserving an irrelevant campaign parameter merely because a generic rewrite happened to do so.

9. **Generate implementation rules.**

   Prefer explicit mappings for high-value and irregular URLs.

   Use patterns only when:

- The transformation is deterministic
- Every matched source follows the same rule
- Exceptions are handled first
- Query behavior is tested
- No valid route is captured accidentally

10. **Test before launch.**

    For every row or statistically complete sample, verify:

- Expected source
- Expected status
- Expected destination
- One redirect step
- Final `200`, `404` or `410`
- Query handling
- No loop
- No cross-language mistake
- No environment hostname
- No authentication surprise

11. **Launch and recrawl the map.**

    Crawl the old URL inventory after deployment.

    Compare actual behavior with the map.

12. **Monitor unmatched requests.**

    Logs will reveal old URLs missing from the original inventory.

    Add only justified mappings. Do not respond to every malformed bot request with a permanent redirect.

13. **Retain the mapping as a governed artifact.**

    Record:

- Source URL
- Destination
- Reason
- Owner
- Approval
- Implementation rule
- Test result
- First release
- Later changes

Treat mapping review as a comparison of intent, not merely a syntax check. Reviewers should be able to see the old page’s purpose, the proposed destination’s purpose and the evidence supporting consolidation. Sort the map by template and outcome so broad mistakes become visible—for example, an entire product family sent to a category page or every retired campaign sent to the homepage.

Before launch, generate automated requests from the approved map and record the full response chain, final status, final canonical and query-string behavior. After launch, run the same set from outside the production network and compare results with the approved artifact. Keep unmatched old-URL requests in a separate queue instead of editing production rules ad hoc. Each added mapping should receive the same intent review, test and ownership fields as the original release. This preserves the map as an auditable translation between two URL systems rather than a collection of emergency server rules.

## Failure cases

Common failures include a homepage catch-all; a redirect chain; a redirect loop; an HTTP intermediate hop; the wrong hostname; the wrong language; parameter loss; a path regex matching too broadly; a destination returning `404`; the source and destination having unrelated intent; redirecting private URLs publicly; redirecting malformed attack traffic; mapping only sitemap URLs; forgetting images and PDFs; removing redirects after one month; or editing mappings without review.

Google recommends server-side permanent redirects and advises against irrelevant mass redirects because they can confuse users and be treated like soft 404s. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)[@b8-google-redirects]

## Completion criteria

The map is complete when:

- Every known valuable old URL has an outcome
- Every replacement is contextually equivalent
- Consolidations are documented
- Removed content returns a truthful response
- Destinations use final canonical URLs
- Redirect chains are absent
- Query behavior is defined
- Images and documents are covered
- Test output matches the map
- Unmatched production requests are monitored
- The mapping is versioned and reviewable
- Internal links no longer depend on the redirects

Use [Domain Migration SEO](/articles/domain-migration-seo) for the full-domain process and [How to Change a URL](/articles/change-url-without-losing-seo) for smaller page-level moves.

Archive the final map with its normalization rules, approval date, deployed configuration identity and test results. Preserve unresolved rows as explicit exceptions rather than silently dropping them. After launch, compare real requests with the map so newly discovered old URLs enter the same review process and do not accumulate as undocumented one-off redirects.
