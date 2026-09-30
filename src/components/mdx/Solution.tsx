import type { ReactNode } from "react";

/** Collapsible worked solution / answer block, embedded from MDX. */
export default function Solution({ children }: { children: ReactNode }) {
  return (
    <details className="my-6 rounded-xl border border-ink-600 bg-ink-800/60">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent-300">
        Show solution
      </summary>
      <div className="border-t border-ink-600 px-4 py-3 text-sm leading-relaxed text-zinc-300 [&>p]:my-2">
        {children}
      </div>
    </details>
  );
}
