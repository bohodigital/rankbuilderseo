---
{
  "slug": "google-indexing-api-scope-limitations",
  "title": "Google Indexing API: Supported Pages, Quotas, and Common Misuse",
  "description": "Understand the Indexing API's narrow JobPosting and BroadcastEvent scope, notification semantics, batching limits and safer alternatives for ordinary content.",
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
  "directAnswer": "Google's Indexing API is limited to JobPosting pages and BroadcastEvent pages embedded in VideoObject; it sends crawl notifications rather than guaranteed indexing and is not a bulk-submission API for ordinary content.",
  "takeaways": [
    "Only documented job-posting and livestream event pages are supported.",
    "A successful notification does not prove that a URL was crawled, indexed, ranked or shown.",
    "Ordinary content should rely on links, sitemaps, crawlable responses and URL Inspection.",
    "Quota circumvention and misleading structured data violate the intended contract."
  ],
  "claimLimits": [
    "API acceptance, crawl timing, indexing and search appearance remain separate states governed by Google's systems and policies."
  ],
  "citations": [
    {
      "id": "indexing-api-use",
      "title": "Using the Indexing API",
      "url": "https://developers.google.com/search/apis/indexing-api/v3/using-api",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "indexing-api-quickstart",
      "title": "Indexing API Quickstart",
      "url": "https://developers.google.com/search/apis/indexing-api/v3/quickstart",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "verify-googlebot-requests-dns-ip-ranges",
    "search-console-removals-tool-temporary-permanent",
    "why-google-isnt-indexing-your-page",
    "xml-sitemap-size-limits"
  ]
}
---

## Definition

Google’s Indexing API is a notification interface for a narrow class of short-lived pages. Google currently permits it for pages containing either `JobPosting` structured data or a `BroadcastEvent` embedded in a `VideoObject`. It is not a general-purpose “submit any URL for instant indexing” endpoint. [Using the Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api)[@indexing-api-use]

The API can notify Google that a supported URL was added or updated, notify Google after the page was removed, and report the last notification status received for that URL. The notification can help Google schedule a fresh crawl. It does not guarantee crawling, indexing, ranking, rich-result eligibility, or a particular processing time.

For ordinary articles, products, service pages, documentation, and most other web content, use the normal discovery systems:

- Crawlable internal links
- Accurate XML sitemaps
- URL Inspection for a small number of important URLs
- Correct status codes and canonicals
- Stable, accessible content
- Search Console indexing reports

A service that claims to “force-index” thousands of ordinary pages through the Indexing API is using the wrong contract, even if the HTTP request itself returns success.

## Mechanism

A valid implementation begins with ownership and authentication. The project enables the Indexing API, uses a service account or other supported OAuth flow, and grants that identity appropriate access to the Search Console property. Authentication proves that the caller may send a notification; it does not expand the types of content the API supports.

The primary notification actions are conceptually:

- `URL_UPDATED` for a new or materially updated supported page
- `URL_DELETED` after the supported page has been removed
- Metadata lookup to see the last notification Google received

Google accepts one URL in an individual update request and documents batching of up to 100 calls. It also warns callers not to circumvent submission limits by distributing requests across multiple accounts. [Using the Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api)[@indexing-api-use]

A reliable job-posting workflow looks like this:

1. Publish the job page with accurate visible content and valid `JobPosting` markup.
2. Return a successful, crawlable response.
3. Notify Google with `URL_UPDATED`.
4. Record the request result and notification time.
5. Update the page and notify again when material details change.
6. When the job expires, remove the markup or page according to policy.
7. Return the intended final status.
8. Notify Google with `URL_DELETED` after deletion.
9. Monitor Search Console and logs rather than assuming notification equals index inclusion.

A livestream workflow follows the same logic with `BroadcastEvent` inside `VideoObject`. The API exists because these pages can become stale quickly and benefit from timely notifications. Google’s quickstart describes job postings and livestream videos as the supported use cases. [Indexing API Quickstart](https://developers.google.com/search/apis/indexing-api/v3/quickstart)[@indexing-api-quickstart]

The structured data and visible content remain subject to Google’s spam policies and feature guidelines. An API call cannot make an expired job current, turn a prerecorded video into a livestream, or legitimize misleading markup.

## Examples

**A large employer publishes new jobs**

Each job has a unique public URL, visible title, employer, location, description, and expiration information. The page includes valid `JobPosting` data. The system sends an update notification after publication and another after a meaningful change. When the role closes, the site removes or updates the page correctly and sends a deletion notification when applicable. This is the intended pattern.

**A news site submits every article**

The pages contain ordinary Article markup, not supported Indexing API content. The site may receive API responses, but it is outside the documented use. The correct scalable discovery method is an XML sitemap, strong internal links, and ordinary crawling. Using a job or broadcast type solely to gain API access would misrepresent the content.

**An ecommerce plugin advertises instant indexing**

The plugin submits product URLs through the API and claims that a successful request means the products are indexed. That conclusion is false twice: products are not the supported page type, and a notification acknowledgment is not an indexing guarantee.

**A livestream ends**

The page described a genuine scheduled livestream and used `BroadcastEvent` inside `VideoObject`. After the event, update the page and structured data to reflect the actual state. If the URL is deleted, send the deletion notification after the origin change. Do not leave a live-event object active because the API was already called.

**A job board uses several service accounts to increase volume**

Google explicitly warns against circumventing submission limits through multiple accounts. Design the queue around the legitimate quota, deduplicate notifications, and send updates only when the source content changes.

## Boundaries

The API is not a ranking tool. It does not override quality evaluation, canonical selection, robots rules, status codes, spam systems, or rich-result requirements. A notification can be accepted while the page remains unindexed because Google still evaluates whether to crawl and include it.

Do not infer page status from the API’s notification metadata. That metadata reports what Google received from the caller, not whether the URL is currently indexed. Use URL Inspection and Search Console reports for indexing evidence.

Operational controls should include:

- Supported page-type validation before enqueueing
- Search Console property verification
- Deduplication by URL and change event
- Quota-aware retries
- Exponential backoff for transient failures
- No replay of permanent validation errors
- Audit logs without stored access tokens
- Removal notifications only after the origin state changes
- Monitoring for expired jobs or events
- Periodic comparison between visible content and structured data

Do not send secrets, private URLs, preview hosts, search-result parameter pages, or URLs that require login. The API is a public-search notification channel.

Use [Search Console Removals Tool](/articles/search-console-removals-tool-temporary-permanent) for temporary hiding of owned URLs. Use [Verify Googlebot Requests](/articles/verify-googlebot-requests-dns-ip-ranges) when server logs, firewalls, or spoofed crawlers are the problem. For ordinary content, the dull machinery of links, sitemaps, crawlable responses, and accurate pages remains the correct system. Dull machinery is irritating, but it is still better than an unsupported shortcut marketed as magic.
