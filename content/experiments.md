---
{
  "experiments": [
    {
      "id": "RB-EXP-001",
      "title": "Direct titles vs. brand-led titles",
      "hypothesis": "Direct, descriptive titles may establish clearer query alignment than brand-led titles on a young publication.",
      "protocol": ["Record the current title and query mix before intervention.","Change only the title pattern for the selected cohort.","Compare impressions and query mix over the stated window."],
      "baseline": "The pre-change Search Console impression and query-mix record for the selected pages.",
      "measurementWindow": "28 days",
      "status": "Measuring",
      "measurement": "Impressions + query mix",
      "result": "Pending; the measurement window is still open.",
      "limitations": ["A young site has limited history.","Search demand and result layouts can change during the window.","A site-specific observation cannot establish a universal ranking rule."],
      "relatedPublications": ["what-an-seo-report-should-answer","search-console-is-not-analytics"]
    },
    {
      "id": "RB-EXP-002",
      "title": "Definition-first glossary pages",
      "hypothesis": "Putting the plain-language answer first may improve usefulness without forcing every entry into long-form article theater.",
      "protocol": ["Preserve the existing glossary index and anchors.","Publish one canonical URL per validated term.","Observe indexation and on-page engagement over the stated window."],
      "baseline": "The existing single-page glossary index with fragment-only entry destinations.",
      "measurementWindow": "42 days",
      "status": "Queued",
      "measurement": "Indexation + engagement",
      "result": "Not started.",
      "limitations": ["Indexation alone does not measure reader usefulness.","Engagement signals depend on the configured analytics implementation.","Twelve terms are a small initial collection."],
      "relatedPublications": ["technical-seo-baseline"]
    },
    {
      "id": "RB-EXP-003",
      "title": "Visible evidence labels",
      "hypothesis": "Readers may navigate more confidently when source depth and claim limits are visible before the body copy.",
      "protocol": ["Render the evidence level and claim limits from canonical metadata.","Keep article titles, descriptions, and primary copy stable.","Compare navigation paths during the stated window."],
      "baseline": "Article pages label evidence but do not expose validated citations or record-level correction history.",
      "measurementWindow": "21 days",
      "status": "Queued",
      "measurement": "Navigation paths",
      "result": "Not started.",
      "limitations": ["Navigation behavior does not prove trust.","Traffic mix may change during the window.","The observation applies only to this publication interface."],
      "relatedPublications": ["how-to-read-an-seo-audit","what-an-seo-report-should-answer"]
    }
  ]
}
---

Experiment records are separate from publication records and fail validation when required fields or related-publication links are invalid.
