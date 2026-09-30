"use client";

import { useProgress } from "@/lib/progress";

export default function DayProgressToggle({ day }: { day: number }) {
  const { isDone, toggleDay, hydrated } = useProgress();
  const done = hydrated && isDone(day);
  return (
    <button
      onClick={() => toggleDay(day)}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        done
          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/25"
          : "bg-ink-700 text-zinc-300 ring-1 ring-ink-600 hover:bg-ink-600"
      }`}
    >
      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${
        done ? "border-emerald-400 bg-emerald-400 text-ink-950" : "border-zinc-500"
      }`}>
        {done ? "✓" : ""}
      </span>
      {done ? "Completed" : "Mark day complete"}
    </button>
  );
}
