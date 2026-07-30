import { legacyGuideRedirects } from "./legacy-guide-redirects.ts";
import { documentLinkTargets, publicationExposure, type GlossaryEntry, type Publication, type Topic } from "./registry.ts";
import type { ToolRecord } from "./tool-records.ts";

export type SiteEdgeKind =
  | "contextual-article"
  | "related-reading"
  | "topic-parent"
  | "navigation"
  | "tool-link"
  | "glossary-link"
  | "static-page"
  | "home-feature"
  | "redirect";

export type SiteGraphEdge = {
  from: string;
  to: string;
  kind: SiteEdgeKind;
};

export type ApplicationSource = {
  path: string;
  source: string;
};

export type SiteGraphReport = {
  nodeCount: number;
  edgeCount: number;
  inboundCounts: Record<string, number>;
  outboundCounts: Record<string, number>;
  orphans: string[];
  deadEnds: string[];
  redirectingInternalLinks: SiteGraphEdge[];
  weaklyConnectedNodes: string[];
  topLinkedPages: Array<{ route: string; inbound: number }>;
  topicMembership: Record<string, string>;
  connectedComponents: string[][];
};

const fixedPublicRoutes = [
  "/",
  "/about",
  "/articles",
  "/glossary",
  "/lab",
  "/method",
  "/privacy",
  "/tools",
  "/topics",
];
const globalNavigationRoutes = ["/topics", "/articles", "/tools", "/glossary", "/lab", "/method", "/about", "/privacy"];
const staticDownloadRoutes = new Set([
  "/downloads/crawl-evidence-report-template.md",
  "/downloads/crawl-stats-investigation-template.csv",
  "/downloads/google-request-verification-checklist.md",
  "/downloads/googlebot-log-analysis-template.csv",
  "/downloads/googlebot-log-field-dictionary.md",
  "/downloads/orphan-page-audit-template.csv",
  "/downloads/url-parameter-audit-template.csv",
]);

function fail(label: string, message: string): never {
  throw new Error(`${label}: ${message}`);
}

export function canonicalPublicRouteSet(
  publications: readonly Publication[],
  glossary: readonly GlossaryEntry[],
  topics: readonly Topic[],
  tools: readonly ToolRecord[],
  at = new Date(),
): Set<string> {
  return new Set([
    ...fixedPublicRoutes,
    ...publications
      .filter((publication) => publicationExposure(publication, at).route === "public")
      .map((publication) => `/articles/${publication.slug}`),
    ...glossary.map((entry) => `/glossary/${entry.slug}`),
    ...topics.map((topic) => `/topics/${topic.slug}`),
    ...tools.map((tool) => tool.href),
  ]);
}

export function internalRedirectMap(publications: readonly Publication[]): Map<string, string> {
  return new Map([
    ["/guides", "/articles"],
    ...Object.entries(legacyGuideRedirects).map(([slug, target]) => [`/guides/${slug}`, target] as const),
    ...publications
      .filter((publication) => publication.state === "archived" && publication.archiveDisposition !== "retained-public" && publication.archiveTarget)
      .map((publication) => [`/articles/${publication.slug}`, publication.archiveTarget!] as const),
  ]);
}

export function canonicalInternalRoute(
  href: string,
  routes: ReadonlySet<string>,
  redirects: ReadonlyMap<string, string>,
  label: string,
): string | undefined {
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return undefined;
  let route = href;
  if (/^https?:\/\//i.test(href)) {
    const url = new URL(href);
    if (url.hostname !== "rankbuilderseo.com" && url.hostname !== "www.rankbuilderseo.com") return undefined;
    if (url.protocol !== "https:" || url.hostname !== "rankbuilderseo.com" || url.port) {
      fail(label, `internal absolute URL must use https://rankbuilderseo.com: ${href}`);
    }
    route = `${url.pathname}${url.search}${url.hash}`;
  }
  if (!route.startsWith("/")) return undefined;
  const url = new URL(route, "https://rankbuilderseo.com");
  if (url.pathname.startsWith("/downloads/")) {
    if (!staticDownloadRoutes.has(url.pathname)) fail(label, `internal download has no registered static asset: ${href}`);
    return undefined;
  }
  if (
    url.pathname.startsWith("/media/")
    || url.pathname.startsWith("/assets/")
    || url.pathname.startsWith("/api/")
    || /\.(?:avif|gif|ico|jpe?g|png|svg|webmanifest|webp)$/i.test(url.pathname)
  ) return undefined;
  if (url.pathname !== "/" && url.pathname.endsWith("/")) fail(label, `noncanonical trailing slash: ${href}`);
  if (redirects.has(url.pathname)) fail(label, `internal route points through redirect: ${href} -> ${redirects.get(url.pathname)}`);
  if (!routes.has(url.pathname)) fail(label, `internal route has no generated destination: ${href}`);
  return url.pathname;
}

function sourceRoute(path: string): string | undefined {
  const match = path.match(/^app\/(.+)\/page\.tsx$/);
  if (!match) return path === "app/page.tsx" ? "/" : undefined;
  if (match[1].includes("[")) return undefined;
  return `/${match[1]}`;
}

export function validateApplicationRouteSources(
  sources: readonly ApplicationSource[],
  routes: ReadonlySet<string>,
  redirects: ReadonlyMap<string, string>,
): Array<{ from: string; to: string }> {
  const links: Array<{ from: string; to: string }> = [];
  for (const { path, source } of sources) {
    const from = sourceRoute(path);
    for (const match of source.matchAll(/<(?:Link|a)\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')[^>]*>/g)) {
      const href = match[1] ?? match[2];
      const to = canonicalInternalRoute(href, routes, redirects, path);
      if (from && to) links.push({ from, to });
    }
    for (const match of source.matchAll(/\b(?:canonical|url):\s*(?:"([^"]+)"|'([^']+)')/g)) {
      canonicalInternalRoute(match[1] ?? match[2], routes, redirects, path);
    }
    if (path === "app/sitemap.ts") {
      for (const match of source.matchAll(/(?:"(\/[^"]*)"|'(\/[^']*)')/g)) {
        canonicalInternalRoute(match[1] ?? match[2], routes, redirects, path);
      }
    }
  }
  return links;
}

function edgeKey(edge: SiteGraphEdge): string {
  return `${edge.from}\u0000${edge.to}\u0000${edge.kind}`;
}

export function buildSiteGraph(
  publications: readonly Publication[],
  glossary: readonly GlossaryEntry[],
  topics: readonly Topic[],
  tools: readonly ToolRecord[],
  applicationLinks: readonly { from: string; to: string }[] = [],
  at = new Date(),
): { edges: SiteGraphEdge[]; report: SiteGraphReport } {
  const nodes = canonicalPublicRouteSet(publications, glossary, topics, tools, at);
  const redirects = internalRedirectMap(publications);
  const publicPublications = publications.filter((publication) => publicationExposure(publication, at).route === "public");
  const topicMembership = Object.fromEntries(
    topics.flatMap((topic) => topic.primaryPublications.map((slug) => [`/articles/${slug}`, `/topics/${topic.slug}`] as const)),
  );
  const edges = new Map<string, SiteGraphEdge>();
  const add = (edge: SiteGraphEdge) => {
    if (!nodes.has(edge.to) && edge.kind !== "redirect") fail("site graph", `edge has no public destination: ${edge.from} -> ${edge.to}`);
    edges.set(edgeKey(edge), edge);
  };

  for (const route of nodes) {
    for (const destination of globalNavigationRoutes) {
      if (route !== destination) add({ from: route, to: destination, kind: "navigation" });
    }
  }
  for (const { from, to } of applicationLinks) {
    if (!nodes.has(from) || from === to) continue;
    add({
      from,
      to,
      kind: from === "/" && to.startsWith("/articles/")
        ? "home-feature"
        : from.startsWith("/tools/") && to.startsWith("/articles/")
          ? "tool-link"
          : "static-page",
    });
  }
  for (const publication of publicPublications) {
    const from = `/articles/${publication.slug}`;
    for (const href of documentLinkTargets(publication.document)) {
      const to = canonicalInternalRoute(href, nodes, redirects, publication.sourceFile);
      if (!to || to === from) continue;
      add({
        from,
        to,
        kind: to.startsWith("/articles/")
          ? "contextual-article"
          : to.startsWith("/glossary/")
            ? "glossary-link"
            : to.startsWith("/tools/")
              ? "tool-link"
              : "static-page",
      });
    }
    for (const relatedSlug of publication.relatedContent) {
      const to = `/articles/${relatedSlug}`;
      if (nodes.has(to)) add({ from, to, kind: "related-reading" });
    }
    const parent = topicMembership[from];
    if (parent) add({ from, to: parent, kind: "topic-parent" });
  }
  for (const topic of topics) {
    const from = `/topics/${topic.slug}`;
    add({ from: "/topics", to: from, kind: "navigation" });
    for (const publicationSlug of [...topic.primaryPublications, ...topic.secondaryPublications]) {
      add({ from, to: `/articles/${publicationSlug}`, kind: "topic-parent" });
    }
    for (const tool of topic.relatedTools) add({ from, to: tool, kind: "tool-link" });
    for (const route of topic.relatedRoutes) add({ from, to: route, kind: "static-page" });
    for (const glossarySlug of topic.relatedGlossary) add({ from, to: `/glossary/${glossarySlug}`, kind: "glossary-link" });
  }
  for (const tool of tools) add({ from: "/tools", to: tool.href, kind: "tool-link" });
  for (const publication of publicPublications) add({ from: "/articles", to: `/articles/${publication.slug}`, kind: "navigation" });
  for (const entry of glossary) add({ from: "/glossary", to: `/glossary/${entry.slug}`, kind: "navigation" });
  for (const [from, to] of redirects) add({ from, to, kind: "redirect" });

  const edgeList = [...edges.values()];
  const inboundCounts = Object.fromEntries([...nodes].map((route) => [route, 0]));
  const outboundCounts = Object.fromEntries([...nodes].map((route) => [route, 0]));
  for (const edge of edgeList) {
    if (edge.kind === "redirect") continue;
    if (edge.to in inboundCounts) inboundCounts[edge.to] += 1;
    if (edge.from in outboundCounts) outboundCounts[edge.from] += 1;
  }
  const orphans = [...nodes].filter((route) => inboundCounts[route] === 0 && route !== "/").sort();
  const deadEnds = [...nodes].filter((route) => outboundCounts[route] === 0).sort();
  const redirectingInternalLinks = edgeList.filter((edge) => edge.kind !== "redirect" && redirects.has(edge.to));
  const weaklyConnectedNodes = [...nodes].filter((route) => inboundCounts[route] <= 1).sort();

  const adjacency = new Map([...nodes].map((route) => [route, new Set<string>()]));
  for (const edge of edgeList) {
    if (edge.kind === "redirect" || !nodes.has(edge.from) || !nodes.has(edge.to)) continue;
    adjacency.get(edge.from)!.add(edge.to);
    adjacency.get(edge.to)!.add(edge.from);
  }
  const unvisited = new Set(nodes);
  const connectedComponents: string[][] = [];
  while (unvisited.size > 0) {
    const first = unvisited.values().next().value as string;
    const stack = [first];
    const component: string[] = [];
    unvisited.delete(first);
    while (stack.length > 0) {
      const route = stack.pop()!;
      component.push(route);
      for (const neighbor of adjacency.get(route) ?? []) {
        if (!unvisited.delete(neighbor)) continue;
        stack.push(neighbor);
      }
    }
    connectedComponents.push(component.sort());
  }

  const report: SiteGraphReport = {
    nodeCount: nodes.size,
    edgeCount: edgeList.length,
    inboundCounts,
    outboundCounts,
    orphans,
    deadEnds,
    redirectingInternalLinks,
    weaklyConnectedNodes,
    topLinkedPages: Object.entries(inboundCounts)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "en-US"))
      .slice(0, 10)
      .map(([route, inbound]) => ({ route, inbound })),
    topicMembership,
    connectedComponents,
  };

  const additionalArticleInboundKinds = new Set<SiteEdgeKind>([
    "contextual-article",
    "related-reading",
    "tool-link",
    "home-feature",
  ]);
  for (const publication of publicPublications) {
    const route = `/articles/${publication.slug}`;
    const topicInbound = edgeList.filter((edge) => edge.to === route && edge.kind === "topic-parent");
    if (topicInbound.length === 0) fail("site graph", `${route} has no inbound topic-page link`);
    const additionalInbound = edgeList.filter((edge) => edge.to === route && additionalArticleInboundKinds.has(edge.kind));
    if (additionalInbound.length === 0) fail("site graph", `${route} has no additional contextual, related, tool, or homepage inbound link`);
    if (publication.authoringContract === "canonical-v1") {
      const onward = edgeList.filter((edge) => edge.from === route && [
        "contextual-article", "related-reading", "tool-link", "glossary-link",
      ].includes(edge.kind));
      if (onward.length === 0) fail("site graph", `${route} has no appropriate onward link`);
    }
  }
  for (const tool of tools) {
    const inboundFromTools = edgeList.some((edge) => edge.from === "/tools" && edge.to === tool.href);
    if (!inboundFromTools) fail("site graph", `${tool.href} has no inbound link from /tools`);
    const contextualArticles = new Set(edgeList
      .filter((edge) => edge.to === tool.href && edge.from.startsWith("/articles/") && edge.kind === "tool-link")
      .map((edge) => edge.from));
    if (contextualArticles.size < 2) fail("site graph", `${tool.href} has fewer than two contextual article links`);
  }
  if (orphans.length > 0) fail("site graph", `orphan public routes: ${orphans.join(", ")}`);
  if (deadEnds.length > 0) fail("site graph", `dead-end public routes: ${deadEnds.join(", ")}`);
  if (redirectingInternalLinks.length > 0) fail("site graph", "normal internal edges point through redirects");
  if (connectedComponents.length !== 1) fail("site graph", `public graph has ${connectedComponents.length} connected components`);
  return { edges: edgeList, report };
}
