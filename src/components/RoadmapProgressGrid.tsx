"use client";

import Link from "next/link";
import { PHASES, TOTAL_DAYS } from "@/lib/phases";
import { useProgress } from "@/lib/progress";

/** 60-cell grid: one cell per day, colored by phase, filled when completed. */
export default function RoadmapProgressGrid() {
  const { isDone, hydrated } = useProgress();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.4rem,1fr))] gap-1.5">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
          const phase = PHASES.find((p) => day >= p.from && day <= p.to)!;
          const done = hydrated && isDone(day);
          return (
            <Link
              key={day}
              href={`/roadmap/day/${day}`}
              title={`Day ${day} — ${phase.name}`}
              className={`flex h-10 items-center justify-center rounded-md text-xs font-medium transition ${
                done
                  ? "bg-emerald-500 text-ink-950"
                  : `${phase.color} opacity-25 hover:opacity-100`
              }`}
            >
              {day}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
        {PHASES.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${p.color} opacity-70`} />
            {p.name} ({p.from}–{p.to})
          </span>
        ))}
      </div>
    </div>
  );
}
