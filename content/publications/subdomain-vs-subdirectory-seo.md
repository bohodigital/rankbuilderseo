---
{
  "slug": "subdomain-vs-subdirectory-seo",
  "title": "Subdomain vs. Subdirectory for SEO: Which Does Google Prefer?",
  "description": "Google says it has no indexing or ranking preference between subfolders and subdomains. Learn what actually changes, when each structure makes sense, and what to watch during migrations.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Developers and migration leads",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Google says it does not prefer subfolders over subdomains for indexing and ranking. Choose the structure that best fits ownership, deployment, content boundaries, analytics, security, and maintenance. The SEO risk usually comes from poor architecture or migration execution, not from the presence of a dot versus a slash.",
  "takeaways": [
    "Google explicitly says it has no ranking or indexing preference between subfolders and subdomains.",
    "Operational architecture should drive the decision more than SEO folklore.",
    "Subdomains can be appropriate when content has separate ownership, infrastructure, or product boundaries.",
    "Moving between structures is a migration and should be handled with redirects, canonicals, internal-link updates, and monitoring."
  ],
  "claimLimits": [
    "Google can treat subdomains as distinct sites for some product or presentation purposes even though it states no general ranking preference between subdomains and subfolders.",
    "This article does not claim every architecture performs identically in practice; implementation quality and site relationships still matter."
  ],
  "citations": [
    {
      "id": "sub-google-faq",
      "title": "FAQ: Google Search Crawling and Indexing",
      "url": "https://developers.google.com/search/help/crawling-index-faq",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "sub-ranking-systems",
      "title": "A Guide to Google Search Ranking Systems",
      "url": "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "sub-site-names",
      "title": "Site Names in Google Search",
      "url": "https://developers.google.com/search/docs/appearance/site-names",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "eeat-google-ranking-factor"
  ]
}
---

## Definition

A subdomain places content on a hostname such as `docs.example.com`. A subdirectory places content under the primary hostname, such as `example.com/docs/`. The debate over which structure is better for SEO has lasted for years because the choice is visually obvious and therefore easy to turn into a rule.

Google's current crawling and indexing FAQ answers the central question directly. Asked whether subfolders or subdomains are better, Google says site owners should choose whatever is easiest to organize and manage and that Google has no preference from an indexing and ranking perspective. [@sub-google-faq]

That does not mean the two architectures are operationally identical. It means the SEO decision cannot be reduced to `subdirectories rank better` as a universal law.

## Mechanism

Search systems evaluate pages and sites using many signals. Google's ranking-systems guide says most ranking work happens at the page level while some site-wide signals and classifiers also contribute. [@sub-ranking-systems] It also notes that site-diversity systems generally treat subdomains as part of the root domain but can sometimes treat them as separate sites when relevant.

That nuance is important. A subdomain can look and behave like a distinct property for hosting, cookies, analytics, content management, security policies, deployment teams, and product identity. Google can also generate site names for domain-level and subdomain-level sites. [@sub-site-names] None of that establishes a blanket ranking penalty or bonus.

A subdirectory, by contrast, often makes shared navigation, templates, analytics, internal linking, and deployment simpler because everything lives under one host. Those operational advantages can indirectly produce a cleaner site. But the benefit comes from the implementation, not from a mysterious preference for slashes.

## Examples

A software company with a documentation platform maintained by a separate engineering team may reasonably use `docs.example.com`. The documentation might deploy through a different stack, use independent caching rules, and require different security controls from the marketing site. Forcing it into a subdirectory solely because someone believes subfolders inherit more SEO power can create unnecessary engineering complexity.

A small business blog is the opposite case. If the blog uses the same brand, templates, navigation, analytics, and editorial team as the main site, placing it at `example.com/blog/` may be simpler. The content naturally participates in the same information architecture, and there may be no operational reason to create a separate host.

Now consider a company that already ranks with a large blog on `blog.example.com`. Moving it to `example.com/blog/` merely to chase a presumed ranking boost creates real migration risk. Every URL changes. Redirects must be correct. Internal links, canonicals, sitemaps, hreflang annotations if present, analytics, and external references may need updating. The migration can succeed, but the benefit should justify the work.

The inverse migration carries the same issues. A company splitting a monolithic application into separate product surfaces may move content from a directory to a subdomain for operational reasons. That can be defensible if the migration preserves URL mappings and the resulting site remains crawlable and internally connected.

Search Console setup can also influence how teams perceive the difference. Domain properties aggregate protocols and subdomains, while URL-prefix properties can be scoped more narrowly. Reporting configuration can therefore make the architecture feel more separate or more unified than the underlying ranking question actually is.

Brand presentation is another consideration. Google's site-name documentation says site names are supported for domain-level and subdomain-level sites. [@sub-site-names] If a subdomain is a genuinely distinct product or publication, that separateness may be useful. If it is not, a subdirectory may better express a single-site structure to users.

## Boundaries

Google's statement of no general preference should not be exaggerated into `architecture never matters`. Architecture affects how humans and crawlers discover pages, how internal links distribute attention, how reliably teams maintain metadata, and how easily technical problems can be isolated. Those effects can absolutely influence search performance.

Nor should you assume every subdomain automatically shares every site-wide characteristic with its root domain. Google's own ranking-systems documentation notes that subdomains are generally treated as part of a root domain for site diversity but can be treated separately in some cases. [@sub-ranking-systems]

The practical decision framework is therefore operational. Ask who owns the content, whether it needs a different application stack, whether authentication or cookies differ, whether the brand identity is distinct, whether analytics needs separate governance, and how the pages will be linked from the rest of the site.

If both options are equally easy, a subdirectory is often simpler for a unified site because fewer moving pieces are involved. If the content is a separate application or organizational unit, a subdomain can be cleaner. Neither choice deserves a ranking superstition.

Most importantly, do not migrate a stable architecture for theoretical SEO alone. Google has already answered the general preference question. [@sub-google-faq] Spend the engineering budget where it changes crawlability, content quality, internal linking, performance, or user experience instead.
