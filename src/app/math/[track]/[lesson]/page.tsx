import Link from "next/link";
import { notFound } from "next/navigation";
import { getMathLesson, getMathTracks } from "@/lib/content";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";

export function generateStaticParams() {
  return getMathTracks().flatMap((t) =>
    t.lessons.map((l) => ({ track: t.slug, lesson: l.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; lesson: string }>;
}) {
  const { track, lesson } = await params;
  const entry = getMathLesson(track, lesson);
  return { title: entry?.data.title ?? "Lesson not found" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; lesson: string }>;
}) {
  const { track, lesson } = await params;
  const entry = getMathLesson(track, lesson);
  if (!entry) notFound();
  const { data, content } = entry;

  const trackMeta = getMathTracks().find((t) => t.slug === track);
  const siblings = trackMeta?.lessons ?? [];
  const idx = siblings.findIndex((l) => l.slug === data.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <nav className="text-sm text-zinc-500">
        <Link href="/math" className="hover:text-accent-300">
          Mathematics
        </Link>
        <span className="mx-2">/</span>
        <span>{trackMeta?.name ?? track}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-100">{data.title}</h1>
        {data.summary && <p className="text-zinc-400">{data.summary}</p>}
        <p className="text-sm text-zinc-500">~{data.minutes} min</p>
      </header>

      <MDXRenderer source={content} />

      <nav className="flex justify-between gap-4 border-t border-ink-700 pt-6 text-sm">
        {prev ? (
          <Link href={`/math/${track}/${prev.slug}`} className="text-zinc-400 hover:text-accent-300">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/math/${track}/${next.slug}`} className="text-right text-zinc-400 hover:text-accent-300">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
