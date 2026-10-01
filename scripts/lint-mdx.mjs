#!/usr/bin/env node
/**
 * Compiles AND renders every .mdx file in /content with the exact pipeline the
 * site uses (remark-gfm, remark-math, rehype-katex) and reports:
 *   - files that fail to compile
 *   - files whose rendered HTML contains a katex-error span
 *   - math blocks that swallowed surrounding prose (value contains $$)
 * Usage: node scripts/lint-mdx.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const { compile, run } = require("@mdx-js/mdx");
const reactJsxRuntime = require("react/jsx-runtime");
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const remarkGfm = require("remark-gfm").default;
const remarkMath = require("remark-math").default;
const rehypeKatex = require("rehype-katex").default;

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

function* mdxFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* mdxFiles(p);
    else if (entry.name.endsWith(".mdx")) yield p;
  }
}

// remark-math flow fences drop content after the opening $$ (like a code-fence
// info string), so display math must be written with $$ alone on its own lines.
// A math node whose value still contains $$ means a block swallowed prose.
const swallowProbe = () => (tree) => {
  const visit = (node) => {
    const cls = node.properties?.className;
    if (Array.isArray(cls) && cls.some((c) => String(c).includes("math"))) {
      const val = String(node.children?.[0]?.value ?? "");
      if (val.includes("$$")) {
        throw new Error(`math block swallowed surrounding prose (value contains $$): ${JSON.stringify(val.slice(0, 80))}...`);
      }
    }
    (node.children ?? []).forEach(visit);
  };
  visit(tree);
};

// rehype-katex turns unparseable TeX into a visible <span class="katex-error">
const katexErrorProbe = (errors) => (tree) => {
  const visit = (node) => {
    if (node.type === "element" && node.properties?.className?.includes?.("katex-error")) {
      errors.push(String(node.properties.title ?? "unparseable math").slice(0, 120));
    }
    (node.children ?? []).forEach(visit);
  };
  visit(tree);
};

const Stub = (props) => createElement("div", null, props.children);
const components = { Callout: Stub, Quiz: Stub, Solution: Stub, a: (p) => createElement("a", p) };

const failures = [];
let ok = 0;
for (const file of mdxFiles(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  const rel = path.relative(ROOT, file);
  try {
    const katexErrors = [];
    const code = String(
      await compile(content, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [swallowProbe, rehypeKatex, () => katexErrorProbe(katexErrors)],
        outputFormat: "function-body",
        development: false,
      })
    );
    const { default: MdxContent } = await run(code, { ...reactJsxRuntime });
    renderToStaticMarkup(createElement(MdxContent, { components }));
    if (katexErrors.length) {
      throw new Error(`rendered KaTeX error(s):\n  ${[...new Set(katexErrors)].join("\n  ")}`);
    }
    ok++;
  } catch (e) {
    failures.push({ file: rel, message: String(e.message).split("\n").slice(0, 6).join("\n") });
  }
}

console.log(`compiled + rendered OK: ${ok} · failed: ${failures.length}`);
for (const f of failures) {
  console.log(`\n✗ ${f.file}\n${f.message}`);
}
process.exit(failures.length ? 1 : 0);
