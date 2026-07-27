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
    "TathyaForge builds reliable data platforms, AI automation workflows, data science solutions, dashboards, and custom ERP/SaaS systems for modern businesses.",
  keywords: [
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
      "Reliable data platforms, AI automation workflows, data science solutions, dashboards, and custom ERP/SaaS systems for modern businesses.",
    url: "https://tathyaforge.in",
    siteName: "TathyaForge",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TathyaForge",
  url: "https://tathyaforge.in",
  logo: "https://tathyaforge.in/icon.svg",
  email: "hello@tathyaforge.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressCountry: "IN",
  },
  sameAs: ["https://www.linkedin.com/in/imsubhammondal/"],
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
