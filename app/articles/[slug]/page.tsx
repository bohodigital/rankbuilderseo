import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../../data";
import { SiteFooter, SiteHeader } from "../../site-chrome";

export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.published, modifiedTime: article.updated },
  } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== article.slug && (item.series === article.series || item.category === article.category)).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated,
    author: { "@type": "Organization", name: "Rank Builder SEO Research Desk" },
    publisher: { "@type": "Organization", name: "Rank Builder SEO" },
    mainEntityOfPage: `https://rankbuilderseo.com/articles/${article.slug}`,
  };

  return <><SiteHeader /><main id="main-content">
    <article className="article-shell shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="article-header">
        <p className="eyebrow">{article.category} / {article.format}</p>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <div className="article-byline"><span>Rank Builder research desk</span><span>{article.readTime}</span><span>Updated {article.updated}</span></div>
      </header>
      <div className="article-layout">
        <aside className="article-rail">
          <p>Article record</p>
          <div className="rail-record"><span>Series</span><b>{article.series}</b></div>
          <div className="rail-record"><span>Evidence</span><b>{article.evidence}</b></div>
          <div className="rail-record"><span>For</span><b>{article.audience}</b></div>
          <p className="rail-heading">On this page</p>
          {article.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}
          <Link href="/method">How we research ↗</Link>
        </aside>
        <div className="article-body">
          <div className="verdict"><span>Direct answer</span><p>{article.verdict}</p></div>
          <div className="takeaway-box"><span>What to remember</span><ul>{article.keyTakeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></div>
          {article.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><p className="section-count">0{index + 1}</p><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
          <div className="article-end"><span>Claim limit</span><p>This article is a decision aid, not a universal ranking rule. Verify the conditions on your own site and preserve a baseline before changing them.</p></div>
        </div>
      </div>
    </article>
    <section className="related-section section"><div className="shell"><p className="eyebrow">Continue the series</p><div className="related-grid">{related.map((item) => <Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.format}</span><h2>{item.title}</h2><p>{item.readTime} →</p></Link>)}</div></div></section>
  </main><SiteFooter /></>;
}
