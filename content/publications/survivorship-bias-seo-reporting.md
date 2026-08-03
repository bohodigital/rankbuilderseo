---
{
  "slug": "survivorship-bias-seo-reporting",
  "title": "Survivorship Bias in SEO Reporting: Why Failed Pages Disappear",
  "description": "Understand survivorship bias in SEO case studies, content reporting, migrations, page pruning, rankings, and vendor analysis, with controls that preserve failed pages.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Measurement",
  "series": "Measurement without theater",
  "audience": "Analysts and marketing leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-03",
  "revisedAt": "2026-08-03",
  "directAnswer": "Survivorship bias occurs when analysis includes only units that remain observable after a process and excludes units that failed, were removed, were rejected, or disappeared. In SEO, current published pages, current clients, current ranking keywords, or successful migrations can make outcomes look better than the full starting population. Freeze the original cohort and retain every disposition.",
  "takeaways": [
    "Use the original eligible population, not only the surviving current inventory.",
    "Keep removed, redirected, noindexed, rejected, and zero-traffic pages in the outcome record.",
    "Separate planned exclusions from post-outcome deletions.",
    "Report survival rate, disposition, and full-cohort results beside survivor-only metrics."
  ],
  "claimLimits": [
    "Removing poor pages can be a valid intervention; the bias arises when the removals disappear from measurement.",
    "Not every missing unit failed, and every disposition needs classification.",
    "Survivorship bias is one selection mechanism and can coexist with regression to the mean, confounding, and missing-data bias."
  ],
  "citations": [
    {
      "id": "surv-msmarco",
      "title": "On Survivorship Bias in MS MARCO",
      "url": "https://eprints.gla.ac.uk/268516/",
      "publisher": "University of Glasgow / SIGIR",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "surv-outcome-bias",
      "title": "Empirical evidence of bias in trial outcome reporting",
      "url": "https://pubmed.ncbi.nlm.nih.gov/16248351/",
      "publisher": "JAMA / PubMed",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "surv-gsc-data",
      "title": "Performance report: About the data",
      "url": "https://support.google.com/webmasters/answer/17011364?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    },
    {
      "id": "surv-gsc-performance",
      "title": "Performance report overview",
      "url": "https://support.google.com/webmasters/answer/7576553?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-03"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "translated-results-google-search-data-note",
    "seo-proposal-bid-normalization-playbook",
    "content-security-policy-seo-checklist"
  ]
}
---

## Definition

Survivorship bias is a selection error caused by analyzing only units that remain observable after a process. Let the original population be P0, containing units 1 through N, and let S be the subset of observed survivors. A survivor-only average can be written as:

```text
average among survivors = sum of outcomes for units in S divided by the number of units in S
```

That average is not generally equal to the average for the original population unless the excluded units are irrelevant to the question or their disappearance is unrelated to outcome.

In SEO, units can disappear because pages are deleted, redirected, noindexed, canonicalized elsewhere, rejected in editorial review, removed from a keyword tracker, omitted from a migration sheet, or excluded from a case study. The current visible inventory is therefore often a selected subset of the work that originally entered the program.

Research on the MS MARCO passage-ranking dataset found survivorship bias when discarded or unmatched queries disappeared from the effective evaluation population, distorting system comparison. [@surv-msmarco] The mechanism is directly relevant to SEO reporting because pages and queries pass through multiple survival filters before they appear in a final dashboard.

## Mechanism

The bias enters when inclusion in the analysis depends on what happened to the unit. A publisher launches pages, watches their performance, removes weak pages, and then calculates the average only for pages that remain. An agency publishes case studies only for clients with dramatic growth. A migration report validates only URLs that successfully reached the final redirect map. A rank tracker drops queries that never entered the top one hundred.

The mathematical problem is selection on an outcome-related process. If low-performing pages are more likely to be removed, the missingness is not random. The survivor-only mean answers a different question: “How did the units that remained perform?” It does not answer “How did the original program perform?”

Selective outcome-reporting research describes a related form of bias when only selected outcomes appear in the final publication. [@surv-outcome-bias] A vendor case study can be individually accurate while still producing a misleading expectation if flat, failed, terminated, or unmeasurable engagements are systematically absent.

Search Console can compound the issue without causing it. Its Performance report contains processed and aggregated data, omits some query rows, and applies report-specific filters and canonicalization rules. [@surv-gsc-data] [@surv-gsc-performance] A current Search Console view is not a historical registry of every URL, query, property state, and disposition. The analyst needs a separate cohort table.

A defensible registry preserves:

```text
unit_id
eligibility_date
initial state
cost
treatment
current state
disposition
outcome
```

Removed pages need tombstone rows containing the old URL, removal date, reason, replacement, cost, and historical metrics. The deletion of a CMS record should not erase the unit from the analysis population.

## Examples

A publisher creates 500 pages. After one year, 100 are deleted, 75 redirected, 50 noindexed, 25 never indexed, and 250 remain live. The report calculates a median of 400 clicks among the 250 survivors and says the typical page generated 400 clicks. That statement excludes half the original program. The full report needs the original count, every disposition, pre-removal performance, creation cost, maintenance cost, traffic, and business outcome.

A content-pruning project can raise average traffic per surviving page while total traffic falls. Both statements can be true. The report should therefore show sitewide traffic, traffic per survivor, traffic per original page, removed-page traffic, redirected-page traffic, and the cost of the content that was later removed.

A migration team may report a 98 percent success rate using only URLs that entered the final mapping file. The correct denominator depends on the question. If the migration intended to process all eligible original URLs, use:

```text
success rate = accepted migrated units divided by all eligible original units
```

Missing URLs, unmatched content, errors, and intentionally retired pages need named dispositions rather than disappearance.

An agency may have forty clients and publish three high-growth case studies. The studies can document real results while omitting flat outcomes, tracking failures, client implementation problems, and terminated accounts. A buyer should treat the case-study set as selected evidence, not as an empirical distribution of all client outcomes.

A keyword tracker can create the same effect when it reports only currently tracked queries, queries with impressions, or queries within a ranking cutoff. Preserve the original keyword inventory, every addition and removal date, and the rule used to change the set.

## Boundaries

Survivorship bias does not mean pages should never be pruned, weak campaigns should never be stopped, or irrelevant units must remain in every analysis. Removal can be a valid intervention. The requirement is to preserve the unit and its disposition when evaluating the program that created it.

Two views are often useful: survivor performance and original-cohort performance. The first answers how the remaining inventory behaves. The second answers what happened to the full investment. Neither should impersonate the other.

Survivorship bias is also distinct from regression to the mean. Regression to the mean concerns extreme measurements moving toward an underlying average. Survivorship bias concerns which units remain available for analysis. They can coexist when an analyst selects top pages, removes weak pages, waits for the winners to regress, and reports only the remaining winners.

A defensible report freezes the original cohort, preserves all dispositions, records exclusion timing, explains missing data, includes the cost of failed units, reports both survivor and original-cohort metrics, and states the limitations. The pages that disappeared are part of the strategy’s outcome. Deleting them from the CMS does not delete them from history, although it can make a dashboard extremely optimistic.
