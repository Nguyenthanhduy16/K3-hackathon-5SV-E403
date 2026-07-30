"use client";

import type { CSSProperties, ReactNode } from "react";

interface Props {
  label: string;
  side?: "top" | "bottom";
  children: ReactNode;
  className?: string;
  /** Cho phép nơi gọi tự định vị lớp bọc (ví dụ tay cầm thu gọn sidebar). */
  style?: CSSProperties;
}

export default function Tooltip({
  label,
  side = "bottom",
  children,
  className = "",
  style,
}: Props) {
  return (
    <span className={`group/tt relative inline-flex ${className}`} style={style}>
      {children}
      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-lg",
          "bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-white shadow-lg",
          "opacity-0 transition-all duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          "dark:bg-slate-700",
          side === "bottom"
            ? "top-[calc(100%+10px)] translate-y-1 group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0"
            : "bottom-[calc(100%+10px)] -translate-y-1 group-hover/tt:translate-y-0 group-focus-within/tt:translate-y-0",
        ].join(" ")}
      >
        {label}
      </span>
    </span>
  );
}
