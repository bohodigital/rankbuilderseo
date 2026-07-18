import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossary, glossaryBySlug } from "../../content/glossary";
import { formatPublicationDate } from "../../content/registry";
import { glossaryStructuredData, serializeStructuredData } from "../../content/structured-data";
import { sharedOpenGraph } from "../../metadata";
import { SiteFooter, SiteHeader } from "../../site-chrome";

export function generateStaticParams() {
  return glossary.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = glossaryBySlug.get(slug);
  const canonical = `https://rankbuilderseo.com/glossary/${entry?.slug ?? slug}`;
  return entry ? {
    title: `${entry.term} definition`,
    description: entry.short,
    alternates: { canonical },
    openGraph: {
      ...sharedOpenGraph,
      type: "website",
      url: canonical,
      title: `${entry.term} definition`,
      description: entry.short,
    },
  } : {};
}

export default async function GlossaryEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = glossaryBySlug.get(slug);
  if (!entry) notFound();

  return <><SiteHeader /><main id="main-content">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(glossaryStructuredData(entry)) }}
    />
    <section className="page-hero shell">
      <p className="eyebrow">{entry.category} / Glossary definition</p>
      <h1>{entry.term}</h1>
      <p>{entry.short}</p>
    </section>
    <section className="section shell glossary-explorer">
      <article className="glossary-entry">
        <div className="glossary-index" aria-hidden="true">{entry.term.charAt(0)}</div>
        <div className="glossary-copy">
          <h2>Operational meaning</h2>
          <p>{entry.full}</p>
          <div className="myth"><span>Common misunderstanding</span><p>{entry.myth}</p></div>
          <h2>References</h2>
          {entry.citations.length > 0 ? <ol>{entry.citations.map((citation) => <li key={citation.id}><a href={citation.url}>{citation.title}</a> — {citation.publisher}{citation.accessedAt ? ` (accessed ${formatPublicationDate(citation.accessedAt)})` : ""}</li>)}</ol> : <p>No external reference is claimed for this plain-language definition.</p>}
          <p><Link href={`/glossary#${entry.slug}`}>Return to this term in the glossary index →</Link></p>
        </div>
      </article>
    </section>
  </main><SiteFooter /></>;
}
