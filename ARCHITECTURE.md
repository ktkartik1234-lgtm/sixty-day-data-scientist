# Architecture — 60 Day Data Scientist

A content-driven Next.js web app: the A–Z of data science in 60 days, with a
day-by-day roadmap, mathematics tracks, a research-paper library and a blog.
Inspired by the [roadmap.sh AI-engineer path](https://roadmap.sh/r/ai-roadmap-for-2026---final-draft),
restructured into 60 daily units.

## Decisions (agreed)

| Decision | Choice |
|---|---|
| Stack | Next.js 15 (App Router, TypeScript) + Tailwind CSS |
| Content store | MDX/JSON files in the repo ("content as database") |
| Progress tracking | localStorage in the browser — no accounts in v1 |
| Hosting | Local dev now; Vercel-ready (`next build` with no server dependencies) |

## The core idea

All four features are **content types with typed cross-links**:

```
Roadmap day ──frontmatter refs──▶ Math lesson   (math: ["linear-algebra/vectors-and-matrices"])
          ├──frontmatter refs──▶ Paper          (papers: ["xgboost"])
          └──frontmatter refs──▶ Blog post      (blog: ["case-study-financial-stress"])
```

A learner on Day 2 lands on the exact eigenvector lesson and the LoRA paper that
uses that math. The cross-links are resolved at build time from frontmatter —
no database, no runtime graph.

## Layout

```
sixty-day-data-scientist/
├── content/                      ← ALL content (git-versioned, the "database")
│   ├── blog/*.mdx                posts: title/date/tags frontmatter
│   ├── papers/index.json         paper library: metadata, summaries, takeaways, day refs
│   ├── math/<track>/             one folder per track (_meta.json = display name)
│   │   ├── _meta.json
│   │   └── *.mdx                 lessons with KaTeX math, resources, Quiz/Solution
│   └── roadmap/day-XX.mdx        60 day files (5 shipped, rest via scaffold script)
├── scripts/scaffold-day.mjs      `npm run scaffold:day -- 12 "Title"` → day template
├── src/
│   ├── app/
│   │   ├── page.tsx              landing: hero, feature cards, phase overview
│   │   ├── roadmap/              overview (all 60 slots, progress grid) …
│   │   │   └── day/[day]/        … day detail: MDX, objectives, toggle, prev/next, related
│   │   ├── math/                 track list …
│   │   │   └── [track]/[lesson]/ … lesson page with KaTeX
│   │   ├── papers/               library + client-side search/tag filter
│   │   └── blog/                 list + post pages
│   ├── components/
│   │   ├── SiteHeader.tsx        nav + live progress badge
│   │   ├── ProgressBadge.tsx     header pill (client)
│   │   ├── ProgressSummary.tsx   count / streak / bar (client)
│   │   ├── RoadmapProgressGrid.tsx  60-cell grid, colored by phase, filled when done
│   │   ├── DayProgressToggle.tsx mark-complete button (client)
│   │   ├── PapersBrowser.tsx     client filter/search over paper JSON
│   │   └── mdx/                  widget set embedded from content:
│   │       ├── MDXRenderer.tsx   next-mdx-remote/rsc + remark-math/rehype-katex
│   │       ├── Callout.tsx       info/tip/warn/deep aside
│   │       ├── Quiz.tsx          interactive multiple choice
│   │       └── Solution.tsx      collapsible worked solution
│   └── lib/
│       ├── content.ts            fs loaders: blog, roadmap, math tracks, papers
│       ├── phases.ts             the 6 phases (ranges, colors, blurbs) — single source
│       └── progress.ts           localStorage store + React hook (cross-tab sync)
└── ARCHITECTURE.md / README.md
```

## Rendering model

- **Static-first.** Every route is a server component; `generateStaticParams`
  covers all existing blog posts, day files and math lessons. `dynamicParams = false`
  means a missing day 404s instead of rendering an empty page.
- **MDX is compiled per request/build** from `/content` by
  `next-mdx-remote/rsc`, with `remark-gfm` + `remark-math` + `rehype-katex`.
  Content files never touch the app bundle — add a file, get a page.
- **Interactivity is islands**: quiz, progress toggle and papers filter are the
  only client components; everything else ships zero JS.

## Progress store (v1)

`src/lib/progress.ts` — a tiny localStorage store (`ds60-progress-v1`) holding
`completed: number[]` + `lastActive`. Hook `useProgress()` re-reads on a custom
event, so the header badge, day toggle and roadmap grid stay in sync across tabs.
Migration path to accounts later: swap the storage functions for API calls; the
hook's shape (`completed`, `toggleDay`, `streak`) is the contract.

## The 60-day curriculum (roadmap.sh-inspired)

| Phase | Days | Focus |
|---|---|---|
| 1. Foundations | 1–10 | Python/NumPy/Git, linear algebra, calculus, probability & statistics |
| 2. Data & Classical ML | 11–22 | pandas, SQL, EDA, regression, trees & ensembles, evaluation, feature engineering, unsupervised |
| 3. Deep Learning | 23–34 | PyTorch, backprop, optimization, CNNs, transfer learning, attention → transformers |
| 4. LLMs & GenAI | 35–46 | prompting, embeddings, RAG + vector DBs, fine-tuning (LoRA), LLM evaluation, multimodal |
| 5. Agentic AI & MLOps | 47–54 | tool use, agents & MCP, FastAPI serving, Docker, CI/CD, monitoring |
| 6. Capstone | 55–60 | the Financial Stress Prediction challenge end-to-end, deployed |

Phase metadata lives once in `src/lib/phases.ts`; day files declare their phase
number and the UI derives everything else.

## Content ops

- New day: `npm run scaffold:day -- 12 "Title of day 12"` → fills frontmatter
  with correct phase, inserts a Quiz stub.
- New math track: create `content/math/<track>/_meta.json` + lesson `.mdx` files.
- New paper: append to `content/papers/index.json` (slug, authors, year, tags,
  link, summary, takeaways, roadmap `days` back-references).
- **Validation:** `npm run validate:content` checks that all 60 days exist,
  every `math`/`papers`/`blog` cross-reference resolves to real content, paper
  JSON parses with all required fields, and slugs are unique. Missing days are
  warnings (rendered as "Coming soon" slots); broken refs are errors.
- **Full check:** `npm run build` compiles every MDX file — the gate before
  committing content, since it catches JSX/MDX syntax errors the validator
  can't see (e.g. bare `<` or `{` in prose).
- Missing day files render as "Coming soon" slots on the roadmap — the site is
  never broken by unfinished content.

## Running & operating

| Task | Command |
|---|---|
| Develop (hot reload on content) | `npm run dev` → http://localhost:3000 |
| Full compile + typecheck + prerender | `npm run build` |
| Serve production build | `npm run start` |
| Validate content integrity | `npm run validate:content` |
| Generate a day template | `npm run scaffold:day -- <1-60> "Title"` |

Windows note: if PowerShell reports "running scripts is disabled", that is the
OS execution policy blocking `npm.ps1` — use Git Bash/cmd, call `npm.cmd run
dev`, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.

Deployment target is Vercel: push to GitHub, import at vercel.com/new — the
app has no server or database, so zero configuration is needed beyond the
auto-detected Next.js preset.

## Deployment

No server, no database: `npm run build` produces a fully static-ish Next.js
output deployable to Vercel (`vercel` CLI or GitHub import) with zero config.
Databases/auth, if ever needed (accounts, server-side progress), slot in later
via API routes without restructuring content.
