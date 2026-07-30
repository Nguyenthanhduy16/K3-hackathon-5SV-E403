"use client";

import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onClick: () => void;
  label: string;
  ariaLabel: string;
}

/**
 * Nút mở trợ lý AI trên header — bo tròn, gradient xanh thương hiệu,
 * nổi nhẹ khi rê chuột và có chấm trạng thái nhấp nháy khi panel đang đóng.
 */
export default function AIAssistantButton({
  open,
  onClick,
  label,
  ariaLabel,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={open}
      className={[
        "group relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5",
        "text-sm font-semibold text-white",
        "bg-gradient-to-r from-brand-600 to-brand-500",
        "shadow-[0_6px_16px_-6px_rgba(37,87,217,0.75)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(37,87,217,0.85)]",
        "active:translate-y-0 active:shadow-[0_4px_10px_-6px_rgba(37,87,217,0.9)]",
        "focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:outline-none",
        "dark:focus-visible:ring-offset-slate-900",
        open ? "from-brand-700 to-brand-600 ring-2 ring-brand-300/70" : "",
      ].join(" ")}
    >
      <span className="relative grid h-5 w-5 place-items-center">
        <Sparkles
          className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-12"
          strokeWidth={2.2}
        />
      </span>
      <span className="hidden sm:inline">{label}</span>
      {!open && (
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5">
          <span className="pulse-ring absolute inset-0 rounded-full text-emerald-400" />
          <span className="absolute inset-0 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
        </span>
      )}
    </button>
  );
}
