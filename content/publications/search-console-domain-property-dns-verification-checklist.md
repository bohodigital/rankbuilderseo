---
{
  "slug": "search-console-domain-property-dns-verification-checklist",
  "title": "Search Console Domain Property DNS Verification Checklist",
  "description": "Verify a Search Console Domain property through DNS with checks for scope, TXT and CNAME records, propagation, ownership, token retention, security, and offboarding.",
  "format": "Checklist",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Owners and marketing leads",
  "evidenceLevel": "Primary sources",
  "state": "review",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "A Search Console Domain property covers the verified domain across: HTTP and HTTPS; all subdomains; all paths.",
  "takeaways": [
    "Enter the domain without: protocol; path; trailing slash.",
    "A Domain property is broad.",
    "Search Console generates a DNS record value."
  ],
  "claimLimits": [
    "DNS propagation and provider interfaces vary. Search Console permissions and verification methods can change. Product ownership does not establish legal ownership of the domain or business."
  ],
  "citations": [
    {
      "id": "rb24-18-source-1",
      "title": "Add a website property to Search Console",
      "url": "https://support.google.com/webmasters/answer/34592?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-18-source-2",
      "title": "Verify site ownership",
      "url": "https://support.google.com/webmasters/answer/9008080?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "search-console-domain-vs-url-prefix-property",
    "search-console-site-verification-methods",
    "seo-agency-domain-registrar-access"
  ]
}
---

## Checklist

- **Choose the exact domain.**
- **Understand the scope.**
- **Obtain the verification record.**
- **Identify the authoritative DNS provider.**
- **Preserve existing records.**
- **Wait for propagation.**
- **Verify in Search Console.**
- **Keep the token.**
- **Security and least privilege.**

**Direct answer.**

A Search Console Domain property covers the verified domain across:

- HTTP and HTTPS;
- all subdomains;
- all paths.[@rb24-18-source-1]

Example:

```text
example.com
```

can include:

```text
http://example.com/
https://example.com/
https://www.example.com/
https://shop.example.com/
```

Google currently requires DNS verification for Domain properties.[@rb24-18-source-1][@rb24-18-source-2]

The business should keep durable control of the DNS record and at least two business-controlled Search Console owners.

**Choose the exact domain.**

Enter the domain without:

- protocol;
- path;
- trailing slash.

Correct:

```text
example.com
```

Wrong:

```text
https://example.com/
example.com/blog/
```

For a specific protocol or path, use a URL-prefix property instead.

**Understand the scope.**

A Domain property is broad.

Before granting access, consider that it can expose Search Console data for:

- public site;
- store;
- support portal;
- staging subdomain if publicly crawlable;
- regional subdomains;
- old hosts;
- API or asset hosts that appear in reports.

Do not grant a vendor Domain-property Owner because it works on one folder.

Use Full or Restricted user access where sufficient.

**Obtain the verification record.**

Search Console generates a DNS record value.

Common method:

```text
Type: TXT
Name/Host: @ or provider-specific root value
Value: google-site-verification=...
```

Some DNS providers support an integrated flow or CNAME method under Google's documented verification options.[@rb24-18-source-2]

Copy the exact value.

Do not add quotation marks unless the DNS provider requires them as interface syntax.

**Identify the authoritative DNS provider.**

The registrar is not always the DNS host.

Check authoritative nameservers.

Possible DNS operators:

- Cloudflare;
- registrar DNS;
- managed hosting;
- enterprise DNS;
- another provider.

Add the record where the authoritative nameservers are managed.

A perfect TXT record in the wrong dashboard is a decorative configuration.

**Preserve existing records.**

Adding a verification TXT value should not require deleting unrelated TXT records.

Review existing:

- SPF;
- DKIM;
- DMARC;
- other Google verification;
- Microsoft verification;
- security records;
- service ownership records.

Do not replace the entire TXT set with the Search Console value.

**Wait for propagation.**

DNS changes can take time to propagate.

The provider's TTL, resolver cache, delegation, and publication process affect timing.[@rb24-18-source-2]

Verify through multiple resolvers where practical.

Do not repeatedly delete and recreate the record during propagation.

That resets the evidence and makes the operator feel busy, which unfortunately is not the same as making DNS faster.

**Verify in Search Console.**

After the record is publicly visible:

1. return to Search Console;
2. click Verify;
3. preserve the property identifier;
4. record the verified owner;
5. add a backup business owner;
6. grant agency user access separately.

A successful verification proves control at that moment.

**Keep the token.**

Google advises keeping the verification token in place to maintain verification.[@rb24-18-source-2]

Do not remove it during DNS cleanup merely because verification already succeeded.

Record:

```text
PROPERTY:
DNS_PROVIDER:
RECORD_TYPE:
RECORD_NAME:
TOKEN_OWNER:
VERIFIED_AT:
REVIEW_DATE:
```

Do not place the full token in a public document.

**Security and least privilege.**

DNS edit access can change:

- website routing;
- email;
- verification;
- certificates;
- third-party services.

A vendor needing Search Console access does not necessarily need permanent DNS administration.

Safer workflow:

- business owner adds record;
- business remains verified owner;
- vendor receives Search Console Full user;
- DNS access is removed or never granted.

## Completion criteria

**Multiple owners and methods.**

Maintain more than one business-controlled owner.

Use a durable method such as DNS for the Domain property.

Review legacy verification methods:

- HTML file;
- meta tag;
- Analytics;
- Tag Manager;
- provider integration.

A delegated or verified owner can retain control through an old token even after a user is removed from the interface.

**Offboarding.**

At agency exit:

- remove agency users;
- remove delegated owners;
- review all verification methods;
- confirm DNS token belongs to business control;
- review related Analytics and Tag Manager access;
- review associations;
- preserve property history;
- confirm backup owners.

Do not delete the property to remove the agency. Remove the agency.

**Checklist.**

- Exact root domain selected.
- Domain scope understood.
- Authoritative DNS provider identified.
- Exact TXT or CNAME value copied.
- Existing TXT records preserved.
- Public DNS response verified.
- Propagation allowed.
- Verification completed.
- Token retained.
- Two business owners maintained.
- Vendor receives least privilege.
- DNS edit access bounded.
- Verification methods inventoried.
- Offboarding tested.

**Evidence limits.**

DNS propagation and provider interfaces vary. Search Console permissions and verification methods can change. Product ownership does not establish legal ownership of the domain or business.
