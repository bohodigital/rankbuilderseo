---
{
  "slug": "nosnippet-max-snippet-ai-overviews",
  "title": "nosnippet vs max-snippet for AI Overviews: How Google Preview Controls Really Work",
  "description": "Compare nosnippet, data-nosnippet, max-snippet, and noindex for Google AI Overviews, AI Mode, featured snippets, and ordinary Search previews.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Operators and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-06",
  "revisedAt": "2026-08-06",
  "directAnswer": "Google’s AI Search documentation names the same preview controls publishers already use for ordinary Search. The hard part is choosing the least destructive control: exclude one section, limit snippet length, remove all snippets, or remove the page from indexing entirely.",
  "takeaways": [
    "Google’s AI Search documentation names the same preview controls publishers already use for ordinary Search. The hard part is choosing the least destructive control: exclude one section, limit snippet length, remove all snippets, or remove the page from indexing entirely.",
    "Google names four main controls site owners can use to limit information shown from pages in Search, including AI features: nosnippet; data-nosnippet; max-snippet; noindex.",
    "Use the narrowest control that matches the policy."
  ],
  "claimLimits": [
    "The cited sources supporting this nosnippet AI Overviews review were checked through 2026-08-06.",
    "nosnippet AI Overviews documentation, interfaces, measurement methods, policies, and availability can change after publication.",
    "Correct handling of nosnippet AI Overviews does not guarantee rankings, traffic, citations, advertising delivery, or commercial outcomes."
  ],
  "citations": [
    {
      "id": "rb-algo-trend-06-06-source-1",
      "title": "AI features and your website",
      "url": "https://developers.google.com/search/docs/appearance/ai-features",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-06-source-2",
      "title": "Control your snippets in search results",
      "url": "https://developers.google.com/search/docs/appearance/snippet",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-06-source-3",
      "title": "Featured snippets and your website",
      "url": "https://developers.google.com/search/docs/appearance/featured-snippets",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-06"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "google-extended-ai-overviews",
    "google-approved-seo-tools",
    "ai-mode-vs-ai-overviews"
  ]
}
---

## Preconditions

Google’s AI Search documentation names the same preview controls publishers already use for ordinary Search. The hard part is choosing the least destructive control: exclude one section, limit snippet length, remove all snippets, or remove the page from indexing entirely.

Google names four main controls site owners can use to limit information shown from pages in Search, including AI features:

- `nosnippet`;
- `data-nosnippet`;
- `max-snippet`;
- `noindex`.

They do different jobs.

Use the narrowest control that matches the policy.

**`data-nosnippet`.**

Hide selected page sections from snippets.

**`max-snippet`.**

Limit the amount of text Google can use in snippets.

**`nosnippet`.**

Prevent text snippets for the page.

**`noindex`.**

Remove the page from Google Search indexing after Google processes the directive.

That last one is not a preview preference. It is a visibility kill switch.

**Why this matters in 2026.**

Publishers now care about ordinary snippets, featured snippets, AI Overviews, AI Mode, and Discover at the same time.

A control added for one reason can affect several surfaces.

Google’s AI Search documentation tells site owners to use existing Search preview controls to limit page information shown in generative features.

So the question is no longer:

> What is the AI tag?

There is no special AI tag.

The question is:

> Which existing Search control matches the policy?

**`data-nosnippet`: the surgical option.**

Use `data-nosnippet` when one section should not appear in snippets.

Example:

```html
<div data-nosnippet>
  Subscriber-only analysis here.
</div>
```

The rest of the page can remain available for snippet generation.

Good use cases:

- proprietary table;
- sensitive teaser;
- spoiler;
- subscriber-only explanation;
- content that becomes misleading out of context.

Do not wrap the whole `<body>` in it unless that is the actual intent.

**Sources reviewed.**

1. [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — Google Search Central; accessed 2026-08-06. [@rb-algo-trend-06-06-source-1]
2. [Control your snippets in search results](https://developers.google.com/search/docs/appearance/snippet) — Google Search Central; accessed 2026-08-06. [@rb-algo-trend-06-06-source-2]
3. [Featured snippets and your website](https://developers.google.com/search/docs/appearance/featured-snippets) — Google Search Central; accessed 2026-08-06. [@rb-algo-trend-06-06-source-3]

## Ordered process

Use the article in this order:

1. Why this matters in 2026
2. `data-nosnippet`: the surgical option
3. `max-snippet`: limit the amount
4. `nosnippet`: broad preview removal
5. `noindex`: much broader
6. The robots.txt trap
7. Troubleshooting when AI still shows old content
8. `X-Robots-Tag` for non-HTML resources
9. Policy examples
10. Structured data does not override preview policy

**`max-snippet`: limit the amount.**

Example:

```html
<meta name="robots" content="max-snippet:120">
```

This tells Google the maximum number of characters that may be used in a text snippet.

Google also documents `max-snippet` in relation to featured snippets.

Shorter limits can reduce the likelihood that enough text is available for a useful featured snippet.

But Google does not publish a universal threshold that guarantees exclusion from featured snippets.

**`nosnippet`: broad preview removal.**

Example:

```html
<meta name="robots" content="nosnippet">
```

This prevents Google from showing a text snippet for the page.

That is a major tradeoff.

Ordinary results can become less informative.

Featured snippets are blocked.

AI Search use of the page’s text is constrained.

Do not deploy it merely because someone dislikes the idea of one AI answer.

Measure what snippets contribute to CTR first.

**`noindex`: much broader.**

Example:

```html
<meta name="robots" content="noindex">
```

Google can remove the page from Search after recrawling and processing the directive.

Use it when the page should not be indexed.

Do not use it as an AI-only control.

If the site still wants ordinary Search traffic, `noindex` solves the wrong problem extremely effectively.

**The robots.txt trap.**

Do not block crawling of a page before Google can read a new meta robots directive.

If Google cannot crawl the page, it may not see:

```text
noindex
nosnippet
max-snippet
```

Google’s documentation repeatedly distinguishes crawl controls from index and preview controls.

A common cleanup sequence is:

1. allow crawl;
2. expose the directive;
3. let Google process it;
4. verify the result.

**Troubleshooting when AI still shows old content.**

Google says preview-control changes require recrawling and processing.

Crawling can take from days to months depending on the page.

Check:

- directive in raw HTML;
- directive in rendered HTML;
- URL Inspection;
- last crawl;
- CDN cache;
- stale server version;
- conflicting `X-Robots-Tag`.

Request recrawl for important URLs after verifying the implementation.

**`X-Robots-Tag` for non-HTML resources.**

HTTP headers can carry robots directives.

That is useful for:

- PDFs;
- files;
- generated resources.

Example:

```text
X-Robots-Tag: noindex
```

Do not assume an HTML meta tag can control a PDF.

Use the response header where appropriate.

**Policy examples.**

**Public news article.**

Goal:

```text
ordinary Search yes
AI visibility yes
```

Use no special restriction.

**Public article with one proprietary table.**

Goal:

```text
index page
avoid snippet reuse of table
```

Consider `data-nosnippet` around the table.

**Public page with minimal preview.**

Goal:

```text
remain indexed
limit excerpt length
```

Consider `max-snippet`.

**Member-only page not intended for Google.**

Goal:

```text
not indexed
```

Use access control and/or appropriate indexing directives.

**Structured data does not override preview policy.**

A page can contain Article or Product structured data.

That does not nullify `nosnippet`.

Do not treat JSON-LD as a separate permission system.

The visible page, indexing controls, preview controls, and structured data must be coherent.

## Failure cases

**FAQ.**

**Does nosnippet block AI Overviews?**

Google documents nosnippet as a Search preview control relevant to its AI Search features.

**Can I hide only one paragraph?**

Use `data-nosnippet` around the specific content when appropriate.

**Does max-snippet guarantee no AI citation?**

No. It controls snippet length, not a universal citation guarantee.

**Does noindex keep the page in normal Search but out of AI?**

No. It is much broader.

**How fast do changes apply?**

After Google recrawls and processes the page. Timing varies.

**Deployment checklist.**

- Business goal defined.
- Narrowest control selected.
- Raw HTML checked.
- Rendered HTML checked.
- X-Robots-Tag checked.
- robots.txt allows Google to see directive.
- URL Inspection run.
- Featured snippet effect considered.
- Ordinary CTR effect considered.
- AI reporting baseline saved.
- Change date recorded.
- Follow-up crawl verified.

**Verdict.**

Google did not invent a new AI meta tag.

That is good news.

Use the existing Search controls deliberately, because each one trades visibility for control at a different scale.

**Verification record.**

- Search preview controls and AI feature guidance were checked on 2026-08-06.
- No universal max-snippet threshold or AI-citation guarantee is claimed.
- Crawl and indexing controls are distinguished.

**Duplication and search-intent record.**

No prior package centers the exact nosnippet-versus-max-snippet AI Search control comparison.
