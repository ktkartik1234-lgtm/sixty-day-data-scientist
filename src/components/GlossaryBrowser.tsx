"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTerm } from "@/lib/content";

export default function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [terms, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms and definitions…"
        className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-accent-500/60 sm:max-w-md"
      />

      {grouped.length === 0 && (
        <p className="text-zinc-500">No terms match your search.</p>
      )}

      {grouped.map(([letter, letterTerms]) => (
        <section key={letter} className="space-y-3">
          <h2 className="flex items-center gap-3 text-xl font-bold text-accent-300">
            {letter}
            <span className="h-px flex-1 bg-ink-700" />
            <span className="text-xs font-normal text-zinc-600">
              {letterTerms.length}
            </span>
          </h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {letterTerms.map((t) => (
              <div
                key={t.term}
                className="rounded-xl border border-ink-700 bg-ink-800/40 p-4"
              >
                <dt className="font-semibold text-zinc-100">{t.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
                  {t.definition}
                </dd>
                <SeeLinks see={t.see} />
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function SeeLinks({ see }: { see?: GlossaryTerm["see"] }) {
  if (!see) return null;
  const items: { href: string; label: string }[] = [];
  for (const ref of see.math ?? []) {
    const [track, lesson] = ref.split("/");
    items.push({ href: `/math/${track}/${lesson}`, label: lesson ?? ref });
  }
  for (const slug of see.papers ?? []) {
    items.push({ href: "/papers", label: slug });
  }
  for (const day of see.days ?? []) {
    items.push({ href: `/roadmap/day/${day}`, label: `Day ${day}` });
  }
  for (const slug of see.blog ?? []) {
    items.push({ href: `/blog/${slug}`, label: slug });
  }
  if (items.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((it) => (
        <Link
          key={it.href + it.label}
          href={it.href}
          className="rounded-full bg-ink-700 px-2.5 py-0.5 text-[11px] text-accent-300 hover:bg-ink-600"
        >
          {it.label} →
        </Link>
      ))}
    </div>
  );
}
