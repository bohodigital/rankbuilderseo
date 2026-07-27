import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toolByRoute } from "../../content/tool-records";
import { serializeStructuredData, topicStructuredData } from "../../content/structured-data";
import { topicBySlug, topicGlossaryEntries, topicPublications, topics } from "../../content/topics";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicBySlug.get(slug);
  if (!topic) return {};
  const canonical = `https://rankbuilderseo.com/topics/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      ...sharedOpenGraph,
      type: "website",
      url: canonical,
      title: topic.title,
      description: topic.description,
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topicBySlug.get(slug);
  if (!topic) notFound();
  const startHere = topicPublications(topic.startHere);
  const primary = topicPublications(topic.primaryPublications);
  const secondary = topicPublications(topic.secondaryPublications);
  const glossary = topicGlossaryEntries(topic.slug);
  const tools = topic.relatedTools.map((route) => toolByRoute.get(route)).filter(Boolean);

  return <><SiteHeader /><main id="main-content">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(topicStructuredData(topic, [...primary, ...secondary])) }}
    />
    <section className="page-hero shell topic-hero">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/topics">Topics</Link><span aria-hidden="true">/</span><span aria-current="page">{topic.title}</span>
      </nav>
      <p className="eyebrow">Topic {String(topic.displayOrder).padStart(2, "0")} / {primary.length} primary articles</p>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>
    </section>

    <section className="section shell topic-start">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">Start here / In order</p><h2>Build the diagnosis<br />one step at a time.</h2></div>
        <p>These approved entry points establish the topic before the complete inventory below.</p>
      </div>
      <ol className="topic-start-grid">
        {startHere.map((publication, index) => (
          <li key={publication.slug}>
            <Link href={`/articles/${publication.slug}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{publication.title}</h3>
              <p>{publication.directAnswer}</p>
            </Link>
          </li>
        ))}
      </ol>
    </section>

    <section className="section shell topic-inventory">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">Complete primary inventory</p><h2>Every article<br />in this topic.</h2></div>
        <p>{topic.description}</p>
      </div>
      <div className="article-card-grid">
        {primary.map((publication, index) => (
          <Link className="article-card" href={`/articles/${publication.slug}`} key={publication.slug}>
            <div className="article-card-top"><span>{publication.format}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <p className="article-series">{publication.series}</p>
            <h2>{publication.title}</h2>
            <p>{publication.description}</p>
            <div className="article-card-bottom"><span>{publication.evidenceLevel}</span><span>{publication.readTime} →</span></div>
          </Link>
        ))}
      </div>
    </section>

    {secondary.length > 0 && <section className="section shell topic-secondary">
      <div className="section-heading"><p className="eyebrow">Related reading</p><h2>Useful supporting records.</h2></div>
      <div className="related-grid">
        {secondary.map((publication) => (
          <Link href={`/articles/${publication.slug}`} key={publication.slug}>
            <span>{publication.format}</span><h2>{publication.title}</h2><p>{publication.description}</p>
          </Link>
        ))}
      </div>
    </section>}

    {(tools.length > 0 || topic.relatedRoutes.length > 0) && <section className="section shell topic-utilities">
      <div className="section-heading"><p className="eyebrow">Related utilities</p><h2>Inspect or measure the evidence.</h2></div>
      <div className="evidence-tool-grid">
        {tools.map((tool) => tool && <Link href={tool.href} key={tool.href}><span>Tool</span><h3>{tool.name}</h3><p>{tool.description}</p></Link>)}
        {topic.relatedRoutes.map((route) => <Link href={route} key={route}><span>Research</span><h3>Experiment lab</h3><p>Logged SEO experiments with hypotheses, protocols, baselines, measurement windows, results, and explicit limits.</p></Link>)}
      </div>
    </section>}

    <section className="section shell topic-glossary">
      <div className="section-heading split-heading">
        <div><p className="eyebrow">Existing glossary references</p><h2>Terms used<br />inside this topic.</h2></div>
        <p>These definitions are derived from glossary links already approved in the topic&apos;s article inventory.</p>
      </div>
      {glossary.length > 0 ? <div className="definition-grid">
        {glossary.map((entry) => <Link className="definition-card" href={`/glossary/${entry.slug}`} key={entry.slug}>
          <span className="term-letter">{entry.term.charAt(0)}</span><h3>{entry.term}</h3><p>{entry.short}</p><span className="definition-link">Full definition →</span>
        </Link>)}
      </div> : <p><Link href="/glossary">Browse the full glossary</Link>.</p>}
    </section>
  </main><SiteFooter /></>;
}
