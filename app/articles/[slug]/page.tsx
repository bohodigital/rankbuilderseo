import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicationBySlug, publications } from "../../content/publications";
import type { Publication } from "../../content/registry";
import { formatPublicationDate } from "../../content/registry";
import { articleStructuredData, serializeStructuredData } from "../../content/structured-data";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const publication = publicationBySlug.get(slug);
  const canonical = `https://rankbuilderseo.com/articles/${publication?.slug ?? slug}`;
  return publication ? {
    title: publication.title,
    description: publication.description,
    alternates: { canonical },
    openGraph: {
      ...sharedOpenGraph,
      type: "article",
      url: canonical,
      title: publication.title,
      description: publication.description,
      publishedTime: publication.publishedAt,
      modifiedTime: publication.revisedAt,
    },
  } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publication = publicationBySlug.get(slug);
  if (!publication) notFound();
  const related = publication.relatedContent
    .map((relatedSlug) => publicationBySlug.get(relatedSlug))
    .filter((item): item is Publication => Boolean(item));

  return <><SiteHeader /><main id="main-content">
    <article className="article-shell shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(articleStructuredData(publication)) }}
      />
      <header className="article-header">
        <p className="eyebrow">{publication.category} / {publication.format}</p>
        <h1>{publication.title}</h1>
        <p>{publication.description}</p>
        <div className="article-byline">
          <span>{publication.author.name}</span>
          <span>{publication.readTime}</span>
          <span>Published {formatPublicationDate(publication.publishedAt)}</span>
          <span>Revised {formatPublicationDate(publication.revisedAt)}</span>
        </div>
      </header>
      <div className="article-layout">
        <aside className="article-rail">
          <p>Article record</p>
          <div className="rail-record"><span>Series</span><b>{publication.series}</b></div>
          <div className="rail-record"><span>Evidence</span><b>{publication.evidenceLevel}</b></div>
          <div className="rail-record"><span>For</span><b>{publication.audience}</b></div>
          <p className="rail-heading">On this page</p>
          {publication.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}
          <a href="#references">References</a>
          <a href="#corrections">Corrections</a>
          <Link href="/method">How we research ↗</Link>
        </aside>
        <div className="article-body">
          <div className="verdict"><span>Direct answer</span><p>{publication.directAnswer}</p></div>
          <div className="takeaway-box"><span>What to remember</span><ul>{publication.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></div>
          {publication.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><p className="section-count">0{index + 1}</p><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
          <section id="references">
            <p className="section-count">References</p>
            <h2>Sources behind this record</h2>
            {publication.citations.length > 0 ? <ol>{publication.citations.map((citation) => <li key={citation.id}><a href={citation.url}>{citation.title}</a> — {citation.publisher}{citation.accessedAt ? ` (accessed ${formatPublicationDate(citation.accessedAt)})` : ""}</li>)}</ol> : <p>No external references are claimed for this desk-analysis or documented-practice record. Its evidence level and claim limits remain explicit.</p>}
          </section>
          <section id="corrections">
            <p className="section-count">Corrections</p>
            <h2>Correction history</h2>
            {publication.correctionHistory.length > 0 ? <ul>{publication.correctionHistory.map((correction) => <li key={`${correction.date}-${correction.summary}`}><time dateTime={correction.date}>{formatPublicationDate(correction.date)}</time>: {correction.summary}</li>)}</ul> : <p>No corrections recorded.</p>}
            <p>To report an error, use the <Link href="/about#corrections">public corrections path</Link>.</p>
          </section>
          <div className="article-end"><span>Claim limit</span>{publication.claimLimits.map((limit) => <p key={limit}>{limit}</p>)}</div>
        </div>
      </div>
    </article>
    <section className="related-section section"><div className="shell"><p className="eyebrow">Continue the series</p><div className="related-grid">{related.map((item) => <Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.format}</span><h2>{item.title}</h2><p>{item.readTime} →</p></Link>)}</div></div></section>
  </main><SiteFooter /></>;
}
