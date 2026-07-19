import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { publicationBySlug, publicationRouteBySlug, routePublications } from "../../content/publications";
import type { Publication } from "../../content/registry";
import { formatPublicationDate } from "../../content/registry";
import { articleStructuredData, serializeStructuredData } from "../../content/structured-data";
import { stableEntries } from "../../content/stable-keys";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { ArticleContent } from "../article-content";

function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function generateStaticParams() {
  return routePublications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = publicationRouteBySlug.get(slug);
  const publication = route?.exposure.route === "public" ? route.publication : undefined;
  const canonical = `https://rankbuilderseo.com/articles/${publication?.slug ?? slug}`;
  return publication ? {
    title: publication.title,
    description: publication.description,
    alternates: { canonical },
    robots: { index: route?.exposure.indexable ?? false, follow: true },
    openGraph: {
      ...sharedOpenGraph,
      type: "article",
      url: canonical,
      title: publication.title,
      description: publication.description,
      publishedTime: publication.publishedAt,
      modifiedTime: publication.revisedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: publication.title,
      description: publication.description,
      images: ["/og.png"],
    },
  } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = publicationRouteBySlug.get(slug);
  if (!route) notFound();
  if (route.exposure.route === "redirect") redirect(route.exposure.redirectTo!);
  const publication = route.publication;
  const related = publication.relatedContent
    .map((relatedSlug) => publicationBySlug.get(relatedSlug))
    .filter((item): item is Publication => Boolean(item));
  const relatedHeading = related.length > 0 && related.every((item) => item.series === publication.series)
    ? "Continue this series"
    : "Related reading";
  const isRevised = publication.revisedAt !== publication.publishedAt;
  const takeaways = stableEntries(publication.takeaways, `${publication.slug}-takeaway`, (takeaway) => takeaway);
  const corrections = stableEntries(
    publication.correctionHistory,
    `${publication.slug}-correction`,
    (correction) => `${correction.date}\u0000${correction.summary}`,
  );
  const claimLimits = stableEntries(publication.claimLimits, `${publication.slug}-claim-limit`, (limit) => limit);

  return <><SiteHeader /><main id="main-content">
    <article className="article-shell shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(articleStructuredData(publication)) }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/articles">Articles</Link><span aria-hidden="true">/</span><span aria-current="page">{publication.title}</span>
      </nav>
      <header className="article-header">
        <p className="eyebrow">{publication.category} / {publication.format}</p>
        <h1>{publication.title}</h1>
        <p>{publication.description}</p>
        <div className="article-byline">
          <span>{publication.author.name}</span>
          <span>Editor: {publication.editor.name}</span>
          <span>{publication.readTime}</span>
          <time dateTime={publication.publishedAt}>Published {formatPublicationDate(publication.publishedAt)}</time>
          {isRevised && <time dateTime={publication.revisedAt}>Revised {formatPublicationDate(publication.revisedAt)}</time>}
        </div>
      </header>
      <div className="article-layout">
        <aside className="article-rail">
          <p>Article record</p>
          <div className="rail-record"><span>Series</span><b>{publication.series}</b></div>
          <div className="rail-record"><span>Evidence</span><b>{publication.evidenceLevel}</b></div>
          <div className="rail-record"><span>For</span><b>{publication.audience}</b></div>
          <nav aria-label="On this page">
            <p className="rail-heading">On this page</p>
            {publication.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>{sectionNumber(index)}</span>{section.heading}</a>)}
            <a href="#references">References</a>
            <a href="#corrections">Corrections</a>
          </nav>
          <Link href="/method">How we research</Link>
        </aside>
        <div className="article-body">
          <div className="verdict"><span>Direct answer</span><p>{publication.directAnswer}</p></div>
          <div className="takeaway-box"><span>What to remember</span><ul>{takeaways.map((entry) => <li key={entry.key}>{entry.value}</li>)}</ul></div>
          <ArticleContent publication={publication} />
          <section id="references">
            <p className="section-count">References</p>
            <h2>Sources behind this record</h2>
            {publication.citations.length > 0 ? <ol>{publication.citations.map((citation) => <li id={`reference-${citation.id}`} key={citation.id}><a href={citation.url} rel="noopener noreferrer external">{citation.title}</a> — {citation.publisher}{citation.accessedAt ? ` (accessed ${formatPublicationDate(citation.accessedAt)})` : ""}</li>)}</ol> : <p>No external references are claimed for this desk-analysis or documented-practice record. Its evidence level and claim limits remain explicit.</p>}
          </section>
          <section id="corrections">
            <p className="section-count">Corrections</p>
            <h2>Correction history</h2>
            {corrections.length > 0 ? <ul>{corrections.map((entry) => <li key={entry.key}><time dateTime={entry.value.date}>{formatPublicationDate(entry.value.date)}</time>: {entry.value.summary}</li>)}</ul> : <p>No corrections recorded.</p>}
            <p>To report an error, use the <Link href="/about#corrections">public corrections path</Link>.</p>
          </section>
          <div className="article-end"><span>Claim limit</span>{claimLimits.map((entry) => <p key={entry.key}>{entry.value}</p>)}</div>
        </div>
      </div>
    </article>
    {related.length > 0 && <section className="related-section section"><div className="shell"><p className="eyebrow">{relatedHeading}</p><div className="related-grid">{related.map((item) => <Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.format}</span><h2>{item.title}</h2><p>{item.readTime} →</p></Link>)}</div></div></section>}
  </main><SiteFooter /></>;
}
