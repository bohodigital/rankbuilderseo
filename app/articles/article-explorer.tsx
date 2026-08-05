"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ArticleArchiveItem = {
  slug: string;
  title: string;
  description: string;
  format: string;
  category: string;
  series: string;
  readTime: string;
};

export type ArticleTopicOption = {
  slug: string;
  title: string;
};

export function ArticleExplorer({
  articles,
  topics,
  topicAssignments,
}: {
  articles: ArticleArchiveItem[];
  topics: ArticleTopicOption[];
  topicAssignments: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const topicBySlug = useMemo(() => new Map(topics.map((item) => [item.slug, item])), [topics]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const assignedTopic = topicBySlug.get(topicAssignments[article.slug]);
      const inTopic = topic === "All" || assignedTopic?.slug === topic;
      const inSearch = !needle || [article.title, article.description, article.category, article.format, article.series, assignedTopic?.title ?? ""]
        .join(" ").toLowerCase().includes(needle);
      return inTopic && inSearch;
    });
  }, [articles, query, topic, topicAssignments, topicBySlug]);

  return (
    <div className="article-explorer">
      <div className="archive-controls">
        <div className="search-control">
          <label htmlFor="article-search">Search the desk</label>
          <input id="article-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try canonicals, reporting, pricing…" />
          {query && <button className="search-clear" type="button" onClick={() => setQuery("")} aria-label="Clear article search">Clear</button>}
        </div>
        <div className="category-filters" aria-label="Filter articles by topic">
          {["All", ...topics.map((item) => item.slug)].map((slug) => (
            <button type="button" className={topic === slug ? "active" : ""} aria-pressed={topic === slug} onClick={() => setTopic(slug)} key={slug}>
              {slug === "All" ? "All topics" : topicBySlug.get(slug)?.title}
            </button>
          ))}
        </div>
      </div>
      <div className="archive-count"><span>{String(visible.length).padStart(2, "0")} articles</span><span>{topic === "All" ? "Complete archive" : topicBySlug.get(topic)?.title}</span></div>
      <div className="article-card-grid">
        {visible.map((article, index) => (
          <Link className="article-card" href={`/articles/${article.slug}`} key={article.slug}>
            <div className="article-card-top"><span>{article.format}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <p className="article-series">{topicBySlug.get(topicAssignments[article.slug])?.title ?? article.series}</p>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <div className="article-card-bottom"><span>{article.category}</span><span>{article.readTime} →</span></div>
          </Link>
        ))}
      </div>
      {visible.length === 0 && <p className="empty-state">No article matches that combination yet.</p>}
    </div>
  );
}
