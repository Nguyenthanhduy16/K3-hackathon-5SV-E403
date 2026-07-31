"use client";

import { useEffect, useRef } from "react";
import {
  Download,
  Flag,
  Highlighter,
  Info,
  Maximize2,
  Minimize2,
  Minus,
  MoreHorizontal,
  MousePointer2,
  PenLine,
  Plus,
  Printer,
  Save,
  ScrollText,
  Trash2,
  Undo2,
} from "lucide-react";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";
import { HIGHLIGHT_COLORS, PEN_COLORS } from "@/lib/course-data";
import type { Dict } from "@/lib/i18n";
import type { MarkStyle, ToolId } from "@/lib/types";

interface Props {
  t: Dict;
  tool: ToolId;
  onToolChange: (tool: ToolId) => void;
  page: number;
  noteCount: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  focusMode: boolean;
  onToggleFocus: () => void;
  saved: boolean;
  onDownload: () => void;
  onSave: () => void;
  onUndo: () => void;
  onClearNotes: () => void;
  penStyle: MarkStyle;
  highlightStyle: MarkStyle;
  onStyleChange: (tool: Exclude<ToolId, "read">, next: MarkStyle) => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onMenuAction: (action: "continuous" | "print" | "info" | "report") => void;
}

const THICKNESS = [1, 2, 3];

export default function DocumentToolbar({
  t,
  tool,
  onToolChange,
  page,
  noteCount,
  zoom,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
  focusMode,
  onToggleFocus,
  saved,
  onDownload,
  onSave,
  onUndo,
  onClearNotes,
  penStyle,
  highlightStyle,
  onStyleChange,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onMenuAction,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) onCloseMenu();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseMenu();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, onCloseMenu]);

  const activeStyle = tool === "pen" ? penStyle : highlightStyle;
  const palette = tool === "pen" ? PEN_COLORS : HIGHLIGHT_COLORS;

  const toolBtn = (id: ToolId, label: string, tip: string, icon: React.ReactNode) => (
    <Tooltip label={tip}>
      <button
        type="button"
        onClick={() => onToolChange(id)}
        aria-pressed={tool === id}
        className={[
          "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none",
          tool === id
            ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
            : "text-slate-600 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-700",
        ].join(" ")}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>
    </Tooltip>
  );

  return (
    <div className="relative z-30 mx-auto w-full max-w-[1240px] px-3 pt-4 sm:px-6">
      {/* cuộn ngang trên màn hình hẹp; từ lg trở lên để tràn tự do cho tooltip hiện đủ */}
      <div className="scroll-slim flex items-center gap-1.5 overflow-x-auto rounded-full border border-slate-200/90 bg-white px-2.5 py-2 shadow-[0_4px_18px_-8px_rgba(15,23,42,0.25)] sm:gap-2 sm:px-3 lg:overflow-x-visible dark:border-slate-700 dark:bg-slate-900">
        {/* nhóm công cụ */}
        <div className="flex shrink-0 items-center gap-1">
          {toolBtn(
            "read",
            t.toolbar.read,
            t.toolbar.readTip,
            <MousePointer2 className="h-4 w-4" />,
          )}
          {toolBtn(
            "pen",
            t.toolbar.pen,
            t.toolbar.penTip,
            <PenLine className="h-4 w-4" />,
          )}
          {toolBtn(
            "highlight",
            t.toolbar.highlight,
            t.toolbar.highlightTip,
            <Highlighter className="h-4 w-4" />,
          )}
          <IconButton label={t.toolbar.more} onClick={onToggleMenu} active={menuOpen}>
            <MoreHorizontal className="h-4 w-4" />
          </IconButton>
        </div>

        <span
          aria-hidden="true"
          className="mx-1 h-7 w-px shrink-0 bg-slate-200 dark:bg-slate-700"
        />

        {/* trang + zoom */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-bold whitespace-nowrap text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            {t.toolbar.noteBadge(page, noteCount)}
          </span>
          <div className="flex items-center gap-0.5 rounded-full bg-slate-50 px-1 py-0.5 dark:bg-slate-800">
            <IconButton
              label={t.toolbar.zoomOut}
              onClick={onZoomOut}
              disabled={!canZoomOut}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </IconButton>
            <span className="w-12 text-center text-[12px] font-bold tabular-nums text-slate-600 dark:text-slate-300">
              {zoom}%
            </span>
            <IconButton
              label={t.toolbar.zoomIn}
              onClick={onZoomIn}
              disabled={!canZoomIn}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </IconButton>
          </div>
        </div>

        {/* nhóm hành động bên phải */}
        <div className="ml-auto flex shrink-0 items-center gap-0.5 pl-2">
          <IconButton
            label={focusMode ? t.toolbar.exitFullscreen : t.toolbar.fullscreen}
            onClick={onToggleFocus}
            active={focusMode}
          >
            {focusMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </IconButton>
          <IconButton label={t.toolbar.download} onClick={onDownload}>
            <Download className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={saved ? t.toolbar.saved : t.toolbar.save}
            onClick={onSave}
            active={saved}
          >
            <Save className="h-4 w-4" />
          </IconButton>
          <IconButton label={t.toolbar.undo} onClick={onUndo}>
            <Undo2 className="h-4 w-4" />
          </IconButton>
          <IconButton label={t.toolbar.clearNotes} onClick={onClearNotes} danger>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* bảng chọn độ dày + màu, hiện khi dùng Bút hoặc Highlight */}
      {tool !== "read" && (
        <div className="animate-pop absolute top-[calc(100%+8px)] left-3 z-40 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg sm:left-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              {t.toolbar.thickness}
            </span>
            <div className="flex items-center gap-1">
              {THICKNESS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`${t.toolbar.thickness} ${s}`}
                  aria-pressed={activeStyle.size === s}
                  onClick={() =>
                    onStyleChange(tool, { ...activeStyle, size: s })
                  }
                  className={[
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors",
                    activeStyle.size === s
                      ? "bg-brand-50 ring-1 ring-brand-300 dark:bg-brand-500/20 dark:ring-brand-500/40"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  <span
                    className="rounded-full bg-slate-700 dark:bg-slate-200"
                    style={{ width: 4 + s * 3, height: 4 + s * 3 }}
                  />
                </button>
              ))}
            </div>
          </div>

          <span
            aria-hidden="true"
            className="h-6 w-px bg-slate-200 dark:bg-slate-700"
          />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              {t.toolbar.color}
            </span>
            <div className="flex items-center gap-1.5">
              {palette.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  aria-pressed={activeStyle.color === c}
                  onClick={() => onStyleChange(tool, { ...activeStyle, color: c })}
                  style={{ backgroundColor: c }}
                  className={[
                    "h-6 w-6 rounded-full transition-transform duration-150 hover:scale-110",
                    activeStyle.color === c
                      ? "ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-900"
                      : "ring-1 ring-black/10",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* menu ba chấm */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="animate-pop absolute top-[calc(100%+8px)] left-3 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl sm:left-6 dark:border-slate-700 dark:bg-slate-900"
        >
          {(
            [
              ["continuous", t.toolbar.menuContinuous, ScrollText],
              ["print", t.toolbar.menuPrint, Printer],
              ["info", t.toolbar.menuInfo, Info],
              ["report", t.toolbar.menuReport, Flag],
            ] as const
          ).map(([action, label, Icon]) => (
            <button
              key={action}
              type="button"
              onClick={() => onMenuAction(action)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Icon className="h-4 w-4 shrink-0 text-slate-400" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
