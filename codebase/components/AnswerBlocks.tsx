"use client";

import { ArrowUpRight, CircleAlert, Info, Layers } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import type { AnswerBlock } from "@/lib/types";

interface Props {
  t: Dict;
  blocks: AnswerBlock[];
  onJumpToPage: (page: number, docId?: string) => void;
}

/**
 * Câu trả lời cấp buổi/môn trả về nhiều loại khối chứ không chỉ văn xuôi —
 * dàn ý có khoảng trang bấm được, bảng, thuật ngữ, danh sách slide khớp.
 */
export default function AnswerBlocks({ t, blocks, onJumpToPage }: Props) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "text":
            return (
              <p
                key={i}
                className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200"
              >
                {block.text}
              </p>
            );

          case "callout":
            return (
              <div
                key={i}
                className={[
                  "flex gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed",
                  block.tone === "warn"
                    ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                    : "border-brand-100 bg-brand-50/70 text-brand-900 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-100",
                ].join(" ")}
              >
                {block.tone === "warn" ? (
                  <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                )}
                <span>{block.text}</span>
              </div>
            );

          case "bullets":
            return (
              <div key={i}>
                {block.title && <BlockTitle>{block.title}</BlockTitle>}
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "steps":
            return (
              <div key={i}>
                {block.title && <BlockTitle>{block.title}</BlockTitle>}
                <ol className="space-y-2">
                  {block.items.map((item, n) => (
                    <li
                      key={item}
                      className="flex gap-2 text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                        {n + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case "outline":
            return (
              <div key={i}>
                {block.title && <BlockTitle>{block.title}</BlockTitle>}
                <ol className="space-y-1">
                  {block.items.map((item) => (
                    <li key={`${item.from}-${item.title}`}>
                      <button
                        type="button"
                        onClick={() => onJumpToPage(item.from)}
                        title={t.chat.openPage(item.from)}
                        className="group/row flex w-full gap-2.5 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/70 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <span className="mt-0.5 shrink-0 rounded-md bg-brand-100 px-1.5 py-1 font-mono text-[10px] font-bold text-brand-700 tabular-nums dark:bg-brand-500/20 dark:text-brand-200">
                          {item.from === item.to
                            ? item.from
                            : `${item.from}–${item.to}`}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1 text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">
                            {item.title}
                            <ArrowUpRight className="h-3 w-3 shrink-0 text-brand-500 opacity-0 transition-opacity group-hover/row:opacity-100" />
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-500 dark:text-slate-400">
                            {item.summary}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case "table":
            return (
              <div key={i}>
                {block.title && <BlockTitle>{block.title}</BlockTitle>}
                <div className="scroll-slim overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full border-collapse text-left text-[11.5px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800">
                        {block.head.map((h) => (
                          <th
                            key={h}
                            className="px-2.5 py-2 font-bold whitespace-nowrap text-slate-600 dark:text-slate-300"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr
                          key={r}
                          className="border-t border-slate-100 align-top dark:border-slate-800"
                        >
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className="px-2.5 py-2 leading-snug text-slate-600 dark:text-slate-300"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );

          case "terms":
            return (
              <div key={i} className="space-y-2">
                {block.items.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-300" />
                      <span className="text-[13px] font-bold text-brand-900 dark:text-brand-100">
                        {item.term}
                      </span>
                      <button
                        type="button"
                        onClick={() => onJumpToPage(item.page)}
                        className="ml-auto shrink-0 rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100 dark:bg-slate-900 dark:text-brand-300"
                      >
                        {t.chat.pageShort(item.page)}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            );

          case "hits":
            return (
              <div key={i}>
                {block.title && <BlockTitle>{block.title}</BlockTitle>}
                <ul className="space-y-1">
                  {block.items.map((item) => (
                    <li key={`${item.docId ?? ""}-${item.page}-${item.title}`}>
                      <button
                        type="button"
                        onClick={() => onJumpToPage(item.page, item.docId)}
                        title={t.chat.openPage(item.page)}
                        className="group/row flex w-full gap-2.5 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/70 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <span className="mt-0.5 shrink-0 rounded-md bg-slate-100 px-1.5 py-1 font-mono text-[10px] font-bold text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300">
                          {item.page}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1 text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">
                            {item.title}
                            <ArrowUpRight className="h-3 w-3 shrink-0 text-brand-500 opacity-0 transition-opacity group-hover/row:opacity-100" />
                          </span>
                          {item.source && (
                            <span className="mt-0.5 block truncate font-mono text-[10px] text-brand-600 dark:text-brand-300">
                              {item.source}
                            </span>
                          )}
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-500 dark:text-slate-400">
                            {item.snippet}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
        }
      })}
    </div>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-bold tracking-[0.06em] text-slate-400 uppercase dark:text-slate-500">
      {children}
    </p>
  );
}
