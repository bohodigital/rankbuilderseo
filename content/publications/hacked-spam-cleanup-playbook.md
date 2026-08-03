---
{
  "slug": "hacked-spam-cleanup-playbook",
  "title": "Hacked Spam Cleanup Playbook: Remove Injected URLs and Restore Search Trust",
  "description": "Clean hacked SEO spam through containment, evidence preservation, access rotation, full inventory, trusted restoration, URL disposition, review, and monitoring.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Bad SEO patterns",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Treat hacked spam as a security incident. Freeze unsafe changes, preserve logs and samples, remove attacker access, identify the vulnerability and persistence mechanisms, rebuild from trusted code and data, remove or retire injected URLs with honest responses, verify the entire site, then request review in Search Console. Deleting visible spam while leaving the entry point intact is not cleanup.",
  "takeaways": [
    "Search Console sample URLs are examples, not a complete inventory.",
    "Fix every listed security issue across the site before requesting review.",
    "Remove attacker persistence and rotate credentials before restoring normal publishing.",
    "Use 404 or 410 for removed injected URLs rather than redirecting all spam to the homepage."
  ],
  "claimLimits": [
    "This playbook cannot identify a compromise without access to affected infrastructure, logs, code, and accounts.",
    "Severe incidents may require professional incident response, legal counsel, insurer notification, or regulatory reporting.",
    "Search recovery timing is controlled by Google and can range from days to weeks after review."
  ],
  "citations": [
    {
      "id": "hack-gsc-security",
      "title": "Security issues report",
      "url": "https://support.google.com/webmasters/answer/9044101?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "hack-gsc-performance",
      "title": "How are you performing on Google?",
      "url": "https://support.google.com/webmasters/answer/10268906?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "hack-google-spam",
      "title": "Spam policies for Google web search",
      "url": "https://developers.google.com/search/docs/essentials/spam-policies",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "hack-webdev",
      "title": "Hacked site recovery guidance",
      "url": "https://web.dev/articles/hacked",
      "publisher": "web.dev",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "discover-ranking-systems-claim-check",
    "infinite-calendar-urls-crawl-trap",
    "seo-vendor-ai-use-disclosure-checklist"
  ]
}
---

## Preconditions

Do not begin by editing random spam pages in production. Establish an incident commander, technical owner, communications owner, and a safe investigation environment. Confirm access to hosting, CDN, DNS, CMS, repository, Search Console, authentication records, deployment history, backups, and relevant legal or insurance contacts.

Google’s Security Issues report distinguishes hacked content, malware or unwanted software, and social engineering. It warns that sample URLs are not necessarily complete and says every issue must be fixed throughout the site before review. [@hack-gsc-security]

If the site is actively harming users, prioritize containment over traffic preservation. A temporary outage can be less damaging than continuing to distribute malware, steal credentials, or redirect visitors to fraudulent pages.

Preserve the distinction between observation and hypothesis. “Casino pages appeared” is an observation. “A vulnerable plugin caused them” remains a hypothesis until logs, code, account history, or forensic evidence support it.

## Ordered process

1. **Preserve evidence.** Export Search Console issue details, sample URLs, timestamps, server logs, CDN logs, authentication logs, file hashes, database snapshots, scheduled-task records, installed-extension lists, deployment history, and administrator inventories. Record collection time, source, custodian, and any gaps. Preserve evidence before cleanup when safe so the organization can investigate persistence, data exposure, and reporting duties.

2. **Contain the incident.** Restrict administrative access, disable compromised accounts, isolate affected hosts, pause unsafe deployment paths, and block malicious outbound connections. Avoid destroying evidence needed to understand the compromise. If the site must remain online, serve a known-safe reduced version rather than trusting the compromised application.

3. **Rotate credentials and tokens.** Change hosting, DNS, CMS, database, repository, CI, CDN, email, Search Console, analytics, API, and service-account credentials that may have been exposed. Revoke active sessions, OAuth grants, deploy keys, personal access tokens, application passwords, and recovery codes. Do not rotate only the password used in the most obvious login screen.

4. **Identify the entry point.** Review vulnerable plugins, themes, dependencies, weak credentials, exposed administration panels, file permissions, leaked secrets, infected developer machines, compromised third parties, and unpatched services. The visible spam payload is not necessarily the original compromise, and several entry paths can coexist.

5. **Find persistence.** Inspect startup jobs, cron entries, scheduled tasks, web shells, administrator accounts, database triggers, must-use plugins, injected templates, altered build scripts, service workers, server configuration, DNS records, and CI secrets. Attackers often install more than one return path because even criminals understand redundancy.

6. **Build the complete affected inventory.** Combine Search Console samples with server and CDN logs, filesystem and database searches, CMS records, sitemap diffs, crawl results, unexpected Search queries, external backlink records, threat records, and modified-file history. Use `site:` searches as examples rather than a complete index count. Google notes that unexpected pharmaceutical or casino queries can be a hacking signal. [@hack-gsc-performance] Treat those queries as leads, not a complete affected-URL export.

7. **Restore from trusted sources.** Rebuild systems from verified code, clean packages, and known-good content. A backup is useful only when its date and integrity are known and the original vulnerability is fixed. Reinstall dependencies from trusted registries, verify lockfiles or hashes, rebuild infrastructure when practical, and avoid copying unknown executable files into the restored system.

8. **Remove malicious content and behavior.** Delete injected pages, links, redirects, scripts, users, files, database rows, sitemaps, feeds, generated caches, and service-worker artifacts. Check desktop, mobile, logged-out, crawler, referrer, language, and geographic conditions because attackers may cloak payloads. Review metadata and structured data as well as visible body content.

9. **Choose the correct URL disposition.** Attacker-created URLs that never had legitimate value should normally return `404 Not Found` or `410 Gone`, disappear from sitemaps and internal links, and remain crawlable long enough for Google to observe removal. Legitimate URLs that were modified should be restored with their legitimate content and successful response. Truly moved legitimate content should redirect only to an equivalent destination. Do not redirect every spam URL to the homepage.

10. **Validate the public production path.** Test representative clean pages and former spam URLs through the public hostname. Inspect response codes, rendered HTML, scripts, outgoing links, structured data, canonicals, robots directives, sitemaps, cache layers, service workers, security headers, mobile behavior, and geographic variants. Testing only the application origin can miss malicious edge rules or stale CDN content.

11. **Review Search Console reports.** Check Security Issues, Manual Actions, Page Indexing, URL Inspection, Sitemaps, and performance queries. Security Issues and Manual Actions are different systems: the former concerns hacked or harmful behavior, while the latter primarily concerns attempts to manipulate Search. [@hack-gsc-security] A clean report is useful evidence, not a substitute for infrastructure validation.

12. **Request review only after complete remediation.** Google says a security review can take from a few days to a few weeks. Explain the issue, root cause, cleanup, and preventive controls. Do not submit repeated requests while the site remains compromised. A concise factual request is stronger than an essay insisting that the website learned an important lesson.

13. **Monitor for recurrence.** Alert on new administrators, executable files, suspicious scheduled jobs, unexpected sitemaps, spikes in new URLs, anomalous query terms, DNS changes, failed logins, outbound traffic, integrity drift, and unapproved deployments. Compare against a known-good baseline and preserve alert disposition.

14. **Complete the post-incident review.** Record the timeline, root cause, affected data, attacker actions, containment, recovery, Search impact, user impact, communication, control failures, and assigned remediation. Track each preventive task to an owner and deadline, and schedule a later follow-up after the system has operated long enough to reveal recurrence.

## URL cleanup matrix

```text
attacker URL never valid -> 404 or 410
legitimate URL modified -> restore legitimate content, 200
legitimate URL permanently moved -> 301 to true equivalent
malicious redirect -> remove redirect and restore intended state
private exposed content -> require authentication and assess disclosure
```

A canonical to the homepage does not make injected pages disappear. It adds a suggestion to an incident.

Remove attacker-generated URLs from XML sitemaps, HTML sitemaps, internal search indexes, related-content modules, feeds, and caches. Check whether the attack created parameter variants, calendar-like paths, or internal-link generators that continue producing new URLs after visible database records are removed.

## Search and user communication

Security warnings can appear in Search results or browsers. Do not claim the site is safe until harmful behavior is removed and validated.

Communications may need to address downtime, password resets, compromised data, fraudulent pages, payment systems, customer support, law enforcement, regulators, insurers, and partners. SEO messaging is subordinate to accurate incident communication.

Google’s spam policies describe hacked content as material placed on a site without permission because of security vulnerabilities. [@hack-google-spam] The owner’s intent may be innocent, but the public effect can still harm users and Search quality.

Google’s hacked-site recovery guidance emphasizes quarantine, assessment, cleanup, security fixes, and review. [@hack-webdev] A Search review should follow technical recovery, not substitute for it.

## Failure cases

**Deleting only Search Console examples.** The report provides samples, not the complete affected set.

**Restoring a vulnerable backup.** The spam returns because the entry point survives.

**Changing passwords but leaving sessions and tokens active.** The attacker can continue using already issued access.

**Blocking spam URLs in robots.txt.** Google cannot crawl the final removed state.

**Redirecting every injected URL to the homepage.** This creates irrelevant redirects and can resemble soft-404 behavior.

**Submitting review before all issues are fixed.** The review cannot substitute for remediation.

**Cleaning the CMS but not the developer workstation or CI pipeline.** The compromised deployment path recreates the incident.

**Treating a security issue as negative SEO without evidence.** Compromise evidence should be traced through accounts, code, logs, and infrastructure.

**Trusting a clean visual check.** Injected behavior may trigger only for particular referrers, devices, locations, cookies, or crawler identities.

**Failing to preserve evidence.** The page disappears, but the organization cannot identify exposed data, persistence, or legal duties.

## Completion criteria

The incident is ready for closure only when the organization can demonstrate that attacker access has been removed, credentials and sessions have been rotated, persistence checks have passed, production has been rebuilt or restored from trusted sources, malicious behavior is absent across tested conditions, injected URLs return correct final states, and sitemaps and internal links no longer generate the unwanted inventory.

Search Console issues must be reviewed, any required reconsideration or security review must contain a complete factual explanation, recurrence monitoring must be operating, and the post-incident record must identify unresolved uncertainty, compensating controls, owners, and follow-up dates. A green Search Console screen is useful evidence. It is not proof that the attacker no longer owns a small, enthusiastic corner of the infrastructure.
