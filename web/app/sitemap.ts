import { MetadataRoute } from "next";
import { apiInstance } from "@/lib/axios";
import { Project, Blog } from "@/types";

const BASE_URL = "https://codernex.dev";

// Helper to escape special XML characters in URLs
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&"']/g, (m) => {
    switch (m) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return m;
    }
  });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [projectsRes, blogsRes] = await Promise.all([
      apiInstance
        .get<{ data: Project[] }>("/project/all")
        .catch(() => ({ data: { data: [] } })),
      apiInstance
        .get<{ data: Blog[] }>("/blog/all")
        .catch(() => ({ data: { data: [] } })),
    ]);

    const projects = projectsRes.data?.data || [];
    const blogs = blogsRes.data?.data || [];

    const projectEntries = projects.map((project) => ({
      // We escape the URL to prevent & character errors
      url: escapeXml(`${BASE_URL}/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const blogEntries = blogs.map((blog) => ({
      url: escapeXml(`${BASE_URL}/blog/${blog.slug}`),
      lastModified: new Date(blog.updatedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const staticPages = ["", "/projects", "/blog", "/contact"].map((route) => ({
      url: escapeXml(`${BASE_URL}${route}`),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    }));

    return [...staticPages, ...projectEntries, ...blogEntries];
  } catch (error) {
    console.error("SITEMAP_ERR:", error);
    return [{ url: BASE_URL, lastModified: new Date() }];
  }
}
