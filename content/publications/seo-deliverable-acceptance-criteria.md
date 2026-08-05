---
{
  "slug": "seo-deliverable-acceptance-criteria",
  "title": "SEO Deliverable Acceptance Criteria: What “Done” Should Mean",
  "description": "Define objective SEO acceptance criteria for audits, content, redirects, migrations, analytics, structured data, technical fixes, and vendor handoff.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Buyer defense",
  "series": "Buying SEO",
  "audience": "Owners and procurement teams",
  "evidenceLevel": "Primary sources",
  "state": "draft",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "“Done” should mean that an agreed deliverable exists, satisfies objective acceptance criteria, has been validated in the correct environment, and can be operated by the client.",
  "takeaways": [
    "A deliverable needs a noun and a boundary.",
    "These are different states: A redirect map can be delivered without being deployed.",
    "Good acceptance criteria are testable."
  ],
  "claimLimits": [
    "This is operational and procurement guidance, not legal advice. Contract law, warranties, payment terms, and remedies vary by jurisdiction. Search performance remains uncertain even when the deliverable is accepted."
  ],
  "citations": [
    {
      "id": "rb24-10-source-1",
      "title": "Google Search technical requirements",
      "url": "https://developers.google.com/search/docs/essentials/technical",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-10-source-2",
      "title": "NIST baseline configuration definition",
      "url": "https://csrc.nist.gov/glossary/term/baseline_configuration",
      "publisher": "NIST",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "seo-proposal-scope-checklist",
    "how-to-read-an-seo-audit",
    "what-an-seo-report-should-answer"
  ]
}
---

## Definition

**Direct answer.**

“Done” should mean that an agreed deliverable exists, satisfies objective acceptance criteria, has been validated in the correct environment, and can be operated by the client.

It should not mean only:

- an invoice was sent;
- a file was uploaded;
- code was merged;
- a task was marked complete;
- Google has not complained yet;
- rankings changed.

Acceptance is a contract and operations concept. Ranking is a later external outcome that no vendor controls directly.

**Define the deliverable.**

A deliverable needs a noun and a boundary.

Weak:

```text
Fix technical SEO.
```

Stronger:

```text
Replace the 1,240 mapped HTTP product URLs with direct 301 redirects to the approved HTTPS canonical targets listed in redirect-map.csv.
```

Define:

- included systems;
- included URLs;
- excluded systems;
- environment;
- format;
- owner;
- dependencies;
- deadline;
- expected artifact.

**Preserve a baseline.**

NIST defines a baseline configuration as a documented, reviewed set of specifications changed only through control procedures.[@rb24-10-source-2]

Scaled to an SEO engagement, preserve:

- before state;
- approved change;
- after state;
- validation;
- rollback.

Without a baseline, disagreements become archaeology.

## Mechanism

**Make criteria observable.**

Good acceptance criteria are testable.

**Redirect example.**

- Old URL returns 301.
- Location points directly to approved target.
- Target returns 200.
- No chain.
- Query handling matches policy.
- Canonical on target self-references.

**Content example.**

- Article matches approved brief.
- Claims have source links.
- Title and description fit editorial rules.
- Canonical slug is unique.
- Images have rights records and alt text.
- Required internal links exist.

**Analytics example.**

- Event fires once under defined action.
- Consent state is respected.
- Parameters match schema.
- Debug evidence is preserved.
- Standard reports process the event.
- CRM reconciliation is documented.

**Use the public result as evidence.**

Google’s technical requirements focus on what Googlebot can access: a working response and indexable content.[@rb24-10-source-1]

That means acceptance should test the deployed URL, not only source code.

Capture:

- status;
- headers;
- final URL;
- HTML;
- rendered DOM;
- screenshot where useful;
- log evidence;
- build ID;
- deployment time.

A correct local test does not prove production.

**Handoff is part of acceptance.**

Require:

- source files;
- repository access;
- account ownership;
- credentials under client control;
- documentation;
- redirect map;
- analytics schema;
- media rights;
- vendor dependency list;
- rollback instructions.

A technically correct system that only the departing vendor can operate is not fully accepted.

## Examples

**Distinguish defects from outcomes.**

A defect violates the agreed deliverable.

Examples:

- redirect target wrong;
- duplicate canonical emitted;
- source missing;
- event fires twice;
- sitemap contains staging URLs.

An outcome can remain uncertain:

- ranking gain;
- traffic gain;
- conversion lift;
- rich-result display;
- index-selection timing.

Do not make acceptance depend on a result the vendor cannot guarantee unless the contract explicitly defines a performance contingency.

**Define severity and repair.**

Classify defects:

```text
CRITICAL: security, outage, deindexing, ownership loss
HIGH: major route or measurement failure
MEDIUM: bounded template or content defect
LOW: cosmetic or documentation issue
```

Define:

- repair window;
- retest owner;
- evidence required;
- fee treatment;
- acceptance pause;
- escalation.

## Boundaries

**Separate delivery from deployment.**

These are different states:

```text
AUTHORED
DELIVERED
APPROVED
DEPLOYED
VERIFIED
ACCEPTED
```

A redirect map can be delivered without being deployed. Code can be deployed without the edge receiving it. A page can be live without Google processing it.

Use precise state labels.

**Sample acceptance record.**

```text
DELIVERABLE_ID: SEO-REDIRECT-04
SCOPE: 1,240 legacy product URLs
ENVIRONMENT: Production
DEPLOYED_AT: 2026-08-05T16:00:00Z
VALIDATION: 1,240/1,240 direct permanent redirects
EXCEPTIONS: 0
OWNER: Client web operations
ACCEPTED_BY: Site owner
ACCEPTED_AT: 2026-08-06
```

**Acceptance checklist.**

- Scope and exclusions written.
- Artifact format defined.
- Objective tests defined.
- Production environment named.
- Before state preserved.
- Deployment evidence preserved.
- Public result tested.
- Known limitations disclosed.
- Defect severity defined.
- Repair window defined.
- Ownership transferred.
- Documentation delivered.
- Acceptance recorded.

**Evidence limits.**

This is operational and procurement guidance, not legal advice. Contract law, warranties, payment terms, and remedies vary by jurisdiction. Search performance remains uncertain even when the deliverable is accepted.
