// ISR: revalidate each project detail every 1 hour
export const revalidate = 3600;
// New slugs not yet pre-rendered are SSR'd on first request then cached
export const dynamicParams = true;

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Project } from "@/types";
import ProjectDetailContent from "./ProjectDetailContent";
import ProjectDetailSkeleton from "./loading";
import { Metadata } from "next";

type PageParams = {
  params: Promise<{ slug: string }>;
};

async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.codernex.dev/api/v1";
    const res = await fetch(
      `${apiBase}/project/${slug}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data || json) as Project;
  } catch {
    return null;
  }
}

/** Pre-render all project slugs at build time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.codernex.dev/api/v1";
    const res = await fetch(
      `${apiBase}/project/slugs`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const result = await res.json();
    const slugs: string[] = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
      ? result.data
      : [];
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    return { title: "Project Not Found | Codernex" };
  }

  return {
    title: `${project.title} | Codernex Project`,
    description: project.shortDescription,
    keywords: project.technologies,
    openGraph: {
      images: [project.thumbnailUrl],
      description: project.shortDescription,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function ProjectPage({ params }: PageParams) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectFetcher slug={slug} />
    </Suspense>
  );
}

async function ProjectFetcher({ slug }: { slug: string }) {
  const project = await fetchProject(slug);
  if (!project) return notFound();

  return <ProjectDetailContent project={project} />;
}
