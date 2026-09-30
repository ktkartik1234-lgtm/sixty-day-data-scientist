#!/usr/bin/env node
/**
 * Compiles every .mdx file in /content with the exact plugin pipeline the site
 * uses (remark-gfm, remark-math, rehype-katex) and reports files that fail.
 * Usage: node scripts/lint-mdx.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const { compile } = require("@mdx-js/mdx");
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

const failures = [];
let ok = 0;
for (const file of mdxFiles(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  try {
    await compile(content, {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
      development: false,
    });
    ok++;
  } catch (e) {
    failures.push({ file: path.relative(ROOT, file), message: String(e.message).split("\n").slice(0, 6).join("\n") });
  }
}

console.log(`compiled OK: ${ok} · failed: ${failures.length}`);
for (const f of failures) {
  console.log(`\n✗ ${f.file}\n${f.message}`);
}
process.exit(failures.length ? 1 : 0);
