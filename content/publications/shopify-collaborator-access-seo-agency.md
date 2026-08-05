---
{
  "slug": "shopify-collaborator-access-seo-agency",
  "title": "Shopify Collaborator Access Checklist for SEO Agencies",
  "description": "Give an SEO agency safe Shopify collaborator access with least-privilege roles, request codes, two-step authentication, app and theme controls, and offboarding.",
  "format": "Checklist",
  "authoringContract": "canonical-v1",
  "category": "Buyer defense",
  "series": "Buying SEO",
  "audience": "Owners and procurement teams",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "Shopify recommends collaborator accounts for Partners who need to work on a client’s existing store.",
  "takeaways": [
    "Before approving a request, confirm the agency name, Partner organization, sender, business email, project scope, named account lead, subcontractors, and expected dates.",
    "Shopify lets the merchant generate a four-digit collaborator request code.",
    "Shopify says collaborator accounts are the recommended path for Partners."
  ],
  "claimLimits": [
    "Shopify roles and plan-specific features change. Effective permissions can include dependencies. Review the current permission screen and exact requested tasks before approval."
  ],
  "citations": [
    {
      "id": "rb24-03-source-1",
      "title": "Working on client stores",
      "url": "https://help.shopify.com/en/partners/getting-started/working-on-client-stores",
      "publisher": "Shopify Help Center",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-03-source-2",
      "title": "Collaborator accounts",
      "url": "https://help.shopify.com/en/manual/your-account/users/security/collaborator-accounts",
      "publisher": "Shopify Help Center",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-03-source-3",
      "title": "Store permissions",
      "url": "https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions",
      "publisher": "Shopify Help Center",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "seo-vendor-security-due-diligence-playbook",
    "seo-vendor-offboarding-playbook",
    "seo-agency-domain-registrar-access",
    "search-console-crawl-stats-every-googlebot-request"
  ]
}
---

## Checklist

- **Verify the Partner identity.**
- **Use and rotate the request code.**
- **Use collaborator access, not shared credentials.**
- **Require two-step authentication.**
- **Map tasks to permissions.**
- **Bound theme permissions.**
- **Review file dependencies.**

**Direct answer.**

Shopify recommends collaborator accounts for Partners who need to work on a client’s existing store.[@rb24-03-source-1]

A collaborator account is requested through the Partner or Dev Dashboard, approved by the merchant, limited to selected permissions, excluded from normal staff limits, protected by required two-step authentication, and removable from the Shopify admin.[@rb24-03-source-1][@rb24-03-source-2]

The agency should not ask for the merchant owner’s password. Shopify explicitly prohibits Partners from using merchant credentials.[@rb24-03-source-1]

**Verify the Partner identity.**

Before approving a request, confirm the agency name, Partner organization, sender, business email, project scope, named account lead, subcontractors, and expected dates. Confirm through a known channel rather than approving a lookalike request.

**Use and rotate the request code.**

Shopify lets the merchant generate a four-digit collaborator request code.[@rb24-03-source-2]

1. Share the code privately.
2. Wait for the expected request.
3. Verify the Partner organization.
4. Approve the minimum role.
5. Generate a new code after onboarding when appropriate.

Changing the code blocks old codes. It does not remove an already approved collaborator.

**Use collaborator access, not shared credentials.**

Shopify says collaborator accounts are the recommended path for Partners.[@rb24-03-source-1] A staff account can be justified when a task cannot be completed through collaborator access, but the reason should be documented.

Do not create a generic staff login shared by several agency employees. Named Partner users improve accountability and revocation.

**Require two-step authentication.**

Shopify requires two-step authentication for collaborator access.[@rb24-03-source-2] The merchant should still require named users, removal of former agency staff, governed devices, and clean subcontractor controls. Two-factor authentication does not make excessive permissions harmless.

**Map tasks to permissions.**

Common SEO work can touch:

**Content.**

- blog posts and pages;
- navigation;
- metaobjects;
- redirects;
- files.

**Online store.**

- themes;
- theme code;
- preferences;
- domains in limited cases.

**Products.**

- titles;
- descriptions;
- collections;
- images;
- search listings.

**Apps.**

- analytics;
- feeds;
- schema;
- redirects;
- reviews;
- consent tools.

Build a task-to-permission table before approval.

**Bound theme permissions.**

Theme access can change storefront code. Require a duplicate theme or development workflow, preview, approval, rollback, change record, and production verification. A content task should not inherit unrestricted theme-code authority by default.

**Review file dependencies.**

Shopify documents that several content, product, and theme permissions can bring required file permissions with them.[@rb24-03-source-3] Review automatically selected dependencies before saving the role.

A top-level label is not always the complete effective permission set.

## Completion criteria

**Separate app use, installation, and charges.**

Distinguish:

- access to an existing app;
- permission to install or delete apps;
- permission to approve app charges;
- custom app development;
- webhook creation.

An SEO agency can often use an existing analytics app without permission to install every future app. Paid-app approval should remain with the merchant unless procurement is explicitly delegated.

**Exclude sensitive data.**

Most technical SEO work does not require access to orders, customers, gift cards, payouts, finances, billing, users, or private API credentials. Do not grant broad Administrator access because the theme editor requested one dependent permission.

**Change control.**

For production changes, preserve:

```text
CHANGE_ID:
THEME_OR_RESOURCE:
OLD_STATE:
NEW_STATE:
APPROVED_BY:
DEPLOYED_BY:
ROLLBACK:
VERIFIED_AT:
```

**Offboarding.**

1. Export collaborator and role inventory.
2. Transfer final theme and content work.
3. Remove collaborator access.
4. Review custom apps and webhooks.
5. Revoke API credentials.
6. Remove agency-owned integrations.
7. Preserve analytics and Search Console ownership.
8. Confirm billing.
9. Verify storefront and checkout.

**Checklist.**

- Partner identity verified.
- Request code shared privately.
- Collaborator account used.
- Two-step authentication confirmed.
- Tasks mapped to permissions.
- Theme access bounded.
- File dependencies reviewed.
- App installation separated from app use.
- Charge approval retained.
- Customer and financial data excluded.
- Production change control defined.
- Named users required.
- Offboarding completed.

**Evidence limits.**

Shopify roles and plan-specific features change. Effective permissions can include dependencies. Review the current permission screen and exact requested tasks before approval.
