/**
 * Frozen redirect registry for guide URLs that existed before the /articles/
 * migration. New publications must never be added automatically.
 */
export const legacyGuideRedirects = Object.freeze({
  "ai-overviews-traffic-claims": "/articles/ai-overviews-traffic-claims",
  "canonical-tags-when-they-work": "/articles/canonical-tags-when-they-work",
  "how-to-read-an-seo-audit": "/articles/how-to-read-an-seo-audit",
  "internal-links-audit-by-template": "/articles/internal-links-audit-by-template",
  "local-seo-provider-scorecard": "/articles/local-seo-provider-scorecard",
  "ranking-guarantees": "/articles/ranking-guarantees",
  "search-console-is-not-analytics": "/articles/search-console-is-not-analytics",
  "seo-migration-launch-checklist": "/articles/seo-migration-launch-checklist",
  "seo-pricing-without-fairy-tales": "/articles/seo-pricing-without-fairy-tales",
  "technical-seo-baseline": "/articles/technical-seo-baseline",
  "what-an-seo-report-should-answer": "/articles/what-an-seo-report-should-answer",
  "zero-click-search-study-notes": "/articles/zero-click-search-study-notes",
} as const);

export type LegacyGuideSlug = keyof typeof legacyGuideRedirects;

export function legacyGuideTarget(slug: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(legacyGuideRedirects, slug)
    ? legacyGuideRedirects[slug as LegacyGuideSlug]
    : undefined;
}
