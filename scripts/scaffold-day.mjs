#!/usr/bin/env node
/**
 * Scaffold a roadmap day file: content/roadmap/day-XX.mdx
 * Usage: npm run scaffold:day -- 12 "Title of day 12"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "content", "roadmap");

const PHASES = [
  { id: 1, name: "Foundations", from: 1, to: 10 },
  { id: 2, name: "Data & Classical ML", from: 11, to: 22 },
  { id: 3, name: "Deep Learning", from: 23, to: 34 },
  { id: 4, name: "LLMs & GenAI", from: 35, to: 46 },
  { id: 5, name: "Agentic AI & MLOps", from: 47, to: 54 },
  { id: 6, name: "Capstone", from: 55, to: 60 },
];

const [dayArg, ...titleParts] = process.argv.slice(2);
const day = Number(dayArg);
const title = titleParts.join(" ") || "TODO: day title";

if (!Number.isInteger(day) || day < 1 || day > 60) {
  console.error("Usage: npm run scaffold:day -- <day 1-60> [title]");
  process.exit(1);
}

const phase = PHASES.find((p) => day >= p.from && day <= p.to);
const file = path.join(DIR, `day-${String(day).padStart(2, "0")}.mdx`);

if (fs.existsSync(file)) {
  console.error(`${file} already exists — refusing to overwrite.`);
  process.exit(1);
}

const body = `---
day: ${day}
title: "${title}"
phase: ${phase.id}
minutes: 60
objectives:
  - "TODO: first objective"
  - "TODO: second objective"
tags: ["${phase.name.toLowerCase().replace(/[^a-z]+/g, "-")}"]
math: []        # e.g. ["linear-algebra/vectors-and-matrices"]
papers: []      # e.g. ["attention-is-all-you-need"]
blog: []        # e.g. ["hello-60-days"]
---

TODO: theory sections. Use Callout, Quiz and Solution components, e.g.:

<Quiz
  question="TODO"
  options={["A", "B", "C", "D"]}
  answer={0}
  explanation="TODO"
/>
`;

fs.writeFileSync(file, body, "utf8");
console.log(`Created ${path.relative(ROOT, file)} (Phase ${phase.id}: ${phase.name})`);
