import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/", // Keep your dashboard private from Google
    },
    sitemap: "https://codernex.dev/sitemap.xml",
  };
}
