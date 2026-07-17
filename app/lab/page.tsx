import type { Metadata } from "next";
import { experiments } from "../data";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { sharedOpenGraph } from "../metadata";

export const metadata: Metadata = {
  title: "Public SEO lab",
  description: "Logged SEO experiments with hypotheses, signals, windows, and explicit claim limits.",
  alternates: { canonical: "https://rankbuilderseo.com/lab" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/lab",
    title: "Public SEO lab",
    description: "Logged SEO experiments with hypotheses, signals, windows, and explicit claim limits.",
  },
};

export default function LabPage() {
  return <><SiteHeader /><main id="main-content" className="lab-page"><section className="page-hero shell"><p className="eyebrow">Public experiment register</p><h1>Test small.<br />Write down everything.</h1><p>No secret sauce. Each record names the variable, measurement window, evidence, and what the result cannot prove.</p></section>
    <section className="section shell lab-register"><div className="register-header"><span>ID / STATUS</span><span>EXPERIMENT</span><span>SIGNAL / WINDOW</span></div>{experiments.map((experiment) => <article key={experiment.id} className="register-row"><div><b>{experiment.id}</b><span className={`lab-status ${experiment.status === "Measuring" ? "live" : "queued"}`}>{experiment.status}</span></div><div><h2>{experiment.title}</h2><p>{experiment.hypothesis}</p><details><summary>Protocol and limits</summary><p>Hold the surrounding page shell as stable as practical, record changes before measurement, and do not extend a site-specific observation into a universal ranking rule.</p></details></div><dl><div><dt>Signal</dt><dd>{experiment.signal}</dd></div><div><dt>Window</dt><dd>{experiment.window}</dd></div></dl></article>)}</section>
    <section className="lab-rules"><div className="shell"><p className="eyebrow">Lab rules</p><div className="rules-grid"><div><span>01</span><h3>Reversible</h3><p>Every intervention should be easy to undo or isolate.</p></div><div><span>02</span><h3>Observable</h3><p>Define the signal before looking for a result.</p></div><div><span>03</span><h3>Bounded</h3><p>Write down what the experiment cannot prove.</p></div><div><span>04</span><h3>Recorded</h3><p>No clean-up that erases an inconvenient outcome.</p></div></div></div></section>
  </main><SiteFooter /></>;
}
