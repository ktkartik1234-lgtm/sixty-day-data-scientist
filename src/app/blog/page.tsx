import Link from "next/link";
import { getBlogPosts } from "@/lib/content";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Blog</h1>
        <p className="max-w-2xl text-zinc-400">
          Notes from the 60-day journey — deep dives, experiment write-ups and lessons
          learned. Written in MDX, so posts can embed math, code and interactive widgets.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-ink-700 bg-ink-800/40 p-6 transition hover:border-accent-500/40"
            >
              <p className="text-xs text-zinc-500">
                {post.date} · {post.readingMinutes} min read
              </p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-100 group-hover:text-accent-300">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink-700 px-2 py-0.5 text-[11px] text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
