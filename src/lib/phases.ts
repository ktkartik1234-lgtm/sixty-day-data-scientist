export type Phase = {
  id: number;
  name: string;
  from: number;
  to: number;
  color: string; // tailwind classes for chips / cells
  blurb: string;
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Foundations",
    from: 1,
    to: 10,
    color: "bg-sky-500",
    blurb:
      "Math for AI (linear algebra, calculus, probability & statistics), Python, NumPy and Git — the toolkit everything else stands on.",
  },
  {
    id: 2,
    name: "Data & Classical ML",
    from: 11,
    to: 22,
    color: "bg-emerald-500",
    blurb:
      "Pandas, SQL, cleaning, EDA, then the classical ML toolbox: regression, trees, ensembles, evaluation and feature engineering.",
  },
  {
    id: 3,
    name: "Deep Learning",
    from: 23,
    to: 34,
    color: "bg-amber-500",
    blurb:
      "PyTorch, backprop, training loops, CNNs, transfer learning and the attention mechanism that leads into transformers.",
  },
  {
    id: 4,
    name: "LLMs & GenAI",
    from: 35,
    to: 46,
    color: "bg-accent-500",
    blurb:
      "Tokenization, embeddings, prompt engineering, RAG with vector databases, fine-tuning with LoRA, and LLM evaluation.",
  },
  {
    id: 5,
    name: "Agentic AI & MLOps",
    from: 47,
    to: 54,
    color: "bg-rose-500",
    blurb:
      "Tool use, agent orchestration and MCP, then shipping: FastAPI serving, Docker, CI/CD and model monitoring.",
  },
  {
    id: 6,
    name: "Capstone",
    from: 55,
    to: 60,
    color: "bg-indigo-500",
    blurb:
      "One end-to-end project — the Financial Stress Prediction challenge — from problem framing to a deployed demo and write-up.",
  },
];

export function phaseOf(day: number): Phase {
  return PHASES.find((p) => day >= p.from && day <= p.to) ?? PHASES[0];
}

export const TOTAL_DAYS = 60;
