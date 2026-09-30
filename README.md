# 60 Day Data Scientist

A web app for the **A–Z of data science in 60 days**: a day-by-day roadmap with
progress tracking, mathematics tracks with curated resources, a research paper
library, and a blog — all cross-linked so you learn the right math and read the
right paper on the exact day you need it.

Lives inside the `financial_stress_prediction_challenge` workspace and uses its
Financial Stress Prediction pipeline as the Phase 6 capstone.

---

## 1. Running the app

Prerequisites: **Node.js 18.18+** (Node 20/24 recommended). Dependencies are
already installed in `node_modules/` if you received this project set up; if
not, run `npm install` once.

### 1.1 The PowerShell "scripts disabled" error (Windows)

If PowerShell says `running scripts is disabled on this system`, that is
PowerShell's execution policy blocking `npm.ps1` — **not** a problem with this
project. Any one of these fixes it:

| Option | Command | Notes |
|---|---|---|
| Use Git Bash or cmd instead | `cd sixty-day-data-scientist` then `npm run dev` | Nothing to change |
| Call the `.cmd` shim in PowerShell | `npm.cmd run dev` | Works immediately |
| One-time policy fix (npm's official recommendation) | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` | Your user only; after this plain `npm run dev` works everywhere |

### 1.2 The three run modes

```bash
cd sixty-day-data-scientist

npm run dev          # development — hot reload; content edits show on refresh
npm run build        # production build — also type-checks and prerenders every page
npm run start        # serve the production build (run `build` first)
```

- Use **`dev`** while writing/editing content — any file under `content/`
  appears on a browser refresh, no restart.
- Run **`build`** before deploying or committing big content changes — it
  compiles every MDX file, so it catches syntax errors, bad component props
  and broken pages across all 60 days.
- Run **`validate:content`** anytime to check cross-references (see §3).

The site is at **http://localhost:3000** in every mode. Dev mode also listens
on your LAN (printed in the terminal) — handy for checking on a phone.

### 1.3 Deploying to Vercel (optional, free)

The app has no server or database, so it deploys as-is:

1. Push the project folder to a GitHub repository (don't commit
   `node_modules/` or `.next/` — already in `.gitignore`).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Accept the auto-detected settings (framework: Next.js) and deploy.

CLI alternative: `npx vercel` from this folder.

---

## 2. What's inside

- **/roadmap** — all 60 days across 6 phases (Foundations → Data & Classical
  ML → Deep Learning → LLMs & GenAI → Agentic AI & MLOps → Capstone). Each day:
  objectives, theory with math/code, curated resources, exercises and a quiz.
  Mark days complete; progress + streak persist in your browser.
- **/math** — five tracks (Linear Algebra, Probability, Calculus, Statistics,
  Optimization) with KaTeX-rendered lessons, curated resources, worked problems
  and quizzes.
- **/papers** — 9-paper curated library with plain-language summaries, key
  takeaways, tags, search, and back-references to roadmap days.
- **/blog** — MDX posts with embedded math, code and interactive widgets.

---

## 3. Authoring content (the main workflow)

All content lives in `content/` as plain files — the site is a *renderer*.
You never touch `src/` to add content.

| To add… | Do this |
|---|---|
| A roadmap day | `npm run scaffold:day -- 12 "Day title"` then edit `content/roadmap/day-12.mdx` |
| A math lesson | New `.mdx` in `content/math/<track>/` (frontmatter: `title`, `summary`, `order`) |
| A math track | New folder `content/math/<track>/` + optional `_meta.json` (`{"name": ..., "description": ...}`) |
| A paper | Append to `content/papers/index.json` (fields: slug, title, authors, year, venue, tags, link, summary, keyTakeaways, days) |
| A blog post | New `.mdx` in `content/blog/` with `title/date/description/tags` frontmatter |

### 3.1 Cross-linking (the site's core mechanism)

Days link to lessons/papers/posts via frontmatter — the day page renders them
as "Related on this site" cards:

```yaml
math:   ["linear-algebra/vectors-and-matrices"]   # "track/lesson" paths
papers: ["xgboost"]                               # slugs from papers/index.json
blog:   ["case-study-financial-stress"]           # post file names
```

### 3.2 MDX widgets available in any content file

```jsx
<Callout kind="tip|info|warn|deep" title="Optional">…text…</Callout>
<Quiz question="…" options={["a", "b", "c", "d"]} answer={0} explanation="…" />
<Solution>…worked answer…</Solution>
```

Math: `$inline$` and `$$display$$` (KaTeX). ⚠ In MDX prose, never write bare
`<` or `{` — wrap in backticks or use words, or the build fails.

### 3.3 Validating before you commit

```bash
npm run validate:content   # checks: 60 days exist, all cross-refs resolve, JSON valid
npm run build              # compiles every MDX file — catches syntax errors
```

The validator reports missing days as warnings (the site shows them as
"Coming soon" slots), and broken cross-references or duplicate slugs as
errors.

---

## 4. Tech

Next.js 15 (App Router) · TypeScript · Tailwind CSS · MDX via
next-mdx-remote/rsc · KaTeX · localStorage progress (no accounts) · Vercel-ready.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design.
