import Link from "next/link";
import { getRoadmapDays } from "@/lib/content";
import { PHASES } from "@/lib/phases";
import ProgressSummary from "@/components/ProgressSummary";
import RoadmapProgressGrid from "@/components/RoadmapProgressGrid";

export const metadata = { title: "60-Day Roadmap" };

export default function RoadmapPage() {
  const days = getRoadmapDays();

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">The 60-Day Roadmap</h1>
        <p className="max-w-2xl text-zinc-400">
          The A–Z of data science in six phases, inspired by the roadmap.sh AI-engineer
          path: foundations → classical ML → deep learning → LLMs & GenAI → agentic AI
          & MLOps → capstone. Mark each day complete as you go.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <RoadmapProgressGrid />
        <ProgressSummary />
      </div>

      <div className="space-y-10">
        {PHASES.map((phase) => {
          const phaseDays = Array.from({ length: phase.to - phase.from + 1 }, (_, i) => {
            const day = phase.from + i;
            return days.find((d) => d.day === day) ?? null;
          });
          return (
            <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-20 space-y-4">
              <div>
                <h2 className="flex items-center gap-3 text-xl font-semibold text-zinc-100">
                  <span className={`h-3 w-3 rounded-full ${phase.color}`} />
                  Phase {phase.id}: {phase.name}
                  <span className="text-sm font-normal text-zinc-500">
                    Days {phase.from}–{phase.to}
                  </span>
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-zinc-400">{phase.blurb}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {phaseDays.map((d, i) =>
                  d ? (
                    <Link
                      key={d.day}
                      href={`/roadmap/day/${d.day}`}
                      className="group rounded-xl border border-ink-700 bg-ink-800/40 p-4 transition hover:border-accent-500/40"
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-accent-300">
                          Day {d.day}
                        </span>
                        <span className="text-xs text-zinc-500">{d.minutes} min</span>
                      </div>
                      <p className="mt-1 font-medium text-zinc-100 group-hover:text-accent-300">
                        {d.title || "Coming soon"}
                      </p>
                      {d.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {d.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-ink-700 px-2 py-0.5 text-[11px] text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div
                      key={`slot-${phase.from}-${phase.to}-${i}`}
                      className="rounded-xl border border-dashed border-ink-700 p-4 text-sm text-zinc-600"
                    >
                      <span className="text-xs font-semibold text-zinc-600">
                        Day {phase.from + i}
                      </span>
                      <p className="mt-1">Coming soon</p>
                    </div>
                  )
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
