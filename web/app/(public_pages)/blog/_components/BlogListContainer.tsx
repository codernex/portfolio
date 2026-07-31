// app/blog/_components/BlogListContainer.tsx
import { Blog, PaginatedResponse } from "@/types";
import BlogArchiveClient from "./BlogArchiveClient";

export default async function BlogListContainer({
  searchParams,
}: {
  searchParams: Record<string, unknown>;
}) {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });
  }

  // Use native fetch for ISR caching (axios bypasses Next.js cache)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?${params.toString()}`,
    { next: { revalidate: 300 } }, // ISR: re-fetch every 5 minutes
  );

  const json = (await res.json()) as PaginatedResponse<Blog>;
  const result = json.data;

  return (
    <BlogArchiveClient
      initialBlogs={result.items}
      meta={result.meta}
    />
  );
}
