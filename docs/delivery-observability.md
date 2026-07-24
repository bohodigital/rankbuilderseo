# Delivery and observability

This document is the canonical operating contract for the Rank Builder SEO release lane.

## Repository and release lane

- Manifest repo key: rankbuilderseo-site
- Canonical Pi checkout: /srv/local1/repos/sites/rankbuilderseo-site
- Compatibility resource ID: projects/rankbuilderseo-site
- GitHub repository and release branch: bohodigital/rankbuilderseo, main
- Cloudflare Pages project: rankbuilderseo
- Production origin: https://rankbuilderseo.com
- Pages alias: https://rankbuilderseo.pages.dev

Resolve the checkout through /srv/local1/hub/repo-manifest.yaml. Do not edit the legacy snapshot or assume the compatibility resource ID is a literal checkout.

The only approved deployment mechanism is the existing fixed-purpose wrapper:

    python3 /srv/local1/hub/tools/secret_broker/deploy_rankbuilderseo_pages.py EXPECTED_SHA

The wrapper requires a clean main checkout whose HEAD and github/main both equal EXPECTED_SHA. It deploys dist/client to the existing Pages project and uses the encrypted Pi-managed credential lane without printing credential material. Do not create another repository, Pages project, Sites deployment, or hosting lane.

## Local release gate

Run from the canonical checkout:

    npm run release:review
    npm run build:pages
    git status --short --branch
    git diff --check
    git diff github/main...HEAD --check

`release:review` runs the complete network-independent `verify` gate, then uses
`release:links` to inspect every controlled citation in deterministic batches of
25 with at most three concurrent requests. Source findings remain advisory unless
the release owner explicitly adds `--strict`; the complete human or JSON report
must still be recorded in release evidence.

Before push, fetch github/main and verify it is still the reviewed base. Push only the exact reviewed main chain. Rebuild after the final commit and deploy that exact SHA.

## Cache policy

| Surface | Cache-Control | Reason |
| --- | --- | --- |
| HTML and RSC | public, max-age=0, must-revalidate | Navigation must observe the current release and not retain stale server-component payloads. |
| Fingerprinted /assets files | public, max-age=31536000, immutable | Content hashes make year-long immutable caching safe. |
| Fingerprinted /media files | public, max-age=31536000, immutable | A content hash makes immutable article-media caching safe. |
| Stable /media files | public, max-age=86400, stale-while-revalidate=604800 | Stable article URLs get a one-day freshness bound and a resilient revalidation window. |
| Icons, manifest, and /og.png | public, max-age=3600, stale-while-revalidate=86400 | Stable URLs need bounded refresh rather than immutable caching. |
| /robots.txt, /sitemap.xml, and /feed.xml | public, max-age=0, must-revalidate | Discovery records must track publication eligibility and release state. |
| Hashed Pages previews | private, no-store | Preview HTML/RSC/assets must not become durable shared-cache records. |

public/_headers supplies the Pages static policy. worker/response-policy.ts applies the runtime policy. Tests require security-header parity and exercise runtime cache selection. Live release checks must sample HTML, RSC, one hashed asset, one article-media asset, one durable image/icon, and all discovery endpoints.

## Request budget and RSC prefetch

scripts/audit-request-budget.mjs launches installed Chromium through the DevTools protocol without a browser dependency. It counts every HTTP response visible to the page target from the first navigation, including documents, RSC, scripts, styles, images, fonts, analytics, and other responses. It reserves capacity before another route, stops broad checking at the configured soft stop, and fails closed at the hard ceiling.

Example local audit:

    npm run audit:requests -- --base-url http://127.0.0.1:8788 --route /articles --ceiling 100 --stop-at 85 --reserve-per-route 15 --scroll

The Packet 3 pre-tuning baseline produced 17 responses for a fully scrolled article archive and 17 for a fully scrolled glossary, including seven automatic RSC responses on each route. The responses were static shell destinations; dynamic article/glossary cards did not produce RSC fetches. Primary navigation remains on the framework default. Prefetch is disabled only for the wordmark, the desktop About shortcut, and footer links.

The same post-tuning audit produced 10 responses and zero automatic RSC responses on each archive. That larger-than-local change is observed Vinext behavior even though primary links retain framework defaults in source, so treat it as adapter behavior to regression-test on upgrades. Direct click navigation must be proven separately during release checks.

For a public audit, count one browser run from its first navigation. Stop broad checks around 80 to 85 and never reach 100. Provider API calls and explicit command-line HTTP requests must also be added to the release report's public/provider request total when they are outside that browser run.

Publication eligibility is evaluated against a timestamp injected by Vite at build time. Do not replace it with a top-level Worker new Date() call: Cloudflare Worker clocks advance after I/O, while upload validation executes module startup before request I/O. The build clock keeps local validation and remote startup aligned; scheduled publication still requires a new reviewed build and deployment.

Provider reference: https://developers.cloudflare.com/workers/reference/security-model/

## Atom feed

/feed.xml is an Atom 1.0 feed generated from feedPublications, the canonical feed-eligible view of the publication registry. Each entry contains its canonical article URL, title, summary, author, published date, and revised date. Draft, review, future scheduled, and non-feed archived records never enter the feed. Root metadata declares the feed.

## Analytics

Umami remains self-hosted at analytics.bohodigitalservices.com, honors Do Not Track, and excludes search-query text. Packet 3 adds only these named events:

| Event | Trigger | Property |
| --- | --- | --- |
| citation-click | External article or glossary citation | Controlled citation ID |
| related-article-click | Related-reading article link | Controlled destination slug |
| correction-path-click | Article link to the public correction process | None |
| correction-email-click | Corrections mailbox link | None |

Do not send article copy, titles, email addresses, search queries, URL query strings, or free-form reader input as event properties. Do not add scroll-depth or high-volume engagement events without a separate measurement question and privacy review.

GA4 uses the existing Rank Builder SEO web stream and public measurement ID
`G-3VYXZ0H1P8`. The first-party `/ga4-bootstrap.js` boundary loads one Google
tag on the apex, `www`, and immutable production Pages origins. Its single
`config` command sends the standard page view with the query string and fragment
removed from `page_location`; Google Signals and advertising-personalization
signals are disabled. It sends no custom events, user IDs, form values, account
identifiers, or free-form content. The `boho_qa` session marker and browser
automation flag suppress analytics during controlled QA.

## CSP and security headers

Content Security Policy remains Content-Security-Policy-Report-Only. There is no reporting collector in this release. Violations are inspected manually in browser console/network evidence during release audits. The policy includes form-action, frame-src, manifest-src, worker-src, and media-src boundaries, but it is not enforced.

Do not add Content-Security-Policy enforcement until production navigation, hydration, analytics, images, previews, error pages, and correction paths have completed a separately approved observation period without material violations. public/_headers and worker/response-policy.ts must remain in exact tested parity. No secrets belong in source, logs, analytics properties, or reports.

## External account owner actions

No Search Console or mailbox claim may be made without verified account access.

The owner should record a pre-content Search Console baseline in a protected operating record: indexed pages, excluded pages, Google-selected canonicals, impressions and queries by article, sitemap status, and crawl dates. Do not copy query data or account exports into this public repository.

The owner should verify support@rankbuilderseo.com accepts mail, routes to a monitored inbox, uses an approved reply identity, has working spam handling, and follows the correction review path described on /about. A source-only release cannot prove those account facts.

## Dependency review

Dependency advisories are reviewed separately in docs/dependency-review-2026-07-19.md. Packet 3 changes no dependency version and does not run an automated fix. Compatibility-tested dependency remediation requires a separate work order.

## Future search trigger

Do not ship a search index or search UI in this release. When the feed-eligible published corpus reaches 30 records, or the owner approves an earlier demonstrated need, create a separate work order for a small build-time index. That work order must define index fields, draft/archive exclusion, byte budget, accessibility, privacy, and whether a UI is justified.

## Rollback and readiness

The release rollback deployment is 114eb386-274f-4f23-b7eb-cc0c29f5cda1 unless a newer deployment is independently verified good and recorded before release. On a release-blocking regression, use the existing Cloudflare Pages rollback path to restore the recorded deployment, then recheck apex, Pages alias, crawler endpoints, headers, and representative routes. Do not change DNS.

Content-production readiness requires all cleanup packets to be independently accepted, the exact accepted commit chain to be on GitHub main, the accepted release SHA to be deployed through rankbuilderseo, bounded live checks to pass, and remaining external-account actions to be recorded honestly.
