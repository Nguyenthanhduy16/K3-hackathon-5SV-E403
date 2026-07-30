"use client";

import type { ReactNode } from "react";
import Tooltip from "./Tooltip";

interface Props {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  tooltipSide?: "top" | "bottom";
  className?: string;
}

export default function IconButton({
  label,
  onClick,
  children,
  active = false,
  danger = false,
  disabled = false,
  tooltipSide = "bottom",
  className = "",
}: Props) {
  const tone = active
    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
    : danger
      ? "text-slate-500 hover:bg-red-50 hover:text-vin-red dark:text-slate-400 dark:hover:bg-red-500/10"
      : "text-slate-500 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-brand-200";

  return (
    <Tooltip label={label} side={tooltipSide}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
        className={[
          "grid h-9 w-9 place-items-center rounded-xl transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none",
          "dark:focus-visible:ring-offset-slate-900",
          "disabled:cursor-not-allowed disabled:opacity-40",
          tone,
          className,
        ].join(" ")}
      >
        {children}
      </button>
    </Tooltip>
  );
}
