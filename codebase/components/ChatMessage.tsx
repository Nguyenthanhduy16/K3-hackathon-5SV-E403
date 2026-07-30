"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  ChevronDown,
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
import type { AnswerBlock, ChatMsg, ScopeLevel } from "@/lib/types";

interface Props {
  t: Dict;
  message: ChatMsg;
  text: string;
  docName: string;
  dayLabel: string;
  onFeedback: (id: string, value: "up" | "down") => void;
  onCopy: (text: string) => void;
  onRegenerate: (id: string) => void;
  onJumpToPage: (page: number, docId?: string) => void;
  compact?: boolean;
}

interface CitationSource {
  key: string;
  title: string;
  detail: string;
  docId?: string;
  pages: number[];
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

function pagesLabel(t: Dict, pages: number[]) {
  if (pages.length === 1) return t.chat.pageShort(pages[0]);
  return pages.map((page) => page.toString()).join(", ");
}

function addSourcePage(
  groups: Map<string, Omit<CitationSource, "pages"> & { pages: Set<number> }>,
  source: Omit<CitationSource, "pages">,
  page: number,
) {
  const existing = groups.get(source.key);
  if (existing) {
    existing.pages.add(page);
    return;
  }
  groups.set(source.key, { ...source, pages: new Set([page]) });
}

function collectHitSources(blocks: AnswerBlock[] | undefined) {
  const hits: Array<{ page: number; docId?: string; source: string; title: string }> = [];
  blocks?.forEach((block) => {
    if (block.kind !== "hits") return;
    block.items.forEach((item) => {
      if (!item.source) return;
      hits.push({
        page: item.page,
        docId: item.docId,
        source: item.source,
        title: item.title,
      });
    });
  });
  return hits;
}

export default function ChatMessage({
  t,
  message,
  text,
  docName,
  dayLabel,
  onFeedback,
  onCopy,
  onRegenerate,
  onJumpToPage,
  compact = false,
}: Props) {
  const isUser = message.role === "user";
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const citationPages = useMemo(
    () => [...new Set(message.citations ?? [])].sort((a, b) => a - b),
    [message.citations],
  );

  const citationSources = useMemo<CitationSource[]>(() => {
    if (citationPages.length === 0) return [];

    const groups = new Map<
      string,
      Omit<CitationSource, "pages"> & { pages: Set<number> }
    >();
    const hitSources = collectHitSources(message.blocks);

    hitSources.forEach((hit) => {
      addSourcePage(
        groups,
        {
          key: hit.docId ?? hit.source,
          title: hit.source,
          detail: hit.title,
          docId: hit.docId,
        },
        hit.page,
      );
    });

    if (groups.size === 0) {
      const scope = message.scope;
      const detail = scope
        ? scope.level === "session"
          ? `${dayLabel} · ${scope.detail}`
          : scope.detail
        : dayLabel;

      citationPages.forEach((page) => {
        addSourcePage(
          groups,
          {
            key: docName,
            title: docName,
            detail,
          },
          page,
        );
      });
    }

    return [...groups.values()].map((source) => ({
      ...source,
      pages: [...source.pages].sort((a, b) => a - b),
    }));
  }, [citationPages, dayLabel, docName, message.blocks, message.scope]);

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
  const sourceDocumentsLabel = t.chat.citations === "Sources" ? "Source documents" : "Tài liệu nguồn";
  const showSourcesLabel = t.chat.citations === "Sources" ? "Show source documents" : "Mở tài liệu nguồn";
  const hideSourcesLabel = t.chat.citations === "Sources" ? "Hide source documents" : "Ẩn tài liệu nguồn";

  return (
    <div className="animate-fade-up flex gap-2.5 px-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
        <Bot className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
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

        {citationPages.length > 0 && !compact && (
          <div className="mt-2 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">
                {t.chat.citations}
              </span>
              <button
                type="button"
                onClick={() => setSourcesOpen((open) => !open)}
                aria-expanded={sourcesOpen}
                aria-label={sourcesOpen ? hideSourcesLabel : showSourcesLabel}
                title={sourcesOpen ? hideSourcesLabel : showSourcesLabel}
                className="inline-flex items-center gap-1 rounded-lg border border-brand-100 bg-brand-50/70 px-2 py-1 font-mono text-[10.5px] font-bold text-brand-800 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-brand-200"
              >
                <FileText className="h-3 w-3" />
                {citationPages.length}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-150 ${sourcesOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {sourcesOpen && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <p className="mb-1.5 text-[10px] font-bold tracking-[0.06em] text-slate-400 uppercase dark:text-slate-500">
                  {sourceDocumentsLabel}
                </p>
                <div className="space-y-1.5">
                  {citationSources.map((source) => (
                    <button
                      key={source.key}
                      type="button"
                      onClick={() => onJumpToPage(source.pages[0], source.docId)}
                      className="group/source flex w-full items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-brand-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-300" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11.5px] font-semibold text-slate-700 dark:text-slate-100">
                          {source.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[10.5px] text-slate-500 dark:text-slate-400">
                          {source.detail}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                        {pagesLabel(t, source.pages)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
