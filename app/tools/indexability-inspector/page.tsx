import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { InspectorClient } from "./inspector-client";

const canonical = "https://rankbuilderseo.com/tools/indexability-inspector/";
const description = "Inspect a public URL's HTTP response, redirect destination, robots.txt access, robots directives, canonical annotations, content type, and basic HTML signals without storing the submitted URL.";

export const metadata: Metadata = {
  title: "Indexability Inspector: Check Status, Robots, Noindex, and Canonical Signals",
  description,
  alternates: { canonical },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: canonical,
    title: "Indexability Inspector: Check Status, Robots, Noindex, and Canonical Signals",
    description,
    images: [{
      url: "https://rankbuilderseo.com/media/indexability-inspector-hero.jpg",
      width: 1200,
      height: 630,
      alt: "Magnifying glass beside the corner of a laptop",
    }],
  },
};

const application = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Indexability Inspector",
  url: canonical,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "Rank Builder SEO", url: "https://rankbuilderseo.com/" },
};

export default function IndexabilityInspectorPage() {
  return <><SiteHeader /><main id="main-content" className="tool-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application).replace(/</g, "\\u003c") }} />
    <section className="page-hero shell tool-hero">
      <p className="eyebrow">Free public SEO tool</p>
      <h1>Indexability Inspector</h1>
      <p>Check status, robots, noindex, canonical annotations, and basic returned HTML signals without pretending that technical eligibility proves Google indexing.</p>
    </section>
    <figure className="tool-hero-media shell">
      <Image src="/media/indexability-inspector-hero.jpg" alt="Magnifying glass beside the corner of a laptop" width={1200} height={630} priority />
      <figcaption>The inspector separates observable page signals from the much larger question of whether a search engine has selected the URL for its index. <span>Credit: <a href="https://unsplash.com/photos/magnifying-glass-sits-near-a-laptop-on-a-table-P_5mirRrg0k" rel="noopener noreferrer external">Photo by MJ Duford on Unsplash</a></span></figcaption>
    </figure>
    <div className="shell"><InspectorClient /></div>
    <article className="tool-copy shell">
      <section>
        <h2>What this tool checks</h2>
        <p>The Indexability Inspector performs a bounded public fetch and reports the signals a crawler can observe without executing JavaScript or accessing a private Search Console account.</p>
        <p>It checks:</p>
        <ul>
          <li>The requested URL and final URL</li><li>HTTP status</li><li>Redirect count</li><li>Content type</li>
          <li>Whether robots.txt appears to allow the final URL for Googlebot</li><li>Robots meta directives</li>
          <li>Googlebot-specific meta directives</li><li><code>X-Robots-Tag</code> response headers</li>
          <li>HTML and HTTP canonical annotations</li><li>Multiple or conflicting canonical declarations</li>
          <li>Title and primary heading presence</li><li>Approximate visible text availability in the returned HTML</li>
          <li>Obvious status, directive, and canonical conflicts</li>
        </ul>
        <p>The result is an inspection report, not an indexing guarantee.</p>
        <p>Google&apos;s <a href="https://developers.google.com/search/docs/essentials/technical" rel="noopener noreferrer external">minimum technical requirements</a> include crawl access, a working <code>200</code> response, and indexable content. Meeting those requirements makes a page eligible for consideration; it does not require Google to index or rank the page.</p>
      </section>
      <section>
        <h2>Report summary labels</h2>
        <div className="tool-label-grid">
          <div><h3>Potentially indexable</h3><p>The inspected response does not show an obvious crawl block, noindex directive, or non-success status. This means the page appears technically eligible under the signals this tool can observe. It does not prove that Google has indexed the URL.</p></div>
          <div><h3>Indexing prohibited</h3><p>The final response contains a noindex rule in HTML or an X-Robots-Tag header. A crawler that can access the page may use that rule to keep the resource out of search results.</p></div>
          <div><h3>Crawling blocked</h3><p>The robots.txt evaluation indicates that Googlebot is disallowed from fetching the final URL. Because the crawler cannot reliably read the page, this tool cannot treat page-level noindex or canonical signals as fully observable to Google.</p></div>
          <div><h3>Unavailable or error response</h3><p>The final URL did not return a normal successful HTML response. Review the status, redirect chain, access controls, and server behavior before evaluating page-level indexing signals.</p></div>
          <div><h3>Redirecting URL</h3><p>The requested URL redirects. Search systems normally process the destination rather than indexing the redirecting response as a standalone content page. Review the final URL and the full chain.</p></div>
          <div><h3>Indeterminate</h3><p>The response could not be classified reliably within the tool&apos;s bounded fetch and parsing limits. Review the detailed fields and test the URL with an owner-authorized search-engine inspection tool.</p></div>
        </div>
      </section>
      <section>
        <h2>Result fields</h2>
        <div className="article-table" tabIndex={0} role="region" aria-label="Indexability report field descriptions"><table><thead><tr><th scope="col">Field</th><th scope="col">Help text</th></tr></thead><tbody>
          <tr><td>Requested URL</td><td>The exact URL submitted to the tool.</td></tr>
          <tr><td>Final URL</td><td>The URL reached after HTTP redirects.</td></tr>
          <tr><td>HTTP status</td><td>The final response status returned to this inspector.</td></tr>
          <tr><td>Redirects</td><td>The number of HTTP redirect hops followed.</td></tr>
          <tr><td>Content type</td><td>The response media type declared by the server.</td></tr>
          <tr><td>Robots.txt</td><td>The matching allow or disallow result for Googlebot, with the rule shown when available.</td></tr>
          <tr><td>Robots meta</td><td>Directives found in <code>&lt;meta name=&quot;robots&quot;&gt;</code>.</td></tr>
          <tr><td>Googlebot meta</td><td>Directives found in <code>&lt;meta name=&quot;googlebot&quot;&gt;</code>.</td></tr>
          <tr><td>X-Robots-Tag</td><td>Indexing and serving directives found in response headers.</td></tr>
          <tr><td>HTML canonical</td><td>Canonical URL declarations found in HTML.</td></tr>
          <tr><td>HTTP canonical</td><td>Canonical URL declarations found in <code>Link</code> response headers.</td></tr>
          <tr><td>Title</td><td>The returned HTML document title.</td></tr>
          <tr><td>H1 count</td><td>The number of primary headings found in the bounded HTML sample.</td></tr>
          <tr><td>Text sample</td><td>Whether the returned HTML contains meaningful text after basic markup removal.</td></tr>
          <tr><td>Warnings</td><td>Conflicts or conditions requiring manual review.</td></tr>
        </tbody></table></div>
      </section>
      <section>
        <h2>How to interpret the report</h2>
        <h3>Start with the final response</h3>
        <p>A page cannot be evaluated as an ordinary indexable HTML document when the final response is a redirect, authentication challenge, client error, server error, or empty success response.</p>
        <p>Use the final URL rather than assuming the submitted form is canonical.</p>
        <h3>Separate crawl control from index control</h3>
        <p>Robots.txt controls crawler access. It is not a dependable way to keep a public web page out of search results.</p>
        <p>A <code>noindex</code> rule is different. It can be delivered in HTML or with <code>X-Robots-Tag</code>, but the crawler must be allowed to access the resource to observe it.</p>
        <p>The inspector therefore warns when a page is simultaneously blocked by robots.txt and declares <code>noindex</code>. That combination can hide the removal instruction from the crawler expected to obey it.</p>
        <h3>Read every directive source</h3>
        <p>A clean HTML template does not prove that the public response is indexable.</p>
        <p>A directive can come from robots meta tags, Googlebot-specific meta tags, <code>X-Robots-Tag</code>, application middleware, web server configuration, or a reverse proxy or CDN. When several directive sources exist, restrictive rules can combine.</p>
        <h3>Treat canonical annotations as preferences</h3>
        <p>The inspector reports declared canonical signals. It cannot report Google&apos;s selected canonical because that decision is made during indexing and requires owner-authorized indexed data.</p>
        <p>Warnings appear when more than one HTML canonical is present, HTML and HTTP canonicals disagree, the canonical resolves to the same redirecting URL, the canonical uses a different protocol or hostname, or the canonical is malformed or cannot be resolved.</p>
        <p>A declared canonical is a preference, not proof that a search engine selected it.</p>
        <h3>Remember the JavaScript boundary</h3>
        <p>This tool does not execute page JavaScript.</p>
        <p>It can inspect the returned HTML, but it cannot confirm whether client-rendered content, metadata, links, or error states appear after hydration. Use URL Inspection or another renderer when the main content depends on JavaScript.</p>
      </section>
      <section>
        <h2>What this tool cannot tell you</h2>
        <p>The Indexability Inspector cannot determine:</p>
        <ul>
          <li>Whether Google has indexed the page</li><li>Google&apos;s selected canonical</li><li>Whether the page ranks for a query</li>
          <li>Whether a manual action, security issue, or removal request applies</li><li>What a fully rendered browser DOM contains</li>
          <li>Whether content quality is sufficient for index selection</li><li>Whether search engines other than Google interpret every rule identically</li>
          <li>Whether a private, cookie-dependent, or logged-in experience works</li>
        </ul>
        <p>For a URL in a Search Console property you control, compare this report with the indexed and live information in URL Inspection.</p>
      </section>
      <section>
        <h2>Safe use and privacy</h2>
        <p>The tool accepts only bounded public HTTP and HTTPS URLs. It rejects credentials, private-network destinations, loopback addresses, link-local addresses, cloud metadata targets, unsupported ports, oversized responses, and excessive redirect chains.</p>
        <p>It does not submit forms, send cookies, reuse visitor credentials, or intentionally retain submitted URLs.</p>
        <p>DNS prevalidation reduces but cannot eliminate the risk inherent in arbitrary public fetching. Every redirect target is checked again, Cloudflare platform protections remain in force, and strict response, time, and byte limits bound each request.</p>
      </section>
      <section>
        <h2>Related reading</h2>
        <ul>
          <li><Link href="/articles/why-google-isnt-indexing-your-page/">Why Google Isn&apos;t Indexing Your Page</Link></li>
          <li><Link href="/articles/excluded-by-noindex/">Excluded by Noindex</Link></li>
          <li><Link href="/articles/url-blocked-by-robots-txt/">URL Blocked by Robots.txt</Link></li>
          <li><Link href="/articles/google-chose-different-canonical/">Google Chose a Different Canonical</Link></li>
          <li><Link href="/articles/google-search-console-url-inspection/">Google Search Console URL Inspection</Link></li>
          <li><Link href="/articles/rendered-html-missing-content/">Rendered HTML Missing Content</Link></li>
        </ul>
      </section>
      <p className="tool-disclosure">The Indexability Inspector reports observable public signals. It is not affiliated with Google and does not access Google&apos;s private index or Search Console data.</p>
    </article>
  </main><SiteFooter /></>;
}
