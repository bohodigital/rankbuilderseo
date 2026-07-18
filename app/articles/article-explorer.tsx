"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Publication } from "../content/registry";

export function ArticleExplorer({ articles }: { articles: Publication[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(articles.map((article) => article.category)))];
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const inCategory = category === "All" || article.category === category;
      const inSearch = !needle || [article.title, article.description, article.category, article.format, article.series]
        .join(" ").toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
  }, [articles, category, query]);

  return (
    <div className="article-explorer">
      <div className="archive-controls">
        <label>
          <span>Search the desk</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try canonicals, reporting, pricing…" />
        </label>
        <div className="category-filters" aria-label="Filter articles by category">
          {categories.map((item) => (
            <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="archive-count"><span>{String(visible.length).padStart(2, "0")} articles</span><span>{category === "All" ? "Complete archive" : category}</span></div>
      <div className="article-card-grid">
        {visible.map((article, index) => (
          <Link className="article-card" href={`/articles/${article.slug}`} key={article.slug}>
            <div className="article-card-top"><span>{article.format}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <p className="article-series">{article.series}</p>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <div className="article-card-bottom"><span>{article.category}</span><span>{article.readTime} ↗</span></div>
          </Link>
        ))}
      </div>
      {visible.length === 0 && <p className="empty-state">No article matches that combination yet.</p>}
    </div>
  );
}
