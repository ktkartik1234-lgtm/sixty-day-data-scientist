import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ---------------------------------- types --------------------------------- */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
};

export type RoadmapDay = {
  day: number;
  slug: string;
  title: string;
  phase: number;
  objectives: string[];
  tags: string[];
  minutes: number;
  math?: string[];
  papers?: string[];
  blog?: string[];
};

export type MathLesson = {
  track: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  minutes: number;
};

export type MathTrack = {
  slug: string;
  name: string;
  description: string;
  lessons: MathLesson[];
};

export type Paper = {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  tags: string[];
  link: string;
  summary: string;
  keyTakeaways: string[];
  days?: number[];
};

/* --------------------------------- helpers -------------------------------- */

function readMatter(filePath: string): { data: Record<string, unknown>; content: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data, content };
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function readingMinutes(text: string): number {
  return Math.max(1, Math.round(wordCount(text) / 200));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function dirExists(dir: string): boolean {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

/* ----------------------------------- blog --------------------------------- */

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(CONTENT_DIR, "blog");
  if (!dirExists(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data, content } = readMatter(path.join(dir, f));
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        tags: (data.tags as string[]) ?? [],
        readingMinutes: readingMinutes(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPost(slug: string): { post: BlogPost; content: string } | null {
  const file = path.join(CONTENT_DIR, "blog", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readMatter(file);
  return {
    post: {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      tags: (data.tags as string[]) ?? [],
      readingMinutes: readingMinutes(content),
    },
    content,
  };
}

/* --------------------------------- roadmap -------------------------------- */

export function getRoadmapDays(): RoadmapDay[] {
  const dir = path.join(CONTENT_DIR, "roadmap");
  if (!dirExists(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^day-\d+\.mdx$/.test(f))
    .map((f) => {
      const { data } = readMatter(path.join(dir, f));
      return {
        day: Number(data.day ?? 0),
        slug: f.replace(/\.mdx$/, ""),
        title: String(data.title ?? ""),
        phase: Number(data.phase ?? 1),
        objectives: (data.objectives as string[]) ?? [],
        tags: (data.tags as string[]) ?? [],
        minutes: Number(data.minutes ?? 60),
        math: data.math as string[] | undefined,
        papers: data.papers as string[] | undefined,
        blog: data.blog as string[] | undefined,
      };
    })
    .sort((a, b) => a.day - b.day);
}

export function getRoadmapDay(day: number): { data: RoadmapDay; content: string } | null {
  const file = path.join(CONTENT_DIR, "roadmap", `day-${String(day).padStart(2, "0")}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readMatter(file);
  return {
    data: {
      day: Number(data.day ?? day),
      slug: path.basename(file, ".mdx"),
      title: String(data.title ?? ""),
      phase: Number(data.phase ?? 1),
      objectives: (data.objectives as string[]) ?? [],
      tags: (data.tags as string[]) ?? [],
      minutes: Number(data.minutes ?? 60),
      math: data.math as string[] | undefined,
      papers: data.papers as string[] | undefined,
      blog: data.blog as string[] | undefined,
    },
    content,
  };
}

/* ----------------------------------- math --------------------------------- */

function trackMeta(trackDir: string): { name: string; description: string } {
  const metaFile = path.join(trackDir, "_meta.json");
  if (fs.existsSync(metaFile)) return readJson(metaFile);
  const name = path.basename(trackDir)
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return { name, description: "" };
}

export function getMathTracks(): MathTrack[] {
  const root = path.join(CONTENT_DIR, "math");
  if (!dirExists(root)) return [];
  return fs
    .readdirSync(root)
    .map((slug) => path.join(root, slug))
    .filter(dirExists)
    .map((trackDir) => {
      const meta = trackMeta(trackDir);
      const lessons = fs
        .readdirSync(trackDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
          const { data, content } = readMatter(path.join(trackDir, f));
          return {
            track: path.basename(trackDir),
            slug: f.replace(/\.mdx$/, ""),
            title: String(data.title ?? f),
            summary: String(data.summary ?? ""),
            order: Number(data.order ?? 99),
            minutes: readingMinutes(content),
          } satisfies MathLesson;
        })
        .sort((a, b) => a.order - b.order);
      return {
        slug: path.basename(trackDir),
        name: meta.name,
        description: meta.description,
        lessons,
      } satisfies MathTrack;
    });
}

export function getMathLesson(
  track: string,
  lesson: string
): { data: MathLesson; content: string } | null {
  const file = path.join(CONTENT_DIR, "math", track, `${lesson}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readMatter(file);
  return {
    data: {
      track,
      slug: lesson,
      title: String(data.title ?? lesson),
      summary: String(data.summary ?? ""),
      order: Number(data.order ?? 99),
      minutes: readingMinutes(content),
    },
    content,
  };
}

/* ---------------------------------- papers -------------------------------- */

export function getPapers(): Paper[] {
  const file = path.join(CONTENT_DIR, "papers", "index.json");
  if (!fs.existsSync(file)) return [];
  return readJson<Paper[]>(file);
}

export function getPaper(slug: string): Paper | null {
  return getPapers().find((p) => p.slug === slug) ?? null;
}
