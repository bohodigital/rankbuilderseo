---
{
  "slug": "search-console-users-permissions-owners",
  "title": "Search Console Users, Permissions, and Owner Offboarding",
  "description": "Design least-privilege Search Console access, distinguish verified and delegated owners, and remove former users without leaving active ownership tokens behind.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Owners and marketing leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Keep at least two accountable verified owners, grant most operators full or restricted user access, use delegated ownership sparingly, and remove both access entries and verification tokens when offboarding verified owners.",
  "takeaways": [
    "Verified and delegated owners have the same Search Console permissions but different proof and removal mechanisms.",
    "Full users can view all data and perform some actions; restricted users have simpler view access.",
    "Removing a verified owner from the user list does not neutralize a surviving verification token.",
    "A property needs at least one verified owner or all users can eventually lose access."
  ],
  "claimLimits": [
    "Search Console permission roles govern Search Console capabilities only; they do not replace access controls in DNS, hosting, Analytics, Tag Manager, Merchant Center or source repositories."
  ],
  "citations": [
    {
      "id": "gsc-access-main",
      "title": "Managing owners, users, and permissions",
      "url": "https://support.google.com/webmasters/answer/7687615",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "search-console-performance-data-limits",
    "search-console-site-verification-methods",
    "search-console-domain-vs-url-prefix-property",
    "search-console-bulk-data-export-bigquery"
  ]
}
---

## Definition

Search Console access is divided among owners, full users, restricted users and associates. These labels are not ceremonial. They determine who can view sensitive search data, manage other users, configure settings and perform site-affecting actions.

Google distinguishes two owner types. A **verified owner** proves control through a verification token or qualifying account relationship. A **delegated owner** receives owner status from an existing owner without adding a new verification token. Both owner types have the same Search Console permissions, but their access is removed differently. [Managing owners, users, and permissions](https://support.google.com/webmasters/answer/7687615)[@gsc-access-main]

A **full user** can view all data and perform some actions. A **restricted user** has simpler view rights for most data. An **associate** can perform specific cross-service actions but cannot directly open and view the property’s Search Console account in the same way.

A durable access model uses verified ownership for continuity, delegated ownership for rare governance needs, and user roles for ordinary work.

## Mechanism

**Verified owners**

A verified owner has an active ownership token or qualifying verification relationship. Examples include:

- DNS record
- HTML verification file
- Homepage verification tag
- Eligible Google Analytics access
- Eligible Google Tag Manager access
- Platform-specific verification

Verified ownership is resilient because it does not depend on another Search Console owner continuing to delegate access. It is also sensitive because the token can allow a removed person to re-verify.

A property must retain at least one verified owner. Google states that if all verified owners are removed, remaining users and delegated owners lose access after a grace period even though data collection can continue. [Managing owners, users, and permissions](https://support.google.com/webmasters/answer/7687615)[@gsc-access-main]

**Delegated owners**

A delegated owner is added through Search Console by an existing owner and does not prove site control through a new token. This can be useful for a senior internal operator who needs full governance rights but should not manage DNS or deploy verification files.

Because delegated owners have full Search Console control, use the role sparingly. Granting “owner” to every agency employee is not collaboration; it is an unmanaged succession plan.

**Full users**

Full users are appropriate for people who need all report data and some operational actions without user-management authority.

Possible use cases:

- SEO lead
- Technical SEO
- Engineering lead
- Analytics lead
- Trusted agency operator

Review the live permission table before assuming a full user can perform a specific action. Google’s documented capabilities differ by tool. For example, some settings and owner-management actions remain owner-only. [Managing owners, users, and permissions](https://support.google.com/webmasters/answer/7687615)[@gsc-access-main]

**Restricted users**

Restricted access is appropriate for stakeholders who need visibility but not operational control.

Possible use cases:

- Executive viewer
- Content editor
- Client stakeholder
- Auditor
- Temporary analyst

Restricted users can view most reports but may receive reduced details or view-only behavior in tools such as URL Inspection and removals.

**Associates**

Associations connect a Search Console property with another Google service or account for a defined purpose. An associate is not simply another Search Console viewer. Treat associations as separate integrations and review their documentation and business need.

**Permission inheritance**

A person who owns a containing parent property can have implicit owner rights on a child property. Search Console can reject an attempt to add that person as a lower-level user because doing so would effectively demote inherited access.

This is one reason a property inventory matters. A team can appear removed from a path property while retaining access through a broader Domain or host-level property.

## Examples

**Small organization**

Recommended baseline:

- Two verified owners using organization-controlled accounts
- One full user for day-to-day SEO work
- Restricted users for stakeholders
- No shared login
- Documented verification methods

The second verified owner protects against employee departure or account loss.

**Agency engagement**

The client retains verified ownership. The agency receives full-user access unless owner-only actions are genuinely required.

At contract end:

1. Remove agency users and delegated owners.
2. Check parent properties for inherited access.
3. Audit unused verification tokens.
4. Remove agency verification tokens when present.
5. Review Analytics, Tag Manager, DNS and hosting separately.
6. Record the offboarding date and responsible owner.

**Former verified owner**

An employee is removed from the Users and permissions screen, but their HTML file remains at the site root. They can potentially re-verify. Search Console exposes unused ownership tokens so current owners can identify and remove them. [Managing owners, users, and permissions](https://support.google.com/webmasters/answer/7687615)[@gsc-access-main]

**Only owner uses a personal account**

The owner leaves or loses the account. All other users eventually lose access because no verified owner remains.

Repair requires a new person to verify site ownership through a valid method. Prevent the failure by maintaining multiple organizationally accountable verified owners.

**Unexpected owner appears**

Do not merely click remove and return to routine reporting. An unknown verified owner may indicate a compromised site, DNS account, Analytics account or Tag Manager container. Remove access and the associated token, then investigate the system that allowed the token to be added.

## Boundaries

Search Console offboarding is only one part of access removal. The same person may retain DNS, hosting, source-control, Analytics, Tag Manager, Merchant Center, Cloud project or registrar access. Search Console roles do not govern those systems, even when one of them was used for verification.

Do not downgrade a verified owner by changing a menu role and assume the token disappeared. Verified ownership is controlled by the verification mechanism. Remove all tokens associated with the person after determining whether those tokens support another service. Google cautions that verification tokens can sometimes be reused across products, so removal should be deliberate rather than reckless. [Managing owners, users, and permissions](https://support.google.com/webmasters/answer/7687615)[@gsc-access-main]

Run a quarterly access review and an immediate review after staff, agency, DNS or platform changes. Record each property’s verified owners, delegated owners, users, parent properties and token locations. Continue with [Search Console Site Verification Methods](/articles/search-console-site-verification-methods) for token mechanics and [Search Console Performance Data Limits](/articles/search-console-performance-data-limits) before granting analysts access to reports they may otherwise overinterpret.
