# Dependency review: 2026-07-19

## Scope

This is a separate read-only advisory review for the accepted Packet 1 and Packet 2 chain plus Packet 3 source changes. No package was installed, removed, or upgraded. npm audit fix was not run. package-lock.json remains unchanged by Packet 3.

Command:

    npm audit --json

Result: five advisory groups: zero critical, one high, three moderate, and one low.

## Findings

| Package | Severity | Observed context | Disposition |
| --- | --- | --- | --- |
| vite 8.0.13 | High group | The high advisory concerns a Windows development-server filesystem deny bypass. The additional moderate advisory concerns Windows UNC handling. Production is a built Cloudflare Worker on Linux; the Vite development server is not publicly exposed. | Track in a separate Vinext/Vite compatibility-tested upgrade work order. Do not upgrade in Packet 3. |
| next 16.2.6 through bundled postcss | Moderate | The audit path is Next to PostCSS. Packet 3 does not accept untrusted CSS or expose a CSS stringify service. | Review with the framework compatibility task; the audit's suggested Next downgrade is not acceptable evidence of a safe fix. |
| postcss below 8.5.10 inside Next | Moderate | The advisory requires crafted CSS reaching stringify output. Current publication input does not include arbitrary CSS or raw HTML. | Track with the Next/Vinext compatibility task. |
| js-yaml 4.1.1 | Moderate | Transitive build/tooling dependency; no public YAML ingestion endpoint exists. | Track for lockfile-compatible remediation testing. |
| @babel/core at or below 7.29.0 | Low | Local arbitrary-file-read scenario through sourceMappingURL handling; not a public production endpoint. | Track with routine toolchain maintenance. |

## Release assessment

No advisory is known to be reachable through the deployed public request path. The high Vite item is still important, but it applies to a Windows development-server surface that is absent from the Linux Cloudflare production lane. This assessment is not a permanent exception.

Recommended follow-up: one bounded dependency work order that upgrades no package until the Vinext, Vite, Next, React Server Components, Cloudflare adapter, production build, and representative browser paths pass together. Re-run npm audit at that time and record exact resolved versions and remaining advisories.
