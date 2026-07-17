import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { sharedOpenGraph } from "../metadata";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Rank Builder SEO handles routine hosting and aggregate analytics data.",
  alternates: { canonical: "https://rankbuilderseo.com/privacy" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/privacy",
    title: "Privacy",
    description: "How Rank Builder SEO handles routine hosting and aggregate analytics data.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="section shell prose-page">
        <p className="eyebrow">Privacy</p>
        <h1>A readable site without an intake funnel.</h1>
        <p className="hero-deck">
          Rank Builder SEO does not require an account, comments, or a lead form
          to read the publication. Cloudflare and our self-hosted Umami analytics
          service may process routine operational data when a page loads.
        </p>
        <section>
          <h2>What the site measures</h2>
          <p>
            Aggregate analytics help us understand which pages are useful and
            whether the site is working. The production tracker is configured to
            respect Do Not Track and exclude search-query text.
          </p>
        </section>
        <section>
          <h2>What to verify</h2>
          <p>
            You can inspect the page source to see the active analytics script
            and review Cloudflare and Umami documentation for their current
            platform behavior. This notice should be revised if the site later
            adds accounts, forms, advertising, or third-party embeds.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
