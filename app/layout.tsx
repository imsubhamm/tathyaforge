import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/MotionProvider";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ClientAssistant } from "@/components/ClientAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://tathyaforge.in"),
  title: {
    default: "TathyaForge | Data Engineering, AI Automation & Multi-Cloud Consulting",
    template: "%s | TathyaForge",
  },
  description:
    "TathyaForge (tathyaforge.in) builds reliable data platforms, AI automation workflows, data science solutions, dashboards, and custom ERP/SaaS systems for modern businesses.",
  keywords: [
    "TathyaForge",
    "tathyaforge",
    "Tathya Forge",
    "tathyaforge.in",
    "Data Engineering",
    "AI Automation",
    "OpenAI",
    "Prompt Engineering",
    "Data Science",
    "GCP Consulting",
    "Azure Consulting",
    "Databricks Consulting",
    "Multi Cloud",
    "Cloud Data Platform",
    "ERP Development",
    "SaaS Development",
    "Power BI",
    "PySpark",
    "India",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "bNyaILHxpsMKGnsrW_4k_wsVwSGpueNo9lYYVi3w9W8",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "TathyaForge | Data Engineering, AI Automation & Multi-Cloud Consulting",
    description:
      "TathyaForge (tathyaforge.in) builds reliable data platforms, AI automation workflows, data science solutions, dashboards, and custom ERP/SaaS systems for modern businesses.",
    url: "https://tathyaforge.in",
    siteName: "TathyaForge",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TathyaForge",
  alternateName: ["tathyaforge", "Tathya Forge", "tathyaforge.in"],
  legalName: "TathyaForge",
  url: "https://tathyaforge.in",
  logo: "https://tathyaforge.in/icon.svg",
  email: "hello@tathyaforge.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/in/imsubhammondal/",
    "https://github.com/imsubhamm/tathyaforge",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TathyaForge",
  alternateName: ["tathyaforge", "Tathya Forge"],
  url: "https://tathyaforge.in",
  publisher: {
    "@type": "Organization",
    name: "TathyaForge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <AnalyticsTracker />
        <MotionProvider />
        <Navbar />
        <main>{children}</main>
        <ClientAssistant />
        <Footer />
      </body>
    </html>
  );
}
