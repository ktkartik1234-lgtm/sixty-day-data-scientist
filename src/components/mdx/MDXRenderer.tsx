import { compile, run } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Callout from "./Callout";
import Quiz from "./Quiz";
import Solution from "./Solution";

/**
 * Renders MDX strings from /content with math (KaTeX) and the custom widget set.
 * Compiles with the official @mdx-js/mdx pipeline (same plugins as before) and
 * evaluates the result with the React JSX runtime on the server.
 */
export async function MDXRenderer({ source }: { source: string }) {
  const components = {
    Callout,
    Quiz,
    Solution,
    a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...p} target="_blank" rel="noopener" />
    ),
  };

  const code = String(
    await compile(source, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: "ignore" }]],
      outputFormat: "function-body",
    })
  );

  const { default: Content } = await run(code, { ...jsxRuntime });

  return (
    <div className="prose prose-invert prose-headings:scroll-mt-20 prose-a:text-accent-300 prose-code:text-accent-300 prose-pre:bg-ink-800 max-w-none">
      <Content components={components} />
    </div>
  );
}
