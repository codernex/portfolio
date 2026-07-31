// ISR: revalidate each blog post every 1 hour
export const revalidate = 3600;
// New slugs not yet pre-rendered are SSR'd on first request then cached
export const dynamicParams = true;

import ContentRenderer from "@/components/ContentRender";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ShareButton from "@/components/shared/ShareButton";
import { Blog } from "@/types";
import { format } from "date-fns";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Share2,
  ShieldCheck,
  Terminal,
  User as UserIcon,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.data;
  } catch (error) {
    return null;
  }
}

/** Pre-render all published blog slugs at build time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/slugs`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const result = await res.json();
    // Expects: { data: string[] }  — adjust if your API shape differs
    const slugs: string[] = result.data ?? [];
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch the blog data from your NestJS backend
  const blog = await getBlogPost(slug);

  if (!blog) {
    return {
      title: "Entry Not Found | Codernex",
    };
  }

  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || "";
  const keywords = blog.seoKeywords
    ? blog.seoKeywords.split(",").map((k) => k.trim())
    : [];

  return {
    title: `${title} | Codernex Journal`,
    description: description,
    keywords: keywords,
    authors: [{ name: "Borhan Uddin (Codernex)" }],

    openGraph: {
      title: title,
      description: description,
      url: `https://codernex.dev/blog/${blog.slug}`,
      siteName: "Codernex Org",
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: ["Borhan Uddin"],
      images: [
        {
          url: blog.featuredImage || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [blog.featuredImage || "/og-image.jpg"],
      creator: "@codernex",
    },

    // Technical SEO: Prevents duplicate content issues
    alternates: {
      canonical: `https://codernex.dev/blog/${blog.slug}`,
    },
    manifest: "/site.webmanifest",
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  console.log("TCL: BlogDetailPage -> post", post);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      <ScrollProgress />
      {/* Sticky Top Header */}
      <header className="sticky top-16 z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="group flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            <span>cd ../blog</span>
          </Link>
          <div className="flex items-center gap-4 text-zinc-600">
            <ShareButton 
              title={post.title} 
              url={`https://codernex.dev/blog/${post.slug}`} 
            />
            <Bookmark className="h-4 w-4 cursor-pointer hover:text-emerald-500 transition-colors" />
          </div>
        </div>
      </header>

      <article className="container mx-auto max-w-5xl px-6 py-16">
        {/* Header Section */}
        <header className="mb-12 space-y-6">
          <div className="flex flex-wrap gap-3">
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="font-mono text-[10px] text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest"
              >
                [{tag.name}]
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-zinc-900/50 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <UserIcon className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-zinc-200">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(
                  new Date(post.publishedAt || post.createdAt),
                  "yyyy.MM.dd"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} MIN_READ</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500/60">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.views.toLocaleString()} HITS</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12 aspect-[21/9] w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/50">
          <img
            src={post?.featuredImage || ""}
            alt={post.title}
            className="h-full w-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {/* New ContentRenderer usage for Block-based Content */}
            <ContentRenderer
              blocks={post.content}
              className="prose prose-invert prose-emerald max-w-none 
                prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg
                prose-strong:text-emerald-500 prose-strong:font-bold
                prose-code:text-emerald-400 prose-code:bg-zinc-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-img:rounded-xl prose-img:border prose-img:border-zinc-800"
            />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">
                  <Terminal size={12} /> System_Menu
                </div>
                <div className="space-y-4">
                  <Link
                    href="/projects"
                    className="group flex items-center justify-between text-sm hover:text-emerald-400 transition-colors"
                  >
                    <span className="font-mono text-zinc-400 text-xs italic">
                      ls ./projects
                    </span>
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="group flex items-center justify-between text-sm hover:text-emerald-400 transition-colors"
                  >
                    <span className="font-mono text-zinc-400 text-xs italic">
                      ssh ./contact
                    </span>
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>

              {/* Status Badge */}
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-6 flex items-center gap-4">
                <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                <div className="font-mono text-[10px] leading-tight text-zinc-500">
                  <p className="text-emerald-500 font-bold uppercase mb-1">
                    Identity_Verified
                  </p>
                  <p>Author: Borhan Uddin</p>
                  <p>Role: Sys_Admin</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950/30 text-center">
        <div className="font-mono text-[10px] text-zinc-700 uppercase tracking-[0.4em]">
          End of Buffer — All Systems Operational
        </div>
      </footer>
    </main>
  );
}
