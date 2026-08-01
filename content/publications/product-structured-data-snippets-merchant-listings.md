---
{
  "slug": "product-structured-data-snippets-merchant-listings",
  "title": "Product Structured Data: Snippets, Merchant Listings, and Variants",
  "description": "Choose product snippets or merchant listings by page purpose, synchronize offers with visible commerce data, and model ProductGroup variants without identity conflicts.",
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
  "directAnswer": "Use product-snippet requirements for editorial or aggregate product pages and merchant-listing requirements for pages where your business sells the product directly. Keep identity, price, currency, availability and variants synchronized with visible content.",
  "takeaways": [
    "Product snippets and merchant listings overlap but have different page-purpose and property requirements.",
    "Merchant listings require a direct-purchase page and an Offer from the merchant seller.",
    "Product rich results focus on one product or variants of the same product rather than unrelated category inventory.",
    "Use ProductGroup and unique group and variant identifiers when products vary by size, color or another defined property."
  ],
  "claimLimits": [
    "Accurate Product markup creates eligibility for supported shopping appearances but cannot guarantee display, traffic, ranking or acceptance of inaccurate or stale commerce data."
  ],
  "citations": [
    {
      "id": "sd-product-intro",
      "title": "Introduction to Product structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/product",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-product-snippet",
      "title": "Product snippet structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-product-merchant",
      "title": "Merchant listing structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/merchant-listing",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    },
    {
      "id": "sd-product-variants",
      "title": "Product variant structured data",
      "url": "https://developers.google.com/search/docs/appearance/structured-data/product-variants",
      "publisher": "Google",
      "accessedAt": "2026-08-01"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "structured-data-valid-no-rich-result",
    "organization-structured-data",
    "google-search-console-page-indexing-report",
    "shopify-canonical-urls-products-collections-variants"
  ]
}
---

## Definition

Google uses `Product` structured data for more than one search experience.

The two main classes are:

- **Product snippets:** Product-related pages where a user may not purchase directly, including editorial reviews and product aggregators.
- **Merchant listings:** Pages where the merchant sells the product directly and a shopper can complete a purchase.

Google’s product introduction explains that the two feature classes overlap but have different requirements and enhancements. Merchant data can support shopping knowledge panels, popular products, Google Images, and other shopping experiences, while product snippets can enrich text results with price, availability, ratings, or review information. [Introduction to Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)[@sd-product-intro]

Begin with the page’s actual commercial role. Do not choose the schema path based on which result looks more dramatic.

## Mechanism

**Identify the page type**

Use this decision table:

| Page | Primary Google documentation |
| --- | --- |
| Merchant product page with direct purchase | Merchant listings |
| Editorial product review | Product snippets |
| Product comparison or aggregator page | Product snippets when requirements are met |
| Category listing many unrelated products | Usually not a single Product rich-result page |
| Product group with color or size variants | Product variants plus Product requirements |
| Informational article mentioning a product | Usually no Product markup unless the page is genuinely product-focused |

Google’s technical guidance says product rich results focus on one product or variants of the same product rather than a general category of unrelated products. [Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)[@sd-product-snippet]

**Build the core Product identity**

A simplified object can contain:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://shop.example.com/products/widget-x#product",
  "name": "Widget X",
  "image": [
    "https://shop.example.com/media/widget-x-front.jpg"
  ],
  "description": "A visible, accurate product description.",
  "sku": "WX-100",
  "brand": {
    "@type": "Brand",
    "name": "Example Brand"
  }
}
```

Use stable identifiers and match visible content.

Recommended identity fields may include:

- Name
- Images
- Description
- SKU
- GTIN
- MPN
- Brand
- Color
- Material
- Size

Do not invent identifiers. A wrong GTIN is worse than an absent one.

**Add the correct evidence or offer**

Product snippets require the product name and at least one supported nested element such as a review, aggregate rating, or offer. Exact requirements depend on the chosen feature and object. [Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)[@sd-product-snippet]

For a merchant listing, the page must allow purchase from the merchant and use an `Offer` rather than merely an `AggregateOffer` representing other sellers. Merchant listings require active price information and currency under the documented rules. [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)[@sd-product-merchant]

A simplified offer:

```json
{
  "@type": "Offer",
  "url": "https://shop.example.com/products/widget-x",
  "price": 39.99,
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock",
  "itemCondition": "https://schema.org/NewCondition"
}
```

The values must match the visible purchasable state.

**Keep rapidly changing data current**

Price and availability can change many times a day.

Use one commerce source of truth for:

- Visible price
- Structured-data price
- Currency
- Availability
- Condition
- Shipping
- Return policy
- Merchant feed

Google recommends placing Product data in initial HTML for merchants seeking broad shopping eligibility. It warns that JavaScript-generated product markup can make shopping crawls less frequent or reliable, especially for fast-changing price and availability. [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)[@sd-product-merchant]

**Model variants intentionally**

Google supports `ProductGroup` with `variesBy`, `hasVariant`, and product-group identifiers.

Each variant needs a unique identifier, and each product group needs a unique group ID. The variant must still satisfy the relevant Product requirements. [Product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants)[@sd-product-variants]

Possible designs include:

- One canonical product-group URL with selectable variants
- Separate crawlable variant URLs
- A combination, depending on the application

For single-page implementations, Google requires one distinct canonical URL for the overall product group. Variant markup should reflect the URL and canonical architecture rather than attempt to override it.

## Examples

**Merchant product page**

The page:

- Shows one product
- Displays 39.99 USD
- Shows in-stock availability
- Offers an Add to Cart action
- Publishes shipping and return information

Use merchant-listing requirements and keep data synchronized with checkout.

**Editorial review**

The publisher reviews a laptop but does not sell it.

Use product-snippet guidance. Mark up the reviewed product, the visible review, and any legitimate rating. Do not describe the publisher as the seller.

Pros-and-cons appearance is limited to eligible editorial product-review pages, not merchant product pages or customer-review pages. [Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)[@sd-product-snippet]

**Marketplace comparison**

A page aggregates offers from several sellers.

An `AggregateOffer` can summarize multiple offers for product snippets when the documented properties are present. It does not make the publisher eligible as the merchant seller.

**Apparel variants**

A shirt varies by color and size.

Define:

- Product group ID
- Variant IDs or SKUs
- `variesBy`
- Variant-specific color and size
- Variant-specific offer and availability
- Canonical behavior

Do not use `AggregateOffer` merely to represent size and color variants. Google’s product-snippet documentation explicitly distinguishes aggregate sellers from product variants. [Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)[@sd-product-snippet]

**Price mismatch**

Visible page:

```text
49.99 USD
```

Structured data:

```text
39.99 USD
```

The object may remain syntactically valid. It is still inaccurate. Fix the data pipeline and consider whether caches or client rendering are serving different states.

## Boundaries

Audit product implementations for:

- Category page marked as one Product
- Merchant listing on a page without direct purchase
- Seller omitted or misrepresented
- Stale price
- Missing currency
- Past `priceValidUntil`
- Wrong availability
- Invented reviews
- Rating hidden from users
- Images blocked
- Variant identifiers duplicated
- Product group missing a stable ID
- Canonical and variant URL disagreement
- Structured data generated after unreliable client actions
- Merchant feed and page data disagree
- Restricted products violating content policies

Google provides separate Search Console reports for merchant listings and product snippets because their requirements differ. Use the report corresponding to the page’s role rather than attempting to clear every warning in both without context. [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)[@sd-product-merchant]

Use [Organization Structured Data](/articles/organization-structured-data) to align merchant identity, logo, return policies, and organization references. Use [Valid Structured Data but No Rich Result](/articles/structured-data-valid-no-rich-result) when testing passes but a shopping appearance does not display.

Product markup works when it reports the same product, seller, price, availability, review, and variant state that a user can actually see and act on. Everything else is decorative inventory fiction.
