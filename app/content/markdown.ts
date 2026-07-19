export type TextInline = { type: "text"; value: string };
export type CodeInline = { type: "code"; value: string };
export type CitationInline = { type: "citation"; id: string };
export type StyledInline =
  | { type: "strong"; children: InlineNode[] }
  | { type: "emphasis"; children: InlineNode[] };
export type LinkInline = { type: "link"; href: string; children: InlineNode[] };
export type InlineNode = TextInline | CodeInline | CitationInline | StyledInline | LinkInline;

export type HeadingBlock = { type: "heading"; id: string; text: string; children: InlineNode[] };
export type ParagraphBlock = { type: "paragraph"; children: InlineNode[] };
export type ListBlock = { type: "list"; ordered: boolean; items: InlineNode[][] };
export type CodeBlock = { type: "code"; language?: string; value: string };
export type QuoteBlock = { type: "blockquote"; callout?: "note" | "tip" | "warning"; children: InlineNode[] };
export type TableBlock = { type: "table"; header: InlineNode[][]; rows: InlineNode[][][] };
export type FigureBlock = { type: "figure"; alt: string; src: string; caption: string };
export type MarkdownBlock = HeadingBlock | ParagraphBlock | ListBlock | CodeBlock | QuoteBlock | TableBlock | FigureBlock;

export type MarkdownSection = {
  id: string;
  heading: string;
  headingInlines: InlineNode[];
  blocks: Exclude<MarkdownBlock, HeadingBlock>[];
  paragraphs: string[];
  bullets?: string[];
};

export type SafeMarkdownDocument = {
  blocks: MarkdownBlock[];
  sections: MarkdownSection[];
  citationIds: string[];
  fragmentLinks: string[];
  figures: FigureBlock[];
  wordCount: number;
};

type ParseContext = {
  label: string;
  citations: string[];
  fragments: string[];
};

function fail(label: string, message: string): never {
  throw new Error(`${label}: ${message}`);
}

function nonEmpty(value: string, label: string): string {
  if (!value.trim()) fail(label, "must not be empty");
  return value;
}

export function headingSlug(value: string): string {
  const result = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!result) throw new Error(`heading cannot produce a stable anchor: ${value}`);
  return result;
}

export function isSafeLinkTarget(raw: string): boolean {
  if (/^#[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw)) return true;
  if (/^\/(?!\/)[A-Za-z0-9/_-]*(?:#[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(raw)) return true;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isSafeMediaSource(raw: string): boolean {
  return /^\/(?!\/)[A-Za-z0-9/_-]+\.(?:png|jpe?g|webp|svg)$/.test(raw);
}

function inlineText(nodes: readonly InlineNode[]): string {
  return nodes.map((node) => {
    if (node.type === "text" || node.type === "code") return node.value;
    if (node.type === "citation") return "";
    return inlineText(node.children);
  }).join("");
}

function findClosing(source: string, token: string, from: number, label: string): number {
  const end = source.indexOf(token, from);
  if (end < 0) fail(label, `unclosed ${token} inline construct`);
  return end;
}

function parseInline(source: string, context: ParseContext, nested = false): InlineNode[] {
  const nodes: InlineNode[] = [];
  let index = 0;

  while (index < source.length) {
    if (source[index] === "`" && !source.startsWith("```", index)) {
      const end = findClosing(source, "`", index + 1, context.label);
      nodes.push({ type: "code", value: nonEmpty(source.slice(index + 1, end), `${context.label} inline code`) });
      index = end + 1;
      continue;
    }

    if (source.startsWith("[@", index)) {
      const end = findClosing(source, "]", index + 2, context.label);
      const id = source.slice(index + 2, end);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(context.label, `invalid citation id: ${id}`);
      context.citations.push(id);
      nodes.push({ type: "citation", id });
      index = end + 1;
      continue;
    }

    if (source[index] === "[") {
      const labelEnd = findClosing(source, "]", index + 1, context.label);
      if (source[labelEnd + 1] !== "(") fail(context.label, "reference links and unsupported bracket constructs are not allowed");
      const targetEnd = findClosing(source, ")", labelEnd + 2, context.label);
      const href = source.slice(labelEnd + 2, targetEnd);
      if (!isSafeLinkTarget(href)) fail(context.label, `unsafe or malformed link target: ${href}`);
      if (href.startsWith("#")) context.fragments.push(href.slice(1));
      nodes.push({
        type: "link",
        href,
        children: parseInline(nonEmpty(source.slice(index + 1, labelEnd), `${context.label} link label`), context, true),
      });
      index = targetEnd + 1;
      continue;
    }

    if (source.startsWith("**", index)) {
      const end = findClosing(source, "**", index + 2, context.label);
      nodes.push({
        type: "strong",
        children: parseInline(nonEmpty(source.slice(index + 2, end), `${context.label} bold text`), context, true),
      });
      index = end + 2;
      continue;
    }

    if (source[index] === "*") {
      const end = findClosing(source, "*", index + 1, context.label);
      nodes.push({
        type: "emphasis",
        children: parseInline(nonEmpty(source.slice(index + 1, end), `${context.label} italic text`), context, true),
      });
      index = end + 1;
      continue;
    }

    if (source[index] === "\\") fail(context.label, "backslash escapes are not supported");
    if (source[index] === "]") fail(context.label, "unmatched closing bracket");

    let end = index + 1;
    while (end < source.length && !"`[*\\]".includes(source[end])) end += 1;
    nodes.push({ type: "text", value: source.slice(index, end) });
    index = end;
  }

  if (nested && nodes.length === 0) fail(context.label, "inline construct must contain text");
  return nodes;
}

function splitTableRow(line: string, label: string): string[] {
  if (!line.startsWith("|") || !line.endsWith("|")) fail(label, "table rows must begin and end with |");
  const cells = line.slice(1, -1).split("|").map((cell) => cell.trim());
  if (cells.length < 2 || cells.some((cell) => !cell)) fail(label, "table rows need at least two non-empty cells");
  return cells;
}

function isTableDelimiter(line: string): boolean {
  if (!line.startsWith("|") || !line.endsWith("|")) return false;
  return line.slice(1, -1).split("|").every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function wordCountOf(value: string): number {
  return value.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function markdownPlainText(document: SafeMarkdownDocument): string {
  return document.blocks.map((block) => {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "blockquote":
        return inlineText(block.children);
      case "list":
        return block.items.map(inlineText).join(" ");
      case "code":
        return block.value;
      case "table":
        return [...block.header, ...block.rows.flat()].map(inlineText).join(" ");
      case "figure":
        return `${block.alt} ${block.caption}`;
    }
  }).join(" ");
}

function beginsBlock(line: string, nextLine = ""): boolean {
  return /^#{1,6}\s/.test(line)
    || /^```/.test(line)
    || /^>\s?/.test(line)
    || /^(?:-|\d+\.)\s/.test(line)
    || /^!\[/.test(line)
    || (line.startsWith("|") && isTableDelimiter(nextLine));
}

export function parseSafeMarkdown(body: string, label = "Markdown body"): SafeMarkdownDocument {
  const normalized = body.replace(/\r\n?/g, "\n").trim();
  if (!normalized) fail(label, "must not be empty");
  const lines = normalized.split("\n");
  const blocks: MarkdownBlock[] = [];
  const context: ParseContext = { label, citations: [], fragments: [] };
  const headingIds = new Set<string>();
  const headingTexts = new Set<string>();
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index];
    const line = raw.trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3);
      if (language && !/^[a-z0-9-]+$/.test(language)) fail(label, `invalid fenced-code language: ${language}`);
      const code: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== "```") {
        code.push(lines[index]);
        index += 1;
      }
      if (index >= lines.length) fail(label, "unclosed fenced code block");
      blocks.push({ type: "code", ...(language ? { language } : {}), value: code.join("\n") });
      index += 1;
      continue;
    }

    if (/<\/?(?:script|iframe|style|[A-Za-z][A-Za-z0-9.-]*)(?:\s|>|\/)/i.test(line) || /<!--|-->|<\?/.test(line)) {
      fail(label, "raw HTML, scripts, iframes, and component-like tags are not allowed");
    }
    if (/^\s{2,}(?:-|\d+\.)\s/.test(raw)) fail(label, "nested lists are not supported");
    if (/^(?:---|___|\*\*\*)$/.test(line)) fail(label, "thematic breaks are not supported");
    if (/^- \[[ xX]\]\s/.test(line)) fail(label, "task-list syntax is not supported");
    if (/^#{1,6}\s/.test(line) && !line.startsWith("## ")) fail(label, "only H2 headings are supported");

    if (line.startsWith("## ")) {
      const match = line.match(/^##\s+(.+?)(?:\s+\{#([a-z0-9]+(?:-[a-z0-9]+)*)\})?$/);
      if (!match) fail(label, `malformed H2 heading: ${line}`);
      const headingContext = { ...context, label: `${label} heading` };
      const children = parseInline(match[1], headingContext);
      const text = inlineText(children).trim();
      const normalizedHeading = text.toLocaleLowerCase("en-US");
      if (headingTexts.has(normalizedHeading)) fail(label, `duplicate heading: ${text}`);
      headingTexts.add(normalizedHeading);
      const id = match[2] ?? headingSlug(text);
      if (headingIds.has(id)) fail(label, `duplicate heading anchor: ${id}`);
      headingIds.add(id);
      blocks.push({ type: "heading", id, text, children });
      index += 1;
      continue;
    }

    if (line.startsWith("![")) {
      const match = line.match(/^!\[([^\]]+)\]\(([^\s)]+)\s+"([^"]+)"\)$/);
      if (!match) fail(label, "figures must use ![alt](/local/path.ext \"caption\") on their own line");
      if (!isSafeMediaSource(match[2])) fail(label, `unsafe or unsupported figure source: ${match[2]}`);
      blocks.push({ type: "figure", alt: match[1], src: match[2], caption: match[3] });
      index += 1;
      continue;
    }

    if (/^(?:-|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items: InlineNode[][] = [];
      while (index < lines.length) {
        const itemLine = lines[index].trim();
        const match = ordered ? itemLine.match(/^\d+\.\s+(.+)$/) : itemLine.match(/^-\s+(.+)$/);
        if (!match) break;
        items.push(parseInline(match[1], { ...context, label: `${label} list item ${items.length + 1}` }));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        const value = lines[index].trim().replace(/^>\s?/, "");
        quoteLines.push(value);
        index += 1;
      }
      let callout: QuoteBlock["callout"];
      const marker = quoteLines[0]?.match(/^\[!(NOTE|TIP|WARNING)\]$/);
      if (marker) {
        callout = marker[1].toLowerCase() as QuoteBlock["callout"];
        quoteLines.shift();
      }
      const value = nonEmpty(quoteLines.join(" "), `${label} blockquote`);
      blocks.push({ type: "blockquote", ...(callout ? { callout } : {}), children: parseInline(value, { ...context, label: `${label} blockquote` }) });
      continue;
    }

    if (line.startsWith("|") && isTableDelimiter(lines[index + 1]?.trim() ?? "")) {
      const headers = splitTableRow(line, `${label} table header`);
      const delimiter = splitTableRow(lines[index + 1].trim(), `${label} table delimiter`);
      if (headers.length !== delimiter.length) fail(label, "table delimiter column count must match the header");
      index += 2;
      const rows: InlineNode[][][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        const cells = splitTableRow(lines[index].trim(), `${label} table row ${rows.length + 1}`);
        if (cells.length !== headers.length) fail(label, `table row ${rows.length + 1} has the wrong column count`);
        rows.push(cells.map((cell, cellIndex) => parseInline(cell, { ...context, label: `${label} table row ${rows.length + 1} cell ${cellIndex + 1}` })));
        index += 1;
      }
      if (rows.length === 0) fail(label, "table must contain at least one data row");
      blocks.push({
        type: "table",
        header: headers.map((cell, cellIndex) => parseInline(cell, { ...context, label: `${label} table header cell ${cellIndex + 1}` })),
        rows,
      });
      continue;
    }

    if (/^\{?[A-Z][A-Za-z0-9]*(?:\s|\{|$)/.test(line) && /[{}]/.test(line)) {
      fail(label, "arbitrary components and brace directives are not supported");
    }
    if (line.startsWith("|") || isTableDelimiter(line)) fail(label, "malformed or unsupported table syntax");

    const paragraph: string[] = [];
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (!candidate || beginsBlock(candidate, lines[index + 1]?.trim() ?? "")) break;
      if (/<\/?[A-Za-z!]/.test(candidate)) fail(label, "raw HTML is not allowed");
      paragraph.push(candidate);
      index += 1;
    }
    if (paragraph.length === 0) fail(label, `unsupported Markdown construct: ${line}`);
    blocks.push({ type: "paragraph", children: parseInline(paragraph.join(" "), { ...context, label: `${label} paragraph` }) });
  }

  if (blocks.length === 0 || blocks[0].type !== "heading") fail(label, "body content must begin with an H2 section");
  const headings = blocks.filter((block): block is HeadingBlock => block.type === "heading");
  if (headings.length === 0) fail(label, "must contain at least one H2 section");
  for (const fragment of context.fragments) {
    if (!headingIds.has(fragment) && fragment !== "references" && fragment !== "corrections") {
      fail(label, `internal fragment does not match a heading: #${fragment}`);
    }
  }

  const sections: MarkdownSection[] = [];
  for (const block of blocks) {
    if (block.type === "heading") {
      sections.push({ id: block.id, heading: block.text, headingInlines: block.children, blocks: [], paragraphs: [] });
      continue;
    }
    const section = sections.at(-1);
    if (!section) fail(label, "body content must begin with an H2 section");
    section.blocks.push(block);
    if (block.type === "paragraph") section.paragraphs.push(inlineText(block.children));
    if (block.type === "list" && !block.ordered) {
      section.bullets ??= [];
      section.bullets.push(...block.items.map(inlineText));
    }
  }

  const document: SafeMarkdownDocument = {
    blocks,
    sections,
    citationIds: context.citations,
    fragmentLinks: context.fragments,
    figures: blocks.filter((block): block is FigureBlock => block.type === "figure"),
    wordCount: 0,
  };
  document.wordCount = wordCountOf(markdownPlainText(document));
  return document;
}

export function renderedWordCount(...values: Array<string | SafeMarkdownDocument | readonly string[]>): number {
  return values.reduce<number>((total, value) => {
    if (typeof value === "string") return total + wordCountOf(value);
    if (Array.isArray(value)) return total + value.reduce((sum, item) => sum + wordCountOf(item), 0);
    return total + (value as SafeMarkdownDocument).wordCount;
  }, 0);
}
