import Link from "next/link";
import { notFound } from "next/navigation";
import { getMathTracks, getRoadmapDay, getRoadmapDays, getBlogPosts, getPapers } from "@/lib/content";
import { phaseOf } from "@/lib/phases";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";
import DayProgressToggle from "@/components/DayProgressToggle";

export function generateStaticParams() {
  return getRoadmapDays().map((d) => ({ day: String(d.day) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const data = getRoadmapDay(Number(day));
  return { title: data ? `Day ${data.data.day}: ${data.data.title}` : "Day not found" };
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayParam } = await params;
  const dayNum = Number(dayParam);
  const entry = getRoadmapDay(dayNum);
  if (!entry) notFound();

  const { data, content } = entry;
  const phase = phaseOf(data.day);
  const allDays = getRoadmapDays();
  const prev = allDays.find((d) => d.day === data.day - 1);
  const next = allDays.find((d) => d.day === data.day + 1);

  // resolve cross-links declared in frontmatter
  const lessons = (data.math ?? [])
    .map((ref) => {
      const [track, lesson] = ref.split("/");
      const found = getMathTracks()
        .flatMap((t) => t.lessons)
        .find((l) => l.track === track && l.slug === lesson);
      return found ? { href: `/math/${track}/${lesson}`, title: found.title, track: found.track } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const papers = (data.papers ?? [])
    .map((slug) => getPapers().find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map((p) => ({ href: "/papers", title: p.title, meta: `${p.authors.join(", ")} · ${p.year}` }));

  const posts = (data.blog ?? [])
    .map((slug) => getBlogPosts().find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map((p) => ({ href: `/blog/${p.slug}`, title: p.title, meta: "blog post" }));

  const hasRelated = lessons.length + papers.length + posts.length > 0;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <nav className="flex items-center justify-between text-sm">
        <Link href="/roadmap" className="text-zinc-500 hover:text-accent-300">
          ← Roadmap
        </Link>
        <DayProgressToggle day={data.day} />
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full ${phase.color} bg-opacity-15 px-2.5 py-1 font-medium text-zinc-200`}>
            Phase {phase.id}: {phase.name}
          </span>
          <span className="rounded-full bg-ink-700 px-2.5 py-1 text-zinc-400">
            ~{data.minutes} min
          </span>
          {data.tags.map((t) => (
            <span key={t} className="rounded-full bg-ink-700 px-2.5 py-1 text-zinc-400">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-zinc-100">
          Day {data.day}: {data.title}
        </h1>
        {data.objectives.length > 0 && (
          <div className="rounded-xl border border-ink-700 bg-ink-800/60 p-4">
            <p className="text-sm font-semibold text-zinc-200">Today&apos;s objectives</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-400">
              {data.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <MDXRenderer source={content} />

      {hasRelated && (
        <section className="space-y-3 rounded-2xl border border-ink-700 bg-ink-800/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Related on this site
          </h2>
          <ul className="space-y-2 text-sm">
            {lessons.map((l) => (
              <li key={l.href}>
                <span className="mr-2 rounded bg-sky-500/15 px-1.5 py-0.5 text-[11px] text-sky-300">math</span>
                <Link href={l.href} className="text-accent-300 hover:underline">
                  {l.title}
                </Link>
              </li>
            ))}
            {papers.map((p) => (
              <li key={p.href + p.title}>
                <span className="mr-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] text-amber-300">paper</span>
                <Link href={p.href} className="text-accent-300 hover:underline">
                  {p.title}
                </Link>
                <span className="ml-2 text-zinc-500">{p.meta}</span>
              </li>
            ))}
            {posts.map((p) => (
              <li key={p.href}>
                <span className="mr-2 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] text-emerald-300">blog</span>
                <Link href={p.href} className="text-accent-300 hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex justify-between gap-4 border-t border-ink-700 pt-6 text-sm">
        {prev ? (
          <Link href={`/roadmap/day/${prev.day}`} className="text-zinc-400 hover:text-accent-300">
            ← Day {prev.day}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/roadmap/day/${next.day}`} className="text-right text-zinc-400 hover:text-accent-300">
            Day {next.day}: {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
