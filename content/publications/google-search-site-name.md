---
{
  "slug": "google-search-site-name",
  "title": "Google Site Name Wrong or Missing: Fix the Home-Page Signals",
  "description": "How Google chooses a site name, why subdirectories cannot claim one, and how to align WebSite structured data with crawlable home-page branding.",
  "format": "Playbook",
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
  "directAnswer": "Put one consistent WebSite structured-data node on the crawlable domain or subdomain home page, use the canonical home-page URL, provide a concise name and useful alternateName values, and align the visible home-page branding, title, headings, and og:site_name.",
  "takeaways": [
    "A site name is a domain- or subdomain-level source label, not a per-page title.",
    "WebSite structured data on the home page is the strongest publisher-controlled preference.",
    "Site names are not supported at the subdirectory level.",
    "Conflicting home-page versions, redirects, structured-data nodes, and visible branding reduce confidence."
  ],
  "claimLimits": [
    "Google’s site-name system is automated and may show a domain or alternate name even when valid structured data is present."
  ],
  "citations": [
    {
      "id": "site-name-google",
      "title": "Provide a site name to Google Search",
      "url": "https://developers.google.com/search/docs/appearance/site-names",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-sitelinks-how-they-work",
    "favicon-not-showing-google-search",
    "google-title-link-rewrites"
  ]
}
---

## Preconditions

Record the exact displayed site name, query, country, device, affected hostname, and date. Separate the site name from the title link: the site name identifies the source website, while the title link describes one page.

Google’s site-name generation is automated. It considers `WebSite` structured data, home-page content, references elsewhere on the web, `og:site_name`, the home-page title, headings, and other visible text. Google says `WebSite` structured data is the most important publisher-controlled preference. [@site-name-google]

Before editing markup, determine whether the intended site is:

- The domain-level site
- A distinct subdomain-level site
- Merely a subdirectory

Google currently supports site names for domains and subdomains, not subdirectories. `example.com/news` cannot independently claim a site name, while `news.example.com` can.

Also map every version of the home page that users or crawlers can reach. Include HTTP and HTTPS, `www` and non-`www`, trailing-slash variants, international hostnames, mobile hostnames, CDN aliases, and any old domain that still redirects. A technically correct `WebSite` node on one URL does little good when Google repeatedly encounters a different host, a redirect loop, or a home page with contradictory branding.

Record the current canonical, final redirect target, response status, rendered structured data, and visible brand name for each version. This produces a concrete conflict map instead of a vague belief that “the schema is installed.”

## Ordered process

1. **Choose the actual preferred name.**

Use a concise, recognized identity. Avoid generic phrases such as “Best Accountants in Ohio” unless that is genuinely the established brand. The preferred name should match how the site identifies itself to users.

Document the exact preferred spelling, capitalization, spacing, punctuation, abbreviation, and domain fallback before implementation. This prevents one team from publishing “ExampleCo,” another from publishing “Example Co.,” and a plugin from inventing “Example Company Official Website.” Those variants may all look harmless to humans, whose species has somehow survived inconsistent naming conventions, but they weaken the clarity of the signal.

2. **Add one `WebSite` node to the home page.**

The node needs:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example",
  "url": "https://example.com/"
}
```

Add `alternateName` when the site has a recognized acronym, shortened brand, spelling variant, or domain fallback.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Burnt Toast",
  "alternateName": ["BT", "Burnt Toast Shop", "example.com"],
  "url": "https://example.com/"
}
```

Google says alternatives are considered in preference order. A lowercase domain or subdomain can be supplied as a backup when the preferred brand is not selected. [@site-name-google]

Keep the node server-rendered when practical so it is present in the initial document and does not depend on a delayed client-side script. Use a stable identifier if the site’s structured-data graph links the `WebSite` entity to an `Organization`, but do not merge the two entity types or assume an organization logo property substitutes for a site-name preference.

3. **Use the canonical domain or subdomain root.**

The `url` must identify the home page of the site, such as:

```text
https://example.com/
https://news.example.com/
```

Do not use:

```text
https://example.com/news/
```

as an independent site-name root.

The `url` value should match the preferred protocol and hostname after redirects. A `www` URL in structured data combined with a non-`www` canonical and a third redirect target creates avoidable ambiguity.

4. **Merge duplicate `WebSite` nodes.**

If an SEO plugin, theme, analytics layer, and custom template each emit a `WebSite` object, combine the site-name properties into one coherent node when possible. Conflicting names and URLs do not become more persuasive through repetition.

Inspect both raw and rendered HTML. A framework may inject one graph server-side and another after hydration. Check tag managers and consent-dependent scripts as well, because structured data that appears only for some sessions produces inconsistent crawl evidence.

5. **Align all home-page signals.**

Check:

- Visible logo text
- Main heading
- Home-page title
- `og:site_name`
- Organization branding
- Navigation labels
- Footer identity
- Canonical URL
- Redirect target
- External profiles

The preferred name should be used consistently. Google may fall back to other home-page sources when it is less confident in the structured data.

Do not hide the preferred name only inside an image without useful accessible text. The visible page should communicate the identity plainly enough that a user arriving without prior brand knowledge can tell which site they are on.

6. **Make every home-page version coherent.**

HTTP, HTTPS, `www`, non-`www`, and mobile duplicates should redirect consistently. Google recommends using the same site-name structured data on duplicate home-page versions, not only the canonical one. The final redirect target must remain crawlable.

A redirecting home page should not serve one brand before redirect and another after redirect. Retired domains should point cleanly to the intended replacement rather than preserving obsolete titles, headings, or structured-data nodes in an intermediate response.

7. **Validate with the correct tools.**

Site-name markup is not supported by the Rich Results Test. Use a schema validator for syntax and URL Inspection to confirm that Google can access the home page. Then request recrawling after deployment. [@site-name-google]

Validation should include the live rendered source, not only a copied JSON fragment. Confirm that the deployed node has the expected values, no duplicate IDs, no malformed JSON, and no environment-specific hostname such as a staging or preview domain.

8. **Allow time for both the home page and internal pages.**

Google notes that changes may take days or weeks to be recrawled and processed. Internal result pages can lag behind the home page even after the preferred name begins appearing there.

Do not keep rewriting valid markup every few days. Record deployment time, home-page recrawl evidence, and observed result changes. Repeated edits reset the diagnostic baseline and make it impossible to tell which version Google processed.

9. **Audit external identity conflicts.**

Search for prominent references to the site using an obsolete company name, acronym, merger name, or domain. External references are not directly controllable, but they help explain why an automated system may prefer a well-established alternate name. Correct owned profiles, directories, and major publisher pages where feasible. Do not launch a spam campaign to manufacture exact-match mentions; consistency is the goal, not synthetic repetition.

## Failure cases

**Trying to name a subdirectory.** Site names are not supported for subdirectory-level properties.

**Publishing several `WebSite` objects.** Plugins and templates produce conflicting names, URLs, or IDs.

**Using a slogan as the name.** “Affordable Solutions for Everyone” is marketing copy, not necessarily the recognized site identity.

**Blocking the home page.** Google cannot reliably process the structured data or visible branding.

**Redirecting to another hostname.** The site name can reflect the visible redirect target rather than the original URL.

**Valid markup but inconsistent branding.** Structured data says one name, while the logo, title, headings, and external references use another.

**Testing only with the Rich Results Test.** Site-name markup requires schema validation and live-page inspection instead.

**Expecting an immediate global update.** Internal pages may retain an older source label until they are recrawled and reprocessed.

**Using a staging URL in production markup.** A copied environment configuration can point the site entity at a preview host even while the canonical points elsewhere.

**Treating an Organization node as a substitute.** Organization structured data can describe the publisher or business, but the site-name preference belongs in a `WebSite` node on the home page.

## Completion criteria

The repair is complete when the canonical domain or subdomain home page is crawlable, redirects resolve predictably, one coherent `WebSite` node contains the preferred `name`, canonical `url`, and useful `alternateName` values, and visible home-page branding uses the same identity.

Duplicate home-page versions should carry consistent data or redirect cleanly. Schema validation should pass. URL Inspection should show the deployed markup. Operators should record when the home page was recrawled rather than repeatedly changing correct data during the processing interval.

The implementation record should identify the preferred name, accepted alternatives, canonical hostname, redirect policy, structured-data owner, deployment date, and verification evidence. That record gives future migrations and rebrands a stable source of truth instead of forcing another forensic expedition through plugins and templates.

Use [Google Sitelinks](/articles/google-sitelinks-how-they-work) for the automated shortcuts that may appear beneath a branded result, [Favicon Not Showing](/articles/favicon-not-showing-google-search) for the icon beside the source, and [Google Rewrote Your Title Link](/articles/google-title-link-rewrites) for the page-title element of the result.
