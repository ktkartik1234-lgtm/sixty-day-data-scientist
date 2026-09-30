"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

export default function ProgressBadge() {
  const { completedCount, hydrated } = useProgress();
  if (!hydrated) return <span className="text-xs text-zinc-600">…</span>;
  return (
    <Link
      href="/roadmap"
      className="rounded-full border border-accent-600/40 bg-accent-600/10 px-3 py-1 text-xs font-medium text-accent-300 hover:bg-accent-600/20"
      title="Your progress — stored in this browser"
    >
      {completedCount}/60 days
    </Link>
  );
}
