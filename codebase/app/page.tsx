"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import CourseSidebar from "@/components/CourseSidebar";
import DocumentToolbar from "@/components/DocumentToolbar";
import PDFViewer from "@/components/PDFViewer";
import PageNavigation from "@/components/PageNavigation";
import LessonCompletion from "@/components/LessonCompletion";
import AIChatPanel from "@/components/AIChatPanel";
import Toasts from "@/components/Toasts";
import { getDict } from "@/lib/i18n";
import { buildAnswer, rephrase } from "@/lib/ai-mock";
import { buildScopeContext, parseAiBlocks, type AiTurn } from "@/lib/ai-context";
import { COURSE_STATS, getSessionPack } from "@/lib/session-data";
import {
  COURSE_CODE,
  COURSE_DAYS,
  DEFAULT_DOC_ID,
  DEFAULT_PAGE,
  DEFAULT_ZOOM,
  SEED_ANNOTATIONS,
  ZOOM_STEPS,
  findDayOfDoc,
  findDoc,
} from "@/lib/mock-data";
import type {
  Annotation,
  AnnotationPoint,
  Answer,
  ChatMsg,
  ChatState,
  Lang,
  MarkStyle,
  ScopeChoice,
  Theme,
  Toast,
  ToolId,
} from "@/lib/types";

export default function ReaderPage() {
  /* ---------------- giao diện chung ---------------- */
  const [lang, setLang] = useState<Lang>("vi");
  const [theme, setTheme] = useState<Theme>("light");
  const t = getDict(lang);

  /* ---------------- học liệu ---------------- */
  const [expandedDays, setExpandedDays] = useState<string[]>(["day-6"]);
  const [activeDocId, setActiveDocId] = useState(DEFAULT_DOC_ID);
  const [userCollapsedSidebar, setUserCollapsedSidebar] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ---------------- trình đọc ---------------- */
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [tool, setTool] = useState<ToolId>("read");
  const [penStyle, setPenStyle] = useState<MarkStyle>({ color: "#e0212b", size: 2 });
  const [highlightStyle, setHighlightStyle] = useState<MarkStyle>({
    color: "#facc15",
    size: 2,
  });
  const [annotations, setAnnotations] = useState<Annotation[]>(SEED_ANNOTATIONS);
  const [focusMode, setFocusMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------------- trợ lý AI ---------------- */
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [scopeChoice, setScopeChoice] = useState<ScopeChoice>("auto");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [completedDocIds, setCompletedDocIds] = useState<string[]>([]);

  /* ---------------- thông báo ---------------- */
  const [toasts, setToasts] = useState<Toast[]>([]);

  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const nextId = useCallback((prefix: string) => {
    counter.current += 1;
    return `${prefix}-${counter.current}`;
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const pushToast = useCallback(
    (message: string, tone: Toast["tone"] = "info") => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev, { id, message, tone }]);
      schedule(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2600);
    },
    [schedule],
  );

  /* ---------------- dẫn xuất ---------------- */
  const doc = useMemo(() => findDoc(activeDocId), [activeDocId]);
  const pack = useMemo(() => getSessionPack(doc), [doc]);
  const pageAnnotations = useMemo(
    () => annotations.filter((a) => a.docId === doc.id && a.page === page),
    [annotations, doc.id, page],
  );
  const sidebarCollapsed = userCollapsedSidebar || focusMode;
  const zoomIndex = ZOOM_STEPS.indexOf(zoom);

  /* ---------------- hiệu ứng phụ ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setMobileSidebarOpen(false);
      setMenuOpen(false);
      setChatState((s) => (s === "open" ? "closed" : s));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------------- hành động ---------------- */
  function toggleLang() {
    const next: Lang = lang === "vi" ? "en" : "vi";
    setLang(next);
    pushToast(getDict(next).toast.langChanged, "info");
  }

  function toggleDay(dayId: string) {
    setExpandedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId],
    );
  }

  function selectDoc(docId: string) {
    setMobileSidebarOpen(false);
    if (docId === activeDocId) return;
    const next = findDoc(docId);
    setActiveDocId(docId);
    setPage(1);
    setSaved(false);
    pushToast(t.toast.docChanged(next.name), "info");
  }

  function changePage(next: number) {
    setPage(Math.min(Math.max(next, 1), doc.pages));
  }

  function addAnnotation(
    points: AnnotationPoint[],
    annotationTool: Exclude<ToolId, "read">,
    style: MarkStyle,
  ) {
    if (points.length === 0) return;
    setAnnotations((prev) => [
      ...prev,
      {
        id: nextId("note"),
        docId: doc.id,
        page,
        tool: annotationTool,
        color: style.color,
        size: style.size,
        points,
      },
    ]);
    setSaved(false);
  }
  function undoAnnotation() {
    const last = [...annotations]
      .reverse()
      .find((a) => a.docId === doc.id && a.page === page);
    if (!last) {
      pushToast(t.toast.nothingToUndo, "info");
      return;
    }
    setAnnotations((prev) => prev.filter((a) => a.id !== last.id));
    setSaved(false);
    pushToast(t.toast.undone, "success");
  }

  function clearNotes() {
    const count = pageAnnotations.length;
    if (count === 0) {
      pushToast(t.toast.noNotes, "info");
      return;
    }
    setAnnotations((prev) =>
      prev.filter((a) => !(a.docId === doc.id && a.page === page)),
    );
    setSaved(false);
    pushToast(t.toast.notesCleared(count), "danger");
  }

  function handleMenuAction(action: "continuous" | "print" | "info" | "report") {
    setMenuOpen(false);
    const map = {
      continuous: [t.toast.continuous, "info"],
      print: [t.toast.print, "info"],
      info: [t.toast.info(doc.name, doc.pages), "info"],
      report: [t.toast.reported, "success"],
    } as const;
    const [message, tone] = map[action];
    pushToast(message, tone);
  }

  function setStyle(target: Exclude<ToolId, "read">, next: MarkStyle) {
    if (target === "pen") setPenStyle(next);
    else setHighlightStyle(next);
  }

  /* ---------------- trợ lý AI ---------------- */
  const resolveText = useCallback(
    (m: ChatMsg) => (m.seedKey ? t.chat[m.seedKey] : (m.content ?? "")),
    [t],
  );

  function stamp() {
    return new Date().toLocaleTimeString(lang === "vi" ? "vi-VN" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function messageFromAnswer(answer: Answer): ChatMsg {
    return {
      id: nextId("a"),
      role: "assistant",
      content: answer.plain,
      blocks: answer.blocks,
      scope: answer.intent === "tutor-probe" ? undefined : answer.scope,
      citations: answer.citations,
      intent: answer.intent,
      time: stamp(),
    };
  }

  /** Vài lượt hội thoại gần nhất để model giữ mạch trò chuyện. */
  function recentHistory(list: ChatMsg[], limit = 6): AiTurn[] {
    return list.slice(-limit).map((m) => ({
      role: m.role,
      text: resolveText(m) || m.content || "",
    }));
  }

  /**
   * Gọi AI thật qua /api/chat. Phạm vi + trích dẫn vẫn do lớp truy xuất
   * (ai-mock) quyết định; AI chỉ sinh phần câu chữ từ grounding context.
   * Trả về null khi lỗi — người gọi tự lui về câu trả lời dựng sẵn.
   */
  async function fetchAiAnswer(
    question: string,
    answer: Answer,
    history: AiTurn[],
    doRephrase = false,
  ): Promise<Answer | null> {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: answer.intent === "tutor-probe"
            ? "The student is asking who VLearn Tutor is and what it can do. Answer as a short self-introduction. Do not tie the answer to a course code unless the student explicitly asks about a course."
            : buildScopeContext(question, doc, page, answer.scope.level),
          scopeLabel: answer.intent === "tutor-probe" ? "VLearn Tutor introduction" : answer.scope.label,
          lang,
          history,
          rephrase: doRephrase,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "network" }));
        pushToast(error === "missing-key" ? t.toast.aiNoKey : t.toast.aiFallback, "info");
        return null;
      }
      const { text } = (await res.json()) as { text: string };
      return { ...answer, blocks: parseAiBlocks(text), plain: text };
    } catch {
      pushToast(t.toast.aiFallback, "info");
      return null;
    }
  }

  async function ask(question: string, forcedScope?: ScopeChoice) {
    const text = question.trim();
    if (!text || isTyping) return;

    // Phạm vi được quyết định TRƯỚC khi trả lời: đây là chỗ xử lý P1 —
    // câu hỏi cấp buổi tự nới ra cả buổi thay vì kẹt ở trang đang mở.
    // Câu trả lời mock giữ vai trò khung (scope + trích dẫn) và đường lui.
    const fallback = buildAnswer(text, doc, page, lang, forcedScope ?? scopeChoice);
    const history = recentHistory(messages);

    setMessages((prev) => [
      ...prev,
      { id: nextId("u"), role: "user", content: text, time: stamp() },
    ]);
    setInput("");
    setIsTyping(true);

    const answer = (await fetchAiAnswer(text, fallback, history)) ?? fallback;
    setMessages((prev) => [...prev, messageFromAnswer(answer)]);
    setIsTyping(false);
  }

  function completeLesson() {
    if (isTyping || completedDocIds.includes(doc.id)) return;

    setCompletedDocIds((prev) => [...prev, doc.id]);
    setScopeChoice("session");
    setChatState("open");
    pushToast(t.toast.lessonCompleted, "success");
    void ask(t.lesson.summaryPrompt, "session");
  }

  async function regenerate(id: string) {
    if (isTyping) return;
    const index = messages.findIndex((m) => m.id === id);
    if (index < 0) return;
    const asked = [...messages.slice(0, index)]
      .reverse()
      .find((m) => m.role === "user");
    const prompt = asked ? resolveText(asked) : t.chat.suggestions[0].text;
    const fallback = buildAnswer(prompt, doc, page, lang, scopeChoice);
    const history = recentHistory(messages.slice(0, index));

    setIsTyping(true);
    const answer =
      (await fetchAiAnswer(prompt, fallback, history, true)) ?? rephrase(fallback, lang);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              seedKey: undefined,
              sourcePage: undefined,
              content: answer.plain,
              blocks: answer.blocks,
              scope: answer.intent === "tutor-probe" ? undefined : answer.scope,
              citations: answer.citations,
              intent: answer.intent,
              feedback: undefined,
              time: stamp(),
            }
          : m,
      ),
    );
    setIsTyping(false);
  }

  /**
   * Bấm vào trích dẫn / dàn ý / kết quả tìm kiếm trong câu trả lời → mở đúng
   * slide đó. Kết quả ở phạm vi "Cả môn" có thể nằm ở tài liệu khác nên đổi
   * luôn tài liệu đang đọc.
   */
  function jumpToPage(target: number, targetDocId?: string) {
    const targetDoc = targetDocId ? findDoc(targetDocId) : doc;
    const next = Math.min(Math.max(target, 1), targetDoc.pages);

    if (targetDoc.id !== activeDocId) {
      setActiveDocId(targetDoc.id);
      setExpandedDays((prev) => {
        const dayId = findDayOfDoc(targetDoc.id).id;
        return prev.includes(dayId) ? prev : [...prev, dayId];
      });
      setSaved(false);
      pushToast(t.toast.docChanged(targetDoc.name), "info");
    } else {
      pushToast(t.toast.jumped(next), "success");
    }
    setPage(next);
    // Trên màn hình hẹp panel chat che mất trang — thu nhỏ để nhìn thấy slide.
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setChatState("minimized");
    }
  }

  function changeScope(next: ScopeChoice) {
    setScopeChoice(next);
    pushToast(t.toast.scopeChanged(t.chat.scope[next]), "info");
  }

  function giveFeedback(id: string, value: "up" | "down") {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, feedback: m.feedback === value ? undefined : value } : m,
      ),
    );
    pushToast(
      value === "up" ? t.toast.feedbackUp : t.toast.feedbackDown,
      value === "up" ? "success" : "info",
    );
  }

  function copyText(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    pushToast(t.toast.copied, "success");
  }

  function clearChat() {
    setMessages([]);
    setIsTyping(false);
    pushToast(t.toast.chatCleared, "danger");
  }

  /* ---------------- render ---------------- */
  return (
    <div className="flex h-full flex-col bg-canvas dark:bg-slate-950">
      <Header
        t={t}
        docName={doc.name}
        docMeta={`${COURSE_CODE} · ${doc.meta}`}
        lang={lang}
        theme={theme}
        chatOpen={chatState !== "closed"}
        mobileSidebarOpen={mobileSidebarOpen}
        onBack={() => pushToast(t.header.back, "info")}
        onToggleLang={toggleLang}
        onToggleTheme={() => setTheme((v) => (v === "light" ? "dark" : "light"))}
        onToggleChat={() => setChatState((s) => (s === "open" ? "closed" : "open"))}
        onToggleMobileSidebar={() => setMobileSidebarOpen((v) => !v)}
      />

      <div className="relative flex min-h-0 flex-1">
        <CourseSidebar
          t={t}
          days={COURSE_DAYS}
          expandedDays={expandedDays}
          activeDocId={activeDocId}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggleDay={toggleDay}
          onSelectDoc={selectDoc}
          onToggleCollapsed={() => {
            setFocusMode(false);
            setUserCollapsedSidebar(!sidebarCollapsed);
          }}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <DocumentToolbar
            t={t}
            tool={tool}
            onToolChange={setTool}
            page={page}
            noteCount={pageAnnotations.length}
            zoom={zoom}
            onZoomIn={() =>
              setZoom(ZOOM_STEPS[Math.min(zoomIndex + 1, ZOOM_STEPS.length - 1)])
            }
            onZoomOut={() => setZoom(ZOOM_STEPS[Math.max(zoomIndex - 1, 0)])}
            canZoomIn={zoomIndex < ZOOM_STEPS.length - 1}
            canZoomOut={zoomIndex > 0}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((v) => !v)}
            saved={saved}
            onDownload={() => pushToast(t.toast.downloaded, "success")}
            onSave={() =>
              setSaved((v) => {
                pushToast(v ? t.toast.unsaved : t.toast.saved, "success");
                return !v;
              })
            }
            onUndo={undoAnnotation}
            onClearNotes={clearNotes}
            penStyle={penStyle}
            highlightStyle={highlightStyle}
            onStyleChange={setStyle}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((v) => !v)}
            onCloseMenu={() => setMenuOpen(false)}
            onMenuAction={handleMenuAction}
          />

          <div className="scroll-slim min-h-0 flex-1 overflow-auto px-3 py-5 sm:px-6">
            <PDFViewer
              t={t}
              doc={doc}
              page={page}
              zoom={zoom}
              tool={tool}
              penStyle={penStyle}
              highlightStyle={highlightStyle}
              annotations={pageAnnotations}
              onAddAnnotation={addAnnotation}
              baseWidth={focusMode ? 1180 : 900}
            />
          </div>

          <LessonCompletion
            t={t}
            completed={completedDocIds.includes(doc.id)}
            isSummarizing={isTyping}
            onComplete={completeLesson}
          />

          <PageNavigation t={t} page={page} total={doc.pages} onChange={changePage} />
        </main>

        <AIChatPanel
          t={t}
          state={chatState}
          page={page}
          dayLabel={pack.dayLabel}
          docName={doc.name}
          sessionPages={pack.totalPages}
          courseDocs={COURSE_STATS.docs}
          scope={scopeChoice}
          onScopeChange={changeScope}
          messages={messages}
          resolveText={resolveText}
          isTyping={isTyping}
          input={input}
          onInputChange={setInput}
          onSend={() => ask(input)}
          onPickSuggestion={ask}
          onFeedback={giveFeedback}
          onCopy={copyText}
          onRegenerate={regenerate}
          onJumpToPage={jumpToPage}
          onClear={clearChat}
          onMinimize={() => setChatState("minimized")}
          onRestore={() => setChatState("open")}
          onClose={() => setChatState("closed")}
          onAttach={() => pushToast(t.toast.attach, "info")}
        />
      </div>

      <Toasts items={toasts} />
    </div>
  );
}
