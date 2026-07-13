import type { Metadata } from "next";
import { GlossaryExplorer } from "./glossary-explorer";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = { title: "SEO glossary", description: "Plain-language SEO and web definitions with the decision-changing detail and common misunderstanding." };

export default function GlossaryPage() {
  return <><SiteHeader /><main id="main-content"><section className="page-hero shell"><p className="eyebrow">Plain-language index / 012</p><h1>Words people use<br />when they want leverage.</h1><p>The short answer, the operational meaning, and the common misunderstanding—without glossary sludge.</p></section><GlossaryExplorer /></main><SiteFooter /></>;
}
