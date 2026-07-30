"use client";

import {
  Bot,
  Copy,
  FileText,
  Layers,
  Library,
  Maximize2,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import AnswerBlocks from "./AnswerBlocks";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";
import type { ChatMsg, ScopeLevel } from "@/lib/types";

interface Props {
  t: Dict;
  message: ChatMsg;
  text: string;
  onFeedback: (id: string, value: "up" | "down") => void;
  onCopy: (text: string) => void;
  onRegenerate: (id: string) => void;
  onJumpToPage: (page: number, docId?: string) => void;
  compact?: boolean;
}

const SCOPE_ICON: Record<ScopeLevel, typeof FileText> = {
  page: FileText,
  session: Layers,
  course: Library,
};

const SCOPE_TONE: Record<ScopeLevel, string> = {
  page: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  session:
    "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200",
  course:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
};

export default function ChatMessage({
  t,
  message,
  text,
  onFeedback,
  onCopy,
  onRegenerate,
  onJumpToPage,
  compact = false,
}: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="animate-fade-up flex justify-end px-4">
        <div className="max-w-[86%]">
          <div className="rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line text-white shadow-sm">
            {text}
          </div>
          <p className="mt-1 pr-1 text-right text-[10px] text-slate-400 dark:text-slate-500">
            {message.time}
          </p>
        </div>
      </div>
    );
  }

  const actionBtn =
    "grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:bg-slate-700 dark:hover:text-brand-200";

  const scope = message.scope;
  const ScopeIcon = scope ? SCOPE_ICON[scope.level] : FileText;

  return (
    <div className="animate-fade-up flex gap-2.5 px-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
        <Bot className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        {/* Phạm vi truy xuất đã dùng cho lượt trả lời này */}
        {scope && (
          <div className="mb-1.5 space-y-1">
            <span
              className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-1 text-[10.5px] font-semibold ${SCOPE_TONE[scope.level]}`}
            >
              <ScopeIcon className="h-3 w-3 shrink-0" />
              <span className="truncate">{scope.label}</span>
              <span className="hidden opacity-70 sm:inline">· {scope.detail}</span>
            </span>
            {scope.expandedFromPage !== undefined && (
              <p className="flex items-start gap-1 text-[10.5px] leading-snug text-brand-600 dark:text-brand-300">
                <Maximize2 className="mt-[2px] h-3 w-3 shrink-0 rotate-45" />
                {t.chat.expandedNote(scope.expandedFromPage, scope.label)}
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3.5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {message.blocks?.length && !compact ? (
            <AnswerBlocks t={t} blocks={message.blocks} onJumpToPage={onJumpToPage} />
          ) : (
            <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
              {text}
            </p>
          )}
        </div>

        {/* Trích dẫn trang — bấm để nhảy tới slide */}
        {message.citations && message.citations.length > 0 && !compact && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
              {t.chat.citations}
            </span>
            {message.citations.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onJumpToPage(p)}
                title={t.chat.openPage(p)}
                className="inline-flex items-center gap-1 rounded-lg border border-brand-100 bg-brand-50/70 px-2 py-1 font-mono text-[10.5px] font-bold text-brand-800 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-200"
              >
                <FileText className="h-3 w-3" />
                {p}
              </button>
            ))}
          </div>
        )}

        {message.sourcePage !== undefined && !message.citations?.length && (
          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50/70 px-2.5 py-1.5 text-[11px] font-medium text-brand-800 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-200">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t.chat.source(message.sourcePage)}</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center gap-0.5">
          <Tooltip label={t.chat.like} side="top">
            <button
              type="button"
              aria-label={t.chat.like}
              aria-pressed={message.feedback === "up"}
              onClick={() => onFeedback(message.id, "up")}
              className={`${actionBtn} ${message.feedback === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" : ""}`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip label={t.chat.dislike} side="top">
            <button
              type="button"
              aria-label={t.chat.dislike}
              aria-pressed={message.feedback === "down"}
              onClick={() => onFeedback(message.id, "down")}
              className={`${actionBtn} ${message.feedback === "down" ? "bg-red-50 text-vin-red dark:bg-red-500/15 dark:text-red-300" : ""}`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Tooltip label={t.chat.copy} side="top">
            <button
              type="button"
              aria-label={t.chat.copy}
              onClick={() => onCopy(text)}
              className={actionBtn}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          {!compact && (
            <Tooltip label={t.chat.regenerate} side="top">
              <button
                type="button"
                aria-label={t.chat.regenerate}
                onClick={() => onRegenerate(message.id)}
                className={actionBtn}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          )}
          <span className="ml-1 text-[10px] text-slate-400 dark:text-slate-500">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
}
