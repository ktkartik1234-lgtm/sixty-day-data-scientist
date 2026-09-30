"use client";

import { useMemo, useState } from "react";
import type { Paper } from "@/lib/content";

export default function PapersBrowser({ papers }: { papers: Paper[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => [...new Set(papers.flatMap((p) => p.tags))].sort(),
    [papers]
  );

  const filtered = papers.filter((p) => {
    const matchesTag = !tag || p.tags.includes(tag);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.authors.some((a) => a.toLowerCase().includes(q));
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search papers by title, author or summary…"
          className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-accent-500/60 sm:max-w-md"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={tag === null} onClick={() => setTag(null)} />
          {tags.map((t) => (
            <FilterChip key={t} label={t} active={tag === t} onClick={() => setTag(t)} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <article
            key={p.slug}
            className="flex flex-col rounded-2xl border border-ink-700 bg-ink-800/40 p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs text-zinc-500">
                {p.venue} · {p.year}
              </p>
              <p className="text-xs text-zinc-500">{p.days ? `Day ${p.days.join(", ")}` : ""}</p>
            </div>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-zinc-100">
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300">
                {p.title} ↗
              </a>
            </h2>
            <p className="mt-1 text-xs text-zinc-500">{p.authors.join(", ")}</p>
            <p className="mt-3 text-sm text-zinc-400">{p.summary}</p>
            {p.keyTakeaways.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-500">
                {p.keyTakeaways.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-ink-700 px-2 py-0.5 text-[11px] text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-zinc-500">No papers match your filters.</p>
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
