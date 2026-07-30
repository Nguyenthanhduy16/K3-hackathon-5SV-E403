"use client";

import { Sparkles } from "lucide-react";

export interface Suggestion {
  text: string;
  tag: string;
}

interface Props {
  label: string;
  questions: readonly Suggestion[];
  onPick: (q: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  label,
  questions,
  onPick,
  disabled = false,
}: Props) {
  return (
    <div className="px-4 pb-2">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase dark:text-slate-500">
        <Sparkles className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q) => (
          <button
            key={q.text}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q.text)}
            className="group/chip flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50/70 py-1.5 pr-2 pl-3 text-[12px] font-medium text-brand-800 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-200 dark:hover:bg-slate-700"
          >
            {q.text}
            <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-brand-600 uppercase dark:bg-slate-900/70 dark:text-brand-300">
              {q.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
