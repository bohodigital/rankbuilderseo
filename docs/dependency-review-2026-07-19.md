# Dependency review: refreshed 2026-07-27

## Scope

This is a read-only advisory refresh for the post-Batch-6 remediation release.
No package was installed, removed, or upgraded, and `npm audit fix` was not run.

Command:

    npm audit --json

Result: 12 vulnerable package groups—zero critical, 11 high, zero moderate, and
one low—across 625 installed dependencies. The severity is the highest advisory
or affected-chain severity assigned to each package group; several high groups
also contain lower-severity advisories.

## Findings

| Package | Direct | Highest severity | Patched version or path reported by npm | Production reachability and disposition |
| --- | --- | --- | --- | --- |
| `next` 16.2.6 | Yes | High | 16.2.12 | App Router output participates in the production build. This application declares no Server Actions, Next middleware, user-controlled rewrites, or untrusted CSS service, which removes several named trigger paths, but framework reachability cannot be dismissed. Upgrade only with Vinext and Cloudflare compatibility testing. |
| `react-server-dom-webpack` 19.2.6 | Yes | High | 19.2.8 | RSC transport is production-reachable. The advisory concerns Server Functions, which this application does not declare, but the direct runtime dependency warrants a bounded React/RSC compatibility upgrade. |
| `@cloudflare/vite-plugin` 1.44.0 | Yes | High | 1.47.0 | Build, preview, and local tooling only; production serves built Worker output. Upgrade together with Wrangler/Miniflare and verify Pages advanced-mode artifacts. |
| `wrangler` 4.110.0 | Yes | High | 4.114.0 | Deployment/build tooling, not a public request dependency. Its chain includes affected Miniflare/Sharp versions. Upgrade only with the Cloudflare plugin. |
| `vite` 8.0.13 | Yes | High | 8.1.5 | Development/build server only. The named Vite issues concern Windows filesystem and UNC-path handling; the canonical build/deploy lane is Linux and the dev server is not public. Upgrade with Vinext compatibility testing. |
| `postcss` | No | High | Through the reported Next upgrade; patched standalone versions are above 8.5.17 | Build-time CSS processing is reachable, but the site accepts no untrusted CSS or source maps. Keep coupled to the Next/Vinext upgrade. |
| `sharp` | No | High | Through Wrangler 4.114.0 for the reported chain | Used by framework/tooling image paths. Published media are controlled and tool submissions are not passed to the site image optimizer. Upgrade with both framework and Cloudflare image-path regression tests. |
| `miniflare` | No | High | Through Wrangler 4.114.0 | Local Cloudflare emulation only; not deployed. Upgrade with Wrangler/plugin. |
| `js-yaml` | No | High | npm reports a fix available; affected range is below 4.3.0 | Build/tooling parser. There is no public YAML ingestion endpoint. Resolve through the owning direct dependency and re-run all build tests. |
| `fast-uri` | No | High | npm reports a fix available | Validator/tooling chain. Rank Builder’s public URL tools use their own fail-closed URL and DNS validation rather than this package. Resolve through the owning direct dependency. |
| `brace-expansion` | No | High | npm reports a fix available | Lint/build globbing chain; no public expansion endpoint. Resolve through lockfile-compatible owner upgrades. |
| `@babel/core` | No | Low | npm reports a fix available | Local build transform surface; the source-map file-read scenario is not a public production endpoint. Resolve with routine toolchain maintenance. |

## Compatibility implications

The available fixes cross a coupled runtime boundary: Next, React Server
Components, Vinext, Vite, Cloudflare’s Vite plugin, Wrangler, Miniflare, and
image handling. Updating a single direct package without the others would not
prove a deployable result. The required follow-up is one bounded compatibility
work order that:

1. upgrades only the direct packages needed to clear the affected chains;
2. preserves the Vinext production build and Cloudflare Pages advanced-mode
   artifacts;
3. re-runs content, type, lint, unit, rendered-route, request-budget, tool
   security, CSP, and four-width browser QA;
4. re-runs `npm audit --json` and records remaining exact chains.

## Release assessment

The audit is materially worse than the 2026-07-19 snapshot and must remain a
release advisory. No critical advisory is reported. The public application does
not expose the named Server Action/Function, middleware, untrusted CSS/YAML,
Windows dev-server, or build-tool inputs, while the direct RSC and framework
packages are still production-adjacent. Automatic remediation is not justified
inside this release; the coupled compatibility upgrade is required follow-up.
