#!/usr/bin/env node
/**
 * Validates content integrity across /content:
 *  - roadmap: all 60 days exist exactly once, frontmatter sane
 *  - cross-refs: every math/papers/blog ref in day frontmatter resolves
 *  - math: every track folder has lessons with unique slugs + valid _meta.json
 *  - papers: index.json parses, slugs unique, required fields present
 * Usage: node scripts/validate-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/* papers */
const papersFile = path.join(CONTENT, "papers", "index.json");
let paperSlugs = [];
if (!fs.existsSync(papersFile)) {
  fail("content/papers/index.json missing");
} else {
  try {
    const papers = JSON.parse(fs.readFileSync(papersFile, "utf8"));
    const seen = new Set();
    for (const p of papers) {
      for (const f of ["slug", "title", "authors", "year", "venue", "tags", "link", "summary", "keyTakeaways"]) {
        if (p[f] === undefined) fail(`paper "${p.slug ?? "?"}": missing field "${f}"`);
      }
      if (seen.has(p.slug)) fail(`duplicate paper slug: ${p.slug}`);
      seen.add(p.slug);
    }
    paperSlugs = [...seen];
  } catch (e) {
    fail(`papers/index.json is not valid JSON: ${e.message}`);
  }
}

/* math */
const mathSlugs = new Set();
const mathRoot = path.join(CONTENT, "math");
if (fs.existsSync(mathRoot)) {
  for (const track of fs.readdirSync(mathRoot, { withFileTypes: true })) {
    if (!track.isDirectory()) continue;
    const trackDir = path.join(mathRoot, track.name);
    const metaFile = path.join(trackDir, "_meta.json");
    if (!fs.existsSync(metaFile)) warn(`math/${track.name}: no _meta.json (name will be derived from slug)`);
    else {
      try {
        const meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
        if (!meta.name) warn(`math/${track.name}/_meta.json: missing "name"`);
      } catch (e) {
        fail(`math/${track.name}/_meta.json invalid JSON: ${e.message}`);
      }
    }
    const lessons = fs.readdirSync(trackDir).filter((f) => f.endsWith(".mdx"));
    if (lessons.length === 0) warn(`math/${track.name}: no lessons`);
    for (const f of lessons) {
      const raw = fs.readFileSync(path.join(trackDir, f), "utf8");
      if (!/^---\n[\s\S]*?\n---/.test(raw)) fail(`math/${track.name}/${f}: missing frontmatter`);
      if (!/title:/.test(raw.split("---")[1] ?? "")) fail(`math/${track.name}/${f}: frontmatter has no title`);
      mathSlugs.add(`${track.name}/${f.replace(/\.mdx$/, "")}`);
    }
  }
} else {
  fail("content/math/ missing");
}

/* blog */
const blogSlugs = new Set();
const blogDir = path.join(CONTENT, "blog");
if (fs.existsSync(blogDir)) {
  for (const f of fs.readdirSync(blogDir).filter((x) => x.endsWith(".mdx"))) {
    blogSlugs.add(f.replace(/\.mdx$/, ""));
  }
} else {
  warn("content/blog/ missing");
}

/* roadmap */
const roadDir = path.join(CONTENT, "roadmap");
const days = [];
if (!fs.existsSync(roadDir)) {
  fail("content/roadmap/ missing");
} else {
  for (const f of fs.readdirSync(roadDir).filter((x) => /^day-\d+\.mdx$/.test(x))) {
    const day = Number(f.match(/^day-(\d+)\.mdx$/)[1]);
    const raw = fs.readFileSync(path.join(roadDir, f), "utf8");
    const fm = raw.split(/^---\n/)[1] ?? "";
    if (!fm) fail(`roadmap/${f}: missing frontmatter`);
    if (!/title:/.test(fm)) fail(`roadmap/${f}: frontmatter has no title`);
    if (!/phase:/.test(fm)) fail(`roadmap/${f}: frontmatter has no phase`);
    if (!/<Quiz/.test(raw)) warn(`roadmap/${f}: no Quiz widget`);
    if (raw.length < 1200) warn(`roadmap/${f}: content looks thin (< ~40 lines)`);
    days.push(day);

    // resolve refs
    const refList = (name) => {
      const m = fm.match(new RegExp(`${name}:\\n((?:[ \\t]+-.*\\n)+)`, "m"))
        ?? fm.match(new RegExp(`${name}: \\[(.*)\\]`, "m"));
      if (!m) return [];
      const inner = m[1];
      return [...inner.matchAll(/"([^"]+)"/g)].map((x) => x[1])
        .concat([...inner.matchAll(/(^|,)\s*([a-z0-9\-/]+)\s*(,|$)/gm)].map((x) => x[2]));
    };
    for (const ref of refList("math")) {
      if (!mathSlugs.has(ref)) fail(`roadmap/${f}: math ref "${ref}" does not resolve to a lesson`);
    }
    for (const ref of refList("papers")) {
      if (!paperSlugs.includes(ref)) fail(`roadmap/${f}: papers ref "${ref}" not in papers/index.json`);
    }
    for (const ref of refList("blog")) {
      if (!blogSlugs.has(ref)) fail(`roadmap/${f}: blog ref "${ref}" does not resolve to a post`);
    }
  }
  const missing = [];
  for (let d = 1; d <= 60; d++) if (!days.includes(d)) missing.push(d);
  if (missing.length) warn(`missing roadmap days: ${missing.join(", ")}`);
  const dupes = days.filter((d, i) => days.indexOf(d) !== i);
  if (dupes.length) fail(`duplicate day numbers: ${[...new Set(dupes)].join(", ")}`);
}

/* glossary */
const glossaryFile = path.join(CONTENT, "glossary.json");
if (fs.existsSync(glossaryFile)) {
  try {
    const terms = JSON.parse(fs.readFileSync(glossaryFile, "utf8"));
    const seen = new Set();
    for (const t of terms) {
      if (!t.term) fail(`glossary entry missing "term"`);
      if (seen.has(t.term.toLowerCase())) fail(`duplicate glossary term: ${t.term}`);
      seen.add(t.term.toLowerCase());
      if (!t.definition) fail(`glossary "${t.term}": missing "definition"`);
      for (const ref of t.see?.math ?? []) {
        if (!mathSlugs.has(ref)) fail(`glossary "${t.term}": math ref "${ref}" does not resolve`);
      }
      for (const ref of t.see?.papers ?? []) {
        if (!paperSlugs.includes(ref)) fail(`glossary "${t.term}": papers ref "${ref}" not in papers/index.json`);
      }
      for (const ref of t.see?.blog ?? []) {
        if (!blogSlugs.has(ref)) fail(`glossary "${t.term}": blog ref "${ref}" does not resolve`);
      }
      for (const ref of t.see?.days ?? []) {
        if (!Number.isInteger(ref) || ref < 1 || ref > 60) fail(`glossary "${t.term}": day ref "${ref}" out of range`);
      }
    }
    console.log(`glossary terms: ${seen.size}`);
  } catch (e) {
    fail(`glossary.json is not valid JSON: ${e.message}`);
  }
} else {
  warn("content/glossary.json missing (glossary page will be empty)");
}

/* report */
const rel = (p) => path.relative(ROOT, p);
console.log(`papers: ${paperSlugs.length} · math lessons: ${mathSlugs.size} · blog posts: ${blogSlugs.size} · roadmap days: ${days.length}/60`);
if (warnings.length) console.log("\nWARNINGS:");
warnings.forEach((w) => console.log(`  ⚠ ${w}`));
if (errors.length) {
  console.log("\nERRORS:");
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log(errors.length ? "" : "\n✓ content OK");
