---
{
  "slug": "import-maps-seo-playbook",
  "title": "Import Maps SEO Playbook: Module Resolution Must Fail Safely",
  "description": "Audit JavaScript import maps for SEO across JSON validity, ordering, scopes, integrity, CORS, caching, workers, fallbacks, and rendered output.",
  "format": "Playbook",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "draft",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-05",
  "revisedAt": "2026-08-05",
  "directAnswer": "An import map controls how a browser resolves JavaScript module specifiers.",
  "takeaways": [
    "The browser must process the map before modules use its specifiers.",
    "An import map is JSON, not JavaScript.",
    "The scopes object can map a specifier differently depending on the importing module’s URL."
  ],
  "claimLimits": [
    "Import-map support and integrity features continue to evolve. The feature changes module resolution, not search eligibility. Search behavior depends on the final document and its failure modes."
  ],
  "citations": [
    {
      "id": "rb24-07-source-1",
      "title": "script type=importmap",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap",
      "publisher": "MDN Web Docs",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-07-source-2",
      "title": "JavaScript modules",
      "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
      "publisher": "MDN Web Docs",
      "accessedAt": "2026-08-05"
    },
    {
      "id": "rb24-07-source-3",
      "title": "Understand the JavaScript SEO basics",
      "url": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-05"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "crawlable-javascript-links",
    "javascript-seo-rendering-pipeline",
    "rendered-html-missing-content"
  ]
}
---

## Preconditions

**Direct answer.**

An import map controls how a browser resolves JavaScript module specifiers.[@rb24-07-source-1]

```html
<script type="importmap">
{
  "imports": {
    "app": "/assets/app.v42.js",
    "vendor/": "/assets/vendor/"
  }
}
</script>
```

A later module can import:

```js
import { start } from 'app';
```

Import maps can reduce bundler coupling and make dependency locations explicit. They can also break every client-rendered route if the map is invalid or arrives after a dependent module.

The SEO rule is ordinary resilience:

> Page identity and primary content should not depend on a module-resolution feature whose failure leaves an empty document.

**Declare the map before dependent modules.**

The browser must process the map before modules use its specifiers.[@rb24-07-source-1]

Correct order:

```html
<script type="importmap">...</script>
<script type="module" src="/assets/bootstrap.js"></script>
```

Wrong order can leave bare specifiers unresolved.

Place the map early in the document head. Do not inject it after a module graph has already begun resolving.

## Ordered process

1. **Use valid JSON.**
2. **Understand scope.**
3. **Version the map and modules together.**
4. **Cross-origin modules.**
5. **Integrity metadata.**
6. **Workers and worklets.**

**Use valid JSON.**

An import map is JSON, not JavaScript.

Invalid:

```json
{
  "imports": {
    "app": "/app.js",
  }
}
```

The trailing comma is invalid JSON.

Validate maps during the build. Fail the deployment when required keys, values, or path-prefix rules are invalid.

Keys ending in `/` must map to values ending in `/` for prefix matching under current browser rules.[@rb24-07-source-1]

**Understand scope.**

The `scopes` object can map a specifier differently depending on the importing module’s URL.

That supports multiple dependency versions, but it creates route-sensitive behavior.

Test:

- direct page load;
- nested route;
- imported component;
- shared layout;
- lazy route;
- old cached module;
- preview deployment.

A scope that matches locally can fail under a production subpath.

**Version the map and modules together.**

A deployment can produce this failure:

```text
new HTML + old cached map
old HTML + new map
new map + missing module
```

Use immutable versioned module URLs and deploy the HTML, map, and module artifacts as one release.

Avoid reusing a URL for different module bytes unless cache invalidation is proven.

**Cross-origin modules.**

Module scripts use CORS.[@rb24-07-source-2]

If a map points to another origin, test:

- `Access-Control-Allow-Origin`;
- redirects;
- credentials mode;
- content type;
- TLS;
- cache;
- outage behavior;
- supply-chain ownership.

Do not depend on a third-party module for the only rendering of primary content.

**Integrity metadata.**

Current import-map syntax can include integrity metadata for mapped module URLs.[@rb24-07-source-1]

Use it where supported and operationally appropriate. Integrity values must change when module bytes change.

A stale integrity hash causes the module to fail rather than silently load unexpected code. That is a security feature, but the page needs a useful fallback.

**Workers and worklets.**

Import maps apply to document module resolution and do not automatically apply to workers or worklets under current documentation.[@rb24-07-source-1]

A module that works in the page can fail inside:

- Web Worker;
- Service Worker;
- AudioWorklet;
- PaintWorklet.

Give those environments resolvable URLs or their documented import mechanism.

## Failure cases

**Primary content and metadata.**

Strong architecture:

```text
Server HTML contains article, title, canonical, links
Import map loads enhancements
```

Fragile architecture:

```text
Server HTML contains empty root
Import map resolves app shell
Module fetch fails
Page remains blank
```

Google can render JavaScript, but its documentation does not promise that every failed or delayed module graph will complete before processing.[@rb24-07-source-3]

**Monitoring.**

Capture:

- import-map parse errors;
- failed module URLs;
- CORS errors;
- integrity failures;
- route rendering failures;
- blank-root detection;
- release version;
- browser support.

A console error that affects only one lazy route can remain invisible to homepage monitoring.

**Release checklist.**

- Map is valid JSON.
- Map appears before dependent modules.
- Prefix keys and values align.
- Scopes are tested by route.
- Module URLs are immutable.
- Map and modules deploy together.
- Cross-origin CORS is correct.
- Integrity values are current.
- Worker imports are handled separately.
- Primary HTML survives module failure.
- Canonical and robots are server-visible.
- Unsupported browsers degrade safely.
- Rendered output is sampled.

**Evidence limits.**

Import-map support and integrity features continue to evolve. The feature changes module resolution, not search eligibility. Search behavior depends on the final document and its failure modes.
