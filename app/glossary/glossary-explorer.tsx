"use client";
import { useMemo, useState } from "react";
import { glossary } from "../data";

export function GlossaryExplorer() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => glossary.filter((entry) => `${entry.term} ${entry.category} ${entry.short}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <section className="section shell glossary-explorer">
    <label className="search-box"><span>Search the index</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “indexing” or “measurement”" /><b aria-hidden="true">⌕</b></label>
    <div className="glossary-count"><span>{String(filtered.length).padStart(2, "0")} terms</span><span>Sources and limits live inside every definition.</span></div>
    <div className="glossary-list">
      {filtered.map((entry, index) => <article id={entry.slug} className="glossary-entry" key={entry.slug}><div className="glossary-index">{String(index + 1).padStart(2, "0")}</div><div className="glossary-copy"><div className="meta-row"><span>{entry.category}</span></div><h2>{entry.term}</h2><p className="definition-short">{entry.short}</p><p>{entry.full}</p><div className="myth"><span>Common misunderstanding</span><p>{entry.myth}</p></div></div></article>)}
      {filtered.length === 0 && <p className="empty-state">No clean match. Try a broader term.</p>}
    </div>
  </section>;
}
