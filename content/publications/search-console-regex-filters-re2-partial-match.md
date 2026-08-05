---
{
  "slug": "search-console-regex-filters-re2-partial-match",
  "title": "Search Console Regex Filters Use RE2 and Partial Matching",
  "description": "Use Search Console regex filters correctly with RE2 syntax, partial matching, anchors, case sensitivity, exclusions, testing, and reproducible exports.",
  "format": "Data note",
  "authoringContract": "canonical-v1",
  "category": "Measurement",
  "series": "Measurement without theater",
  "audience": "Analysts and marketing leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "Search Console Performance filters support regular expressions using RE2 syntax.",
  "takeaways": [
    "Search Console uses RE2-compatible syntax.",
    "Weak goal: Find branded traffic.",
    "Search Console's default partial-match behavior is useful for phrase families."
  ],
  "claimLimits": [
    "A regex classifies displayed dimension values. It does not recover anonymized queries, bypass Search Console row limits, prove user intent, or produce a complete query log."
  ],
  "citations": [
    {
      "id": "rb24-11-source-1",
      "title": "Performance report filters",
      "url": "https://support.google.com/webmasters/answer/17011165?hl=en",
      "publisher": "Google Search Console Help",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "search-console-regex-filters-re2",
    "search-console-performance-data-limits",
    "search-console-bulk-data-export-bigquery",
    "http-424-failed-dependency-playbook"
  ]
}
---

## Dataset and period

**Direct answer.**

Search Console Performance filters support regular expressions using RE2 syntax.[@rb24-11-source-1]

Three defaults cause most mistakes:

1. The pattern matches **any part** of the value unless it is anchored.
2. Matching is **case-insensitive** by default.
3. RE2 does not support every feature found in PCRE, JavaScript, or Python regex engines.

Example:

```text
cat
```

can match:

```text
cat
cats
category
bobcat
```

For the complete value only, use:

```text
^cat$
```

**What to remember.**

- Search Console uses RE2-compatible syntax.
- Add `^` and `$` when the whole query or URL must match.
- Use `(?-i)` when case-sensitive matching is genuinely required under current product guidance.[@rb24-11-source-1]
- Save the exact property, date range, dimensions, filters, and regex.
- A filtered table remains subject to Search Console's reporting limits and privacy protections.

**Start with a plain-language question.**

Weak goal:

> Find branded traffic.

Better goal:

> Return queries containing `rank builder`, `rankbuilder`, or `rankbuilderseo`, regardless of case, but exclude unrelated uses of the word `builder`.

Then write the pattern:

```text
rank ?builder|rankbuilderseo
```

Test it outside the production report using a small list of expected values.

Do not begin with a dense regex and invent its meaning afterward. That is not analysis. It is archaeology performed on punctuation.

## Methodology

**Partial matching.**

Search Console's default partial-match behavior is useful for phrase families.

Pattern:

```text
canonical
```

can match:

```text
canonical tag
canonical url
how to canonicalize
self canonical
```

But a broad token can create false positives.

Pattern:

```text
seo
```

can match words or URLs containing those letters inside a longer string.

Use boundaries or surrounding structure when needed.

RE2 supports common anchors and character classes, but verify the exact supported syntax rather than importing a pattern from another engine.

**Whole-value matching.**

For one exact query:

```text
^technical seo audit$
```

For one exact page path in a URL-oriented filter:

```text
^https://example\.com/guides/canonical-tags/$
```

The dot is escaped because an unescaped `.` means any character in regex syntax.

Keep URL normalization in mind:

- protocol;
- host;
- trailing slash;
- query parameters;
- percent encoding;
- canonical aggregation.

A correct regex can still miss the data when the report's dimension value differs from the URL string expected by the analyst.

**Case sensitivity.**

Search Console's current documentation says regex matching is case-insensitive by default and documents `(?-i)` for case-sensitive matching.[@rb24-11-source-1]

Example:

```text
(?-i)^API$
```

matches uppercase `API` but not lowercase `api` under that behavior.

Most query research does not need case-sensitive filtering because search queries often vary in capitalization without changing intent.

Use case sensitivity for a real analytical distinction, not because the brand team prefers one capitalization.

**Include versus exclude.**

Search Console lets analysts filter values that match or do not match a regex.

Example include:

```text
^(how|what|why|when|where|can|does)\b
```

This can isolate question-like queries.

Example exclusion:

```text
jobs?|careers?|salary|login
```

This can remove known irrelevant intent from a report.

Preserve the exclusion pattern. An unexplained filtered total is impossible to audit later.

## Result

**Unsupported features.**

RE2 deliberately avoids some features common in backtracking engines, including lookaround and backreferences under its core design.

A copied pattern such as:

```text
(?<!not )canonical
```

can fail because negative lookbehind is not supported.

Rewrite the analytical logic through:

- simpler alternation;
- multiple filters;
- export and post-processing;
- a warehouse query;
- explicit inclusion lists.

Do not keep adding punctuation until the interface accepts something whose meaning nobody can explain.

**URL filtering.**

For an article section:

```text
^https://example\.com/guides/
```

For several sections:

```text
^https://example\.com/(guides|research|tools)/
```

For a path ending in `.pdf`:

```text
\.pdf($|\?)
```

Test redirects and canonical selection separately. Search Console can aggregate performance under Google's canonical URL rather than the literal URL a user saw.

## Limitations

**Query-family research.**

A reusable question pattern:

```text
^(how|what|why|when|where|who|can|does|is|are)\b
```

A comparison pattern:

```text
\b(vs|versus|compared with|difference between)\b
```

A troubleshooting pattern:

```text
\b(error|failed|broken|not working|missing|wrong)\b
```

These patterns are editorial heuristics, not perfect intent classifiers.

Review the returned queries before turning the grouping into a content strategy.

**Reproducibility record.**

Store:

```text
PROPERTY:
SEARCH_TYPE:
START_DATE:
END_DATE:
DIMENSION:
INCLUDE_OR_EXCLUDE:
REGEX:
CASE_MODE:
DATA_STATE:
EXPORTED_AT:
```

A dashboard label saying `Nonbrand` is not enough.

The definition belongs beside the result.

**Checklist.**

- Business question written first.
- RE2 compatibility checked.
- Partial matching understood.
- Whole-value anchors added where needed.
- Literal dots escaped.
- Case mode documented.
- Positive examples tested.
- Negative examples tested.
- Include or exclude mode preserved.
- URL canonical behavior considered.
- Report limits disclosed.
- Exact regex saved with export.

**Evidence limits.**

A regex classifies displayed dimension values. It does not recover anonymized queries, bypass Search Console row limits, prove user intent, or produce a complete query log.
