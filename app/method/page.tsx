import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { sharedOpenGraph } from "../metadata";

export const metadata: Metadata = {
  title: "Research method",
  description: "How Rank Builder separates sources, observations, inferences, opinions, and corrections.",
  alternates: { canonical: "https://rankbuilderseo.com/method" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/method",
    title: "Research method",
    description: "How Rank Builder separates sources, observations, inferences, opinions, and corrections.",
  },
};

const standards = [
  ["Source", "A record a reader can inspect: official documentation, a public claim, first-hand test output, or a dated archive."],
  ["Observation", "What the source or test directly shows, without smuggling a conclusion into the description."],
  ["Inference", "A reasoned interpretation of the evidence, labeled with its conditions and uncertainty."],
  ["Opinion", "A judgment or recommendation. Useful, sometimes strong, and never dressed up as an objective measurement."],
];

export default function MethodPage() {
  return <><SiteHeader /><main id="main-content"><section className="page-hero shell"><p className="eyebrow">Research standard / v1.0</p><h1>Standards before<br />opinions.</h1><p>Our method is part of the product. Without it, a review is just tone and a guide is preference wearing a lab coat.</p></section>
    <section className="section shell method-grid"><div className="method-intro"><p className="eyebrow">The evidence ladder</p><h2>Four labels.<br />No costume changes.</h2><p>Every consequential claim should make its position on this ladder obvious.</p></div><div className="standards-list">{standards.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
    <section className="section method-dark"><div className="shell"><div className="section-heading light-heading"><p className="eyebrow">Publishing compact</p><h2>What we refuse to fake.</h2></div><div className="refusal-grid"><p>Testimonials</p><p>Case studies</p><p>Review stars</p><p>Market averages</p><p>Ranking guarantees</p><p>Authority by tone</p></div><p className="method-note">If the evidence is thin, the page should read as thin. If the conclusion is limited, the limit belongs in public.</p></div></section>
    <section className="section shell corrections" id="corrections"><p className="eyebrow">Corrections</p><h2>Errors get fixed in daylight.</h2><p>Material factual corrections should identify what changed, when it changed, and whether the conclusion moved with it. Disagreement is not automatically an error; better evidence is always welcome.</p></section>
  </main><SiteFooter /></>;
}
