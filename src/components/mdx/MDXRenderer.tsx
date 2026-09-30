import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Callout from "./Callout";
import Quiz from "./Quiz";
import Solution from "./Solution";

/**
 * Renders MDX strings from /content with math (KaTeX) and the custom widget set.
 * Used by blog posts, roadmap days and math lessons.
 */
export function MDXRenderer({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-headings:scroll-mt-20 prose-a:text-accent-300 prose-code:text-accent-300 prose-pre:bg-ink-800 max-w-none">
      <MDXRemote
        source={source}
        components={{ Callout, Quiz, Solution, a: (p) => <a {...p} target="_blank" rel="noopener" /> }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </div>
  );
}
