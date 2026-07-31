---
{
  "slug": "xml-sitemap-size-limits",
  "title": "XML Sitemap Size Limits: 50,000 URLs, 50 MB, and When to Split",
  "description": "Understand Google's sitemap URL and uncompressed file-size limits, when to split a sitemap, how sitemap index files work, and how to validate the result.",
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
  "directAnswer": "A single sitemap can contain no more than 50,000 URLs and cannot exceed 50 MB uncompressed. Split the file as soon as either limit would be exceeded, keep every child sitemap below both limits, and use a sitemap index when one submission should organize several sitemap files.",
  "takeaways": [
    "The 50 MB limit applies to the uncompressed sitemap, even when the submitted file uses gzip compression.",
    "A sitemap must be split when either the URL-count limit or the uncompressed byte limit is reached.",
    "A sitemap index can list up to 50,000 child sitemap locations and can organize files by stable operational boundaries.",
    "Splitting a sitemap does not create a ranking benefit; it makes a large URL inventory valid and easier to operate."
  ],
  "claimLimits": [
    "Sitemap submission is a discovery hint rather than a guarantee that every listed URL will be fetched, selected as canonical, indexed, ranked, or shown to users."
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
      "id": "b9-google-large-sitemaps",
      "title": "Manage your sitemaps with a sitemap index file",
      "url": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps",
      "publisher": "Google",
      "accessedAt": "2026-07-31"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "sitemap-in-robots-txt",
    "sitemap-could-not-be-read",
    "internal-links-vs-xml-sitemaps",
    "xml-sitemap-lastmod"
  ]
}
---

## Definition

A sitemap is a machine-readable inventory of URLs or files that a site wants search engines to know about. It is not an unlimited database export.

Google applies two limits to every individual sitemap, regardless of whether the file uses XML, text, RSS, Atom, or another supported sitemap format:

- no more than **50,000 URLs**;
- no more than **50 MB uncompressed**.

The first limit reached controls the decision. A file containing 50,001 short URLs is too large even if it occupies only a few megabytes. A file containing 30,000 unusually long entries is also too large if its uncompressed size exceeds 50 MB. Google states that larger inventories must be divided into multiple sitemaps and may be organized through a sitemap index. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@b9-google-build-sitemap]

Compression can reduce bandwidth, but it does not change the underlying limit. A `.xml.gz` file that transfers as 8 MB but expands to 58 MB remains over the 50 MB uncompressed maximum.

A sitemap index is a separate file that lists child sitemap files instead of page URLs. Google allows one sitemap index to contain as many as 50,000 child sitemap locations. It also permits up to 500 submitted sitemap index files per site in Search Console. [Manage your sitemaps with a sitemap index file](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)[@b9-google-large-sitemaps]

## Mechanism

Start by measuring the generated file rather than estimating from the number of records in the CMS.

For each sitemap, record:

1. URL count.
2. Uncompressed byte size.
3. Compressed byte size, when gzip is used.
4. Content type or operational group.
5. Generation time.
6. Last successful validation.
7. Public response status.

Split the inventory before either hard limit is reached. Leaving a reasonable buffer prevents one publishing event from pushing a previously valid file over the boundary.

A site with 72,000 canonical pages could create:

```text
/sitemaps/articles-1.xml  36,000 URLs
/sitemaps/articles-2.xml  36,000 URLs
```

It could also divide the files by a stable content boundary:

```text
/sitemaps/articles.xml
/sitemaps/products.xml
/sitemaps/categories.xml
```

The second design is often easier to monitor because an error or unusual change can be traced to one content family. The grouping should reflect maintenance, ownership, update behavior, or reporting needs rather than an invented belief that a particular filename receives better rankings.

A sitemap index has this logical structure:

```text
sitemapindex
  sitemap
    loc: https://www.example.com/sitemaps/articles.xml.gz
    lastmod: 2026-07-31
  sitemap
    loc: https://www.example.com/sitemaps/products.xml.gz
    lastmod: 2026-07-30
```

In an index, `lastmod` describes when the referenced sitemap file changed. It does not claim that every page inside the child sitemap changed on that date.

Google requires referenced sitemaps to remain on the same site as the index unless cross-site submission has been configured. Child sitemap locations normally must be in the same directory as the index or below it in the site hierarchy. An index at `/public/sitemap-index.xml` should not casually list a sitemap above `/public/`. [Manage your sitemaps with a sitemap index file](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)[@b9-google-large-sitemaps]

The generation pipeline should fail closed when a child file exceeds either limit. Do not silently truncate the sitemap, emit malformed content, or produce a partial index that looks successful.

## Examples

**More than 50,000 URLs**

A publication has 61,200 canonical article URLs. One file is invalid by count even if it remains below 50 MB.

A sensible split might be:

```text
articles-current.xml  41,200 URLs
articles-archive.xml  20,000 URLs
```

The split is operationally meaningful if current and archived inventory have different update schedules. A simple numeric split is also valid when no stable content boundary exists.

**Fewer than 50,000 URLs but more than 50 MB**

An international catalog has 42,000 entries containing long alternate-language annotations and image data. The file reaches 57 MB uncompressed.

The correct response is to divide the sitemap. The URL count does not excuse the byte-size violation.

**Compressed sitemap**

The server publishes:

```text
products.xml.gz
```

The network transfer is 9 MB, but decompression produces a 54 MB sitemap. The file is still too large. Compression is a transport optimization, not a larger sitemap allowance.

**Several small sitemaps**

A site may use several sitemaps even when all URLs fit in one file. Separate files can support:

- different teams;
- different generation systems;
- clearer Search Console reporting;
- isolated troubleshooting;
- distinct update schedules;
- specialized image, video, or news metadata.

Do not create hundreds of tiny files without an operational reason. More files create more fetches, more failure points, more index entries, and more things for a human to misname at 2 a.m.

**Submitting the index**

A site can submit the sitemap index through Search Console or declare it in robots.txt:

```text
Sitemap: https://www.example.com/sitemap-index.xml
```

See [Sitemap in Robots.txt](/articles/sitemap-in-robots-txt) for directive syntax and multiple-file behavior.

## Boundaries

A valid sitemap still needs valid inventory.

List URLs that are:

- absolute and fully qualified;
- on the intended protocol and hostname;
- canonical or intended canonical candidates;
- publicly reachable when they are meant for search;
- free of redirect chains;
- not obvious `404`, `410`, or server-error routes;
- consistent with the sitemap's directory and site scope.

Google attempts to crawl URLs as listed. Relative paths such as `/article/example` do not belong in a sitemap; use the complete URL. Google also recommends listing the canonical URLs that the site wants shown in search. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)[@b9-google-build-sitemap]

Do not confuse file organization with page importance. The first URL in a sitemap does not receive privileged treatment, and a URL does not rank better because it appears in a smaller child file.

Do not use a sitemap index as a recursive directory tree. Use it to list sitemap files, and submit additional index files separately when the operation genuinely requires more than one index.

Validate every child file independently:

```text
Public URL returns 200
File parses successfully
URL count is at most 50,000
Uncompressed size is at most 50 MB
URLs use the intended host and protocol
No child reference redirects
No unexpected HTML error body is returned
```

Use [Sitemap Could Not Be Read](/articles/sitemap-could-not-be-read) when Search Console cannot fetch or parse the file, [Internal Links vs. XML Sitemaps](/articles/internal-links-vs-xml-sitemaps) when a page relies only on sitemap discovery, and [XML Sitemap lastmod](/articles/xml-sitemap-lastmod) when the file dates change on every deployment.

A sitemap should be split because a technical or operational boundary requires it, not because more files look like more SEO work.
