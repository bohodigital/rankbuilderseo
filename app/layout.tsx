import type { Metadata, Viewport } from "next";
import { organizationStructuredData, serializeStructuredData, websiteStructuredData } from "./content/structured-data";
import "./globals.css";
import { sharedOpenGraph } from "./metadata";

export const metadata: Metadata = {
  metadataBase: new URL("https://rankbuilderseo.com"),
  title: {
    default: "Rank Builder SEO — Evidence for the search-obsessed",
    template: "%s — Rank Builder SEO",
  },
  description: "Evidence-aware SEO articles, explainers, playbooks, claim checks, and public experiments—published in a consistent, useful format.",
  alternates: {
    canonical: "https://rankbuilderseo.com/",
    types: {
      "application/atom+xml": "https://rankbuilderseo.com/feed.xml",
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    ...sharedOpenGraph,
    title: "Rank Builder SEO",
    description: "Clear SEO answers, on repeat. Evidence-aware articles, plain-language definitions, and public experiments.",
    type: "website",
    url: "https://rankbuilderseo.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rank Builder SEO",
    description: "Evidence for the search-obsessed.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(organizationStructuredData()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(websiteStructuredData()) }}
        />
        <script
          defer
          src="https://analytics.bohodigitalservices.com/script.js"
          data-website-id="297e47a1-fd92-42f1-a34d-5a7698e8a58f"
          data-domains="rankbuilderseo.com,www.rankbuilderseo.com"
          data-do-not-track="true"
          data-exclude-search="true"
        />
        <script
          defer
          src="/ga4-bootstrap.js"
          data-ga4-bootstrap="rankbuilder-v1"
          data-ga4-measurement-id="G-3VYXZ0H1P8"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
