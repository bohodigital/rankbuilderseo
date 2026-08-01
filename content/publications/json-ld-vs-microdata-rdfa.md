---
{
  "slug": "json-ld-vs-microdata-rdfa",
  "title": "JSON-LD vs. Microdata vs. RDFa for SEO",
  "description": "Compare Google's three supported structured-data formats by maintenance, rendering, source-of-truth ownership, template coupling, testing and migration risk.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and technical marketers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-01",
  "revisedAt": "2026-08-01",
  "directAnswer": "Google supports JSON-LD, Microdata and RDFa and recommends JSON-LD. Choose the format your publishing system can keep synchronized with visible content; changing syntax alone does not correct inaccurate types, properties or claims.",
  "takeaways": [
    "JSON-LD separates the data graph from presentation markup and is Google's recommended format.",
    "Accurate existing Microdata or RDFa does not require replacement merely to preserve rich-result eligibility.",
    "Generate structured data from the same source of truth as visible content.",
    "Test the deployed rendered URL and assign one system ownership of each structured-data object."
  ],
  "claimLimits": [
    "Implementation format does not create an independent ranking advantage, and Google feature documentation still determines which types, properties and content rules apply."
  ],
  "citations": [
    {
      "id": "sd-formats-general",
      "title": "General structured data guidelines",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-formats-javascript",
      "title": "Generate structured data with JavaScript",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-formats-intro",
      "title": "Introduction to structured data markup in Google Search",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "breadcrumb-structured-data",
    "structured-data-valid-no-rich-result",
    "javascript-seo-crawling-rendering-indexing",
    "rendered-html-missing-content"
  ]
}
---

## Definition

JSON-LD, Microdata, and RDFa are three supported ways to express structured data on a web page.

Google’s current general guidelines list all three as supported formats and recommend JSON-LD. A site does not receive a special ranking bonus merely for choosing the recommended syntax. The practical difference is how each format is authored, coupled to visible markup, generated, maintained, and tested. [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)[@sd-formats-general]

- **JSON-LD** expresses one or more data objects in a separate JSON block.
- **Microdata** adds attributes directly to the page’s visible elements.
- **RDFa** adds vocabulary and relationship attributes to visible markup.

All three can describe the same underlying schema.org concepts. The best choice is the format the site can keep accurate as visible content changes.

## Mechanism

**JSON-LD separates the data graph from presentation markup**

A simplified object might look like this:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.example.com/#organization",
  "name": "Example Company",
  "url": "https://www.example.com/",
  "logo": "https://www.example.com/media/logo.png"
}
```

The page template can generate this object from the same canonical data used to render the organization name, URL, and logo.

Advantages include:

- Easier inspection as one graph
- Less interference with page layout
- Convenient reuse of stable entity IDs
- Straightforward server-side serialization
- Easier nesting of related objects
- Lower risk of attributes being dropped during visual redesign

Risks include:

- Markup drifting from visible content
- Duplicate objects emitted by plugins and templates
- Unsafe string serialization
- Client-side generation failing
- Stale prices, dates, or availability
- One global object being copied onto pages it does not describe

Google can process JavaScript-generated structured data that is present in the rendered DOM. However, its guidance warns that duplicating page information in a tag-management system raises mismatch risk. For fast-changing product data, dynamically generated markup can also make shopping crawls less reliable. [Generate structured data with JavaScript](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)[@sd-formats-javascript]

**Microdata binds data to visible elements**

Microdata identifies items and properties through attributes attached to the content.

Conceptually:

```text
Organization item
  name property attached to visible company name
  url property attached to homepage link
  logo property attached to visible logo
```

Advantages include:

- Strong proximity to visible content
- Fewer duplicated text values
- Useful when a CMS already emits correct Microdata
- Direct relationship between a displayed element and its property

Risks include:

- Complex nesting inside templates
- Attributes lost during component refactors
- Difficult graphs when items span distant page regions
- Repeated boilerplate
- Styling and data concerns becoming entangled

Microdata is not obsolete merely because JSON-LD is recommended. Existing accurate Microdata does not need replacement solely to obtain eligibility.

**RDFa expresses linked relationships in markup**

RDFa can describe schema.org entities and relationships through vocabulary-aware attributes.

It can be useful when:

- The publishing stack already supports RDFa
- Linked-data relationships are a first-class requirement
- The same visible markup participates in a broader semantic system

Its operational risks resemble Microdata: template complexity, attribute loss, and maintenance difficulty for teams unfamiliar with the syntax.

**The vocabulary remains separate from the format**

These are format decisions:

- JSON-LD
- Microdata
- RDFa

These are vocabulary decisions:

- `Organization`
- `Product`
- `BreadcrumbList`
- `Article`
- `Person`
- `Offer`

Changing JSON-LD to Microdata does not correct an inappropriate type. Changing Microdata to JSON-LD does not fix false reviews or a wrong price.

Google describes structured data as a standardized way to classify page content and provide explicit clues about meaning. Feature documentation still governs which types and properties are used for a particular appearance. [Introduction to structured data markup](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)[@sd-formats-intro]

## Examples

**A static publication**

A static site has canonical publication metadata at build time. Server-generated JSON-LD is usually simple:

- Serialize title, dates, author, canonical URL, and hero image
- Validate the object during the build
- Compare the values with visible page metadata
- Fail the build when required fields are missing

JSON-LD is a sensible choice because the source data already exists separately from layout.

**An established ecommerce template using Microdata**

The current templates bind product name, image, price, and availability directly to visible elements. Tests show the markup is complete and accurate.

A full conversion to JSON-LD introduces migration risk without a clear user benefit. Keep Microdata until another architectural reason justifies the change. Format fashion is not a migration strategy.

**A tag manager injecting product data**

The visible product page is rendered by the commerce platform, while a tag manager maintains a second copy of price and availability.

This design can drift. Prefer generating structured data from the product source of truth. If client-side generation remains necessary, extract current values from the page or application state and test the rendered URL. Google’s JavaScript guidance specifically cautions against duplicated information in tag-management variables. [Generate structured data with JavaScript](https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript)[@sd-formats-javascript]

**Several objects on one page**

An article page can legitimately describe:

- The main Article
- Its publisher Organization
- Its author Person
- A BreadcrumbList
- A VideoObject

The objects may be nested or represented separately when their relationships remain clear. The main type should still reflect the primary purpose of the page.

## Boundaries

Choose the format through operational questions:

| Question | Why it matters |
| --- | --- |
| Where is the source of truth? | Prevents duplicated values |
| Can the server render the data? | Reduces client-rendering dependencies |
| Does the CMS already maintain one format correctly? | Avoids needless migration |
| Can tests compare markup with visible content? | Detects drift |
| Will designers remove semantic attributes? | Exposes Microdata or RDFa risk |
| Will plugins emit duplicate objects? | Exposes graph conflict |
| Does information change rapidly? | Favors reliable source-bound generation |

Do not mix formats accidentally. Google can understand multiple items and formats, but duplicate or conflicting representations make debugging harder. If several systems emit structured data, assign clear ownership.

Use stable entity identifiers where useful, but do not invent dozens of IDs without a graph design. An `@id` should help identify the same entity across relevant objects, not decorate every nested value.

Use [Valid Structured Data but No Rich Result](/articles/structured-data-valid-no-rich-result) when a format passes testing but the feature does not display. Use [Organization Structured Data](/articles/organization-structured-data) for entity-graph design, and [Breadcrumb Structured Data](/articles/breadcrumb-structured-data) for a concrete implementation.

The format decision is successful when the data remains accurate after ordinary publishing, pricing, redesign, and deployment changes. Syntax is the container. Truthful maintenance is the actual work.
