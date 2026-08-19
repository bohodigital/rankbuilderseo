---
{
  "slug": "nofollow-sponsored-ugc-rel-attributes",
  "title": "Nofollow vs. Sponsored vs. UGC: Which rel Attribute Should You Use?",
  "description": "A practical SEO guide to Google's `nofollow`, `sponsored`, and `ugc` link qualifiers, including when each applies, how multiple values work, and common misuse patterns.",
  "format": "Explainer",
  "authoringContract": "canonical-v1",
  "category": "Technical SEO",
  "series": "Technical baseline",
  "audience": "Publishers and marketing leaders",
  "evidenceLevel": "Primary sources",
  "state": "published",
  "citationMode": "inline-required",
  "author": "rank-builder-research-desk",
  "editor": "rank-builder-editorial-desk",
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Use `sponsored` for paid or compensated links, `ugc` for links placed by users in comments or forums, and `nofollow` when the other values do not fit and you do not want to associate your site with the linked page. Normal editorial links generally need no qualifier.",
  "takeaways": [
    "Paid placements should be marked `sponsored` or, where necessary, `nofollow`; Google prefers `sponsored` for paid links.",
    "User-generated links can be marked `ugc`, optionally combined with `nofollow`.",
    "Do not add `nofollow` to every external link by default; ordinary editorial citations can remain normal links."
  ],
  "claimLimits": [
    "Link qualifiers describe a site's relationship with outbound links; they do not create a guaranteed ranking outcome for either the source or destination."
  ],
  "citations": [
    {
      "id": "rb2-rel-google-qualify",
      "title": "Qualify Outbound Links for SEO",
      "url": "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-rel-google-links",
      "title": "SEO Link Best Practices for Google",
      "url": "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "rb2-rel-google-spam",
      "title": "Spam Policies for Google Web Search",
      "url": "https://developers.google.com/search/docs/essentials/spam-policies",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "meta-refresh-redirects-seo",
    "localbusiness-schema-local-seo"
  ]
}
---

## Definition

Google recognizes several `rel` values that qualify the relationship between a page and an outbound link. The three that cause the most SEO confusion are `sponsored`, `ugc`, and `nofollow`. They are not interchangeable labels for “bad link,” and they are not requirements for every external citation.

Google's current guidance says `sponsored` should identify advertisements, paid placements, sponsorships, and other compensated links. `ugc` is intended for user-generated links such as those posted in comments and forums. `nofollow` is the general fallback when the other values do not apply and the publisher would rather Google not associate the site with, or crawl from, that link in the ordinary way. [@rb2-rel-google-qualify]

For regular editorial links that a publisher chooses to cite or recommend without compensation, Google says no special `rel` value is required. [@rb2-rel-google-links]

## Mechanism

A link carries several kinds of information at once: a destination URL, anchor text, surrounding context, and the relationship the publisher is expressing by linking. The link qualifiers add machine-readable context to that relationship.

A paid link is the clearest case. Google's spam policies treat links created primarily to manipulate rankings as link spam, and paid placements need appropriate qualification. [@rb2-rel-google-spam] Marking a compensated placement as `sponsored` tells Google the commercial relationship explicitly. Google still accepts `nofollow` for paid links, but its documentation prefers `sponsored` because the label is more precise. [@rb2-rel-google-qualify]

User-generated content has a different risk model. A publisher may host thousands of comments, forum posts, profiles, or community answers without manually endorsing every destination that users insert. `ugc` communicates that the link came from user-generated content. Sites can combine values, such as `ugc nofollow`, when they want to express both facts.

`nofollow` is intentionally broader. It is useful when a publisher needs to link to something for reference or criticism but does not want to imply endorsement or association and the more specific sponsored or UGC labels do not apply. Google specifically cautions against using `nofollow` on every external link just because it leaves the site. [@rb2-rel-google-links]

Multiple values can be used together, which matters in real systems. A forum that sells sponsored user posts might reasonably produce a link carrying both `ugc` and `sponsored`. A moderation system can apply defaults to untrusted user links and remove them for established contributors if the publisher's policy supports that approach.

## Examples

A newspaper writes an unpaid review of a local restaurant and links to the restaurant's website as a source for its menu and opening hours. That is a normal editorial link. There is no reason to add `sponsored` because no compensation exists, and automatically adding `nofollow` to every citation would misdescribe the editorial relationship.

A software company pays a publisher for a sponsored article containing a product link. That link should be qualified as `sponsored`; `nofollow` is also accepted by Google for paid links, but `sponsored` is the clearer label. [@rb2-rel-google-qualify]

A community forum allows members to include links in posts. The platform can mark those links `ugc`, and may also use `nofollow` depending on its trust and moderation model. If a long-standing contributor is manually trusted, Google notes that publishers may choose to remove the UGC qualifier from links posted by consistently high-quality contributors. [@rb2-rel-google-qualify]

A journalist writes about a deceptive website and links to it so readers can identify the subject of the investigation. If the publisher does not want to associate itself with the destination, `nofollow` is a reasonable choice because neither `sponsored` nor `ugc` describes the relationship.

An affiliate program creates another common case. Compensation tied to referrals makes the link commercial. The appropriate qualifier is therefore `sponsored`, even if the publisher genuinely likes the product. The qualifier is about the relationship, not the publisher's emotional sincerity.

Sitewide templates deserve special attention. A CMS plugin that blindly appends `nofollow` to every outbound link can degrade the semantic usefulness of the markup and make source citations look identical to paid or untrusted references. A better implementation asks why the link exists and applies the corresponding value.

## Boundaries

These qualifiers are not a loophole for link schemes. If a site participates in large-scale paid linking designed to manipulate rankings, adding attributes does not transform a poor editorial strategy into a good one. Google's spam policies address manipulative link creation more broadly than a single HTML attribute. [@rb2-rel-google-spam]

Likewise, do not infer a guaranteed PageRank outcome from a qualifier. Google has long described these values as ways to qualify links and treats them as signals within its systems. Public documentation does not provide a deterministic per-link scoring formula, so claims such as “nofollow passes exactly zero value” or “UGC links count at half strength” are unsupported.

For internal navigation, Google recommends crawlable standard links and specifically points to robots.txt rather than `nofollow` as the mechanism for blocking crawler access to internal URLs when that is genuinely necessary. [@rb2-rel-google-qualify] Using `nofollow` to sculpt internal authority around a site is generally a sign that the information architecture needs attention.

The practical rule is straightforward: classify the relationship, not the destination's reputation. Paid means `sponsored`; user-placed means `ugc`; unusual unendorsed references can use `nofollow`; normal editorial links need nothing special. That policy is easier to automate, easier to audit, and far less likely to turn a site's link markup into ritualistic SEO decoration.
