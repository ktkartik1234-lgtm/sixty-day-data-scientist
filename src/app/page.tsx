import Link from "next/link";
import { PHASES } from "@/lib/phases";
import ProgressSummary from "@/components/ProgressSummary";

const FEATURES = [
  {
    href: "/roadmap",
    title: "60-Day Roadmap",
    desc: "The A–Z of data science, one day at a time: objectives, theory, exercises and a quiz for each of the 60 days, grouped into 6 phases.",
    cta: "Open the roadmap",
  },
  {
    href: "/math",
    title: "Mathematics",
    desc: "Learn the math behind the models — linear algebra, calculus, probability and statistics — with curated resources and worked problems.",
    cta: "Browse math tracks",
  },
  {
    href: "/papers",
    title: "Research Library",
    desc: "The papers that matter, filtered by topic, with plain-language summaries, key takeaways and links to the roadmap days that use them.",
    cta: "Read the papers",
  },
  {
    href: "/blog",
    title: "Blog",
    desc: "Notes from the journey: deep dives, experiment write-ups and lessons learned along the 60 days.",
    cta: "Visit the blog",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-6 text-center">
        <p className="inline-block rounded-full border border-accent-600/40 bg-accent-600/10 px-4 py-1 text-xs font-medium text-accent-300">
          A–Z of data science · 60 days · 6 phases
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
          Become a data scientist in{" "}
          <span className="bg-gradient-to-r from-accent-400 to-sky-400 bg-clip-text text-transparent">
            60 focused days
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          A structured journey from the foundations of mathematics to LLMs and MLOps —
          with a day-by-day roadmap, a research paper library and math tracks with
          resources, all in one place.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/roadmap/day/1"
            className="rounded-xl bg-accent-600 px-6 py-3 font-medium text-white transition hover:bg-accent-500"
          >
            Start Day 1 →
          </Link>
          <Link
            href="/roadmap"
            className="rounded-xl border border-ink-600 px-6 py-3 font-medium text-zinc-300 transition hover:border-accent-500/50 hover:text-zinc-100"
          >
            See the full roadmap
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group flex flex-col rounded-2xl border border-ink-700 bg-ink-800/60 p-6 transition hover:border-accent-500/40"
          >
            <h2 className="text-lg font-semibold text-zinc-100">{f.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            <span className="mt-4 text-sm text-accent-300 group-hover:underline">{f.cta} →</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">The six phases</h2>
          <div className="space-y-3">
            {PHASES.map((p) => (
              <Link
                key={p.id}
                href={`/roadmap#phase-${p.id}`}
                className="flex gap-4 rounded-xl border border-ink-700 bg-ink-800/40 p-4 transition hover:border-accent-500/40"
              >
                <span className={`mt-1 h-full w-1.5 rounded-full ${p.color}`} />
                <span>
                  <span className="font-medium text-zinc-100">
                    Phase {p.id}: {p.name}
                  </span>
                  <span className="ml-2 text-xs text-zinc-500">
                    Days {p.from}–{p.to}
                  </span>
                  <p className="mt-1 text-sm text-zinc-400">{p.blurb}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Track yourself</h2>
          <ProgressSummary />
        </div>
      </section>
    </div>
  );
}
