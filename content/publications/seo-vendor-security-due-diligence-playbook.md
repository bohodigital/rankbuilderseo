---
{
  "slug": "seo-vendor-security-due-diligence-playbook",
  "title": "SEO Vendor Security Due Diligence Playbook",
  "description": "Assess an SEO vendor’s security, ownership, access, data handling, subcontractors, AI systems, continuity, incident response, evidence, and exit.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Buyer defense",
  "series": "Buying SEO",
  "audience": "Owners and procurement teams",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Treat an SEO provider as a digital supplier. Confirm legal identity and ownership, map every system and dataset it can access, review least privilege, multi-factor authentication, devices, subcontractors, AI use, incident reporting, backups, continuity, and offboarding, then validate claims with evidence proportionate to the risk. A polished security questionnaire is not itself a control.",
  "takeaways": [
    "Scope due diligence to the provider’s actual access and business impact.",
    "Identify downstream subcontractors, software, and AI systems.",
    "Require incident-notification, continuity, backup, export, and deletion terms.",
    "Verify high-risk controls through records, tests, or independent evidence."
  ],
  "claimLimits": [
    "This playbook is not a security certification or legal opinion.",
    "Small providers can be secure without a large compliance program, and large providers can have serious weaknesses.",
    "Required controls should be proportional to data, access, availability, and regulatory risk."
  ],
  "citations": [
    {
      "id": "nist-1326",
      "title": "NIST SP 1326: Cybersecurity Supply Chain Risk Management Due Diligence Assessment Quick-Start Guide",
      "url": "https://csrc.nist.gov/pubs/sp/1326/final",
      "publisher": "National Institute of Standards and Technology",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "nist-161",
      "title": "NIST SP 800-161 Rev. 1 Update 1",
      "url": "https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final",
      "publisher": "National Institute of Standards and Technology",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "google-hiring",
      "title": "Do you need an SEO?",
      "url": "https://developers.google.com/search/docs/fundamentals/do-i-need-seo",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "ftc-protect",
      "title": "Protecting Personal Information: A Guide for Business",
      "url": "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business",
      "publisher": "Federal Trade Commission",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "nist-incident",
      "title": "NIST SP 800-61 Rev. 3",
      "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
      "publisher": "National Institute of Standards and Technology",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "seo-advisory-vs-implementation-managed-service",
    "seo-proposal-bid-normalization-playbook",
    "content-security-policy-seo-checklist"
  ]
}
---

## Preconditions

Create a supplier-risk profile before sending a questionnaire. List every system and dataset the provider may touch, including domain and DNS controls, Search Console, analytics, Tag Manager, CMS, hosting, CDN, repositories, logs, CRM, customer data, commerce systems, publishing rights, and emergency access. Risk increases with privilege, data sensitivity, operational impact, and dependency.

NIST SP 1326 provides a supplier due-diligence framework centered on provenance, stability, foundational cybersecurity practices, and product or service integrity. [@nist-1326] NIST SP 800-161 places supplier risk inside a broader cybersecurity supply-chain program. [@nist-161] The practical implication is that the review must follow the actual service chain rather than stop at the agency’s front door.

Define the business owner, security reviewer, technical owner, legal reviewer where needed, decision authority, evidence standard, access ceiling, and offboarding requirements before the provider receives credentials. A generic questionnaire without a risk profile tends to demand irrelevant certificates while overlooking the systems that could actually take the site offline.

## Ordered process

1. **Verify the supplier.** Confirm the legal entity, trade names, address, ownership, executives, operating history, insurance, material acquisitions, key subcontractors, and business-continuity contact.
2. **Map the service chain.** Trace the client through the agency, subcontractors, software vendors, cloud providers, and AI providers. Record the service, data, access, location, retention, incident obligation, deletion method, and replacement path for each party.
3. **Review access control.** Require named accounts, least privilege, multi-factor authentication, approval for privileged access, periodic review, logged changes, and immediate revocation at exit.
4. **Review devices and workforce controls.** Ask about managed devices, disk encryption, endpoint protection, screen locks, remote wipe, contractor standards, security training, and departure procedures.
5. **Review data handling.** Document purpose, fields, storage, encryption, retention, subprocessors, export, deletion, and incident ownership for each dataset.
6. **Review software and AI dependencies.** Inventory approved tools, patching, credential storage, API-token scope, model use, prompt retention, training use, confidential-data controls, generated-code review, and dependency monitoring.
7. **Review incident response.** Define reportable events, notification timing, contacts, evidence preservation, containment authority, subcontractor reporting, recovery, post-incident review, and credential rotation.
8. **Review resilience and continuity.** Examine backup frequency, restore tests, alternate staff, critical-tool dependencies, recovery plans, key-person risk, access transfer, and provider-shutdown procedures.
9. **Verify evidence.** Request evidence proportionate to risk, such as policy excerpts, access records, audit summaries, penetration-test summaries, restore results, incident exercises, subprocessors, data-flow diagrams, or deletion confirmations.
10. **Bind the controls into the contract.** State permitted access, data purpose, subprocessors, confidentiality, incident notice, security baseline, evidence rights, continuity, export, deletion, transition, and termination.

Supplier verification begins with identity. The name on the proposal may be a trade name, holding company, reseller, or newly created entity. Confirm who signs the agreement, who employs or contracts the workers, who owns the software, and who remains responsible if a subcontractor fails.

The service-chain map should look something like:

```text
client
→ SEO agency
→ subcontractor
→ software vendor
→ cloud provider
→ AI provider
```

A white-label writer with CMS access is part of the supply chain even when the agency calls the person “production support.” A browser extension that can read analytics or publish changes is also a supplier dependency, however cheerfully tiny its icon appears.

Access control should default to named user accounts, least privilege, MFA, approval for privileged roles, periodic review, logged changes, and immediate revocation. Google’s SEO hiring guidance recommends limited access during evaluation and continued site ownership by the client. [@google-hiring] The provider should not become the sole verified owner of Search Console or the only administrator of the domain.

Review workforce controls without collecting unnecessary personal information. Ask for the control, not a dossier on every worker. Useful questions cover managed devices, encryption, endpoint protection, screen locks, remote wipe, contractor-device standards, training, and departures.

For data handling, record the business purpose, fields, storage, encryption, retention, subprocessor, export, deletion, and incident owner. FTC business guidance recommends taking stock of personal information, scaling down collection, securing it, disposing of unneeded data, and planning for incidents. [@ftc-protect] An SEO provider rarely needs payment-card data, government identifiers, or complete customer correspondence.

Software and AI review should cover approved tools, patching, credential storage, token scope, prompt retention, training use, confidential-data restrictions, generated-code review, and dependency monitoring. A model or browser extension that receives confidential exports belongs in the supply-chain map even when it is marketed as a productivity feature.

Incident terms should define what counts as an incident, who is notified, the time limit, how evidence is preserved, who may contain the event, how subcontractors report, how recovery works, and when credentials are rotated. NIST’s current incident-response guidance emphasizes preparation, detection, response, recovery, communication, and improvement. [@nist-incident] “We will notify you promptly” is not a usable control until promptly has a clock and an owner.

Resilience matters because the supplier can fail without suffering the client’s consequences. Review backup frequency, restore tests, alternate staff, key-person risk, critical tools, documented recovery, export, transition, and provider shutdown. The client should be able to recover accounts, data, history, and operational control if the vendor disappears.

Evidence should match the risk. A low-risk advisory engagement may need identity verification and read-only access records. A provider with DNS, repository, publishing, and customer-data access may justify stronger evidence. Do not demand a certification unrelated to the work merely because procurement inherited a checkbox from another industry.

The final risk decision can approve, approve with conditions, require a bounded pilot, or decline. Conditions may include reduced access, remediation, monitoring, shorter terms, or removal of a subprocessor.

## Failure cases

Due diligence fails when the buyer accepts a polished questionnaire as proof, grants shared administrator credentials, ignores subcontractors, permits unrestricted AI or browser extensions, leaves incident timing undefined, or discovers at termination that the provider owns the data and accounts. It also fails when the review demands irrelevant compliance badges from a small supplier while overlooking the unencrypted shared password that controls the domain.

Another failure is scale theater. A large vendor can have certifications and still expose the client through weak role design, uncontrolled subcontractors, stale access, or poor incident communication. A small provider can lack a broad compliance program and still operate strong, documented controls proportional to its access. The decision should follow evidence and impact rather than brand size.

The review is complete when supplier identity is verified, the service chain is mapped, access is least-privileged, data handling is documented, subcontractors and AI use are known, incident obligations exist, continuity is tested, evidence supports material claims, contract controls match risk, and exit remains possible. Security due diligence should reveal whether the organization can safely receive the exact access the work requires, not reward whoever assembled the longest questionnaire.
