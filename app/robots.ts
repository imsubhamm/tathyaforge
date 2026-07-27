import type { MetadataRoute } from "next";

const siteUrl = "https://tathyaforge.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/opportunities",
          "/opportunities/",
          "/analytics",
          "/analytics/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: "tathyaforge.in",
  };
}
