"use client";

import { useEffect, useRef } from "react";
import {
  Bot,
  ChevronUp,
  FileText,
  Layers,
  Library,
  Minus,
  Paperclip,
  SendHorizontal,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";
import type { ChatMsg, ChatState, ScopeChoice } from "@/lib/types";

interface Props {
  t: Dict;
  state: ChatState;
  page: number;
  /** Nhãn buổi đang mở, ví dụ "Day 6". */
  dayLabel: string;
  sessionPages: number;
  courseDocs: number;
  scope: ScopeChoice;
  onScopeChange: (scope: ScopeChoice) => void;
  messages: ChatMsg[];
  resolveText: (m: ChatMsg) => string;
  isTyping: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onPickSuggestion: (q: string) => void;
  onFeedback: (id: string, v: "up" | "down") => void;
  onCopy: (text: string) => void;
  onRegenerate: (id: string) => void;
  onJumpToPage: (page: number, docId?: string) => void;
  onClear: () => void;
  onMinimize: () => void;
  onRestore: () => void;
  onClose: () => void;
  onAttach: () => void;
}

const SCOPE_OPTIONS = [
  { id: "auto" as const, icon: Wand2 },
  { id: "page" as const, icon: FileText },
  { id: "session" as const, icon: Layers },
  { id: "course" as const, icon: Library },
];

function TypingBubble({ label }: { label: string }) {
  return (
    <div className="animate-fade-up flex gap-2.5 px-4" aria-live="polite">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
        <Bot className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <span className="dot-typing flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function AIChatPanel(props: Props) {
  const {
    t,
    state,
    page,
    dayLabel,
    sessionPages,
    courseDocs,
    scope,
    onScopeChange,
    messages,
    resolveText,
    isTyping,
    input,
    onInputChange,
    onSend,
    onPickSuggestion,
    onFeedback,
    onCopy,
    onRegenerate,
    onJumpToPage,
    onClear,
    onMinimize,
    onRestore,
    onClose,
    onAttach,
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const minimized = state === "minimized";
  const open = state === "open";

  useEffect(() => {
    if (state === "closed") return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, state]);

  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none";

  const panelHeader = (
    <div className="flex shrink-0 items-center gap-2.5 bg-gradient-to-r from-brand-700 to-brand-500 px-4 py-3 text-white">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
        <Bot className="h-[18px] w-[18px]" />
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-brand-600" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] leading-tight font-bold">{t.chat.title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/75">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.chat.status}
        </p>
      </div>
      {minimized ? (
        <Tooltip label={t.chat.restore} side="top">
          <button
            type="button"
            aria-label={t.chat.restore}
            onClick={onRestore}
            className={iconBtn}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip label={t.chat.minimize}>
          <button
            type="button"
            aria-label={t.chat.minimize}
            onClick={onMinimize}
            className={iconBtn}
          >
            <Minus className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
      <Tooltip label={t.chat.close} side={minimized ? "top" : "bottom"}>
        <button
          type="button"
          aria-label={t.chat.close}
          onClick={onClose}
          className={iconBtn}
        >
          <X className="h-4 w-4" />
        </button>
      </Tooltip>
    </div>
  );

  const contextLine =
    scope === "page"
      ? t.chat.contextPage(page)
      : scope === "session"
        ? t.chat.contextSession(dayLabel, sessionPages)
        : scope === "course"
          ? t.chat.contextCourse(courseDocs)
          : t.chat.contextAuto(page, dayLabel);

  const ContextIcon =
    scope === "session" ? Layers : scope === "course" ? Library : scope === "page" ? FileText : Wand2;

  /**
   * Thanh phạm vi — phần trả lời trực tiếp cho P1: câu hỏi cấp buổi không còn
   * bị kẹt trong một trang. "Tự động" để hệ thống tự đoán, ba mức còn lại ép cứng.
   */
  const scopeBar = (
    <div className="shrink-0 space-y-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[10px] font-bold tracking-[0.06em] text-slate-400 uppercase dark:text-slate-500">
          {t.chat.scope.label}
        </span>
        <div className="flex flex-1 items-center gap-0.5 rounded-full bg-white p-0.5 shadow-inner ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          {SCOPE_OPTIONS.map(({ id, icon: Icon }) => (
            <Tooltip key={id} label={t.chat.scope[`${id}Hint`]} side="bottom">
              <button
                type="button"
                onClick={() => onScopeChange(id)}
                aria-pressed={scope === id}
                className={[
                  "flex items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none",
                  scope === id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span>{t.chat.scope[id]}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-0.5">
        <ContextIcon className="h-3.5 w-3.5 shrink-0 text-brand-500" />
        <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {contextLine}
        </p>
        <Tooltip label={t.chat.clearChat} side="bottom">
          <button
            type="button"
            aria-label={t.chat.clearChat}
            onClick={onClear}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-vin-red dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  const composer = (
    <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-end gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5 transition-colors focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:bg-slate-800">
        <Tooltip label={t.chat.attach} side="top">
          <button
            type="button"
            aria-label={t.chat.attach}
            onClick={onAttach}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-brand-700 dark:hover:bg-slate-700"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        </Tooltip>

        <textarea
          rows={1}
          value={input}
          placeholder={t.chat.placeholder}
          aria-label={t.chat.placeholder}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="scroll-slim max-h-28 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <Tooltip label={t.chat.send} side="top">
          <button
            type="button"
            aria-label={t.chat.send}
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white transition-all duration-150 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
      {!minimized && (
        <p className="mt-1.5 px-1 text-[10px] text-slate-400 dark:text-slate-500">
          {t.chat.sendHint}
        </p>
      )}
    </div>
  );

  const thread = (
    <div
      ref={scrollRef}
      className="scroll-slim flex-1 space-y-4 overflow-y-auto py-4"
    >
      {!minimized && (
        <>
          <div className="px-4">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-3.5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                {t.chat.intro}
              </p>
            </div>
          </div>
          <SuggestedQuestions
            label={t.chat.suggestionsLabel}
            questions={t.chat.suggestions}
            onPick={onPickSuggestion}
            disabled={isTyping}
          />
        </>
      )}

      {messages.length === 0 && !isTyping && (
        <p className="px-4 text-center text-[12px] text-slate-400 dark:text-slate-500">
          {t.chat.empty}
        </p>
      )}

      {messages.map((m) => (
        <ChatMessage
          key={m.id}
          t={t}
          message={m}
          text={resolveText(m)}
          onFeedback={onFeedback}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onJumpToPage={onJumpToPage}
          compact={minimized}
        />
      ))}

      {isTyping && <TypingBubble label={t.chat.typing} />}
    </div>
  );

  return (
    <>
      {/* Panel chính: overlay trên mobile, nằm trong luồng và đẩy khung PDF trên desktop */}
      <aside
        aria-label={t.chat.title}
        inert={!open}
        className={[
          "fixed top-[84px] right-0 bottom-0 z-40 w-full max-w-[420px] shrink-0 overflow-hidden",
          "border-l border-slate-200 bg-white transition-transform duration-300 ease-out",
          "dark:border-slate-800 dark:bg-slate-900",
          open ? "translate-x-0 shadow-2xl" : "pointer-events-none translate-x-full",
          "lg:static lg:max-w-none lg:translate-x-0 lg:shadow-none",
          "lg:transition-[width] lg:duration-300 lg:ease-out",
          open ? "lg:w-[440px]" : "lg:w-0 lg:border-l-0",
        ].join(" ")}
      >
        {/* Khi thu nhỏ, nội dung chuyển hẳn sang cửa sổ nổi bên dưới —
            không render hai bản để tránh trùng ref cuộn. */}
        {!minimized && (
          <div className="flex h-full w-full flex-col lg:w-[440px]">
            {panelHeader}
            {scopeBar}
            {thread}
            {composer}
          </div>
        )}
      </aside>

      {/* Cửa sổ nhỏ ở góc dưới bên phải khi thu nhỏ */}
      {minimized && (
        <div className="animate-slide-left fixed right-4 bottom-4 z-50 flex h-[440px] w-[min(92vw,340px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6 sm:bottom-6 dark:border-slate-700 dark:bg-slate-900">
          {panelHeader}
          {scopeBar}
          {thread}
          {composer}
        </div>
      )}
    </>
  );
}
