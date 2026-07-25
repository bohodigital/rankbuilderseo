# Rank Builder SEO Agent Instructions

This repository owns the public Rank Builder SEO application deployed at
`rankbuilderseo.com`.

Resolve this checkout through the Local1 repo manifest. The canonical Pi path is
/srv/local1/repos/sites/rankbuilderseo-site; projects/rankbuilderseo-site is a
compatibility resource ID, not a second checkout. Delivery, observability,
rollback, account-action, and content-readiness rules live in
docs/delivery-observability.md.

Keep source, durable documentation, tests, and sanitized examples here. Do not
commit secrets, credentials, local environment files, runtime databases,
browser profiles, caches, generated build output, or logs.

Before publishing, run `npm test`, push the exact validated commit to the
public GitHub `main` branch, deploy that same commit to the Cloudflare Pages
`rankbuilderseo` project, and verify the apex, Pages alias, crawler endpoints,
analytics marker, and representative routes.

## Editorial governance

Explicit owner direction controls. Beneath it, the
[Rank Builder Constitution](docs/rank-builder-constitution.md) is the highest
repository-level editorial governance document and controls all subordinate
editorial governance, including the
[Phase 1 Editorial Governance](docs/phase-1-editorial-governance.md) guide.

ChatGPT owns substantive editorial decisions and exact copy. Codex handles
mechanical integration, testing, Git, and release. Agents may not invent or
rewrite approved substance, impose flagship-level research or asset requirements
on ordinary pages, or add editorial requirements beyond the proportional effort
authorized by the Constitution.

Publication volume and proportional effort are binding constitutional
requirements. Ordinary pages must be produced rapidly and economically while
meeting the Constitution's accuracy, usefulness, distinct-intent, sourcing,
internal-linking, and repository-validation floors.
