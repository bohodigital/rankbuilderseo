import type { Metadata } from "next";
import Link from "next/link";
import { experiments } from "../content/experiments";
import { sharedOpenGraph } from "../metadata";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "Public SEO lab",
  description: "Logged SEO experiments with hypotheses, protocols, baselines, measurement windows, results, and explicit limits.",
  alternates: { canonical: "https://rankbuilderseo.com/lab" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/lab",
    title: "Public SEO lab",
    description: "Logged SEO experiments with hypotheses, protocols, baselines, measurement windows, results, and explicit limits.",
  },
};

export default function LabPage() {
  return <><SiteHeader /><main id="main-content" className="lab-page"><section className="page-hero shell"><p className="eyebrow">Public experiment register</p><h1>Test small.<br />Write down everything.</h1><p>No secret sauce. Each record names the variable, protocol, baseline, measurement window, result, and what it cannot prove.</p></section>
    <section className="section shell lab-assets">
      <div className="section-heading split-heading"><div><p className="eyebrow">Tools and indexing research</p><h2>Inspect the evidence.</h2></div><p>Use bounded public tools, then compare what they can observe with the registered indexing study and its explicit evidence gates.</p></div>
      <div className="lab-asset-grid">
        <Link href="/tools/indexability-inspector"><span>Public tool</span><h2>Indexability Inspector</h2><p>Check public status, robots, noindex, canonical annotations, and returned HTML signals.</p></Link>
        <Link href="/tools/redirect-chain-visualizer"><span>Public tool</span><h2>Redirect Chain Visualizer</h2><p>Trace every HTTP hop and expose loops, protocol changes, and broken destinations.</p></Link>
        <Link href="/articles/google-indexing-time-study-methodology"><span>Research method</span><h2>Indexing Time Study Methodology</h2><p>See the registered event definitions, observation schedule, and reporting gates.</p></Link>
        <Link href="/articles/google-indexing-time-study-baseline"><span>Research baseline</span><h2>First Cohort Baseline</h2><p>Review the 31-URL cohort and why no duration estimate is available yet.</p></Link>
      </div>
    </section>
    <section className="section shell lab-register"><div className="register-header"><span>ID / STATUS</span><span>EXPERIMENT</span><span>MEASUREMENT / WINDOW</span></div>{experiments.map((experiment) => <article key={experiment.id} className="register-row"><div><b>{experiment.id}</b><span className={`lab-status ${experiment.status === "Measuring" ? "live" : "queued"}`}>{experiment.status}</span></div><div><h2>{experiment.title}</h2><p>{experiment.hypothesis}</p><details><summary>Protocol, result, and limits</summary><h3>Protocol</h3><ol>{experiment.protocol.map((step) => <li key={step}>{step}</li>)}</ol><h3>Baseline</h3><p>{experiment.baseline}</p><h3>Result</h3><p>{experiment.result}</p><h3>Limitations</h3><ul>{experiment.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul>{experiment.relatedPublications.length > 0 && <p>Related: {experiment.relatedPublications.map((slug, index) => <span key={slug}>{index > 0 ? ", " : ""}<Link href={`/articles/${slug}`}>{slug}</Link></span>)}</p>}</details></div><dl><div><dt>Measurement</dt><dd>{experiment.measurement}</dd></div><div><dt>Window</dt><dd>{experiment.measurementWindow}</dd></div></dl></article>)}</section>
    <section className="lab-rules"><div className="shell"><p className="eyebrow">Lab rules</p><div className="rules-grid"><div><span>01</span><h3>Reversible</h3><p>Every intervention should be easy to undo or isolate.</p></div><div><span>02</span><h3>Observable</h3><p>Define the signal before looking for a result.</p></div><div><span>03</span><h3>Bounded</h3><p>Write down what the experiment cannot prove.</p></div><div><span>04</span><h3>Recorded</h3><p>No clean-up that erases an inconvenient outcome.</p></div></div></div></section>
  </main><SiteFooter /></>;
}
