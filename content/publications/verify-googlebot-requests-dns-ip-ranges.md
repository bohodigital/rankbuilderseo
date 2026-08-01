---
{
  "slug": "verify-googlebot-requests-dns-ip-ranges",
  "title": "Verify Googlebot Requests: Reverse DNS, Forward DNS, and IP Ranges",
  "description": "Verify crawler origin using forward-confirmed reverse DNS or Google's published CIDR ranges before allowing, exempting, throttling or blocking traffic.",
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
  "directAnswer": "Do not trust the Googlebot user-agent string alone; verify the source with forward-confirmed reverse DNS or Google's current published crawler IP ranges and classify the request category.",
  "takeaways": [
    "User-agent strings are spoofable and provide no origin proof.",
    "Reverse DNS must be followed by a forward lookup that returns the original IP.",
    "Large-scale systems should consume Google's current published CIDR lists by crawler category.",
    "Trusted proxy handling must be correct before source-IP verification means anything."
  ],
  "claimLimits": [
    "Verification establishes likely Google origin, not an entitlement to bypass authentication, application security, or reasonable capacity controls."
  ],
  "citations": [
    {
      "id": "verify-google-requests",
      "title": "Verify requests from Google crawlers and fetchers",
      "url": "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "verify-ip-move",
      "title": "New location for the Google crawlers' IP range files",
      "url": "https://developers.google.com/search/blog/2026/03/crawler-ip-ranges",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "googlebot-crawl-delay-crawl-rate",
    "google-indexing-api-scope-limitations",
    "technical-seo-baseline",
    "server-error-5xx"
  ]
}
---

## Definition

A request header that says `Googlebot` is not proof that the request came from Google. User-agent strings are ordinary text and can be copied by scrapers, vulnerability scanners, abusive bots, and anyone with a command-line HTTP client.

Google documents two defensible verification methods:

1. Perform a reverse DNS lookup on the source IP, validate the returned Google hostname, then perform a forward DNS lookup and confirm that it resolves back to the original IP.
2. Match the source IP against Google’s published crawler and fetcher IP ranges. [Verify requests from Google crawlers and fetchers](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)[@verify-google-requests]

The verification matters before a firewall allows privileged access, bypasses rate limits, exempts traffic from bot controls, or blocks what appears to be an abusive crawler. False trust gives an attacker a convenient costume. False blocking can remove legitimate Google crawling and quietly damage discovery.

Google separates its automated traffic into common crawlers, special-case crawlers, and user-triggered fetchers. Those categories can use different hostnames, IP lists, and robots behavior. Verification should therefore identify both origin and category rather than reducing every Google request to one allowlist.

## Mechanism

The forward-confirmed reverse DNS process begins with the source IP captured directly from the server or trusted proxy log.

1. Run a reverse DNS lookup for the source IP.
2. Confirm that the hostname ends in an expected Google-controlled domain documented for that crawler category.
3. Run a forward DNS lookup on the returned hostname.
4. Confirm that one of the returned addresses exactly matches the original source IP.
5. Preserve the result with a short cache lifetime rather than performing blocking DNS work on every request.

The second lookup is essential. A malicious operator can configure a PTR record under a domain they control to contain a convincing word such as `googlebot`. They cannot legitimately make that hostname resolve under Google’s controlled domain and back to the original address.

Google’s current documentation lists patterns including `googlebot.com`, `geo.googlebot.com`, `google.com`, and `googleusercontent.com` for different categories. Do not write a loose check that merely searches for the substring `google` anywhere in the hostname. [Verify requests from Google crawlers and fetchers](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)[@verify-google-requests]

At larger scale, download Google’s published JSON IP ranges and compare addresses using proper CIDR logic. Separate the lists by category:

- Common crawlers
- Special crawlers
- User-triggered fetchers
- User-triggered agents
- Other documented Google infrastructure where relevant

In March 2026, Google announced that crawler IP range files were moving from the Search-specific path to a general crawling infrastructure location. Systems should consume the current documented URLs instead of freezing the old path into a permanent firewall rule. [New location for Google crawlers' IP range files](https://developers.google.com/search/blog/2026/03/crawler-ip-ranges)[@verify-ip-move]

A production verifier should update ranges on a schedule, validate the downloaded schema, keep the last known-good set, and alert when an update fails. Do not replace a working allowlist with an empty file because one fetch returned an error.

## Examples

**A scraper spoofs Googlebot**

The log shows a Googlebot user agent from an address that reverse-resolves to a residential ISP. The forward-confirmed DNS test fails, and the address is absent from Google’s crawler ranges. Treat it as an unverified bot and apply ordinary security or rate-limit policy.

**A common Google crawler**

The source address reverse-resolves to a hostname under `googlebot.com`, and the forward lookup returns the original address. It also falls within the published common-crawler ranges. The evidence supports treating the request as a common crawler that follows the documented automated-crawl rules.

**A special-case crawler**

The request uses a Google product-specific user agent and originates from a documented special-crawler range. It may have different robots behavior from common Googlebot. Apply the product’s documented policy rather than assuming every Google-owned request obeys the same controls.

**A user-triggered fetch**

A user requests a preview, translation, or other Google feature that fetches the page. The request may come from a user-triggered fetcher range rather than the common crawler list. Blocking it because it is “not Googlebot” can break a user-facing feature even though the source is legitimate Google infrastructure.

**A reverse-proxy mistake**

The application logs the CDN’s internal address instead of the original client IP. DNS verification then evaluates the proxy, not the crawler. Fix trusted-proxy handling first. Accept forwarded-client headers only from infrastructure you control, or an attacker can supply a fake source address.

## Boundaries

Verification establishes likely request origin. It does not mean every request should be allowed without limits, that the URL should be public, or that the crawler is entitled to bypass authentication. Google’s crawlers still receive the same public application behavior and security boundaries appropriate to the product.

Do not hard-code a historical block such as one broad IPv4 range. Google publishes multiple current lists, supports IPv6, and can change infrastructure. Do not depend only on reverse DNS, only on a user agent, or only on a hostname suffix without the forward lookup.

Avoid synchronous DNS verification in the critical request path when it can create latency or an outage dependency. Better designs verify asynchronously or cache results by source IP, while applying a safe default to unknown traffic. Cache expiration should be short enough to accommodate range changes and long enough to prevent a DNS query storm.

Log:

- Source IP as observed by trusted infrastructure
- User agent
- Request path
- Timestamp
- Verification method
- Google category
- Range-list version
- Reverse and forward results
- Decision applied
- Rate-limit or block action

Use [Googlebot Crawl Delay](/articles/googlebot-crawl-delay-crawl-rate) before changing rate controls, because an apparent crawl surge may be spoofed traffic. Use [Google Indexing API](/articles/google-indexing-api-scope-limitations) for supported notifications rather than trying to infer indexing from crawler identity. The safe rule is simple: classify by evidence, not by costume.
