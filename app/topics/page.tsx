import type { Metadata } from "next";
import Link from "next/link";
import { serializeStructuredData, topicsIndexStructuredData } from "../content/structured-data";
import { topics } from "../content/topics";
import { sharedOpenGraph } from "../metadata";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "SEO topics",
  description: "Seven controlled paths through Rank Builder's articles, tools, glossary, and research.",
  alternates: { canonical: "https://rankbuilderseo.com/topics" },
  robots: { index: true, follow: true },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/topics",
    title: "SEO topics",
    description: "Seven controlled paths through Rank Builder's articles, tools, glossary, and research.",
  },
};

export default function TopicsPage() {
  return <><SiteHeader /><main id="main-content">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(topicsIndexStructuredData(topics)) }}
    />
    <section className="page-hero shell topic-index-hero">
      <p className="eyebrow">Controlled topic architecture / Seven paths</p>
      <h1>Start with the problem.<br />Follow the evidence.</h1>
      <p>Each topic collects a complete primary article inventory, a short start-here sequence, and the approved tools or glossary paths that support the diagnosis.</p>
    </section>
    <section className="section shell">
      <div className="topic-card-grid">
        {topics.map((topic) => (
          <Link className="topic-card" href={`/topics/${topic.slug}`} key={topic.slug}>
            <span>{String(topic.displayOrder).padStart(2, "0")} / {String(topic.primaryPublications.length).padStart(2, "0")} primary</span>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <b>Explore this topic →</b>
          </Link>
        ))}
      </div>
    </section>
  </main><SiteFooter /></>;
}
