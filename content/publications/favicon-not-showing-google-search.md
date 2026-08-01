---
{
  "slug": "favicon-not-showing-google-search",
  "title": "Favicon Not Showing in Google Search: Eligibility and Debugging",
  "description": "How Google discovers a search favicon, which hostname and crawlability rules apply, and how to debug dimensions, conflicts, redirects, and stale processing.",
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
  "directAnswer": "Put a supported favicon link on the crawlable hostname home page, use a stable square image URL, allow Googlebot to crawl the home page and Googlebot-Image to crawl the file, and provide at least an 8×8 image, preferably 48×48 or larger. Appearance remains automated and requires recrawling.",
  "takeaways": [
    "Google Search supports one favicon per hostname, not one per subdirectory.",
    "Both the home page and favicon file must be crawlable by the relevant Google crawlers.",
    "The image must be square, stable, representative, and at least 8×8 pixels; 48×48 or larger is recommended.",
    "Valid implementation creates eligibility but does not guarantee that the favicon will appear."
  ],
  "claimLimits": [
    "Google can replace an eligible favicon with a default icon or decline to show it, and recrawling may take days or weeks."
  ],
  "citations": [
    {
      "id": "favicon-google",
      "title": "Define a favicon to show in search results",
      "url": "https://developers.google.com/search/docs/appearance/favicon-in-search",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-title-link-rewrites",
    "google-search-site-name",
    "google-sitelinks-how-they-work"
  ]
}
---

## Preconditions

Record the affected hostname, current search-result icon, device, query, date, home-page canonical, home-page response, favicon declaration, favicon URL, image dimensions, image format, robots rules, and redirect chain.

A browser successfully displaying a favicon is not enough. Browsers can discover icons through defaults, manifests, caches, historical files, or different link relationships. Google Search’s documented implementation begins with a supported icon-link declaration on the hostname home page. [@favicon-google]

Separate these entities:

- Site favicon used in organic search
- Organization or publisher logo
- Apple touch icon
- Web app manifest icon
- Browser tab icon
- Social-sharing image

They may reuse the same design, but they are different features with different discovery and rendering rules.

Capture both raw and rendered page metadata. A framework, tag manager, consent script, or client-side head manager may alter the icon declaration after the initial response. Also record whether the home page is served differently to logged-in users, anonymous visitors, bots, or different regions. A favicon investigation becomes useless when the operator tests one cached browser session while Google receives an entirely different document.

## Ordered process

1. **Confirm the scope is one hostname.**

Google Search supports one favicon per site, where the site is defined by hostname.

Supported separate scopes include:

```text
example.com
news.example.com
```

Unsupported independent scope:

```text
example.com/news/
```

A subdirectory cannot define a different organic-search favicon from the rest of the hostname. [@favicon-google]

For multi-brand platforms, decide whether each brand genuinely has its own hostname. If several brands live only in folders, Google Search will not treat those folders as separate favicon sites. Solving that limitation may require information architecture or hostname changes, not another icon declaration buried deeper in the application.

2. **Add a supported icon declaration to the home page.**

A basic declaration identifies the relationship as `icon` and points the `href` attribute to a stable image path such as `/media/favicon.png`.

Google also recognizes historical `shortcut icon`, `apple-touch-icon`, and `apple-touch-icon-precomposed` relationships for favicon extraction. The URL may be relative or absolute and may be hosted on a CDN.

Prefer a declaration in the server-rendered document head. Make sure the resolved URL is the one intended for the production hostname. Build systems sometimes copy a staging base URL, content hash, or temporary asset domain into production, leaving the visible browser icon intact through cache while crawlers receive a dead or blocked file.

3. **Test the final home-page response.**

Confirm that:

- The home page returns a successful response.
- Redirects resolve to the intended hostname.
- The icon declaration exists in the delivered metadata.
- The canonical agrees with the hostname.
- Googlebot is not blocked from the home page.
- No login or bot challenge replaces the page.

If several home-page versions exist, inspect which version Google reaches and which icon declaration it receives.

Check HTTP, HTTPS, `www`, non-`www`, trailing-slash variants, language redirects, and legacy domains. A redirect chain can land on a home page with different icon metadata from the page developers thought they edited. CDN edge rules can also serve an old document after the application deployment appears complete.

4. **Test the favicon file itself.**

The file should:

- Return a successful image response
- Use a valid favicon image format
- Have a square 1:1 aspect ratio
- Be at least 8×8 pixels
- Preferably be 48×48 pixels or larger
- Remain accessible to Googlebot-Image
- Use a stable URL
- Avoid frequent filename changes
- Represent the site’s brand clearly

Google’s current guidance requires a square favicon of at least 8×8 pixels and strongly recommends at least 48×48 for clearer rendering across surfaces. [@favicon-google]

Inspect the actual bytes rather than trusting the file extension. A URL ending in `.png` can return a document, a redirect, an access-denied response, or an incorrectly transformed asset. Confirm the response content type, file dimensions, cache headers, and whether image optimization preserves a square canvas.

5. **Check robots rules for both resources.**

Googlebot must be able to crawl the home page. Googlebot-Image must be able to crawl the favicon file. A broad image-directory block can therefore break favicon eligibility even when the home page is accessible.

Test the exact icon URL against the active robots file for the production hostname. Do not assume a rule copied from staging is harmless. A pattern such as `Disallow: /media/` or `Disallow: /*.png` can quietly block the only asset Google needs.

6. **Remove conflicting declarations.**

Themes, plugins, page builders, and application shells may emit several icon references pointing to different files. Pick one stable, correct favicon strategy. Confirm that server-rendered and client-rendered output do not disagree.

When multiple declarations must remain for browser compatibility, make them consistent with the same brand and use valid sizes. Avoid one declaration pointing to a current icon while another points to a retired logo. Also inspect manifests and framework metadata because future developers may “fix” the wrong source and reintroduce the conflict.

7. **Evaluate visual suitability.**

A technically valid icon can still be useless at small sizes. Test it at 16, 24, 32, and 48 pixels.

Avoid:

- Tiny text
- Thin detail
- Transparent artwork that disappears
- Wide rectangular logos squeezed into a square
- Low-contrast marks
- Seasonal artwork changed every week
- Imagery that violates Google’s content policies

Google states that inappropriate images, including pornography or hate symbols, may be replaced with a default icon. [@favicon-google]

Use a simplified mark that remains identifiable when anti-aliasing and small-device rendering remove detail. A favicon is not a miniature billboard. Humans already put too much text on full-size graphics; compressing a slogan into sixteen pixels merely turns branding into decorative lint.

8. **Request home-page recrawling after deployment.**

Google says processing can take several days to several weeks depending on recrawl frequency. Request indexing for the home page after the final icon and declaration are live. Do not rotate the file URL during the waiting period. [@favicon-google]

Record deployment time, successful fetch evidence, and the home page’s later recrawl date. This separates an implementation defect from normal processing delay. Repeatedly changing the filename, dimensions, or metadata before recrawling destroys that baseline.

9. **Recheck by hostname and device.**

Search appearance can differ across devices and queries. Confirm whether the default icon persists consistently and record when Google last recrawled the home page.

Check branded and nonbranded queries, mobile and desktop surfaces, and any separate subdomain result. One screenshot does not establish a sitewide failure. It may represent cached presentation, a different hostname, or a result type that does not show the same decoration.

10. **Document ownership and change control.**

Record which system owns the favicon declaration, which asset is canonical, where the source artwork lives, and who may change the URL. This prevents themes, plugins, and deployment pipelines from competing indefinitely. A stable asset is not merely a Google preference; it is basic operational hygiene.

## Failure cases

**Different favicon for a subdirectory.** Organic Search uses one favicon per hostname.

**The browser tab looks correct.** Browser caching or a manifest can hide a broken Search declaration.

**The image is rectangular.** Google requires a 1:1 aspect ratio.

**The image is technically large but visually unreadable.** A detailed wordmark collapses at small sizes.

**The home page is crawlable but the image directory is blocked.** Googlebot-Image cannot fetch the icon.

**The favicon URL changes on every deployment.** Google recommends a stable URL, and frequent changes restart processing.

**Several plugins emit conflicting icon references.** Google receives inconsistent preferences.

**The organization logo is updated instead.** Organization logo markup does not replace the favicon declaration requirement.

**A correct icon is expected immediately.** Recrawling and processing can take days or weeks, and display is never guaranteed.

**The asset URL returns a document.** A CDN, authentication layer, or missing file route serves an error response under an image filename.

**The production page references staging.** Environment-specific metadata sends crawlers to an inaccessible preview host.

**A bot challenge replaces the home page.** Google cannot reliably discover the intended declaration when the security layer serves an interstitial or denial response.

## Completion criteria

The implementation is complete when the canonical hostname home page returns a stable successful response, contains one intended supported icon declaration, and is crawlable by Googlebot. The favicon URL should return a valid square image of at least 8×8 pixels, preferably at least 48×48, remain crawlable by Googlebot-Image, and use a stable branded asset.

Robots rules, CDN behavior, response content type, redirects, and duplicate declarations should all be checked. The home page should be submitted for recrawling only after the final deployment.

The diagnostic record should include the final home-page URL, favicon URL, image dimensions, content type, response status, robots result, deployment timestamp, recrawl evidence, and observed search result. That record makes future regressions testable instead of reviving the same ritual of clearing a browser cache and hoping an external crawler develops telepathy.

Use [Google Site Name Wrong or Missing](/articles/google-search-site-name) when the text label beside the icon is incorrect, [Google Sitelinks](/articles/google-sitelinks-how-they-work) for result shortcuts, and [Google Rewrote Your Title Link](/articles/google-title-link-rewrites) for the clickable page title. The implementation can establish eligibility. It cannot force Google to decorate every result exactly as a design mockup.
