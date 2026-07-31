import EditProjectPage from "@/components/dashboard/projects/ProjectEditForm";
import { apiInstance } from "@/lib/axios";
import { Project } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Concurrent fetch for Project Data and available Tags
  const [projectRes] = await Promise.all([
    apiInstance.get<{ data: Project }>(`/project/${slug}`),
  ]);

  const project = projectRes.data.data;

  if (!project) return notFound();

  return (
    <div className="container mx-auto max-w-5xl py-10 space-y-8">
      <EditProjectPage project={project} />
    </div>
  );
}
