import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { VisualizerClient } from "./visualizer-client";

const canonical = "https://rankbuilderseo.com/tools/redirect-chain-visualizer";
const description = "Trace a public URL through each HTTP redirect, inspect status codes and Location headers, detect loops and protocol changes, and export the chain as text, CSV, or JSON.";

export const metadata: Metadata = {
  title: "Redirect Chain Visualizer: Trace Every HTTP Redirect Hop",
  description,
  alternates: { canonical },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: canonical,
    title: "Redirect Chain Visualizer: Trace Every HTTP Redirect Hop",
    description,
    images: [{
      url: "https://rankbuilderseo.com/media/redirect-chain-visualizer-hero.jpg",
      width: 1200,
      height: 630,
      alt: "Aerial view of a multilane highway interchange",
    }],
  },
};

const application = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Redirect Chain Visualizer",
  url: canonical,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "Rank Builder SEO", url: "https://rankbuilderseo.com/" },
};

export default function RedirectChainVisualizerPage() {
  return <><SiteHeader /><main id="main-content" className="tool-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application).replace(/</g, "\\u003c") }} />
    <section className="page-hero shell tool-hero">
      <p className="eyebrow">Free public SEO tool</p>
      <h1>Redirect Chain Visualizer</h1>
      <p>Trace every public HTTP redirect hop, inspect the destination, and make loops, protocol changes, and fragile chains visible.</p>
    </section>
    <figure className="tool-hero-media shell">
      <Image src="/media/redirect-chain-visualizer-hero.jpg" alt="Aerial view of a multilane highway interchange" width={1200} height={630} priority />
      <figcaption>A redirect chain becomes understandable when every transition, destination, and failure is shown in order. <span>Credit: <a href="https://unsplash.com/photos/aerial-view-of-a-highway-interchange-with-cars-glnxs44jWSc" rel="noopener noreferrer external">Photo by Jakub Żerdzicki on Unsplash</a></span></figcaption>
    </figure>
    <div className="shell"><VisualizerClient /></div>
    <article className="tool-copy shell">
      <section>
        <h2>What this tool does</h2>
        <p>The Redirect Chain Visualizer sends a bounded public request and follows each HTTP redirect manually. It records the response at every hop instead of allowing the network client to hide the intermediate chain.</p>
        <p>For each hop, it reports:</p>
        <ul>
          <li>Sequence number</li><li>Requested URL</li><li>HTTP status</li><li>Raw <code>Location</code> header</li>
          <li>Resolved next URL</li><li>Response time</li><li>Protocol change</li><li>Hostname change</li>
          <li>Path change</li><li>Query-string change</li><li>Permanent or temporary redirect classification</li>
          <li>Loop, chain, downgrade, and destination warnings</li>
        </ul>
        <p>The visualizer follows at most ten HTTP redirect hops. That limit matches the general redirect depth Google documents for its crawlers, although individual Google products and inspection tools can behave differently.</p>
      </section>
      <section>
        <h2>Result summary labels</h2>
        <div className="tool-label-grid">
          <div><h3>Direct response</h3><p>The submitted URL returned a non-redirect response without an HTTP redirect hop.</p></div>
          <div><h3>Clean single redirect</h3><p>The source redirects directly to the final destination in one HTTP hop.</p></div>
          <div><h3>Redirect chain</h3><p>The URL passes through multiple HTTP redirects before reaching the final response. Replace avoidable intermediate hops with a direct redirect where practical.</p></div>
          <div><h3>Redirect loop</h3><p>A URL repeated within the trace. The chain cannot reach a stable final destination until the loop is repaired.</p></div>
          <div><h3>Broken destination</h3><p>The chain ends at an error, blocked request, malformed Location value, or response that could not be fetched.</p></div>
          <div><h3>Hop limit exceeded</h3><p>The trace reached the ten-hop safety limit before a final response. Long chains are fragile for users and crawlers and should be reduced.</p></div>
          <div><h3>Indeterminate</h3><p>The chain could not be classified reliably within the tool&apos;s bounded fetch and security limits.</p></div>
        </div>
      </section>
      <section>
        <h2>How to read the chain</h2>
        <h3>Permanent redirects</h3>
        <p><code>301</code> and <code>308</code> communicate that the resource has moved permanently. Search systems can use these responses as strong canonicalization signals toward the destination.</p>
        <p>Use permanent redirects when the move should remain in place.</p>
        <h3>Temporary redirects</h3>
        <p><code>302</code>, <code>303</code>, and <code>307</code> generally communicate a temporary move. They can be correct for temporary routing, login flows, experiments, or short-lived maintenance.</p>
        <p>Do not replace every temporary redirect mechanically. First decide whether the source URL should remain the long-term representative.</p>
        <h3>Relative Location values</h3>
        <p>A response can declare a relative target:</p>
        <pre><code>Location: /new-page/</code></pre>
        <p>The tool resolves it against the current URL and displays both the raw value and the resulting absolute URL.</p>
        <h3>Host and protocol changes</h3>
        <p>The visualizer flags transitions such as:</p>
        <pre><code>{`http://example.com/
→ https://example.com/
→ https://www.example.com/
→ https://www.example.com/final/`}</code></pre>
        <p>A normalization sequence may work, but it adds hops. Prefer one direct redirect from each known alternate to the final canonical URL.</p>
        <p>An HTTPS-to-HTTP downgrade receives a high-priority warning.</p>
        <h3>Query changes</h3>
        <p>The report shows when parameters are added, removed, or replaced.</p>
        <p>Review whether the chain drops required campaign or application parameters, preserves tracking parameters indefinitely, creates duplicate destinations, repeats parameters at every hop, or redirects clean URLs into session or preview URLs.</p>
        <h3>Final response</h3>
        <p>The final response matters as much as the redirect path.</p>
        <p>A chain is not healthy merely because every intermediate hop is a valid <code>301</code>. The destination should normally be stable, public, and appropriate for the original resource.</p>
        <p>Warnings appear when the destination returns <code>401</code> or <code>403</code>, <code>404</code> or <code>410</code>, <code>429</code>, <code>5xx</code>, a non-HTML content type when HTML was expected, or another redirect that exceeds the hop limit.</p>
      </section>
      <section>
        <h2>Non-HTTP redirects</h2>
        <p>The tool detects simple HTTP <code>Refresh</code> headers and zero-delay HTML meta refresh declarations when they appear in the bounded response sample. It reports them separately.</p>
        <p>It does not execute JavaScript. A redirect created only through <code>window.location</code>, framework code, or user interaction may not appear in this trace.</p>
        <p>Server-side HTTP redirects are normally easier for crawlers and users to process than script-only redirects.</p>
      </section>
      <section>
        <h2>Export controls</h2>
        <p>Copy summary, Download CSV, and Download JSON operate only on the current browser-visible report. The server does not retain the report to generate a later download.</p>
        <p>CSV cells beginning with spreadsheet formula characters are prefixed safely before download.</p>
      </section>
      <section>
        <h2>What this tool cannot tell you</h2>
        <p>The Redirect Chain Visualizer cannot determine:</p>
        <ul>
          <li>Whether Google has indexed the source or destination</li><li>Which URL Google selected as canonical</li>
          <li>Whether a browser-only JavaScript redirect runs successfully</li><li>Whether logged-in users receive another chain</li>
          <li>Whether a redirect varies by geography, cookie, device, or experimentation platform</li>
          <li>Whether an external destination is trustworthy</li><li>Whether a temporary redirect should become permanent without knowing the business intent</li>
        </ul>
      </section>
      <section>
        <h2>Safe use and privacy</h2>
        <p>The tool rejects credentials, local and private-network addresses, cloud metadata destinations, unsupported ports, oversized responses, and unsafe redirect targets. Every redirect target is revalidated before it is fetched.</p>
        <p>The tool does not impersonate Googlebot. It identifies itself as Rank Builder&apos;s redirect inspector so results may differ from crawler-specific or personalized routing.</p>
        <p>DNS prevalidation reduces but cannot eliminate the risk inherent in arbitrary public fetching. Cloudflare platform protections remain in force, and strict response, time, hop, and byte limits bound each trace.</p>
      </section>
      <section>
        <h2>Related reading</h2>
        <ul>
          <li><Link href="/articles/page-with-redirect">Page With Redirect</Link></li>
          <li><Link href="/articles/redirect-error-search-console">Redirect Error in Search Console</Link></li>
          <li><Link href="/articles/google-chose-different-canonical">Google Chose a Different Canonical</Link></li>
          <li><Link href="/articles/server-error-5xx">Server Error 5xx</Link></li>
          <li><Link href="/articles/cloudflare-pages-workers-seo">Cloudflare Pages and Workers SEO</Link></li>
          <li><Link href="/articles/seo-migration-launch-checklist">SEO Migration Launch Checklist</Link></li>
        </ul>
      </section>
      <p className="tool-disclosure">The Redirect Chain Visualizer inspects public HTTP behavior. It is not a browser emulator, a Search Console replacement, or a guarantee of search-engine canonical selection.</p>
    </article>
  </main><SiteFooter /></>;
}
