import { EditBlogForm } from "@/components/dashboard/blogs/EditBlogForm";
import { apiInstance } from "@/lib/axios";
import { Blog } from "@/types";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await apiInstance.get<{ data: Blog }>(`/blog/${slug}`);
    const blog = res.data.data;

    if (!blog) return notFound();

    return (
      <div className="container mx-auto max-w-6xl py-10 space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Update_Entry: <span className="text-emerald-500">{blog.title}</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] mt-2 uppercase tracking-widest">
            LOG_ID: {blog.id} // SLUG: {blog.slug}
          </p>
        </div>

        <EditBlogForm initialData={blog} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
