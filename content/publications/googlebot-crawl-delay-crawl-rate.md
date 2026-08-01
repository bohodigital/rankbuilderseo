---
{
  "slug": "googlebot-crawl-delay-crawl-rate",
  "title": "Googlebot Crawl Delay: What Google Ignores and How to Reduce Crawl Rate",
  "description": "Understand why Googlebot ignores crawl-delay and use verified traffic evidence, URL-inventory repair, temporary overload responses and exceptional support correctly.",
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
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Googlebot does not process crawl-delay in robots.txt; reduce verified overload by fixing URL waste and host performance, using short-lived 500, 503 or 429 responses in emergencies, or filing an exceptional crawl-rate request.",
  "takeaways": [
    "Googlebot ignores the non-standard crawl-delay robots directive.",
    "Verify crawler origin before applying Google-specific controls.",
    "Durable fixes reduce wasteful URL inventory and improve host response behavior.",
    "Emergency overload responses must be temporary because sustained errors can harm indexing."
  ],
  "claimLimits": [
    "Crawl demand and capacity are adaptive, and reducing requests can delay discovery, updates and removals across the affected hostname."
  ],
  "citations": [
    {
      "id": "crawl-delay-budget",
      "title": "What crawl budget means for Googlebot",
      "url": "https://developers.google.com/search/blog/2017/01/what-crawl-budget-means-for-googlebot",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "crawl-delay-googlebot",
      "title": "Googlebot",
      "url": "https://developers.google.com/search/docs/crawling-indexing/googlebot",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "crawl-delay-troubleshoot",
      "title": "Troubleshoot Google Search crawling errors",
      "url": "https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "crawl-delay-reduce",
      "title": "Reduce Google crawl rate",
      "url": "https://developers.google.com/crawling/docs/crawlers-fetchers/reduce-crawl-rate",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "robots-txt-vs-noindex-x-robots-tag",
    "verify-googlebot-requests-dns-ip-ranges",
    "server-error-5xx",
    "sitemap-in-robots-txt"
  ]
}
---

## Definition

Googlebot does not process the non-standard `crawl-delay` rule in `robots.txt`. Adding a line that asks Googlebot to wait a fixed number of seconds can create reassuring configuration theater while the actual request rate remains unchanged. Google has stated this directly in its crawl-budget guidance. [What crawl budget means for Googlebot](https://developers.google.com/search/blog/2017/01/what-crawl-budget-means-for-googlebot)[@crawl-delay-budget]

Google manages crawling through an adaptive capacity limit and crawl demand. The system attempts to avoid overwhelming a healthy host, adjusts when latency or errors rise, and decides how much crawling is useful based on known URL inventory, freshness, quality, popularity, and product-specific demand.

Three different problems are often confused:

- A legitimate Google crawler is requesting too much for the server.
- Google is spending requests on duplicate or unimportant URLs.
- A non-Google bot is spoofing a Google user agent.

Each requires a different response. Before reducing anything, verify the crawler, inspect server logs, and identify the URL patterns consuming capacity.

`robots.txt` can allow or disallow URL paths for compliant crawlers. It does not provide Googlebot with a per-request sleep schedule. Emergency crawl reduction uses temporary server responses and, in exceptional cases, Google’s crawl-rate support process.

## Mechanism

Begin with evidence from access logs and Search Console Crawl Stats.

Measure:

- Requests per second and concurrent connections
- Source IPs and verified crawler categories
- Hostnames and URL patterns
- Response status distribution
- Time to first byte
- Total response time
- Response size
- Cache hit rate
- JavaScript and media requests
- Change over time
- Whether human traffic is also degraded

Verify that the traffic actually comes from Google before granting exceptions or targeting it with special rules. Google warns that the Googlebot user-agent string is frequently spoofed. [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot)[@crawl-delay-googlebot]

For sustainable improvement, reduce waste rather than merely slowing every request. Common causes include:

- Infinite faceted combinations
- Calendar navigation without bounds
- Session identifiers
- Sort and tracking parameters
- Duplicate print or export URLs
- Long redirect chains
- Large uncached resources
- Slow server-side rendering
- Broken links generating endless error inventory
- Sitemaps containing low-value or redirected URLs

Improve response speed, caching, conditional requests, internal linking, canonical consistency, and URL inventory. Google’s crawling guidance says faster responses can improve crawl efficiency, but speed does not create demand for low-quality pages. [Troubleshoot crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)[@crawl-delay-troubleshoot]

For a short-lived emergency, Google’s current crawling infrastructure guidance recommends returning `500`, `503`, or `429` responses when the server cannot safely handle crawler traffic. A significant number of those responses causes Google’s infrastructure to reduce crawling for the hostname. Stop returning them when the emergency ends. Google warns against using this approach longer than roughly one or two days because URLs can eventually be dropped from search systems. [Reduce Google crawl rate](https://developers.google.com/crawling/docs/crawlers-fetchers/reduce-crawl-rate)[@crawl-delay-reduce]

If temporary error signaling is not feasible and verified Google crawling remains abnormally high, Google provides an exceptional request process to report the problem. It does not offer a request to force a crawl-rate increase.

## Examples

**Faceted URLs multiply**

A retailer exposes millions of combinations for color, size, price, sort, inventory, and tracking parameters. Googlebot spends most requests on near-duplicate URLs.

A `crawl-delay` line does nothing for Googlebot. The durable fix is to control crawlable combinations, remove links to useless states, use stable canonicals where appropriate, clean sitemaps, and block clearly infinite spaces only after understanding indexing consequences.

**A deploy overwhelms the origin**

A cache purge causes every crawler request to trigger an expensive render. Human latency rises and the server approaches failure.

Temporarily return `503` or `429` where capacity is exhausted, restore caching, and remove the emergency responses as soon as the host stabilizes. Do not leave a sitewide failure mode active for days merely because crawl volume fell.

**A fake Googlebot ignores every rule**

The requests claim to be Googlebot, originate outside documented Google infrastructure, and hammer login endpoints. `crawl-delay` is irrelevant. Verify the source, then use ordinary bot management, firewall, and rate-limiting controls.

**A small site sees a brief spike**

The host remains healthy, errors stay near zero, and the spike ends quickly. No intervention may be needed. Googlebot can appear bursty over short intervals even when the average rate is modest. A reactive block can do more harm than the temporary traffic.

**Ads-related crawling recurs**

Google’s troubleshooting documentation notes that AdsBot crawling can be driven by Dynamic Search Ad targets and may recur. Identify the product-specific crawler and business configuration before treating it as ordinary Search crawling.

## Boundaries

Do not use emergency status codes as a permanent crawl-management strategy. Repeated `5xx` and `429` responses communicate service failure or overload and can reduce freshness or remove URLs when sustained. The effect is broad at the hostname level, not a precise throttle for one troublesome directory.

Do not block essential JavaScript, CSS, images, or APIs without checking whether Google needs them to render and understand the page. Do not apply `noindex` to solve server capacity. Indexing rules and rate controls address different layers.

Do not assume that lower crawl volume is always an improvement. If important inventory changes rapidly, excessive blocking can delay new pages, price changes, removals, and canonical updates. The goal is efficient crawling of useful URLs, not the lowest possible request count.

A responsible incident record includes:

- Verified crawler identity
- Start and end time
- Affected hostname
- Request and latency graphs
- Top URL patterns
- Error responses used
- Duration of emergency controls
- Origin or cache repair
- Search Console observations
- Rollback trigger
- Follow-up inventory changes

Use [Verify Googlebot Requests](/articles/verify-googlebot-requests-dns-ip-ranges) before granting or denying crawler-specific access. Use [Robots.txt vs. noindex vs. X-Robots-Tag](/articles/robots-txt-vs-noindex-x-robots-tag) when the real question is crawl access or index visibility. Googlebot’s rate is managed through host health, demand, inventory, and emergency signaling, not a decorative delay directive.
