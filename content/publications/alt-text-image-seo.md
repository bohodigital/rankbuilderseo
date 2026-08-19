---
{
  "slug": "alt-text-image-seo",
  "title": "Alt Text for SEO: How to Write Image Descriptions Google Can Use",
  "description": "Alt text helps accessibility and gives Google useful image context. Learn what to describe, when to leave alt text empty, and why keyword stuffing image attributes is a bad SEO tactic.",
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
  "publishedAt": "2026-08-18",
  "revisedAt": "2026-08-18",
  "directAnswer": "Write alt text to communicate the image's useful meaning in the context of the page, not to repeat every keyword you want to rank for. Google uses alt text with page context and image-understanding systems, while accessibility guidance also treats alternative text as a functional replacement for meaningful images.",
  "takeaways": [
    "Describe the useful content or function of an image in context.",
    "Google uses alt text as one source for understanding image subject matter.",
    "Keyword stuffing alt attributes can create a poor experience and may look spammy.",
    "Decorative images often need empty alternative text rather than a redundant description."
  ],
  "claimLimits": [
    "Alt text is only one part of image SEO; image discoverability, page context, technical access, filenames, and structured data can also matter.",
    "Accessibility decisions depend on the image's purpose in context, not merely on whether the image contains visually interesting details."
  ],
  "citations": [
    {
      "id": "alt-google-images",
      "title": "Google Image SEO Best Practices",
      "url": "https://developers.google.com/search/docs/appearance/google-images",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "alt-search-essentials",
      "title": "Google Search Essentials",
      "url": "https://developers.google.com/search/docs/essentials",
      "publisher": "Google Search Central",
      "accessedAt": "2026-08-18"
    },
    {
      "id": "alt-w3c-images",
      "title": "Images Concepts and Tutorials",
      "url": "https://www.w3.org/WAI/tutorials/images/",
      "publisher": "W3C Web Accessibility Initiative",
      "accessedAt": "2026-08-18"
    }
  ],
  "correctionHistory": [],
  "relatedContent": [
    "anchor-text-seo-internal-links"
  ]
}
---

## Definition

Alt text, short for alternative text, is the textual alternative associated with an image. Its first job is functional: communicate the image's relevant meaning when the image cannot be perceived or loaded. That makes alt text an accessibility feature before it is an SEO field.

It also has search value. Google's current image SEO documentation says Google uses alt text together with computer vision and page content to understand the subject matter of an image. [@alt-google-images] Google also notes that alt text can become anchor text when an image is used as a link.

The mistake is turning that useful signal into a keyword container. Good alt text describes meaning. Bad alt text tries to make one image rank for an entire spreadsheet of phrases.

## Mechanism

Images are not self-explanatory to every user or system. Search engines can analyze pixels, surrounding text, captions, filenames, page structure, and other signals, but explicit alternative text gives the publisher a direct way to state what the image represents in context.

Google's Image SEO guidance recommends descriptive filenames, relevant surrounding text, and useful, information-rich alt text. [@alt-google-images] Its broader Search Essentials also lists alt text as one of the descriptive locations where site owners can use the words people use to find content. [@alt-search-essentials]

Context is the important word. The same photograph can need different alt text on different pages because the information the image contributes can differ. A photo of a leaking pipe on a plumbing tutorial might need to identify the location of the leak. The same photo on a visual-design portfolio might need to identify the photographic treatment instead.

Accessibility guidance from the W3C Web Accessibility Initiative makes a similar distinction: alternative text depends on an image's purpose. Informative images need text that conveys their essential information, functional images need text describing the action, and purely decorative images can generally use an empty alternative so assistive technology can skip them. [@alt-w3c-images]

## Examples

Suppose an ecommerce page shows a pair of black trail-running shoes. `shoes` is technically true but not very informative. `Black waterproof trail-running shoe with orange outsole, side view` gives a user and a search system much more useful context if those details matter to the product presentation.

Now consider the opposite extreme: `best trail running shoes cheap trail shoes waterproof shoes black shoes buy running shoes online`. Google explicitly warns against filling alt attributes with keywords because it creates a bad user experience and can make the site appear spammy. [@alt-google-images] The phrase is not an image description. It is a keyword list wearing an accessibility costume.

For a chart, the alt text should not necessarily transcribe every data point. A concise description can communicate the chart's purpose, while nearby text or a data table can provide the detailed values. If the image contains information that the surrounding page does not otherwise provide, the page needs a way for users who cannot see the chart to obtain that information.

For a decorative flourish, spacer, background shape, or repeated icon that adds no independent information, empty alternative text can be correct. W3C guidance explains that decorative images should be ignored by assistive technologies rather than announced as meaningless clutter. [@alt-w3c-images] Adding `gold decorative line` to every divider may technically create more words, but it does not create a better page.

Functional images need another treatment. If a magnifying-glass image is the only content inside a search button, describing the function as `Search` is more useful than describing its appearance as `magnifying glass`. The purpose of the alternative is to replace what the user needs from the image.

Image links deserve special care because Google can use the image alt text as anchor text. [@alt-google-images] If a product-card image links to a product detail page, the alternative text should identify the linked product meaningfully rather than say `image` or repeat a long promotional slogan.

## Boundaries

Alt text will not rescue an image Google cannot discover or access. Image SEO also depends on crawlable pages, stable image URLs, useful page context, and technical implementation. Google's image documentation covers those broader requirements explicitly. [@alt-google-images]

Likewise, not every image needs a keyword. The target should be accurate meaning, not lexical coverage. If the most useful description naturally contains the product or topic name, include it. If it does not, forcing the term can make the text worse.

Do not treat an automated accessibility scan that reports `alt present` as proof that the alt text is good. A technically nonempty attribute can still be useless, misleading, or stuffed. Human review should ask whether the alternative communicates the information or function a user would miss.

Finally, image descriptions should remain concise enough to be usable. There is no universal word limit because image complexity varies, but alt text is not a second caption field or a hidden essay.

The best SEO rule is also the best accessibility rule: describe the image's useful contribution to the page. That gives Google meaningful context without sacrificing the humans the attribute exists to serve.
