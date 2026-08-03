---
{
  "slug": "expired-jobposting-markup-seo-claim-check",
  "title": "Can Expired JobPosting Markup Stay Live for SEO?",
  "description": "Learn how to handle expired JobPosting structured data, validThrough, removed vacancies, archived job pages, the Indexing API, and manual-action risk.",
  "format": "Claim check",
  "authoringContract": "canonical-v1",
  "category": "Bad SEO patterns",
  "series": "Claim checks",
  "audience": "Publishers and strategists",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "No. A page may remain available after a vacancy closes, but its JobPosting structured data must stop representing the role as open. Google says expired jobs should use a past validThrough value, remove the JobPosting markup, or be removed with a 404 or 410 response. Keeping active-job markup on a closed vacancy can violate job-posting guidelines and expose the site to a structured-data manual action.",
  "takeaways": [
    "Set validThrough accurately when an application deadline exists.",
    "Remove JobPosting markup when an archived page no longer represents an open role.",
    "Return 404 or 410 when the job page itself should disappear.",
    "The Indexing API can notify Google of job-page changes, but it does not guarantee immediate removal."
  ],
  "claimLimits": [
    "Google does not guarantee when a changed or removed job page will be recrawled or reprocessed.",
    "A historical job page can remain useful without JobPosting markup.",
    "This article addresses Google Search eligibility, not employment-record retention or labor-law requirements."
  ],
  "citations": [
    {
      "id": "google-jobposting",
      "title": "JobPosting structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/job-posting",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "indexing-api",
      "title": "Indexing API quickstart",
      "url": "https://developers.google.com/search/apis/indexing-api/v3/quickstart",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "structured-guidelines",
      "title": "General structured data guidelines",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "manual-actions",
      "title": "Manual actions report",
      "url": "https://support.google.com/webmasters/answer/9044175?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "translated-results-google-search-data-note",
    "google-news-transparency-checklist",
    "content-security-policy-seo-checklist"
  ]
}
---

## Identified claim

> “Leave the JobPosting schema live after the vacancy closes because the page still gets traffic.”

**Verdict: contradicted by Google’s current job-posting guidance.**

Traffic does not convert an expired vacancy into an open job. A page may remain online for historical, recruiting, or employer-information reasons, but the structured data must reflect the current state. Google’s documented options for an expired vacancy are to use a past `validThrough` value, remove the JobPosting markup, or remove the page with a `404` or `410` response. [@google-jobposting]

The underlying claim confuses two separate questions: whether the URL remains useful and whether the vacancy remains eligible to be represented as open. The first can be true after the second becomes false. Structured data is a description of the visible subject, not a license to preserve a stale search feature because the page attracts visits.

The traffic argument also mistakes historical demand for current availability. A closed role may continue attracting searches because people research salaries, duties, employers, or past hiring patterns. Those users can still be served by a clearly labeled archive. They do not require markup that tells a search system the employer is presently accepting applications.

## Sources and evidence

Google’s JobPosting documentation says expired jobs must be handled so users are not sent to vacancies that are no longer open. It describes three valid dispositions: set `validThrough` to a date in the past, remove JobPosting structured data, or remove the page and return `404` or `410`. [@google-jobposting]

`validThrough` is the date after which the job posting is no longer valid. A defensible value reflects the actual closing date rather than an arbitrary rolling extension. When a timestamp is supplied, Google recommends including the time-zone offset. A system should not rewrite the value every week unless the employer genuinely extended the application period.

```json
{
  "@type": "JobPosting",
  "title": "Senior Data Analyst",
  "datePosted": "2026-07-01",
  "validThrough": "2026-08-01T23:59:59-05:00"
}
```

Google’s general structured-data policies require markup to represent the page and not mislead users. [@structured-guidelines] An active JobPosting entity on a visibly closed vacancy creates conflicting evidence. Users may spend time reading a closed role, attempt to apply to an inactive process, or arrive from a job feature that implies availability.

If the job is closed but the page remains useful, remove JobPosting markup and make the state obvious. The page can become an archived role description, hiring-process explainer, portfolio record, employer-information page, or route to current vacancies. It should state that applications are closed and remove active application controls. It should not retain a structured-data eligibility signal merely because salary, location, and responsibility text remain visible.

A useful archive can preserve the original posting date, closing date, department, historical responsibilities, hiring-process context, and links to current openings. It can self-canonicalize when it remains a distinct resource. The critical requirement is that the page no longer presents an active application pathway or machine-readable claim that the role remains open.

If the page should disappear, return `404` or `410`. Remove it from XML sitemaps, job feeds, internal search pages, related-role modules, and ordinary links. Redirecting every expired vacancy to the careers homepage is usually misleading because the homepage is not an equivalent vacancy.

Google’s Manual Actions report can identify structured-data actions when markup violates guidelines. [@manual-actions] A correction should address the generator or template, not only the sample URLs listed in the report. The remediation sequence is to inventory expired vacancies, correct the state logic, validate visible content and markup, test representative pages, and request reconsideration only after the pattern is fixed.

Google’s Indexing API supports notifications for pages containing JobPosting or livestream BroadcastEvent structured data. [@indexing-api] It can notify Google that an eligible URL was updated or deleted. It does not force immediate crawling, guarantee removal, create rich-result eligibility, substitute for an honest HTTP response, or repair invalid markup. The public page state must be correct before the notification is sent.

Large vacancy systems should implement a state machine:

```text
draft
scheduled
open
closing-soon
closed
archived
removed
```

Each state should control visible labels, application links, structured data, sitemap inclusion, internal links, API notification, and HTTP status. A database closing date is not sufficient if the public renderer ignores it.

A production QA review should confirm that the job is genuinely open, the application URL works, `datePosted` and `validThrough` are accurate, visible content matches the markup, closed roles stop accepting applications, archived roles remove JobPosting markup, removed roles return `404` or `410`, and sitemaps contain only approved states.

The check should be automated at the template level where possible. Compare the vacancy database state with the rendered page, structured data, application endpoint, sitemap inclusion, and response code. Alert when a closed record still produces active markup or when a removed record continues returning a successful page. This is less glamorous than inventing a new schema strategy, which is why it tends to work.

## Conclusion

The claim fails because it treats residual traffic as evidence of current vacancy status. It is not. Keep the URL when it serves a genuine historical or employer-information purpose, but remove the job-specific eligibility signal when the hiring opportunity ends. If the page itself has no continuing purpose, remove it honestly.

The clean operating rule is simple: an open vacancy can carry JobPosting markup; a closed vacancy can become an archive without that markup; a removed vacancy should return a removal response. The Indexing API may notify Google after the public state changes, but it cannot replace the state change.

Structured data describes reality. Extending the markup after the vacancy closes is not optimization. It is asking a machine to advertise a position the employer has stopped offering.

## Limitations

Google does not guarantee when a changed or removed job page will be recrawled, reprocessed, or disappear from a search feature. A historical job page can remain useful without JobPosting markup, and a temporary processing delay does not prove the site ignored the rules. The correct disposition also depends on the publisher’s archive policy and the role’s actual status.

This analysis addresses Google Search eligibility and structured-data handling. It does not determine employment-record retention duties, labor-law requirements, accessibility obligations, applicant-notice rules, or jurisdiction-specific archival requirements. Those questions can require separate legal and records-management review. A structured-data correction should not destroy records the employer is independently required to preserve.
