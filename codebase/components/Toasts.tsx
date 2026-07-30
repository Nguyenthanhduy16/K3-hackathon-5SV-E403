"use client";

import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { Toast } from "@/lib/types";

const TONE = {
  success: {
    icon: CircleCheck,
    ring: "ring-emerald-200 dark:ring-emerald-500/30",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  danger: {
    icon: CircleAlert,
    ring: "ring-red-200 dark:ring-red-500/30",
    color: "text-vin-red dark:text-red-400",
  },
  info: {
    icon: Info,
    ring: "ring-brand-200 dark:ring-brand-500/30",
    color: "text-brand-600 dark:text-brand-300",
  },
} as const;

export default function Toasts({ items }: { items: Toast[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-[96px] left-1/2 z-[70] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col items-center gap-2"
    >
      {items.map((toast) => {
        const tone = TONE[toast.tone];
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            className={`animate-fade-up flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-slate-700 shadow-lg ring-1 ${tone.ring} dark:bg-slate-800 dark:text-slate-100`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${tone.color}`} />
            <span className="text-center">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
