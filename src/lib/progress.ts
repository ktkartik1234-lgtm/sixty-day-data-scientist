"use client";

import { useCallback, useEffect, useState } from "react";
import { TOTAL_DAYS } from "./phases";

const STORAGE_KEY = "ds60-progress-v1";

export type Progress = {
  completed: number[]; // completed day numbers
  lastActive: string | null; // ISO date
};

function load(): Progress {
  if (typeof window === "undefined") return { completed: [], lastActive: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], lastActive: null };
    const parsed = JSON.parse(raw) as Progress;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.sort((a, b) => a - b) : [],
      lastActive: parsed.lastActive ?? null,
    };
  } catch {
    return { completed: [], lastActive: null };
  }
}

function save(progress: Progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("ds60-progress-changed"));
}

/** Shared localStorage progress store. Every hook instance re-reads on change events. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>({ completed: [], lastActive: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setProgress(load());
    refresh();
    setHydrated(true);
    window.addEventListener("ds60-progress-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("ds60-progress-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const toggleDay = useCallback((day: number) => {
    setProgress((prev) => {
      const completed = prev.completed.includes(day)
        ? prev.completed.filter((d) => d !== day)
        : [...prev.completed, day].sort((a, b) => a - b);
      const next: Progress = { completed, lastActive: new Date().toISOString() };
      save(next);
      return next;
    });
  }, []);

  const isDone = useCallback((day: number) => progress.completed.includes(day), [progress]);

  return {
    progress,
    hydrated,
    toggleDay,
    isDone,
    completedCount: progress.completed.length,
    percent: Math.round((progress.completed.length / TOTAL_DAYS) * 100),
    /** consecutive completed days starting from day 1 */
    streak: (() => {
      let s = 0;
      for (let d = 1; d <= TOTAL_DAYS; d++) {
        if (progress.completed.includes(d)) s++;
        else break;
      }
      return s;
    })(),
  };
}
