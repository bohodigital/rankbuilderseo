import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { sharedOpenGraph } from "../metadata";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Rank Builder SEO handles hosting, aggregate analytics, and transient public-tool requests.",
  alternates: { canonical: "https://rankbuilderseo.com/privacy" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/privacy",
    title: "Privacy",
    description: "How Rank Builder SEO handles hosting, aggregate analytics, and transient public-tool requests.",
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
          service may process routine operational data when a page loads. Google
          Analytics also records basic page-view data for the publication.
        </p>
        <section>
          <h2>Public tool requests</h2>
          <p>
            The Indexability Inspector and Redirect Chain Visualizer process the
            public URL you submit, DNS answers, redirect destinations, remote
            response headers, and a bounded sample of returned HTML. Submitted
            URLs and generated reports are used for the current request and are
            not intentionally stored by Rank Builder.
          </p>
          <p>
            Do not submit credentials, private tokens, or confidential values in
            a URL. The tools do not authenticate to protected resources, send
            visitor cookies, reuse visitor credentials, submit forms, execute
            page JavaScript, or impersonate Googlebot.
          </p>
        </section>
        <section>
          <h2>Rate limiting and operational records</h2>
          <p>
            Cloudflare provides transient request IP information used to limit
            tool requests. The application&apos;s fallback limiter keeps
            IP-keyed request times only in a Worker isolate&apos;s memory, drops
            entries older than 24 hours when evaluated, and may lose them sooner
            when the isolate is recycled. It is not a durable visitor profile.
          </p>
          <p>
            Rank Builder does not create a separate submitted-URL or report log.
            Cloudflare may process and retain ordinary request metadata and
            operational errors according to the site&apos;s Cloudflare
            configuration and the provider&apos;s terms; the submitted URL is in
            the JSON request body and is not intentionally added to application
            logs.
          </p>
        </section>
        <section>
          <h2>What the site measures</h2>
          <p>
            Aggregate analytics help us understand which pages are useful and
            whether the site is working. Umami is configured to respect Do Not
            Track and exclude search-query text. The Google Analytics tag removes
            URL query strings before measurement and disables Google Signals and
            advertising-personalization signals. We do not send names, email
            addresses, form values, account identifiers, or custom marketing
            events.
          </p>
          <p>
            Tool measurement is limited to aggregate events such as an inspection
            starting, completing, returning a result or error class, and using an
            export control. Submitted URLs and hostnames are not included in
            analytics properties.
          </p>
        </section>
        <section>
          <h2>What to verify</h2>
          <p>
            You can inspect the page source to see the active analytics script
            and review Cloudflare, Umami, and Google Analytics documentation for
            their current platform behavior. Google Analytics may use first-party
            cookies to distinguish browsers and sessions. This notice should be
            revised if the site later adds accounts, forms, advertising, or
            third-party embeds.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
