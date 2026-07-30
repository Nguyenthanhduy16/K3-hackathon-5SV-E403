"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlay,
  FileText,
  Library,
} from "lucide-react";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";
import type { CourseDay, Lang } from "@/lib/types";

interface Props {
  t: Dict;
  lang: Lang;
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

const SIDEBAR_W = 380;

export default function CourseSidebar({
  t,
  lang,
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
        aria-label={t.sidebar.title}
        className={[
          "fixed top-[84px] bottom-0 left-0 z-40 w-[86vw] max-w-[380px] shrink-0",
          "border-r border-slate-200 bg-white transition-transform duration-300 ease-out",
          "dark:border-slate-800 dark:bg-slate-900",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          // desktop: nằm trong luồng, thu gọn bằng chiều rộng
          "lg:static lg:max-w-none lg:translate-x-0 lg:overflow-hidden lg:shadow-none",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          collapsed ? "lg:w-0 lg:border-r-0" : "lg:w-[380px] xl:w-[386px]",
        ].join(" ")}
      >
        <div className="flex h-full w-full flex-col lg:w-[380px] xl:w-[386px]">
          <div className="flex shrink-0 items-start gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              <Library className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                {t.sidebar.title}
              </h2>
              <p className="mt-0.5 text-[12px] leading-snug text-slate-400 dark:text-slate-500">
                {t.sidebar.subtitle}
              </p>
            </div>
          </div>

          <div className="scroll-slim flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
            {days.map((day) => {
              const expanded = expandedDays.includes(day.id);
              const hasActive = day.documents.some((d) => d.id === activeDocId);
              return (
                <div
                  key={day.id}
                  className={[
                    "overflow-hidden rounded-2xl border transition-colors duration-200",
                    hasActive
                      ? "border-brand-200 bg-white dark:border-slate-700 dark:bg-slate-800/60"
                      : "border-slate-200/90 bg-slate-50/60 hover:border-brand-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => onToggleDay(day.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:-outline-offset-2"
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
                        {day.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold tracking-[0.06em] text-slate-400 dark:text-slate-500">
                        {t.sidebar.docsCount(day.documents.length)} ·{" "}
                        {t.sidebar.active}
                      </span>
                    </span>
                    {day.studying && (
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
                      <div className="space-y-1.5 px-3 pb-3">
                        <p className="px-1.5 pb-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          {lang === "vi" ? day.topic : day.topicEn}
                        </p>
                        {day.documents.map((doc) => {
                          const selected = doc.id === activeDocId;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => onSelectDoc(doc.id)}
                              aria-current={selected ? "true" : undefined}
                              className={[
                                "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-150",
                                "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none",
                                selected
                                  ? "border-brand-300 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10"
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
        className="absolute top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 transition-[left] duration-300 ease-out lg:inline-flex"
        style={{ left: collapsed ? 14 : SIDEBAR_W }}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
          className="grid h-16 w-7 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-md transition-colors duration-150 hover:text-brand-600 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </Tooltip>
    </>
  );
}
