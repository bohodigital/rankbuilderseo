import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "../../data";
import { SiteFooter, SiteHeader } from "../../site-chrome";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  return guide ? { title: guide.title, description: guide.description } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <><SiteHeader /><main id="main-content">
    <article className="article-shell shell">
      <header className="article-header"><p className="eyebrow">{guide.category} / Field note</p><h1>{guide.title}</h1><p>{guide.description}</p><div className="article-byline"><span>Rank Builder research desk</span><span>{guide.readTime}</span><span>Reviewed July 2026</span></div></header>
      <div className="article-layout">
        <aside className="article-rail"><p>On this page</p>{guide.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}<Link href="/method">How we research ↗</Link></aside>
        <div className="article-body">
          <div className="verdict"><span>Desk verdict</span><p>{guide.verdict}</p></div>
          {guide.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}><p className="section-count">0{index + 1}</p><h2>{section.heading}</h2>{section.paragraphs.map((p) => <p key={p}>{p}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
          <div className="article-end"><span>End note</span><p>This field note is a decision aid, not a universal ranking rule. Verify the conditions on your own site.</p></div>
        </div>
      </div>
    </article>
  </main><SiteFooter /></>;
}
