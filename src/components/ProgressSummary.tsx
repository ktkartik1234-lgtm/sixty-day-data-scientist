"use client";

import { useProgress } from "@/lib/progress";

export default function ProgressSummary() {
  const { completedCount, percent, streak, hydrated } = useProgress();
  if (!hydrated) return null;
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-800/60 p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-zinc-400">Your progress</p>
          <p className="text-3xl font-bold text-zinc-100">
            {completedCount}
            <span className="text-lg font-medium text-zinc-500"> / 60 days</span>
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          streak: <span className="font-semibold text-accent-300">{streak}</span>
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-600">
        <div
          className="h-full rounded-full bg-accent-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Progress is saved in this browser (localStorage) — no account needed.
      </p>
    </div>
  );
}
