---
{
  "slug": "seo-vendor-ai-use-disclosure-checklist",
  "title": "SEO Vendor AI Use Disclosure Checklist",
  "description": "Evaluate an SEO vendor's AI use across tools, client data, human review, sources, copyright, security, testing, incidents, subcontractors, and contracts.",
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
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Require the provider to disclose where AI is used, which systems and subprocessors receive data, what human review occurs, how sources and rights are verified, which outputs are prohibited, how incidents and corrections are handled, and what evidence the client can inspect. “We use AI responsibly” is a slogan, not a control.",
  "takeaways": [
    "AI use should be evaluated by workflow and risk, not by a blanket yes-or-no label.",
    "Client credentials, unpublished content, customer data, and legal material need explicit handling rules.",
    "Human review must identify the reviewer, review standard, and evidence retained.",
    "The contract should preserve client ownership, correction rights, exports, and termination controls."
  ],
  "claimLimits": [
    "This checklist is a procurement framework, not legal advice or a guarantee of regulatory compliance.",
    "NIST AI guidance is voluntary and risk-based rather than a certification.",
    "Copyright, privacy, employment, professional-duty, and sector-specific rules vary by jurisdiction and use."
  ],
  "citations": [
    {
      "id": "vendor-ai-rmf",
      "title": "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
      "url": "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10",
      "publisher": "National Institute of Standards and Technology",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "vendor-ai-profile",
      "title": "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
      "url": "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
      "publisher": "National Institute of Standards and Technology",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "vendor-ai-google",
      "title": "Google Search's guidance on using generative AI content on your website",
      "url": "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "vendor-ai-usco",
      "title": "Copyright Office releases Part 2 of Artificial Intelligence Report",
      "url": "https://www.copyright.gov/newsnet/2025/1060.html",
      "publisher": "U.S. Copyright Office",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "vendor-ai-ftc",
      "title": "Keep your AI claims in check",
      "url": "https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check",
      "publisher": "Federal Trade Commission",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "revenue-share-seo-pricing-attribution",
    "hacked-spam-cleanup-playbook",
    "ga4-known-bot-filtering-data-note"
  ]
}
---

## Checklist

**System inventory.**

- Name every model, platform, API, browser tool, writing assistant, coding assistant, image generator, transcription service, and automated agent used on the account.
- Identify which systems are first-party, third-party, self-hosted, or supplied by subcontractors.
- Record model or service versions when outputs can materially change between versions.
- State whether client work is used for provider evaluation, fine-tuning, training, or product improvement.
- Identify retention periods, deletion methods, human access, and the system owner.

NIST’s AI Risk Management Framework helps organizations govern, map, measure, and manage AI risks across the lifecycle. [@vendor-ai-rmf] Its generative AI profile extends that risk framing to generative systems and emphasizes governance, testing, provenance, security, and human oversight. [@vendor-ai-profile]

A vendor does not become safe merely because a familiar company supplies the model. The buyer still needs to know what enters the system, what leaves it, and who can act on the output.

**Data boundaries.**

- Prohibit credentials, authentication tokens, private keys, and recovery codes from prompts.
- Define whether unpublished strategy, customer records, analytics exports, contracts, legal advice, medical information, or employee data may enter an AI system.
- Require documented approval before sensitive or regulated data is processed.
- Identify data residency and subprocessor locations where relevant.
- Require a method to delete uploaded files and conversation history.
- Separate public-source research from confidential client context.
- Define whether prompts can include personal data, customer identifiers, or proprietary datasets.
- Require redaction or synthetic test data where real records are unnecessary.

A disclosure that says “we do not share data” should define sharing. Sending a document to an external API is a disclosure-relevant transfer even when the provider promises not to publish it.

**Workflow disclosure.**

- List each deliverable where AI may assist: research, clustering, briefs, writing, editing, code, structured data, translations, images, reporting, forecasting, outreach, or support.
- Distinguish suggestion from autonomous execution.
- Identify actions requiring human approval before deployment.
- State whether AI can change production code, CMS records, DNS, analytics, advertising, or Search Console settings.
- Preserve logs for consequential actions.
- Identify whether an agent can browse, download, send messages, create accounts, or purchase services.
- State whether the client can prohibit AI use for a particular deliverable.
- Require change notice when the workflow becomes more autonomous.

**Source verification.**

- Require inspectable sources for factual claims.
- Prohibit citations generated without opening and reviewing the source.
- Require direct support between each material claim and its cited record.
- Label inference, estimates, and uncertainty.
- Use primary sources for changing technical, legal, medical, and financial facts.
- Maintain correction history when published claims change.
- Preserve the access date for time-sensitive documentation.
- Replace a topic when adequate sources cannot be found.

Google says generative AI can assist research and structure, but producing many pages without adding user value may violate the scaled-content-abuse policy. [@vendor-ai-google] The procurement issue is therefore not whether a tool generated text. It is whether the provider adds verifiable value, exercises editorial control, and avoids manipulative scale.

**Human review.**

- Name the accountable reviewer by role.
- Define the review checklist.
- Require review of facts, citations, calculations, links, metadata, claims, rights, and brand risk.
- Require code review and testing for generated code.
- Prohibit “human reviewed” when the reviewer only approved a headline or clicked publish.
- Set qualifications for sensitive work.
- Require a second reviewer for high-impact releases.
- Preserve rejected drafts or issue logs when material.

Human review is a control only when the reviewer has time, authority, evidence, and a standard for rejecting output.

**Rights and attribution.**

- Identify the source and license for every image, chart, quotation, dataset, and code component.
- Distinguish owned, licensed, public-domain, and limited-use assets.
- Define who owns prompts, drafts, final deliverables, source files, and reusable systems.
- Require disclosure when a deliverable contains material generated with limited human authorship.
- Preserve the client’s ability to replace disputed material.
- Require source records for generated media incorporating uploaded client assets.
- Define responsibility for takedowns and replacements.

The U.S. Copyright Office says AI-assisted work can contain protectable human authorship, while material generated from prompts alone is not protected merely because prompts were supplied. [@vendor-ai-usco] “AI generated” is not an asset-rights record.

**Accuracy and testing.**

- Define acceptance criteria before production.
- Test generated redirects, canonicals, robots rules, schema, templates, tracking, and API changes in a safe environment.
- Use representative pages and failure states.
- Require rollback.
- Record false positives and rejected outputs.
- Prevent generated numbers from entering forecasts without a reproducible calculation.
- Test translations with qualified review for consequential content.
- Verify external links and source availability.
- Confirm generated structured data matches visible content.

A model’s fluency is not a validation result. The output must pass the same technical and editorial tests that would apply if a person produced it badly by hand, humanity’s traditional baseline.

**Security.**

- Require least-privilege access.
- Separate client accounts.
- Use organization-controlled credentials.
- Review browser extensions and desktop agents.
- Restrict autonomous browsing and downloads.
- Scan generated or downloaded code.
- Define incident notification timing.
- Revoke access at termination.
- Require multifactor authentication where supported.
- Prevent local storage of client secrets in prompt history.
- Document connections to repositories, email, calendars, and production systems.
- Review prompt-injection and untrusted-content risks for browsing agents.

**Claims and marketing.**

- Require substantiation for claims about accuracy, automation, rankings, cost savings, speed, or revenue.
- Prohibit fabricated case studies, testimonials, demonstrations, and screenshots.
- Require disclosure of material limitations.
- Preserve the benchmark method behind performance claims.
- Distinguish a demonstration from production performance.
- Prohibit claims that an AI tool is “Google approved” without an exact supporting source.

The FTC warns that AI capability claims must be supported and not exaggerated. [@vendor-ai-ftc] A provider saying “our AI predicts Google with 98% accuracy” needs a test protocol, dataset, baseline, error definition, and date. Otherwise the percentage is decorative upholstery.

**Subcontractors.**

- Name subcontractors who can access client data or production systems.
- Flow the same AI, security, confidentiality, and deletion requirements down to them.
- Require approval for material subprocessor changes.
- Prevent undisclosed crowd or white-label work from being presented as an internal expert team.
- Define who is accountable for defects.
- Identify whether subcontractors use their own AI tools.

**Incidents and corrections.**

- Define an AI incident: confidential-data exposure, fabricated source, harmful output, unauthorized deployment, rights dispute, security event, or material factual error.
- Require immediate containment.
- Preserve prompts, outputs, logs, and versions.
- Notify the client under a defined severity schedule.
- Correct public material transparently.
- Perform root-cause review.
- Update controls before resuming the workflow.
- Define who can pause an autonomous system.

**Termination.**

- Export client-owned prompts, drafts, source lists, code, reports, and required logs.
- Delete retained client data where promised.
- Revoke integrations and service accounts.
- Transfer automation documentation.
- Identify reusable provider IP separately from client work.
- Provide a final access and deletion attestation.
- Disable scheduled agents and recurring jobs.
- Confirm no provider-controlled account remains the sole owner of client systems.

## Completion criteria

The disclosure is complete only when the buyer can trace every material AI-assisted workflow from input through output, review, deployment, retention, and deletion. The controlled record must name the systems and versions, data categories, subprocessors, permitted purposes, prohibited data, human reviewers, acceptance tests, rights basis, production permissions, incident owner, evidence retained, and termination procedure. Each item needs an accountable owner and a review date rather than a promise to revisit it when something becomes exciting.

The buyer should also be able to inspect representative evidence: a source-verification record, a reviewed output, a test or rollback result for generated code, a subprocessor list, an access matrix, an incident path, and a deletion or export procedure. Material gaps should remain open findings with deadlines, not disappear beneath the phrase “responsible AI.”

A one-paragraph AI policy usually answers none of these questions. It does, however, consume a paragraph, which remains a thriving procurement deliverable.
