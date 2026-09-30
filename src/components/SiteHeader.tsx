import Link from "next/link";
import ProgressBadge from "./ProgressBadge";

const NAV = [
  { href: "/roadmap", label: "60-Day Roadmap" },
  { href: "/math", label: "Mathematics" },
  { href: "/papers", label: "Papers" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-sm">
            60
          </span>
          <span className="hidden sm:inline">
            Day Data Scientist
          </span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:bg-ink-800 hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ProgressBadge />
      </div>
    </header>
  );
}
