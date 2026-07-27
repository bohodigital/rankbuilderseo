import type { Metadata } from "next";
import Link from "next/link";
import { serializeStructuredData, toolsCollectionStructuredData } from "../content/structured-data";
import { toolRecords } from "../content/tool-records";
import { sharedOpenGraph } from "../metadata";
import { SiteFooter, SiteHeader } from "../site-chrome";

const canonical = "https://rankbuilderseo.com/tools";

export const metadata: Metadata = {
  title: "Free SEO inspection tools",
  description:
    "Inspect public indexability signals and redirect paths with bounded tools that do not authenticate, impersonate Googlebot, or retain submitted URLs.",
  alternates: { canonical },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: canonical,
    title: "Free SEO inspection tools",
    description:
      "Inspect public indexability signals and redirect paths with bounded, privacy-conscious SEO utilities.",
  },
};

export default function ToolsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(toolsCollectionStructuredData()) }}
        />
        <section className="page-hero shell">
          <p className="eyebrow">Public utilities / Bounded by design</p>
          <h1>Inspect the signals.<br />Keep the claim honest.</h1>
          <p>
            These tools inspect public HTTP responses without logging in,
            submitting forms, executing page JavaScript, or pretending to expose
            a search engine&apos;s private index.
          </p>
        </section>
        <section className="section shell">
          <p className="eyebrow">Choose a tool</p>
          <div className="related-grid">
            {toolRecords.map((tool) => <Link href={tool.href} key={tool.href}>
              <span>{tool.label}</span>
              <h2>{tool.name}</h2>
              <p>{tool.description}</p>
            </Link>)}
          </div>
        </section>
        <section className="section shell prose-page" id="privacy-and-security">
          <p className="eyebrow">Shared privacy and security model</p>
          <h2>Public responses only, with strict limits.</h2>
          <p>
            Submitted URLs and reports are processed for the current request and
            are not intentionally stored by Rank Builder. The tools do not send
            cookies, reuse visitor credentials, authenticate to protected
            resources, or impersonate Googlebot.
          </p>
          <p>
            Private, loopback, link-local, metadata, credential-bearing, and
            nonstandard-port destinations are rejected. DNS answers and redirect
            targets are revalidated, while time, redirect, response-size, and
            request-rate limits bound each inspection.
          </p>
          <p>
            Read the <Link href="/privacy">privacy notice</Link> for transient
            processing and analytics details.
          </p>
        </section>
        <section className="section shell prose-page" id="acceptable-use">
          <p className="eyebrow">Acceptable use</p>
          <h2>Inspect only what you are authorized to test.</h2>
          <p>
            Do not use these tools for internal-network probing, credential-bearing
            URLs, attempts to bypass access controls, automated bulk scanning, or
            abuse of third-party infrastructure. Submit only public URLs that you
            own or are authorized to test.
          </p>
        </section>
        <section className="section shell">
          <p className="eyebrow">Continue learning</p>
          <div className="related-grid">
            <Link href="/articles/why-google-isnt-indexing-your-page">
              <span>Diagnostic guide</span>
              <h2>Why Google Isn&apos;t Indexing Your Page</h2>
              <p>Separate discovery, crawling, rendering, indexing, and canonical problems.</p>
            </Link>
            <Link href="/articles/redirect-error-search-console">
              <span>Redirect playbook</span>
              <h2>Redirect Error in Search Console</h2>
              <p>Trace the exact path and repair loops, unsafe targets, and unstable hops.</p>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
