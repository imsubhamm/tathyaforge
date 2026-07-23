import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/MotionProvider";

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
  openGraph: {
    title: "TathyaForge | Data Engineering, AI Automation & Multi-Cloud Consulting",
    description:
      "Reliable data platforms, AI automation workflows, data science solutions, dashboards, and custom ERP/SaaS systems for modern businesses.",
    url: "https://tathyaforge.in",
    siteName: "TathyaForge",
    type: "website",
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
        <MotionProvider />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
