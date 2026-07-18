import type { Metadata } from "next";
import { glossary } from "../content/glossary";
import { sharedOpenGraph } from "../metadata";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { GlossaryExplorer } from "./glossary-explorer";

export const metadata: Metadata = {
  title: "SEO glossary",
  description: "Plain-language SEO and web definitions with the decision-changing detail and common misunderstanding.",
  alternates: { canonical: "https://rankbuilderseo.com/glossary" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "https://rankbuilderseo.com/glossary",
    title: "SEO glossary",
    description: "Plain-language SEO and web definitions with the decision-changing detail and common misunderstanding.",
  },
};

export default function GlossaryPage() {
  return <><SiteHeader /><main id="main-content"><section className="page-hero shell"><p className="eyebrow">Plain-language index / {String(glossary.length).padStart(3, "0")}</p><h1>Words people use<br />when they want leverage.</h1><p>The short answer, the operational meaning, and the common misunderstanding—without glossary sludge.</p></section><GlossaryExplorer entries={glossary} /></main><SiteFooter /></>;
}
