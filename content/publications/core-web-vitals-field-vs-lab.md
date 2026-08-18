---
{
  "slug": "core-web-vitals-field-vs-lab",
  "title": "Core Web Vitals: Why Field Data and Lighthouse Scores Disagree",
  "description": "A measurement guide to CrUX field data, Lighthouse lab tests, LCP, INP, CLS, and how to debug disagreements without chasing the wrong score.",
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
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Field and lab Core Web Vitals can disagree because they measure different populations and environments; use field data to identify real-user problems and lab tests to reproduce and diagnose specific causes.",
  "takeaways": [
    "Search Console Core Web Vitals reflects aggregated real-user field data rather than a single synthetic test run.",
    "Lab tools provide controlled reproducibility and diagnostics, but their result is not expected to equal field data.",
    "Investigations should segment by metric and page group instead of treating one Lighthouse score as the site's universal user experience."
  ],
  "claimLimits": [
    "Core Web Vitals are one part of page experience and do not provide a complete ranking, conversion, or user-satisfaction model."
  ],
  "citations": [
    {
      "id": "cwv-search-console",
      "title": "Core Web Vitals report",
      "url": "https://support.google.com/webmasters/answer/9205520",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "cwv-vitals",
      "title": "Web Vitals",
      "url": "https://web.dev/articles/vitals",
      "publisher": "web.dev",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "cwv-lab-field",
      "title": "Why lab and field data can be different",
      "url": "https://web.dev/articles/lab-and-field-data-differences",
      "publisher": "web.dev",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "http-451-seo-legal-removals"
  ]
}
---

## Definition

Core Web Vitals are a small set of user-experience metrics intended to capture important aspects of loading, responsiveness, and visual stability. The current set centers on Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift. Web.dev describes the metrics and their recommended thresholds, while Search Console groups URLs using real-user data from the Chrome User Experience Report. [@cwv-vitals] [@cwv-search-console]

The central measurement distinction is field data versus lab data. Field data is collected from real users under the devices, networks, locations, cache states, and interaction patterns they actually experience. Lab data is produced in a controlled environment with specified hardware, network throttling, browser configuration, and test flow. Both are legitimate measurements, but they answer different questions. Web.dev explicitly documents reasons that lab and field values can differ. [@cwv-lab-field]

A Lighthouse run therefore is not a miniature copy of Search Console's Core Web Vitals report. One is a synthetic observation under chosen conditions; the other reflects a distribution of eligible real-user experiences over time and can be grouped across similar URLs. Expecting their numbers to match exactly is a category error, though apparently a remarkably durable one.

## Mechanism

Field Core Web Vitals data is built from real Chrome user experiences that meet CrUX eligibility and reporting requirements. Search Console then groups pages with similar experience patterns and reports whether those groups are poor, need improvement, or good based on the relevant metric thresholds. [@cwv-search-console] The data is aggregated and historical, so it should not be interpreted as a real-time probe of a deployment made minutes ago.

Lab testing controls the environment. A team can run the same route repeatedly, hold network and device assumptions relatively constant, capture traces, and identify long tasks, late-loading resources, render-blocking work, layout shifts, or other implementation details. That repeatability is precisely why lab tools are valuable for debugging. The tradeoff is that the test environment represents only one modeled experience rather than the full production population.

Metric behavior can magnify the difference. LCP depends on which element becomes the largest visible content candidate and when it renders. INP depends on real user interactions and their latency, which is difficult to reproduce faithfully with a page-load-only synthetic run. CLS can accumulate from layout shifts caused by ads, personalization, consent interfaces, fonts, asynchronous components, or content that does not appear in every lab scenario. [@cwv-vitals]

Population mix matters too. A site may have fast desktops on office broadband and slow phones on constrained networks. Field data combines eligible real experiences according to the population that actually visited. A lab run can deliberately emulate a slower mobile device, but that synthetic profile may be better or worse than the site's actual mix. The discrepancy is evidence about different sampling frames, not necessarily evidence that one tool is broken. [@cwv-lab-field]

## Examples

Suppose Search Console reports poor LCP for a product template while a local Lighthouse run looks good. The first question should not be which number is "right." Investigate whether the lab test used a warm cache, whether production users encounter a slower CDN region, whether hero images vary by viewport, and whether the Search Console page group includes slower variants. Then reproduce representative conditions in the lab and use traces to find the mechanism.

A reverse case is equally common. Lighthouse can produce a poor synthetic LCP on a throttled mobile profile while field data remains good. That may mean the site's real users have faster devices or networks, the tested page is not representative, or the field population experiences beneficial caching. The synthetic result is still useful because it identifies fragility under slower conditions, but it should not be relabeled as the site's measured real-user percentile.

INP provides another instructive mismatch. A page may load quickly in a lab run but respond poorly after users interact with filters, navigation, or client-side widgets. Field INP can expose that behavior because it is based on real interactions. A lab investigation then needs an interaction script or manual reproduction that exercises the same component; repeatedly measuring only initial load will miss the mechanism. [@cwv-vitals]

CLS differences often point to conditional content. A consent banner may appear only for some geographies, an ad slot may fill only for monetized traffic, or an account widget may appear only after login. If the lab scenario never triggers the condition, it cannot reproduce the field shift. Segmentation and scenario design are more useful than averaging the disagreement away.

## Boundaries

Neither field nor lab Core Web Vitals is a complete model of site quality. A page can pass all three metrics and still be confusing, inaccessible, inaccurate, or commercially useless. Conversely, an important application can have a localized performance problem without every business outcome collapsing. Treat the metrics as focused indicators, not a metaphysical score of web virtue.

Search Console field data also has coverage limits. Low-traffic URLs may not have enough eligible CrUX data and can be grouped with similar pages. [@cwv-search-console] Absence from the report does not prove excellent performance, and a group result is not necessarily the exact experience of every member URL.

Lab results should not be compared to field values as though identical percentiles, devices, and populations were sampled. Web.dev's field-versus-lab guidance recommends understanding the environmental differences and using the datasets together. [@cwv-lab-field] Field data is strongest for detecting real-user impact and prioritizing problems; lab data is strongest for controlled diagnosis and iteration.

Finally, avoid optimizing a composite Lighthouse score while ignoring the underlying metrics and users. Record LCP, INP, and CLS separately, segment representative templates, annotate releases, and preserve both field trends and repeatable lab traces. The useful question is not "Why is Lighthouse lying?" It is "Which population and mechanism does each measurement represent, and what change would improve the actual experience?" That is less emotionally satisfying than yelling at a green circle, but substantially more useful.
