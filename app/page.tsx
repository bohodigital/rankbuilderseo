import Link from "next/link";
import { articles, experiments, glossary } from "./data";
import { SiteFooter, SiteHeader } from "./site-chrome";

export default function Home() {
  const featured = articles[0];

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Independent SEO research desk</p>
            <h1>Clear SEO answers.<br /><em>On repeat.</em></h1>
            <p className="hero-deck">
              Evidence-aware explainers, playbooks, claim checks, checklists, and data notes—published in one consistent format so you can find the answer and judge the proof fast.
            </p>
            <div className="button-row">
              <Link className="button button-dark" href="/articles">Browse all articles <span>→</span></Link>
              <Link className="button button-ghost" href="/lab">Enter the lab <span>↗</span></Link>
            </div>
          </div>
          <aside className="hero-board" aria-label="Rank Builder principles">
            <div className="board-stamp">RB / 001</div>
            <p className="board-label">Every article includes</p>
            <p className="board-quote">Answer.<br /><span>Evidence.</span><br />Limits.</p>
            <ul className="board-list">
              <li><span>01</span> A direct desk verdict</li>
              <li><span>02</span> Three key takeaways</li>
              <li><span>03</span> Visible evidence level</li>
              <li><span>04</span> Reviewed and corrected</li>
            </ul>
          </aside>
        </section>

        <section className="ticker" aria-label="Publication focus">
          <div className="ticker-track">
            <span>Explainers</span><b>◆</b><span>Playbooks</span><b>◆</b><span>Claim checks</span><b>◆</b><span>Data notes</span><b>◆</b><span>Checklists</span><b>◆</b>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Latest articles / {String(articles.length).padStart(2, "0")} published</p>
              <h2>Fresh answers.<br />Same high bar.</h2>
            </div>
            <p>Every story is part of a durable category and series, making the archive easier to grow, browse, update, and trust.</p>
          </div>

          <div className="feature-grid">
            <Link href={`/articles/${featured.slug}`} className="feature-story">
              <div className="feature-number">01</div>
              <div className="feature-copy">
                <div className="meta-row"><span>{featured.format}</span><span>{featured.category}</span><span>{featured.readTime}</span></div>
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
                <span className="text-link">Read the article →</span>
              </div>
            </Link>
            <div className="story-stack">
              {articles.slice(1, 4).map((article, index) => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="story-row">
                  <span className="row-index">0{index + 2}</span>
                  <div>
                    <div className="meta-row"><span>{article.format}</span><span>{article.readTime}</span></div>
                    <h3>{article.title}</h3>
                  </div>
                  <span className="row-arrow">↗</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="center-action"><Link className="button button-ghost" href="/articles">Explore the article archive <span>→</span></Link></div>
        </section>

        <section className="article-system">
          <div className="shell system-grid">
            <div className="system-intro"><p className="eyebrow">The publishing system</p><h2>Volume without<br />the content sludge.</h2><p>One repeatable editorial contract keeps every new article useful on its own and connected to the larger desk.</p></div>
            <ol className="system-steps">
              <li><span>01 / Question</span><h3>One search problem</h3><p>A narrow question with a real decision behind it.</p></li>
              <li><span>02 / Answer</span><h3>Verdict up front</h3><p>The useful answer appears before the throat-clearing.</p></li>
              <li><span>03 / Proof</span><h3>Evidence made visible</h3><p>Sources, observations, inference, and limits stay distinct.</p></li>
              <li><span>04 / Network</span><h3>Series and related reading</h3><p>Every article strengthens a topic cluster instead of becoming an orphan.</p></li>
            </ol>
          </div>
        </section>

        <section className="section section-ink">
          <div className="shell">
            <div className="section-heading light-heading split-heading">
              <div>
                <p className="eyebrow">The live lab</p>
                <h2>No victory laps<br />without a baseline.</h2>
              </div>
              <p>Every experiment records the variable, window, measurement, and the things its result cannot prove.</p>
            </div>
            <div className="experiment-grid">
              {experiments.map((experiment) => (
                <article className="experiment-card" key={experiment.id}>
                  <div className="experiment-top">
                    <span className={`lab-status ${experiment.status === "Measuring" ? "live" : "queued"}`}>{experiment.status}</span>
                    <span>{experiment.id}</span>
                  </div>
                  <h3>{experiment.title}</h3>
                  <p>{experiment.hypothesis}</p>
                  <dl>
                    <div><dt>Signal</dt><dd>{experiment.signal}</dd></div>
                    <div><dt>Window</dt><dd>{experiment.window}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <Link className="button button-light" href="/lab">Open the experiment register <span>→</span></Link>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Plain-language index</p>
              <h2>Know the words.<br />Keep the leverage.</h2>
            </div>
            <p>The short version first, then the detail that changes an ownership, measurement, or search decision.</p>
          </div>
          <div className="definition-grid">
            {glossary.slice(0, 6).map((entry) => (
              <Link className="definition-card" href={`/glossary#${entry.slug}`} key={entry.slug}>
                <span className="term-letter">{entry.term.charAt(0)}</span>
                <h3>{entry.term}</h3>
                <p>{entry.short}</p>
                <span className="definition-link">Full definition ↗</span>
              </Link>
            ))}
          </div>
          <div className="center-action"><Link className="button button-ghost" href="/glossary">Browse the full glossary <span>→</span></Link></div>
        </section>

        <section className="manifesto">
          <div className="shell manifesto-grid">
            <p className="manifesto-mark">R/B</p>
            <div>
              <p className="eyebrow">The compact</p>
              <h2>We publish what we can defend.</h2>
              <p>Facts get sources. Tests get boundaries. Opinions get labeled. If evidence is thin, the conclusion stays thin.</p>
              <Link className="text-link" href="/method">Read our research method →</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
