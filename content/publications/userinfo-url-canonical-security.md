---
{
  "slug": "userinfo-url-canonical-security",
  "title": "Userinfo in URLs: The Text Before @ Is Not the Host",
  "description": "Learn why username:password@host URLs are unsafe for canonicals, how userinfo can mislead readers, and how to normalize links, redirects, logs, and sitemaps.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "review",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "A URI can contain a userinfo component before the hostname: The host is example.com , not user and not any text earlier in the string.",
  "takeaways": [
    "The generic URI authority is conceptually: The last @ separating the authority components identifies the boundary between userinfo and host under standards-aware parsing.",
    "URLs can appear in: browser history; bookmarks; referrer data; server logs; proxy logs; analytics; screenshots; support tickets; clipboard history; monitoring alerts.",
    "Browsers and URL libraries can reject, hide, normalize, or display userinfo differently."
  ],
  "claimLimits": [
    "Some URI schemes use userinfo for scheme-specific purposes. This article addresses public HTTP and HTTPS content URLs. Security handling must follow the application’s authentication and incident-response requirements."
  ],
  "citations": [
    {
      "id": "rb24-06-source-1",
      "title": "RFC 3986: URI Generic Syntax",
      "url": "https://datatracker.ietf.org/doc/html/rfc3986",
      "publisher": "IETF",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-06-source-2",
      "title": "How to specify a canonical URL",
      "url": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "www-vs-non-www-seo",
    "canonical-tags-when-they-work",
    "seo-vendor-security-due-diligence-playbook"
  ]
}
---

## Dataset and period

**Direct answer.**

A URI can contain a `userinfo` component before the hostname:

```text
https://user@example.com/path
https://user:password@example.com/path
```

The host is `example.com`, not `user` and not any text earlier in the string. RFC 3986 says the `user:password` form is deprecated and warns that userinfo can expose secrets or mislead readers about the actual authority.[@rb24-06-source-1]

Public content URLs should normally contain no userinfo.

Do not publish userinfo in:

- canonical tags;
- XML sitemaps;
- hreflang;
- structured data;
- internal links;
- redirects;
- social metadata;
- email templates.

**How parsing works.**

The generic URI authority is conceptually:

```text
[userinfo@]host[:port]
```

The last `@` separating the authority components identifies the boundary between userinfo and host under standards-aware parsing.

A deceptive string can look like:

```text
https://trusted.example.com&login@evil.example.net/
```

The actual host is `evil.example.net`.[@rb24-06-source-1]

Never determine the host by searching for the first domain-looking substring.

## Methodology

**Why credentials in URLs are dangerous.**

URLs can appear in:

- browser history;
- bookmarks;
- referrer data;
- server logs;
- proxy logs;
- analytics;
- screenshots;
- support tickets;
- clipboard history;
- monitoring alerts.

A password embedded in a URL can spread far beyond the original request. RFC 3986 says URI producers should not include a username or password intended to be secret.[@rb24-06-source-1]

Use modern authentication mechanisms instead.

**Browser behavior is not a policy.**

Browsers and URL libraries can reject, hide, normalize, or display userinfo differently. Some modern browsers make credential-bearing HTTP URLs difficult or impossible to use interactively.

Do not rely on display suppression as security. The raw string can still exist in source code, logs, APIs, redirects, or imported content.

## Result

**Canonical tags.**

Bad:

```html
<link rel="canonical" href="https://editor:secret@example.com/page/">
```

Better:

```html
<link rel="canonical" href="https://example.com/page/">
```

Google recommends absolute canonical URLs and coherent signals.[@rb24-06-source-2] A credential-bearing canonical creates a malformed public identity and can expose secrets.

If a CMS generated the canonical from the request URL, fix the URL builder. Do not merely redact the visible HTML while other systems keep generating userinfo.

**Redirects.**

If public userinfo variants reach the same content, normalize them only after security review.

A safe application can reject them:

```text
400 Bad Request
```

or redirect to the clean public URL when no authentication state is involved.

Do not forward the userinfo into the Location header.

Do not preserve embedded credentials across hosts.

**Logs and analytics.**

Search logs for:

```text
://[^/]*@
```

but use a real URI parser before taking action. Encoded characters and unusual schemes can defeat simple regular expressions.

Redact userinfo before broad log distribution. Preserve protected forensic evidence under a restricted incident process.

In analytics, keep the clean host and path. Do not create a high-cardinality dimension containing raw credential-bearing URLs.

## Limitations

**Migration and import defects.**

Userinfo can enter a site through:

- copied browser links;
- old FTP exports;
- CMS imports;
- crawler databases;
- proxy configuration;
- staging credentials;
- malformed Markdown;
- scraped source lists.

Before migration, scan:

- content fields;
- redirects;
- canonical tables;
- sitemaps;
- feeds;
- structured data;
- configuration.

Any discovered password should be treated as potentially exposed and rotated.

**Host validation.**

Use a URL parser:

```js
const url = new URL(input);
console.log(url.username);
console.log(url.password);
console.log(url.hostname);
```

Validate the parsed hostname against an allowlist where the application redirects, fetches, or generates public metadata.

Do not validate the raw prefix.

**Completion checklist.**

- Raw URL sources scanned for userinfo.
- Parsed hostname verified.
- Canonicals contain no userinfo.
- Sitemaps and hreflang are clean.
- Redirects do not preserve credentials.
- Logs redact userinfo.
- Analytics excludes raw secrets.
- Imported content cleaned.
- Exposed credentials rotated.
- Host allowlist applied where needed.
- Public URL builder tested.

**Evidence limits.**

Some URI schemes use userinfo for scheme-specific purposes. This article addresses public HTTP and HTTPS content URLs. Security handling must follow the application’s authentication and incident-response requirements.
