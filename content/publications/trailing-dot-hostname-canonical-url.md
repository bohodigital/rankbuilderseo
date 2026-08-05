---
{
  "slug": "trailing-dot-hostname-canonical-url",
  "title": "Trailing-Dot Hostnames and Canonical URLs: example.com. Is a Different URL String",
  "description": "Understand example.com. versus example.com across DNS, URLs, TLS, cookies, origins, redirects, canonicals, caches, analytics, and security.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "DNS fully qualified domain names can be written with a trailing dot: The dot marks the DNS root.",
  "takeaways": [
    "RFC 1034 describes domain names relative to the root and uses the trailing dot to show an absolute fully qualified name.",
    "The URL host component can preserve the trailing dot under browser URL processing.",
    "A certificate for: may not validate a request for: Client and certificate-library behavior can vary, but the trailing-dot form can trigger hostname mismatch."
  ],
  "claimLimits": [
    "DNS standards explain the trailing root label. URL, TLS, browser, and application behavior can vary. Google does not publish a special trailing-dot canonical rule; the site must provide one coherent reachable host."
  ],
  "citations": [
    {
      "id": "rb24-20-source-1",
      "title": "RFC 1034: Domain Names — Concepts and Facilities",
      "url": "https://datatracker.ietf.org/doc/html/rfc1034",
      "publisher": "Internet Engineering Task Force",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-20-source-2",
      "title": "URL hostname property",
      "url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname",
      "publisher": "MDN Web Docs",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-20-source-3",
      "title": "RFC 3986: URI Generic Syntax",
      "url": "https://www.rfc-editor.org/rfc/rfc3986",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "www-vs-non-www-seo",
    "trailing-slash-seo",
    "canonical-tags-when-they-work",
    "fastapi-seo-html-responses-root-path"
  ]
}
---

## Definition

**Direct answer.**

DNS fully qualified domain names can be written with a trailing dot:

```text
example.com.
```

The dot marks the DNS root.[@rb24-20-source-1]

In ordinary public web use, the same host is normally written:

```text
example.com
```

The DNS names commonly resolve equivalently, but the URL strings are different:

```text
https://example.com/page/
https://example.com./page/
```

That difference can affect:

- TLS certificates;
- origin comparison;
- cookies;
- Host header handling;
- redirects;
- CDN cache keys;
- analytics;
- authentication callbacks;
- security allowlists;
- canonical signals.

Use one public form, usually the dotless host.

**DNS meaning.**

RFC 1034 describes domain names relative to the root and uses the trailing dot to show an absolute fully qualified name.[@rb24-20-source-1]

In DNS configuration and diagnostic tools, the dot can be useful.

Example zone-file target:

```text
mail.example.com.
```

In human-facing HTTPS URLs, the trailing dot is uncommon and can expose compatibility problems.

DNS equivalence does not make every web platform layer equivalent automatically.

## Mechanism

**URL parsing.**

The URL host component can preserve the trailing dot under browser URL processing.[@rb24-20-source-2]

Test:

```js
new URL("https://example.com./page/").hostname
```

Do not assume every library strips it.

Log:

- raw URL;
- parsed hostname;
- Host header;
- origin;
- final URL;
- redirect;
- canonical.

**TLS certificates.**

A certificate for:

```text
example.com
```

may not validate a request for:

```text
example.com.
```

Client and certificate-library behavior can vary, but the trailing-dot form can trigger hostname mismatch.

A redirect cannot run before a secure HTTPS connection succeeds.

Therefore the trailing-dot HTTPS variant can be impossible to consolidate through an application redirect unless the certificate and edge support it.

Test the actual public client behavior.

**HTTP Host handling.**

Servers and proxies can receive:

```text
Host: example.com.
```

Possible behavior:

- reject host;
- route to default site;
- normalize host;
- serve same site;
- redirect;
- bypass an allowlist;
- create a new cache key.

Configure explicit trusted-host rules.

Do not let an unknown Host value generate absolute canonical URLs.

**Origin and cookies.**

Web origins include scheme, host, and port.

A trailing-dot host can be treated as a distinct origin string.

Consequences can include:

- separate cookies;
- failed session;
- CORS mismatch;
- OAuth callback mismatch;
- local storage separation;
- CSP allowlist failure;
- service-worker scope difference.

Do not rely on a canonical tag to repair authentication or origin security.

## Examples

**Redirect policy.**

For HTTP where the host reaches the server safely:

```text
http://example.com./page/
301 or 308 → https://example.com/page/
```

For HTTPS, first verify certificate support.

If the trailing-dot hostname cannot complete TLS, prevent its generation and external promotion. The search engine cannot follow a redirect it cannot retrieve.

Use one direct hop for variants the edge can accept.

**Canonical signals.**

The normal page should self-canonicalize:

```html
<link rel="canonical" href="https://example.com/page/">
```

Align:

- sitemap;
- internal links;
- hreflang;
- structured data;
- Open Graph URL;
- feeds;
- redirects.

Google treats canonicals as signals and can choose another representative when surrounding evidence conflicts.[@rb24-20-source-3]

**Cache and CDN behavior.**

A CDN can distinguish:

```text
example.com
example.com.
```

Review:

- zone matching;
- host normalization;
- cache key;
- WAF;
- bot rules;
- TLS edge;
- origin routing;
- purge behavior.

A trailing-dot request that reaches the wrong tenant is a security incident, not merely duplicate content.

## Boundaries

**Analytics and logs.**

Analytics can record separate page locations or hostnames.

Server logs can show trailing-dot requests from:

- malformed links;
- scanners;
- security tests;
- copied DNS notation;
- application bugs.

Normalize reporting while preserving raw logs for diagnosis.

Do not call the traffic organic duplicate demand without inspecting the source.

**Security review.**

Trailing dots have been used historically to test or bypass hostname and cookie assumptions.

Audit:

- authentication;
- CORS;
- CSP;
- WAF;
- redirect allowlists;
- password-reset URLs;
- email links;
- OAuth;
- tenant routing.

Use standards-aware parsing and exact trusted hosts.

**Completion checklist.**

- Dotless public host chosen.
- Trailing-dot DNS behavior tested.
- TLS behavior tested.
- Host header routing tested.
- Trusted-host validation configured.
- HTTP redirect tested.
- HTTPS limitation documented.
- Canonical uses dotless host.
- Sitemaps and links cleaned.
- Cookies and origin behavior tested.
- CDN cache keys reviewed.
- OAuth and CORS reviewed.
- Analytics normalized.
- Raw logs preserved.

**Evidence limits.**

DNS standards explain the trailing root label. URL, TLS, browser, and application behavior can vary. Google does not publish a special trailing-dot canonical rule; the site must provide one coherent reachable host.
