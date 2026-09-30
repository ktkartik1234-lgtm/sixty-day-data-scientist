import Link from "next/link";
import { getMathTracks } from "@/lib/content";

export const metadata = { title: "Mathematics" };

export default function MathPage() {
  const tracks = getMathTracks();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">Mathematics</h1>
        <p className="max-w-2xl text-zinc-400">
          The math behind the models, learned alongside the roadmap. Every lesson renders
          real notation, links curated external resources (videos, books, courses) and
          ends with worked problems.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {tracks.map((track) => (
          <section
            key={track.slug}
            className="rounded-2xl border border-ink-700 bg-ink-800/40 p-6"
          >
            <h2 className="text-lg font-semibold text-zinc-100">{track.name}</h2>
            {track.description && (
              <p className="mt-1 text-sm text-zinc-400">{track.description}</p>
            )}
            <ul className="mt-4 space-y-2">
              {track.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/math/${track.slug}/${lesson.slug}`}
                    className="group flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-ink-700/60"
                  >
                    <span className="text-zinc-200 group-hover:text-accent-300">
                      {lesson.title}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {lesson.minutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {tracks.length === 0 && (
        <p className="text-zinc-500">
          No math tracks yet — add a folder under <code>content/math/</code>.
        </p>
      )}
    </div>
  );
}
