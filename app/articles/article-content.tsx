import type { ReactNode } from "react";
import Image from "next/image";
import { mediaBySource } from "../content/registries";
import type { InlineNode, MarkdownBlock } from "../content/markdown";
import type { Publication } from "../content/registry";
import { semanticSignature, stableEntries } from "../content/stable-keys";

function inlineNodes(nodes: readonly InlineNode[], publication: Publication, scope: string): ReactNode[] {
  return stableEntries(nodes, scope, semanticSignature).map(({ key, value: node }) => {
    if (node.type === "text") return node.value;
    if (node.type === "code") return <code key={key}>{node.value}</code>;
    if (node.type === "strong") return <strong key={key}>{inlineNodes(node.children, publication, key)}</strong>;
    if (node.type === "emphasis") return <em key={key}>{inlineNodes(node.children, publication, key)}</em>;
    if (node.type === "link") {
      const external = node.href.startsWith("https://");
      return <a href={node.href} rel={external ? "noopener noreferrer external" : undefined} key={key}>
        {inlineNodes(node.children, publication, key)}
      </a>;
    }
    const number = publication.citations.findIndex(({ id }) => id === node.id) + 1;
    return <sup className="inline-citation" key={key}>
      <a href={`#reference-${node.id}`} aria-label={`Citation ${number}: ${publication.citations[number - 1]?.title ?? node.id}`}>[{number}]</a>
    </sup>;
  });
}

function renderBlock(block: Exclude<MarkdownBlock, { type: "heading" }>, publication: Publication, key: string) {
  if (block.type === "paragraph") return <p key={key}>{inlineNodes(block.children, publication, key)}</p>;
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return <List key={key}>{stableEntries(block.items, `${key}-item`, semanticSignature).map(({ key: itemKey, value: item }) => <li key={itemKey}>
      {inlineNodes(item, publication, itemKey)}
    </li>)}</List>;
  }
  if (block.type === "code") return <pre key={key}><code className={block.language ? `language-${block.language}` : undefined}>{block.value}</code></pre>;
  if (block.type === "blockquote") return <blockquote className={block.callout ? `callout callout-${block.callout}` : undefined} key={key}>
    {block.callout && <strong className="callout-label">{block.callout}</strong>}
    <p>{inlineNodes(block.children, publication, key)}</p>
  </blockquote>;
  if (block.type === "table") return <div className="article-table" key={key} tabIndex={0} role="region" aria-label="Scrollable comparison table">
    <table><thead><tr>{stableEntries(block.header, `${key}-head`, semanticSignature).map(({ key: cellKey, value: cell }) => <th scope="col" key={cellKey}>
      {inlineNodes(cell, publication, cellKey)}
    </th>)}</tr></thead><tbody>{stableEntries(block.rows, `${key}-row`, semanticSignature).map(({ key: rowKey, value: row }) => <tr key={rowKey}>
      {stableEntries(row, `${rowKey}-cell`, semanticSignature).map(({ key: cellKey, value: cell }) => <td key={cellKey}>
        {inlineNodes(cell, publication, cellKey)}
      </td>)}
    </tr>)}</tbody></table>
  </div>;
  const media = mediaBySource.get(block.src);
  if (!media) throw new Error(`Validated media record disappeared before render: ${block.src}`);
  return <figure key={key}>
    <Image src={media.src} alt={media.alt} width={media.width} height={media.height} />
    <figcaption>{media.caption} <span>Credit: {media.sourceUrl
      ? <a href={media.sourceUrl} rel="noopener noreferrer external">{media.credit}</a>
      : media.credit}</span></figcaption>
  </figure>;
}

export function ArticleContent({ publication }: { publication: Publication }) {
  return publication.sections.map((section, sectionIndex) => (
    <section key={`${publication.slug}-${section.id}`}>
      <p className="section-count">{String(sectionIndex + 1).padStart(2, "0")}</p>
      <h2 id={section.id}>{inlineNodes(section.headingInlines, publication, `${publication.slug}-${section.id}-heading`)}</h2>
      {stableEntries(section.blocks, `${publication.slug}-${section.id}-block`, semanticSignature)
        .map(({ key, value: block }) => renderBlock(block, publication, key))}
    </section>
  ));
}
