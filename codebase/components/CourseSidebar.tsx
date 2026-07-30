"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlay,
  FileText,
  BookOpen,
} from "lucide-react";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";
import type { CourseDay } from "@/lib/types";

interface Props {
  t: Dict;
  days: CourseDay[];
  expandedDays: string[];
  activeDocId: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleDay: (dayId: string) => void;
  onSelectDoc: (docId: string) => void;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}


function formatDayLabel(label: string) {
  const number = label.match(/\d+/)?.[0];
  return number ? `Day${number.padStart(2, "0")}` : label;
}

export default function CourseSidebar({
  t,
  days,
  expandedDays,
  activeDocId,
  collapsed,
  mobileOpen,
  onToggleDay,
  onSelectDoc,
  onToggleCollapsed,
  onCloseMobile,
}: Props) {
  return (
    <>
      {/* nền mờ khi mở dạng drawer trên mobile */}
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={[
          "fixed inset-x-0 top-[84px] bottom-0 z-30 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        id="course-materials-sidebar"
        aria-label={t.sidebar.title}
        aria-hidden={collapsed && !mobileOpen}
        inert={collapsed && !mobileOpen}
        className={[
          "fixed top-[84px] bottom-0 left-0 z-40 w-[86vw] max-w-[390px] shrink-0",
          "border-r border-slate-200 bg-white transition-transform duration-300 ease-out",
          "dark:border-slate-800 dark:bg-slate-900",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          // desktop: nằm trong luồng, thu gọn bằng chiều rộng
          "lg:static lg:max-w-none lg:translate-x-0 lg:overflow-hidden lg:shadow-none",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          collapsed ? "lg:w-0 lg:border-r-0" : "lg:w-[390px]",
        ].join(" ")}
      >
        <div className="flex h-full w-full flex-col lg:w-[390px]">
          <div className="mx-3 flex shrink-0 items-center gap-3 border-b border-slate-200 py-3.5 dark:border-slate-800">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-200 bg-brand-50/60 text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[17px] leading-tight font-bold text-slate-900 dark:text-white">
                {t.sidebar.title}
              </h2>
              <p className="mt-0.5 text-[12px] leading-snug text-slate-400 dark:text-slate-500">
                {t.sidebar.subtitle}
              </p>
            </div>
          </div>

          <div className="scroll-slim flex-1 space-y-4 overflow-y-auto px-3 py-5">
            {days.map((day) => {
              const expanded = expandedDays.includes(day.id);
              const hasActive = day.documents.some((d) => d.id === activeDocId);
              return (
                <div
                  key={day.id}
                  className={[
                    "overflow-hidden rounded-2xl border transition-all duration-200",
                    hasActive
                      ? "border-brand-300 bg-brand-50/70 shadow-[0_6px_18px_-12px_rgba(37,87,217,0.7)] dark:border-brand-500/40 dark:bg-brand-500/10"
                      : "border-slate-200 bg-slate-50/70 hover:border-brand-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => onToggleDay(day.id)}
                    aria-expanded={expanded}
                    className="flex min-h-20 w-full items-center gap-3 px-4 py-4 text-left focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:-outline-offset-2"
                  >
                    <CirclePlay
                      className={[
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        hasActive
                          ? "text-brand-600 dark:text-brand-300"
                          : "text-slate-400 dark:text-slate-500",
                      ].join(" ")}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-slate-900 dark:text-white">
                        {formatDayLabel(day.label)}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold tracking-[0.06em] text-slate-400 dark:text-slate-500">
                        {t.sidebar.docsCount(day.documents.length)} ·{" "}
                        {t.sidebar.active}
                      </span>
                    </span>
                    {hasActive && (
                      <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-extrabold tracking-[0.08em] text-brand-700 ring-1 ring-brand-100 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/25">
                        {t.sidebar.studying}
                      </span>
                    )}
                    <ChevronDown
                      className={[
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300",
                        expanded ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  <div
                    className={[
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-1.5 px-2.5 pb-2.5">
                        {day.documents.map((doc) => {
                          const selected = doc.id === activeDocId;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => onSelectDoc(doc.id)}
                              aria-current={selected ? "true" : undefined}
                              className={[
                                "relative flex min-h-20 w-full items-center gap-2.5 overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-all duration-150",
                                "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none",
                                selected
                                  ? "border-brand-200 border-l-4 border-l-brand-700 bg-white shadow-[0_5px_14px_-8px_rgba(15,23,42,0.35)] dark:border-brand-500/40 dark:border-l-brand-400 dark:bg-slate-800"
                                  : "border-transparent hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-800",
                              ].join(" ")}
                            >
                              {selected ? (
                                <CirclePlay className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
                              ) : (
                                <FileText className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span
                                  className={[
                                    "block truncate text-[13px] font-semibold",
                                    selected
                                      ? "text-brand-800 dark:text-brand-200"
                                      : "text-slate-700 dark:text-slate-200",
                                  ].join(" ")}
                                >
                                  {doc.name}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-400 dark:text-slate-500">
                                  {t.sidebar.pages(doc.pages)}
                                </span>
                              </span>
                              {selected && (
                                <CircleCheck className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* tay cầm thu gọn / mở rộng ở cạnh sidebar (desktop) */}
      <Tooltip
        label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
        side="top"
        className={[
          "top-1/2 z-50 hidden -translate-y-1/2 transition-[left] duration-300 ease-out lg:inline-flex",
          collapsed ? "left-0" : "left-[390px]",
        ].join(" ")}
        style={{ position: "absolute" }}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
          aria-controls="course-materials-sidebar"
          aria-expanded={!collapsed}
          className="grid h-20 w-12 place-items-center rounded-r-2xl border border-l-0 border-slate-200 bg-white text-slate-400 shadow-[0_5px_18px_rgba(15,23,42,0.14)] transition-all duration-150 hover:bg-brand-50 hover:text-brand-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </Tooltip>
    </>
  );
}
