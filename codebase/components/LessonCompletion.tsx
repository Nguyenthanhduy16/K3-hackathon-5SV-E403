"use client";

import { CircleCheck, Sparkles } from "lucide-react";
import type { Dict } from "@/lib/i18n";

interface Props {
  t: Dict;
  completed: boolean;
  isSummarizing: boolean;
  onComplete: () => void;
}

export default function LessonCompletion({ t, completed, isSummarizing, onComplete }: Props) {
  const Icon = completed ? CircleCheck : Sparkles;
  const buttonLabel = completed
    ? t.lesson.completedButton
    : isSummarizing
      ? t.lesson.summarizingButton
      : t.lesson.completeButton;

  return (
    <section aria-live="polite" className="shrink-0 border-t border-slate-200 bg-white/90 px-3 py-2.5 sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      <div className={`mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border px-3 py-2.5 sm:px-4 ${completed ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40" : "border-brand-100 bg-brand-50 dark:border-slate-700 dark:bg-slate-800"}`}>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${completed ? "bg-emerald-600 text-white" : "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200"}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-bold text-slate-700 dark:text-slate-100">
            {completed ? t.lesson.completedTitle : t.lesson.readyTitle}
          </p>
          <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
            {completed ? t.lesson.completedDescription : t.lesson.readyDescription}
          </p>
        </div>
        <button type="button" onClick={onComplete} disabled={completed || isSummarizing} className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-[12px] font-bold focus-visible:ring-2 focus-visible:outline-none ${completed ? "cursor-default bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200" : "bg-brand-600 text-white hover:bg-brand-700 disabled:cursor-wait disabled:bg-brand-400"}`}>
          <Icon className="h-4 w-4" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </section>
  );
}
