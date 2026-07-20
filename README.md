# Rank Builder SEO

Rank Builder SEO is the public application for
[rankbuilderseo.com](https://rankbuilderseo.com/): an independent SEO research
desk publishing evidence-aware articles, guides, definitions, and experiments.

## Architecture

- Next-compatible routes rendered by [vinext](https://github.com/cloudflare/vinext)
- Cloudflare Pages worker output in `dist/client/_worker.js`
- Site-specific metadata, crawler endpoints, redirects, and security headers
- Self-hosted Umami analytics configured in the root layout
- No production database or user-authentication dependency

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

On Windows, development uses Vinext's native server because the local
Cloudflare inspector can terminate with a closed-pipe error. Production builds
still use the Cloudflare plugin.

## Validation

```bash
npm test
npm run lint
```

`npm test` builds and packages the production worker, then verifies representative routes,
the 404 behavior, crawler endpoints, analytics marker, and required Cloudflare
Pages artifacts.

## Content authoring

Run the fast authoring checks while editing, and run the complete local gate before
hand-off:

```bash
npm run content:check
npm run typecheck
npm run verify
```

Create one of the five canonical draft formats with:

```bash
npm run content:new -- --format explainer --slug example-slug --title "Example title"
```

Accepted format names are `explainer`, `playbook`, `claim-check`, `data-note`,
and `checklist`. Add `--dry-run` to validate and print a scaffold without writing
it. Templates live in `content/templates/`.
New templates declare `authoringContract: "canonical-v1"`. Before a record can
enter review, scheduled, published, or archived state, its exact format roles are
required: Definition/Mechanism/Examples/Boundaries for explainers; Preconditions/
Ordered process/Failure cases for playbooks; Identified claim/Sources and evidence/
Conclusion/Limitations for claim checks; Dataset and period/Methodology/Result/
Limitations for data notes; and Checklist/Completion criteria for checklists.
Ordered process and checklist sections must contain their required list shapes,
and source-dependent formats must contain citations and meaningful limitations.
Review, scheduled, published, and archived canonical records require at least 75
words of prose in each prose-oriented required section. Rendered article minimums
are 700 words for explainers and data notes, 900 for playbooks and claim checks,
and 600 for checklists. Playbooks require at least two ordered steps and checklists
at least three items; fewer than four steps or five items produces an editorial
warning. Exact duplicate titles or descriptions fail, while near-duplicates,
repeated boilerplate, and unusual metadata lengths produce review warnings.

The twelve protected publications use the explicit `legacy-protected-v1`
migration marker so their established bodies remain byte-for-byte editorially
stable. That marker is accepted only for the exact protected slugs in published
state and must never be copied into new work.

Publication metadata is fail-closed. Category, series, audience, author, and editor
must reference `content/registries.json`. Media must be registered in
`content/media.json`, local beneath `public/`, approved, dimensionally accurate,
and include non-empty alt text, caption, credit, rights, and source information when
the rights are not owned. Do not hotlink article images.
Template-only, restricted, expired, placeholder, and scaffold media are accepted
only in drafts. SVG files are limited to 250 KiB, raster files to 1.5 MiB, the
1200x630 Open Graph PNG to 500 KiB, and one article's unique media to 5 MiB.
Declared and actual dimensions must match and neither dimension may exceed 4000
pixels. Oversized draft media is advisory; review and public use fails closed.

The supported body subset is deliberately small:

- H2 sections with generated stable anchors or explicit `{#stable-id}` anchors
- links to HTTPS, root-relative routes, or valid local fragments
- `**bold**`, `*italics*`, inline code, and `[@source-id]` citations
- flat ordered and unordered lists, fenced code, callouts/blockquotes, simple tables
- registered local figures using `![alt](/media/file.ext "caption")`

Raw HTML, scripts, iframes, component syntax, unsafe schemes, nested/task lists,
unsupported heading levels, malformed tables, unknown citations, unknown fragments,
and unregistered media fail validation. Use `citationMode: "inline-required"` for
new work; every listed source must then be cited and every citation must resolve.

Lifecycle states are `draft`, `review`, `scheduled`, `published`, and
`archived`. Draft/review records and future scheduled records are excluded from
routes, feeds, sitemaps, indexing, and related reading. Published records are public
and indexable. Archived records must declare redirect, replacement, or
retained-public behavior; retained archives are public but noindex and absent from
discovery surfaces. Material revision dates require a revision note.

Word count and reading time come from rendered content. An optional numeric
`readTimeOverrideMinutes` is accepted only within the validator's narrow tolerance.
Do not restore free-form read-time labels.

Run `npm run content:links` periodically or during release review to inspect source
redirects, failures, and changed page titles. It is intentionally advisory and is
not part of `verify`; `--strict` is available for an explicit review gate.
Use `--max-sources 25 --batch 1` for deterministic batches, optionally add
`--concurrency 2` or `3`, and add `--json` for machine-readable output. The
maximum batch size is 200 and concurrency never exceeds three.
For release review, run `npm run release:links`; it automatically advances through
every deterministic batch so no citations are omitted. The command stays advisory
unless `--strict` is explicitly supplied. `npm run release:review` combines the
network-independent verification suite with that complete advisory source pass.
The checker validates the initial URL and every redirect as credential-free HTTPS,
resolves every hostname, rejects localhost-like names and any private, loopback,
link-local, reserved, documentation, multicast, or otherwise non-public address,
and pins an approved DNS answer into the TLS request. Network failures remain
review output rather than production-build failures. Redirect loops, timeouts,
oversized responses, unsafe targets, HTTP failures, title-review findings, and
network failures are classified separately. Common publisher suffixes are removed
before title comparison.

## Publication

Production releases follow one commit through the complete chain:

1. Validate a clean checkout.
2. Push the exact commit to `bohodigital/rankbuilderseo` on `main`.
3. Deploy that commit to the Cloudflare Pages project `rankbuilderseo`.
4. Verify the immutable deployment, Pages alias, apex domain, representative
   routes, crawler endpoints, Atom feed, cache/security headers, and analytics marker.

Cloudflare credentials remain in the Pi-managed encrypted secret lane and are
never stored in this repository.


The canonical Pi checkout is /srv/local1/repos/sites/rankbuilderseo-site and is
resolved by /srv/local1/hub/repo-manifest.yaml. The projects/rankbuilderseo-site
identifier is compatibility routing, not a literal or legacy checkout.

## Delivery and observability

Run a bounded real-browser request audit against a local or approved public base:

    npm run audit:requests -- --base-url http://127.0.0.1:8788 --route /articles --ceiling 100 --stop-at 85 --reserve-per-route 15 --scroll

The audit counts documents, RSC, scripts, styles, images, fonts, analytics, and
other responses, and reserves headroom before another route. The canonical cache,
feed, analytics, CSP report-only, release, rollback, account-owner action,
dependency-review, future-search trigger, and content-production readiness rules
are documented in docs/delivery-observability.md.
