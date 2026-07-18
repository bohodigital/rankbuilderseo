import type { Metadata } from "next";
import { publications } from "../content/publications";
import { sharedOpenGraph } from "../metadata";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { ArticleExplorer } from "./article-explorer";

export const metadata: Metadata = {
  title: "SEO articles",
  description: "Evidence-aware SEO explainers, playbooks, claim checks, checklists, and data notes from the Rank Builder research desk.",
  alternates: { canonical: "https://rankbuilderseo.com/articles" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/articles",
    title: "SEO articles",
    description: "Evidence-aware SEO explainers, playbooks, claim checks, checklists, and data notes from the Rank Builder research desk.",
  },
};

export default function ArticlesPage() {
  const categories = new Set(publications.map((article) => article.category)).size;
  const series = new Set(publications.map((article) => article.series)).size;
  return <><SiteHeader /><main id="main-content">
    <section className="page-hero article-archive-hero shell">
      <p className="eyebrow">The article desk / Updated continuously</p>
      <h1>One useful answer<br />at a time.</h1>
      <p>Every article follows the same durable structure: a direct answer, visible evidence level, practical takeaways, claim limits, and a reviewed date.</p>
      <dl className="archive-stats">
        <div><dt>Published</dt><dd>{String(publications.length).padStart(2, "0")}</dd></div>
        <div><dt>Categories</dt><dd>{String(categories).padStart(2, "0")}</dd></div>
        <div><dt>Series</dt><dd>{String(series).padStart(2, "0")}</dd></div>
        <div><dt>Template</dt><dd>01</dd></div>
      </dl>
    </section>
    <section className="section shell"><ArticleExplorer articles={publications} /></section>
  </main><SiteFooter /></>;
}
