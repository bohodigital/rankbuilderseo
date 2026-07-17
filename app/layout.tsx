import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rankbuilderseo.com"),
  title: {
    default: "Rank Builder SEO — Evidence for the search-obsessed",
    template: "%s — Rank Builder SEO",
  },
  description: "Evidence-aware SEO articles, explainers, playbooks, claim checks, and public experiments—published in a consistent, useful format.",
  alternates: { canonical: "https://rankbuilderseo.com/" },
  openGraph: {
    title: "Rank Builder SEO",
    description: "Clear SEO answers, on repeat. Evidence-aware articles, plain-language definitions, and public experiments.",
    type: "website",
    url: "https://rankbuilderseo.com/",
    siteName: "Rank Builder SEO",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Rank Builder SEO — Evidence for the search-obsessed" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rank Builder SEO",
    description: "Evidence for the search-obsessed.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://analytics.bohodigitalservices.com/script.js"
          data-website-id="297e47a1-fd92-42f1-a34d-5a7698e8a58f"
          data-domains="rankbuilderseo.com,www.rankbuilderseo.com"
          data-do-not-track="true"
          data-exclude-search="true"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
