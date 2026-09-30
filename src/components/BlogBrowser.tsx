"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/content";

export default function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts]
  );

  const filtered = posts.filter((p) => {
    const matchesTag = !tag || p.tags.includes(tag);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-accent-500/60 sm:max-w-md"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={tag === null} onClick={() => setTag(null)} />
          {tags.map((t) => (
            <FilterChip key={t} label={t} active={tag === t} onClick={() => setTag(t)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500">No posts match your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
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

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-accent-600 text-white"
          : "bg-ink-700 text-zinc-400 hover:bg-ink-600 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
