"use client";

import { useState } from "react";

export type QuizProps = {
  question: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explanation?: string;
};

/** Interactive multiple-choice quiz embedded from MDX. */
export default function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-xl border border-ink-600 bg-ink-800/60 p-4">
      <p className="font-medium text-zinc-100">{question}</p>
      <div className="mt-3 space-y-2">
        {options.map((opt, i) => {
          const isAnswer = i === answer;
          const isPicked = i === picked;
          let cls = "border-ink-600 bg-ink-700/60 text-zinc-300 hover:border-accent-500/50";
          if (picked !== null && isAnswer)
            cls = "border-emerald-500/60 bg-emerald-500/10 text-emerald-200";
          else if (isPicked && !isAnswer)
            cls = "border-rose-500/60 bg-rose-500/10 text-rose-200";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}
            >
              <span className="mr-2 font-mono text-xs text-zinc-500">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-3 text-sm text-zinc-400">
          {picked === answer ? "✅ Correct. " : "❌ Not quite. "}
          {explanation}
        </p>
      )}
    </div>
  );
}
