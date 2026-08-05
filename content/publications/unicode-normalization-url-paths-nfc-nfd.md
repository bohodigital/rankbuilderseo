---
{
  "slug": "unicode-normalization-url-paths-nfc-nfd",
  "title": "Unicode Normalization in URL Paths: NFC and NFD Canonicalization Checklist",
  "description": "Audit NFC and NFD Unicode URL paths across slugs, filesystems, databases, caches, redirects, canonicals, sitemaps, and percent encoding.",
  "format": "Checklist",
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
  "directAnswer": "Unicode can represent some visually identical text through different code-point sequences.",
  "takeaways": [
    "Visual equality is not byte equality.",
    "Do not compare screenshots.",
    "Unicode distinguishes canonical normalization from compatibility normalization."
  ],
  "claimLimits": [
    "Unicode normalization defines equivalence at the character level. Resource identity remains an application decision. Search engines, browsers, filesystems, and databases can normalize or serialize differently."
  ],
  "citations": [
    {
      "id": "rb24-13-source-1",
      "title": "Unicode Normalization Forms",
      "url": "https://www.unicode.org/reports/tr15/",
      "publisher": "Unicode Consortium",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-13-source-2",
      "title": "String.prototype.normalize()",
      "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize",
      "publisher": "MDN Web Docs",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-13-source-3",
      "title": "RFC 3986: URI Generic Syntax",
      "url": "https://www.rfc-editor.org/rfc/rfc3986",
      "publisher": "RFC Editor",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-13-source-4",
      "title": "URL structure best practices",
      "url": "https://developers.google.com/search/docs/crawling-indexing/url-structure",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "url-parameters-seo",
    "trailing-slash-seo",
    "www-vs-non-www-seo",
    "display-contents-google-indexing"
  ]
}
---

## Checklist

- **Inspect code points.**
- **Canonical versus compatibility normalization.**
- **Percent-encoded paths.**
- **Filesystem behavior.**
- **Database behavior.**
- **Slug generation.**
- **Redirect proven equivalents.**

**Direct answer.**

Unicode can represent some visually identical text through different code-point sequences.

Example conceptually:

```text
é
```

can be represented as:

```text
U+00E9
```

or:

```text
U+0065 U+0301
```

Unicode Normalization Form C, or NFC, tends to use composed sequences where available. NFD decomposes characters into canonical components.[@rb24-13-source-1]

These strings can look identical while producing different URL bytes after UTF-8 percent encoding.

For public URL slugs, choose one normalization policy, generate one form consistently, and redirect only after verifying that alternate forms identify the same resource.

**What to remember.**

- Visual equality is not byte equality.
- NFC and NFD are canonical normalization forms, not language translation.
- Percent encoding happens after character encoding and can expose the byte difference.
- Filesystems and databases can normalize differently.
- Never merge two paths solely because they look similar.

**Inspect code points.**

Do not compare screenshots.

Use a diagnostic script:

```js
const value = "café";
console.log([...value].map(ch => ch.codePointAt(0).toString(16)));
console.log(value.normalize("NFC"));
console.log(value.normalize("NFD"));
```

MDN documents `String.prototype.normalize()` for NFC, NFD, NFKC, and NFKD.[@rb24-13-source-2]

Preserve the raw and normalized strings in a controlled test.

**Canonical versus compatibility normalization.**

Unicode distinguishes canonical normalization from compatibility normalization.[@rb24-13-source-1]

Use caution with:

- NFKC;
- NFKD.

Compatibility forms can change distinctions that are visually or semantically meaningful in some contexts.

For URLs, NFC is a common generation policy because it preserves canonical equivalence without applying broad compatibility folding.

That is an implementation choice, not a universal search-engine mandate.

**Percent-encoded paths.**

UTF-8 encodes the normalized sequence into bytes, then URL serialization can percent-encode those bytes.

Two visually identical paths can become different request targets:

```text
/caf%C3%A9/
/cafe%CC%81/
```

Request both.

Record:

- raw URL;
- decoded path;
- code points;
- status;
- final URL;
- response body;
- canonical;
- cache key;
- storage key.

**Filesystem behavior.**

Some filesystems normalize names automatically or display them in a normalized form.

A static-site build can:

- generate one filename;
- commit another byte sequence;
- upload a third serialization;
- serve both through a CDN rule.

Do not use Finder or Explorer display alone as proof of filename identity.

Inspect repository and deployment bytes.

**Database behavior.**

Database collation and normalization are separate concerns.

A database can treat two Unicode strings as:

- equal;
- different;
- equal for sorting but different for uniqueness;
- normalized by an application layer.

Test the exact production collation and ORM behavior.

Do not allow two content records to generate visually identical slugs under different sequences.

**Slug generation.**

Define:

```text
INPUT_NORMALIZATION: NFC
CASE_POLICY: lower
SPACE_POLICY: hyphen
PUNCTUATION_POLICY: documented
TRANSLITERATION: none or explicit
```

Normalize before uniqueness checks.

Then generate:

- route;
- canonical;
- internal link;
- sitemap URL;
- hreflang URL;
- structured-data identifier;

from the same canonical slug field.

**Redirect proven equivalents.**

When both paths already exist and return the same content:

```text
NFD variant
301 or 308 → NFC variant
```

Use one direct hop.

Before redirecting, verify that the application does not intentionally distinguish the strings.

Do not apply a global compatibility-normalization redirect across user-generated identifiers or signed paths without security review.

## Completion criteria

**Cache and signature risks.**

A CDN can use raw bytes in its cache key.

Signed URLs can hash the exact path.

Normalization can therefore:

- create separate cache entries;
- invalidate signatures;
- bypass path rules;
- alter storage keys;
- break OAuth callbacks.

Exclude security-sensitive routes until the canonical request format is defined.

**Search signals.**

Google recommends simple, descriptive URL structures and coherent canonical signals.[@rb24-13-source-3][@rb24-13-source-4]

Google does not publish a universal NFC-versus-NFD preference.

The site should provide:

- one generated form;
- one self-canonical;
- one sitemap form;
- one internal-link form;
- redirects from proven duplicates.

Do not rely on the search engine to discover that two byte sequences display identically.

**Checklist.**

- Raw URL strings preserved.
- Code points inspected.
- NFC and NFD compared.
- Compatibility normalization avoided unless justified.
- UTF-8 percent encoding inspected.
- Filesystem behavior tested.
- Database collation tested.
- Slug generator normalizes before uniqueness checks.
- Canonicals use one form.
- Sitemaps and links use one form.
- Proven equivalents redirect directly.
- Cache keys reviewed.
- Signed routes excluded or tested.
- Search Console monitored.

**Evidence limits.**

Unicode normalization defines equivalence at the character level. Resource identity remains an application decision. Search engines, browsers, filesystems, and databases can normalize or serialize differently.
