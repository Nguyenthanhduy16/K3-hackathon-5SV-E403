"use client";

import { ArrowLeft, BookOpen, Moon, PanelLeft, Sun, UserRound } from "lucide-react";
import AIAssistantButton from "./AIAssistantButton";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";
import type { Lang, Theme } from "@/lib/types";

interface Props {
  t: Dict;
  docName: string;
  docMeta: string;
  lang: Lang;
  theme: Theme;
  chatOpen: boolean;
  mobileSidebarOpen: boolean;
  onBack: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onToggleChat: () => void;
  onToggleMobileSidebar: () => void;
}

function VLearnLogo() {
  return (
    <span className="flex items-center gap-2">
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 text-brand-700 dark:text-brand-300"
      >
        <path
          d="M3.5 4h6.2l6.3 12.4L22.3 4h6.2L16 28.4 3.5 4Z"
          fill="currentColor"
        />
        <path d="M12.9 4h6.2L16 10.1 12.9 4Z" fill="currentColor" opacity="0.45" />
      </svg>
      <span className="text-[19px] font-bold tracking-tight text-brand-900 dark:text-white">
        VLearn
      </span>
    </span>
  );
}

export default function Header({
  t,
  docName,
  docMeta,
  lang,
  theme,
  chatOpen,
  mobileSidebarOpen,
  onBack,
  onToggleLang,
  onToggleTheme,
  onToggleChat,
  onToggleMobileSidebar,
}: Props) {
  return (
    <header className="z-50 flex h-[84px] shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white px-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-5 dark:border-slate-800 dark:bg-slate-900">
      {/* ---------- trái ---------- */}
      <Tooltip label={t.header.back}>
        <button
          type="button"
          onClick={onBack}
          aria-label={t.header.back}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-150 hover:-translate-x-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>

      <div className="hidden shrink-0 sm:block">
        <VLearnLogo />
      </div>

      <span
        aria-hidden="true"
        className="hidden h-9 w-px shrink-0 bg-slate-200 lg:block dark:bg-slate-700"
      />

      {/* nút mở học liệu — chỉ hiện trên tablet / mobile */}
      <Tooltip label={mobileSidebarOpen ? t.header.closeLibrary : t.header.openLibrary}>
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label={
            mobileSidebarOpen ? t.header.closeLibrary : t.header.openLibrary
          }
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <PanelLeft className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>

      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700 sm:grid dark:border-slate-700 dark:bg-slate-800 dark:text-brand-300">
          <BookOpen className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] leading-tight font-bold text-slate-900 sm:text-[17px] dark:text-white">
            {docName}
          </h1>
          <p className="mt-0.5 hidden truncate font-mono text-[11px] text-slate-400 sm:block dark:text-slate-500">
            {docMeta}
          </p>
        </div>
      </div>

      {/* ---------- phải ---------- */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <AIAssistantButton
          open={chatOpen}
          onClick={onToggleChat}
          label={t.header.aiAssistant}
          ariaLabel={chatOpen ? t.header.aiAssistantClose : t.header.aiAssistantOpen}
        />

        <Tooltip label={t.header.langTooltip}>
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={t.header.langTooltip}
            className="grid h-10 w-11 place-items-center rounded-xl text-[13px] font-bold tracking-wide text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {lang === "vi" ? "VI" : "EN"}
          </button>
        </Tooltip>

        <Tooltip label={theme === "light" ? t.header.themeToDark : t.header.themeToLight}>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === "light" ? t.header.themeToDark : t.header.themeToLight
            }
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === "light" ? (
              <Moon className="h-[18px] w-[18px]" />
            ) : (
              <Sun className="h-[18px] w-[18px]" />
            )}
          </button>
        </Tooltip>

        <Tooltip label={t.header.accountTooltip}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 pr-2 pl-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none sm:pr-4 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-slate-700 dark:text-brand-200">
              <UserRound className="h-3.5 w-3.5" />
            </span>
            <span className="hidden whitespace-nowrap sm:inline">
              {t.header.account}
            </span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
