---
{
  "slug": "chatgpt-product-feeds-acp",
  "title": "ChatGPT Product Feeds and ACP: The 2026 Merchant Checklist for AI Shopping",
  "description": "Prepare product data for ChatGPT shopping using OpenAI product feeds and ACP, including freshness, variants, pricing, images, promotions, Shopify, and QA.",
  "format": "Checklist",
  "authoringContract": "canonical-v1",
  "category": "Search landscape",
  "series": "Technical baseline",
  "audience": "Technical SEOs and developers",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-06",
  "revisedAt": "2026-08-06",
  "directAnswer": "OpenAI’s Agentic Commerce Protocol is becoming the merchant data layer behind richer ChatGPT shopping. The implementation goal is not 'AI keywords.' It is complete, current product data that survives conversational comparison.",
  "takeaways": [
    "OpenAI’s Agentic Commerce Protocol is becoming the merchant data layer behind richer ChatGPT shopping. The implementation goal is not 'AI keywords.' It is complete, current product data that survives conversational comparison.",
    "OpenAI expanded the Agentic Commerce Protocol (ACP) in March 2026 to support richer product discovery in ChatGPT.",
    "OpenAI says merchants can share: product feeds; promotions; through ACP so catalogs can be represented more completely and kept current."
  ],
  "claimLimits": [
    "The cited sources supporting this ChatGPT product feed review were checked through 2026-08-06.",
    "ChatGPT product feed documentation, interfaces, measurement methods, policies, and availability can change after publication.",
    "Correct handling of ChatGPT product feed does not guarantee rankings, traffic, citations, advertising delivery, or commercial outcomes."
  ],
  "citations": [
    {
      "id": "rb-algo-trend-06-16-source-1",
      "title": "Powering Product Discovery in ChatGPT",
      "url": "https://openai.com/index/powering-product-discovery-in-chatgpt/",
      "publisher": "OpenAI",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-16-source-2",
      "title": "Shopping with ChatGPT Search",
      "url": "https://help.openai.com/en/articles/11128490",
      "publisher": "OpenAI Help Center",
      "accessedAt": "2026-08-06"
    },
    {
      "id": "rb-algo-trend-06-16-source-3",
      "title": "OpenAI Merchant Feed Terms of Service",
      "url": "https://openai.com/policies/merchant-feed-terms-of-service/",
      "publisher": "OpenAI",
      "accessedAt": "2026-08-06"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "chatgpt-shopping-seo-2026",
    "oai-adsbot-chatgpt-landing-page",
    "ai-mode-vs-ai-overviews"
  ]
}
---

## Checklist

OpenAI’s Agentic Commerce Protocol is becoming the merchant data layer behind richer ChatGPT shopping. The implementation goal is not 'AI keywords.' It is complete, current product data that survives conversational comparison.

OpenAI expanded the **Agentic Commerce Protocol (ACP)** in March 2026 to support richer product discovery in ChatGPT.

OpenAI says merchants can share:

- product feeds;
- promotions;

through ACP so catalogs can be represented more completely and kept current.[@rb-algo-trend-06-16-source-1]

OpenAI supports several delivery paths, including direct merchant participation and third-party providers.

For Shopify merchants, OpenAI says product data is already integrated through **Shopify Catalog**, so individual Shopify merchants do not need to build a separate direct integration just to participate.[@rb-algo-trend-06-16-source-1][@rb-algo-trend-06-16-source-2]

The merchant job remains data quality.

Use these checks as the working list:

- What ACP is solving
- Product discovery comes before checkout
- Build one source of truth
- Product identity
- Product titles
- Descriptions
- Variants
- Price freshness
- Availability
- Promotions
- Product images
- Shopify merchants
- Direct feed merchants
- Merchant feed governance
- Page and feed must agree
- Product-feed QA sample

**Sources reviewed.**

1. [Powering Product Discovery in ChatGPT](https://openai.com/index/powering-product-discovery-in-chatgpt/) — OpenAI; accessed 2026-08-06. [@rb-algo-trend-06-16-source-1]
2. [Shopping with ChatGPT Search](https://help.openai.com/en/articles/11128490) — OpenAI Help Center; accessed 2026-08-06. [@rb-algo-trend-06-16-source-2]
3. [OpenAI Merchant Feed Terms of Service](https://openai.com/policies/merchant-feed-terms-of-service/) — OpenAI; accessed 2026-08-06. [@rb-algo-trend-06-16-source-3]

**What ACP is solving.**

A product page written for humans can contain commerce data in inconsistent ways.

One retailer says:

```text
Only $89 today
```

Another says:

```text
Sale price: $89
Was $119
```

Another loads price in JavaScript.

An AI shopping system needs structured, current information.

ACP provides a merchant-to-AI commerce layer for that exchange.

**Product discovery comes before checkout.**

ACP is not merely a payment protocol.

OpenAI’s March 2026 product announcement specifically extends ACP into **product discovery**.

The system can use merchant data while helping users:

- browse;
- compare;
- refine requirements;
- evaluate products;
- find relevant offers.

That makes the catalog itself a discovery asset.

**Build one source of truth.**

Do not maintain:

```text
website price
feed price
ERP price
marketplace price
ChatGPT price
```

as five manually edited fields.

Create an authoritative commerce source.

Then publish consistent values downstream.

A useful architecture:

```text
PIM / ERP
→ product feed
→ website
→ ACP
→ marketplaces
→ analytics
```

Your exact stack can differ.

The principle should not.

**Product identity.**

Every product needs stable identity.

Maintain:

- merchant SKU;
- brand;
- manufacturer identifier where available;
- GTIN where appropriate;
- variant identity;
- canonical product URL.

Do not reuse one identifier for several products.

Do not generate new IDs every deployment.

Stable identity helps systems understand that an updated price belongs to the same item.

**Product titles.**

Write titles for recognition.

Include meaningful attributes such as:

- brand;
- model;
- product type;
- variant where necessary.

Weak:

> Amazing Premium Must-Have Best Blender

Strong:

> Vitamix A3500 Ascent Series Blender, 64 oz

Do not turn product titles into keyword bins.

**Descriptions.**

Descriptions should answer buying questions.

Include:

- use case;
- material;
- dimensions;
- compatibility;
- capacity;
- fit;
- included items;
- important limitations.

A shopper can ask:

> Will this fit under a 17-inch cabinet?

If the dimensions are absent, the system has less information to answer.

**Variants.**

Model variants explicitly.

Examples:

```text
size
color
capacity
memory
storage
voltage
bundle
```

Each variant should have:

- valid identifier;
- price;
- availability;
- image where useful;
- option values.

Do not represent an unavailable size as available because the parent product remains in stock.

**Price freshness.**

OpenAI’s shopping documentation warns that pricing updates can take time to propagate through third-party data.[@rb-algo-trend-06-16-source-2]

A direct feed can help merchants provide current product information.

Monitor:

```text
feed price
landing-page price
checkout price
```

Mismatch is not merely a cosmetic issue.

It can make a product irrelevant to a budget constraint.

**Availability.**

Keep availability synchronized.

States can include:

- in stock;
- out of stock;
- preorder;
- discontinued.

The exact schema depends on OpenAI’s current feed specification.

Use the specification rather than inventing values.

**Promotions.**

OpenAI says ACP can carry promotions.

A promotion should have:

- valid start;
- valid end;
- eligible products;
- geographic scope;
- conditions;
- discount;
- redemption requirements.

Expired promotions should disappear promptly.

An AI shopping system explaining a dead coupon is a fast route to customer resentment.

**Product images.**

Supply:

- primary image;
- variant images;
- high resolution;
- accurate color;
- uncluttered subject.

Do not use misleading lifestyle images as the only representation when a clean product view exists.

Conversational and visual shopping makes image quality part of product understanding.

**Shopify merchants.**

OpenAI says Shopify Catalog already integrates Shopify merchant product data into ChatGPT.[@rb-algo-trend-06-16-source-1][@rb-algo-trend-06-16-source-2]

That means Shopify merchants should focus on:

- complete Shopify product records;
- accurate variant data;
- inventory;
- pricing;
- images;
- titles;
- descriptions.

Do not pay a random consultant $5,000 to “install ACP for Shopify” without first confirming that the proposed work does anything beyond the existing catalog integration.

**Direct feed merchants.**

OpenAI’s shopping documentation says merchants interested in direct product feeds can review the Product Feed specification and apply for access.[@rb-algo-trend-06-16-source-2]

Before applying:

1. clean catalog IDs;
2. reconcile price;
3. reconcile inventory;
4. normalize variants;
5. fix dead URLs;
6. improve images;
7. establish update cadence;
8. designate feed owner.

Integration magnifies the quality of your source data.

It does not repair it.

**Merchant feed governance.**

Record:

```text
FEED_VERSION
GENERATED_AT
PRODUCT_COUNT
VALID_COUNT
ERROR_COUNT
PRICE_MISMATCH
AVAILABILITY_MISMATCH
OWNER
```

Set alerts.

A successful upload with bad data is still a failed commerce operation.

**Page and feed must agree.**

A product feed can help ChatGPT discover current information.

The landing page remains important.

Verify:

- same product;
- same price;
- same variant;
- same availability;
- same brand;
- same specifications.

If the page is blocked or contradictory, users lose confidence after the click.

**Product-feed QA sample.**

Daily, select a random set of products.

Compare:

```text
source database
ACP/feed output
ChatGPT observation where available
public page
checkout
```

Do not rely solely on one automated validator.

Real-world destination QA catches failures.

**Feed terms and responsibility.**

OpenAI’s Merchant Feed Terms make merchants responsible for content they submit and require compliance with the published feed specification.[@rb-algo-trend-06-16-source-3]

Treat the feed as production data.

Do not outsource it without ownership and review.

## Completion criteria

**Checklist.**

- Product IDs stable.
- Titles specific.
- Descriptions useful.
- Variants complete.
- Prices current.
- Availability current.
- Promotions bounded.
- Images accurate.
- URLs canonical.
- Landing pages accessible.
- Shopify integration understood.
- Direct-feed eligibility reviewed.
- Source data authoritative.
- Feed errors monitored.
- Daily QA sample defined.
- Owner assigned.

**FAQ.**

**What is ACP?**

OpenAI’s Agentic Commerce Protocol is a merchant integration layer supporting product discovery and broader AI-native commerce workflows.

**Do Shopify merchants need a direct feed?**

OpenAI says Shopify Catalog already integrates Shopify product data into ChatGPT and no additional work is required from individual merchants for that integration.

**Does a direct feed guarantee product placement?**

No.

**Can ACP carry promotions?**

OpenAI says merchants can share product feeds and promotions through ACP.

**Where are the feed requirements?**

OpenAI provides a Product Feed specification for merchants using direct feeds.

**Verdict.**

Product feeds are not glamorous.

That is their strength.

In conversational commerce, the merchant that can tell the system exactly **what exists, what it costs, who it fits, and whether it is available** has a much stronger foundation than the merchant still optimizing a product title around a phrase from 2014.

**Verification record.**

- ACP product-discovery expansion, Shopify Catalog integration, and direct-feed availability were checked on 2026-08-06.
- Merchant Feed Terms were published June 15, 2026 and were checked.
- No direct-feed placement guarantee is claimed.

**Duplication and search-intent record.**

No prior package provides a complete OpenAI ACP and product-feed implementation checklist for merchants.
