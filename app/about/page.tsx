import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { sharedOpenGraph } from "../metadata";

export const metadata: Metadata = {
  title: "About the research desk",
  description: "What Rank Builder SEO is building and what it refuses to become.",
  alternates: { canonical: "https://rankbuilderseo.com/about" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/about",
    title: "About the research desk",
    description: "What Rank Builder SEO is building and what it refuses to become.",
  },
};

export default function AboutPage() {
  return <><SiteHeader /><main id="main-content"><section className="page-hero shell"><p className="eyebrow">About the desk</p><h1>Built for the moment<br />after “trust me.”</h1><p>Rank Builder SEO is an independent publication for people making technical, editorial, and buying decisions in a field crowded with decorative certainty.</p></section>
    <section className="section shell about-grid"><div><p className="big-copy">We publish field notes, definitions, provider-review frameworks, pricing analysis, and small public experiments.</p></div><div><h2>Why this exists</h2><p>SEO advice routinely blurs education, sales, reporting, and implementation. We separate those jobs so a reader can inspect a claim without being pulled into a funnel.</p><h2>Who it serves</h2><p>Owners, operators, marketers, developers, and practitioners who prefer a narrow defensible answer to a sweeping confident one.</p><h2>How it grows</h2><p>Slowly enough to preserve the evidence trail. The library expands when a page has a real reader, a reviewable claim, and something useful to verify.</p></div></section>
    <section className="about-band"><div className="shell"><p className="eyebrow">The short version</p><h2>Independent. Source-minded.<br />Allergic to theater.</h2><Link className="button button-light" href="/method">Inspect the method <span>→</span></Link></div></section>
    <section className="section shell corrections" id="corrections"><p className="eyebrow">Corrections desk</p><h2>Found a claim that does not hold up?</h2><p>Identify the page, quote the exact passage, and bring the stronger source or reproducible proof. Factual fixes, scope clarifications, and opinion disagreements are logged differently.</p></section>
  </main><SiteFooter /></>;
}
