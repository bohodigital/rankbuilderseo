---
{
  "slug": "sitemap-in-robots-txt",
  "title": "Sitemap in Robots.txt: Syntax, Multiple Files, and Common Mistakes",
  "description": "Use the Sitemap directive in robots.txt correctly, declare one or many sitemap files, understand host and path behavior, and avoid mistaking discovery for indexing.",
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
  "publishedAt": "2026-07-31",
  "revisedAt": "2026-07-31",
  "directAnswer": "Add one fully qualified Sitemap directive per sitemap or sitemap index to the root robots.txt file. The directive is not tied to a user-agent group, may appear multiple times, and helps crawlers discover sitemap locations without overriding crawl rules or guaranteeing that any listed URL will be indexed.",
  "takeaways": [
    "The Sitemap directive requires an absolute URL including the protocol and host.",
    "Multiple Sitemap lines are allowed, with one sitemap or sitemap index location on each line.",
    "The directive is independent of user-agent groups and does not grant access to a file blocked from crawling.",
    "Robots.txt discovery complements Search Console submission and does not guarantee sitemap processing or page indexing."
  ],
  "claimLimits": [
    "Robots.txt behavior differs among crawlers, and declaring a sitemap location does not establish ownership, successful fetching, canonical selection, crawling, indexing, ranking, or traffic."
  ],
  "citations": [
    {
      "id": "b9-google-build-sitemap",
      "title": "Build and submit a sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google",
      "accessedAt": "2026-07-31"
    },
    {
      "id": "b9-google-create-robots",
      "title": "Create and submit a robots.txt file",
      "url": "https://developers.google.com/crawling/docs/robots-txt/create-robots-txt",
      "publisher": "Google",
      "accessedAt": "2026-07-31"
    },
    {
      "id": "b9-google-robots-spec",
      "title": "How Google interprets the robots.txt specification",
      "url": "https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
      "publisher": "Google",
      "accessedAt": "2026-07-31"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "xml-sitemap-size-limits",
    "sitemap-could-not-be-read",
    "url-blocked-by-robots-txt",
    "internal-links-vs-xml-sitemaps"
  ]
}
---

## Definition

A robots.txt file can tell supporting crawlers where a site's sitemap or sitemap index is located.

The directive uses this form:

```text
Sitemap: https://www.example.com/sitemap.xml
```

The value must be a fully qualified URL containing the protocol and host. A relative value such as `/sitemap.xml` is not the documented syntax.

Google says the `Sitemap` field is case-insensitive, while the URL value remains case-sensitive. The field is supported by Google, Bing, and other major search engines under the sitemap protocol. It is not tied to a particular `User-agent` group. [How Google interprets the robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)[@b9-google-robots-spec]

The directive helps a crawler discover the sitemap location the next time it fetches robots.txt. It is not an indexing command. The crawler still has to request the sitemap, parse it, evaluate the URLs, and decide whether to crawl or index any listed resources.

A site can also submit its sitemap in Search Console. Search Console adds reporting about fetch history and processing errors, while the robots.txt directive gives crawlers a durable public discovery location. Google documents both methods as valid ways to make a sitemap available. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@b9-google-build-sitemap]

## Mechanism

Place robots.txt at the root of the host it governs:

```text
https://www.example.com/robots.txt
```

A basic file can contain crawler rules and a sitemap declaration:

```text
User-agent: *
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

The `Allow: /` line is optional because crawling is generally allowed when no applicable disallow rule exists. The sitemap directive can appear before or after user-agent groups because it is not scoped to one group. Google's robots.txt creation guide uses the same basic structure. [Create and submit a robots.txt file](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)[@b9-google-create-robots]

For multiple sitemaps, use multiple lines:

```text
Sitemap: https://www.example.com/sitemaps/articles.xml
Sitemap: https://www.example.com/sitemaps/products.xml
Sitemap: https://www.example.com/sitemaps/images.xml
```

Google states that there is no limit to the number of sitemap fields that can be included in robots.txt. The practical limit is maintainability: a long manually edited list creates more opportunities for stale paths, duplicates, wrong hosts, and missing files. [How Google interprets the robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)[@b9-google-robots-spec]

When many child files belong to one inventory, declare a sitemap index instead:

```text
Sitemap: https://www.example.com/sitemap-index.xml
```

The index can list the child sitemap files. See [XML Sitemap Size Limits](/articles/xml-sitemap-size-limits) for file limits and index organization.

The sitemap URL does not have to use the same host as the robots.txt file. Google documents cross-host sitemap directives, such as a sitemap served from a dedicated CDN or another verified site. This flexibility does not make every cross-host configuration wise. The sitemap still needs a stable public response, valid contents, appropriate ownership, and correct URL scope.

A sitemap field does not override a robots rule. If the sitemap file itself is blocked from crawling, declaring its URL does not magically make it fetchable. Google notes that the field may be followed by crawlers provided the sitemap location is not disallowed. [How Google interprets the robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)[@b9-google-robots-spec]

## Examples

**One sitemap**

```text
Sitemap: https://www.example.com/sitemap.xml
```

Use this when one valid file contains the complete preferred URL inventory.

**One sitemap index**

```text
Sitemap: https://www.example.com/sitemap-index.xml
```

Use an index when the site operates several child sitemaps and wants one stable discovery address.

**Several independent sitemap files**

```text
Sitemap: https://www.example.com/articles-sitemap.xml
Sitemap: https://www.example.com/products-sitemap.xml
Sitemap: https://www.example.com/video-sitemap.xml
```

This can be useful when different systems generate independent files or when Search Console reporting is intentionally separated.

**Different sitemap host**

```text
Sitemap: https://sitemaps.example-cdn.com/example-com-index.xml
```

A cross-host location can be valid, but test it as an external dependency. A certificate, DNS, access-control, cache, or deployment failure on the sitemap host can prevent discovery even while the main site remains healthy.

**Host variants**

These hosts have separate robots.txt files:

```text
https://example.com/robots.txt
https://www.example.com/robots.txt
https://shop.example.com/robots.txt
```

If alternate hosts redirect to one preferred host, test how robots.txt is served on every publicly reachable variant. Do not assume one file automatically governs unrelated hosts.

**Common syntax mistakes**

Avoid:

```text
Sitemap: /sitemap.xml
```

The value is not absolute.

Avoid:

```text
Sitemap: https://www.example.com/a.xml, https://www.example.com/b.xml
```

Use one directive per line.

Avoid a stale environment URL:

```text
Sitemap: https://staging.example.com/sitemap.xml
```

Production robots.txt should not advertise a preview or development inventory.

Avoid pointing to a redirect when the final sitemap URL is known. Declare the final public location directly.

## Boundaries

A sitemap directive does not control page crawling.

This line:

```text
Sitemap: https://www.example.com/sitemap.xml
```

does not allow or disallow any page URL. Crawler access is controlled by applicable `User-agent`, `Allow`, and `Disallow` rules. Search exclusion requires an appropriate index-control or access-control mechanism rather than a sitemap declaration.

A sitemap directive also does not establish that the file is valid. The location can still return:

- `404`;
- `403`;
- `429`;
- `5xx`;
- a redirect loop;
- an HTML error page with `200`;
- invalid XML;
- an oversized file;
- URLs on the wrong host;
- redirects and noindexed pages.

Use [Sitemap Could Not Be Read](/articles/sitemap-could-not-be-read) when Google cannot fetch or parse the declared file.

Do not hide important pages behind sitemap-only discovery. Google can use sitemaps to find URLs, but internal links place pages in the site's navigation and contextual structure. See [Internal Links vs. XML Sitemaps](/articles/internal-links-vs-xml-sitemaps).

Do not confuse robots blocking with removal from search. A blocked page URL may still appear based on other signals because the crawler cannot retrieve its content. See [URL Blocked by Robots.txt](/articles/url-blocked-by-robots-txt).

Validate the public robots.txt response after every routing, CDN, framework, or hostname change:

```text
Correct host
HTTP 200
Plain-text response
Expected crawler rules
Absolute sitemap URLs
No staging references
No duplicate obsolete directives
Every declared sitemap returns successfully
```

The directive is valuable because it is simple and durable. Keep it that way. A crawler needs a correct absolute location, not a sitemap scavenger hunt assembled from redirects, environment aliases, and three generations of forgotten plugins.
