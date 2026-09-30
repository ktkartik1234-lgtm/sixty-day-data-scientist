import { getBlogPosts } from "@/lib/content";
import BlogBrowser from "@/components/BlogBrowser";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Blog</h1>
        <p className="max-w-2xl text-zinc-400">
          Notes from the 60-day journey — deep dives, experiment write-ups and
          lessons learned. Written in MDX, so posts embed math, code and
          interactive widgets. Filter by topic:
        </p>
      </header>
      <BlogBrowser posts={posts} />
    </div>
  );
}
