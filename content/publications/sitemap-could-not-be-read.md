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
  "slug": "sitemap-could-not-be-read",
  "title": "Sitemap Could Not Be Read: A Complete Search Console Checklist",
  "description": "Diagnose a sitemap that Google cannot fetch or parse by checking the exact URL, HTTP response, robots rules, XML syntax, limits, child files, and canonical URLs.",
  "format": "Playbook",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "directAnswer": "When Search Console says a sitemap could not be read, first determine whether Google failed to fetch the file or fetched it but could not parse it. Test the exact submitted URL, require a public successful response, inspect robots and server behavior, then validate the sitemap format, URL scope, escaping, size, and child sitemap references.",
  "takeaways": [
    "Fetch failures and XML parsing failures are different problems and require different checks.",
    "Search Console does not follow redirects for the submitted sitemap URL, so submit the final public file directly.",
    "A valid sitemap helps discovery but does not guarantee that listed URLs will be crawled or indexed."
  ],
  "claimLimits": [
    "A sitemap can be technically valid and still remain unprocessed temporarily, and successful reading does not establish that every listed page is indexable."
  ],
  "relatedContent": [
    "internal-links-vs-xml-sitemaps",
    "google-search-console-page-indexing-report",
    "why-google-isnt-indexing-your-page",
    "technical-seo-baseline",
    "discovered-currently-not-indexed",
    "server-error-5xx",
    "nextjs-page-visible-browser-missing-google",
    "infinite-scroll-pagination-seo"
  ],
  "citations": [
    {
      "id": "gsc-sitemaps-report",
      "title": "Sitemaps report",
      "url": "https://support.google.com/webmasters/answer/7451001?hl=en",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-build-sitemap",
      "title": "Build and submit a sitemap",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "publisher": "Google",
      "accessedAt": "2026-07-26"
    },
    {
      "id": "google-large-sitemaps",
      "title": "Manage your sitemaps with sitemap index files",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps",
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

## Preconditions

![Hand holding an unfolded paper map](/media/sitemap-could-not-be-read-hero.jpg "A sitemap is useful only when Google can reach the exact file and interpret its routes.")

Collect the exact sitemap URL shown in Search Console. Do not reconstruct it from memory or test a similar path.

You need:

Access to the public sitemap response;
the submitted property and protocol;
the sitemap or sitemap-index source;
server or CDN logs when fetch failures are intermittent;
the ability to validate XML and decompress `.gz` files;
a list of recent sitemap-generation or routing changes.

Search Console distinguishes a sitemap it could not fetch from one it fetched but partially parsed with errors. [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)[@gsc-sitemaps-report]

## Ordered process

1. **Identify whether this is a fetch failure or a parse failure.**

Use the top-level status and the detail page.

| Report result | Meaning | First investigation |
| --- | --- | --- |
| Couldn’t fetch | Google did not retrieve the sitemap successfully | URL, robots, access, HTTP, DNS, server |
| Sitemap could not be read | The fetch failed; inspect the detailed reason | Live test and fetch diagnostics |
| Sitemap had errors | Google fetched at least part of the file | XML, URL entries, limits, child files |
| Success | Google fetched and processed the file | Review discovered URLs separately |

Do not debug XML syntax first when Google cannot reach the file at all.

2. **Test the exact submitted URL.**

Copy the full sitemap URL from Search Console and run a live URL Inspection test. [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en-FM)[@gsc-url-inspection]

Confirm:

- Crawl allowed: Yes
- Page fetch: Successful
- No login requirement
- No bot challenge
- No host or certificate failure

Google recommends this exact live test when diagnosing sitemap fetch errors. [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)[@gsc-sitemaps-report]

3. **Inspect the raw HTTP response.**

A sitemap should return a stable successful response.

Check:

```text
HTTP status
Content-Type
Content-Encoding
Content-Length
Redirects
Cache behavior
```

The submitted URL should be the final sitemap URL. Search Console’s Sitemaps report does not treat a redirecting submission as an invitation to guess the intended file.

Problem patterns include:

- `404` because the generated filename changed;
- `401` or `403` from authentication or a WAF;
- `429` rate limiting;
- `5xx` origin or CDN failures;
- HTML error content returned with `200`;
- a bot challenge instead of XML;
- an unstable redirect;
- an expired TLS certificate.

4. **Check robots.txt and access controls.**

Google respects robots.txt when fetching sitemaps. Remove any rule that blocks the sitemap file.

Also check:

- CDN bot management;
- IP allowlists;
- geographic restrictions;
- signed URLs;
- middleware;
- maintenance mode;
- staging authentication.

A sitemap should be publicly fetchable without cookies or credentials.

5. **Confirm a supported format.**

Google supports XML, text, RSS, Atom, and sitemap-index formats. Use the format intentionally.

A minimal XML sitemap looks like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/articles/example/</loc>
    <lastmod>2026-07-26</lastmod>
  </url>
</urlset>
```

Google requires absolute, fully qualified URLs and recommends listing the canonical URLs you want shown in search. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@google-build-sitemap]

6. **Validate XML syntax and escaping.**

Look for:

- missing XML declaration;
- wrong namespace;
- unescaped `&`, `<`, or `>`;
- curly quotation marks;
- duplicate `<loc>` tags;
- missing required tags;
- invalid dates;
- malformed or relative URLs;
- unsupported tags;
- leading output from an application warning;
- HTML surrounding the XML.

For example, a query string must escape `&`:

```xml
<loc>https://example.com/search?a=1&amp;b=2</loc>
```

A browser may display malformed XML in a way that looks readable. Use an XML parser, not eyesight alone.

7. **Check URL scope and property alignment.**

Confirm that:

- the sitemap belongs to the correct Search Console property;
- protocol and hostname match;
- child URLs are within the allowed site scope;
- cross-site submissions follow verified-ownership rules;
- the file is not in a subdirectory while listing prohibited higher-level paths;
- canonical URLs, not redirecting alternates, are listed.

Property confusion between HTTP, HTTPS, `www`, and non-`www` is a common source of meaningless troubleshooting.

8. **Check sitemap size and count limits.**

One sitemap may contain at most:

- 50,000 URLs;
- 50 MB uncompressed.

Larger inventories require multiple sitemap files and a sitemap index. [Manage your sitemaps with sitemap index files](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)[@google-large-sitemaps]

A sitemap index may list sitemap files, not another nested sitemap index.

9. **Check compressed files.**

For `.gz` sitemaps:

- confirm the file decompresses successfully;
- confirm the uncompressed file is within limits;
- confirm it contains the expected XML;
- confirm the server does not apply confusing double compression;
- confirm the submitted URL matches the actual file.

A compression error is separate from invalid XML.

10. **Inspect child sitemaps.**

A valid index can still reference broken child files.

For each child:

- fetch the absolute URL;
- verify `200`;
- validate its XML;
- check size and URL count;
- confirm canonical URL scope;
- check robots and access;
- confirm it is a sitemap, not another sitemap index.

Search Console may process some child sitemaps while others fail.

11. **Review listed page URLs after the file succeeds.**

A readable sitemap can still contain poor inventory:

- redirects;
- `404` pages;
- blocked URLs;
- `noindex` pages;
- duplicate alternates;
- noncanonical hostnames;
- parameter URLs;
- stale pages;
- inaccurate `lastmod` dates.

Successful sitemap processing only means Google could read the file. It does not guarantee crawling or indexing. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@google-build-sitemap]

12. **Resubmit only after the live file is correct.**

If a fetch failed repeatedly, fix the public response and submit the exact final URL again.

If the detail shows a temporary processing issue and live testing succeeds, allow time before repeatedly deleting and resubmitting the file. More button presses do not repair Google’s queue or your XML.

## Failure cases

**A browser view is treated as proof.** Your browser may receive a different response than Googlebot.
**A redirecting sitemap is submitted.** Submit the final URL directly.
**HTML is returned with `200`.** A branded error page is not XML.
**The wrong property is open.** An HTTPS sitemap is being managed under the HTTP property or another hostname.
**The XML is valid but the URLs are wrong.** Redirects, alternates, or out-of-scope URLs reduce usefulness.
**A sitemap index contains another index.** Nested indexes are unsupported.
**The file exceeds limits after decompression.** Split it.
**The sitemap is mistaken for an indexing command.** It is a discovery signal.
**Repeated resubmission replaces diagnosis.** Fix the exact fetch or parse failure first.

## Completion criteria

The sitemap repair is complete when:

- the exact submitted URL is public and returns a stable successful response;
- URL Inspection reports a successful live fetch;
- robots, authentication, CDN, and server rules allow access;
- the file uses a supported format;
- XML parsing succeeds;
- URL scope, protocol, and hostname are correct;
- size and count limits are respected;
- child sitemaps succeed independently;
- listed URLs are canonical, useful, and intended for search;
- Search Console reports success or a later bounded check confirms the corrected file is awaiting processing rather than still failing.

After success, monitor the Page Indexing report for the listed URLs. Do not treat the sitemap’s success status as proof that every page entered the index.
