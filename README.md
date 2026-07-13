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

## Publication

Production releases follow one commit through the complete chain:

1. Validate a clean checkout.
2. Push the exact commit to `bohodigital/rankbuilderseo` on `main`.
3. Deploy that commit to the Cloudflare Pages project `rankbuilderseo`.
4. Verify the immutable deployment, Pages alias, apex domain, representative
   routes, crawler endpoints, and analytics marker.

Cloudflare credentials remain in the Pi-managed encrypted secret lane and are
never stored in this repository.
