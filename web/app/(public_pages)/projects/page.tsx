// ISR: revalidate the projects list every 5 minutes
export const revalidate = 300;

import { Project, PaginatedResponse } from "@/types";
import ProjectsArchiveClient from "./ProjectsArchiveClient";

export const metadata = {
  title: "Engineering Projects | Codernex (Borhan Uddin)",
  description:
    "Explore a collection of high-performance technical projects, including e-commerce engines, microservices, and system architectures built with NestJS, Next.js, and AWS.",
  keywords: [
    "Software Portfolio",
    "NestJS Projects",
    "Next.js Case Studies",
    "Full-Stack Engineering Work",
    "System Design Examples",
    "Scalable Web Applications",
  ],
  openGraph: {
    title: "Technical Case Studies | Borhan Uddin",
    description:
      "Deep dives into engineering solutions and architectural patterns.",
    url: "https://codernex.dev/projects",
    images: [{ url: "/og-projects.jpg", width: 1200, height: 630 }],
  },
};

export default async function ProjectsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page = "1", search = "" } = await searchParams;

  const params = new URLSearchParams({ page, limit: "6", search });

  // Use native fetch so Next.js can apply ISR caching
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/project?${params.toString()}`,
    { next: { revalidate: 300 } },
  );

  const json = (await res.json()) as PaginatedResponse<Project>;
  const initialData = json.data;

  return <ProjectsArchiveClient initialData={initialData} />;
}
