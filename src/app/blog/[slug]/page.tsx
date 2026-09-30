import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getBlogPost(slug);
  return { title: entry?.post.title ?? "Post not found" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getBlogPost(slug);
  if (!entry) notFound();
  const { post, content } = entry;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-accent-300">
        ← Blog
      </Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-100">{post.title}</h1>
        <p className="text-sm text-zinc-500">
          {post.date} · {post.readingMinutes} min read
        </p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-ink-700 px-2 py-0.5 text-[11px] text-zinc-400">
              {t}
            </span>
          ))}
        </div>
      </header>
      <MDXRenderer source={content} />
    </article>
  );
}
