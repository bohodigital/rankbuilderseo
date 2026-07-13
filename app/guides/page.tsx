import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "../data";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = { title: "Field notes", description: "Practical, source-minded guides for technical SEO, measurement, pricing, and buyer defense." };

export default function GuidesPage() {
  return <><SiteHeader /><main id="main-content">
    <section className="page-hero shell"><p className="eyebrow">Field notes / 005</p><h1>The practical side<br />of healthy skepticism.</h1><p>Guides for checking claims, reading the evidence, and deciding what deserves work next.</p></section>
    <section className="section shell guide-list">
      {guides.map((guide, index) => <Link href={`/guides/${guide.slug}`} className="guide-list-row" key={guide.slug}>
        <span className="guide-number">0{index + 1}</span><div><div className="meta-row"><span>{guide.category}</span><span>{guide.readTime}</span></div><h2>{guide.title}</h2><p>{guide.description}</p></div><span className="guide-arrow">↗</span>
      </Link>)}
    </section>
  </main><SiteFooter /></>;
}
