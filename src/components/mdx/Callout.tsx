import type { ReactNode } from "react";

const STYLES = {
  info: {
    wrapper: "border-sky-500/40 bg-sky-500/10",
    label: "text-sky-300",
    icon: "ℹ",
  },
  tip: {
    wrapper: "border-emerald-500/40 bg-emerald-500/10",
    label: "text-emerald-300",
    icon: "💡",
  },
  warn: {
    wrapper: "border-amber-500/40 bg-amber-500/10",
    label: "text-amber-300",
    icon: "⚠",
  },
  deep: {
    wrapper: "border-accent-500/40 bg-accent-500/10",
    label: "text-accent-300",
    icon: "🔍",
  },
} as const;

export default function Callout({
  kind = "info",
  title,
  children,
}: {
  kind?: keyof typeof STYLES;
  title?: string;
  children: ReactNode;
}) {
  const s = STYLES[kind];
  return (
    <aside className={`my-6 rounded-xl border px-4 py-3 ${s.wrapper}`}>
      <p className={`text-sm font-semibold ${s.label}`}>
        <span className="mr-1.5">{s.icon}</span>
        {title ?? kind.toUpperCase()}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-zinc-300 [&>p]:my-1">{children}</div>
    </aside>
  );
}
