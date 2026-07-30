"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "./Tooltip";
import type { Dict } from "@/lib/i18n";

interface Props {
  t: Dict;
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function PageNavigation({ t, page, total, onChange }: Props) {
  const [draft, setDraft] = useState(String(page));
  const [syncedPage, setSyncedPage] = useState(page);

  // Đồng bộ ô nhập khi trang đổi từ nơi khác (nút mũi tên, chọn tài liệu mới).
  if (syncedPage !== page) {
    setSyncedPage(page);
    setDraft(String(page));
  }

  function commit() {
    const n = Number.parseInt(draft, 10);
    if (Number.isNaN(n)) {
      setDraft(String(page));
      return;
    }
    onChange(Math.min(Math.max(n, 1), total));
  }

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:hover:bg-slate-800";

  return (
    <nav
      aria-label={t.nav.page}
      className="flex shrink-0 items-center justify-center gap-3 px-4 pt-3 pb-4"
    >
      <Tooltip label={t.nav.prev} side="top">
        <button
          type="button"
          aria-label={t.nav.prev}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={btn}
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>

      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span>{t.nav.page}</span>
        <Tooltip label={t.nav.jump} side="top">
          <input
            value={draft}
            inputMode="numeric"
            aria-label={t.nav.jump}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-10 rounded-md bg-slate-50 py-0.5 text-center font-bold tabular-nums text-brand-700 outline-none focus:ring-2 focus:ring-brand-400 dark:bg-slate-900 dark:text-brand-200"
          />
        </Tooltip>
        <span className="text-slate-400 tabular-nums dark:text-slate-500">
          {t.nav.of(total)}
        </span>
      </div>

      <Tooltip label={t.nav.next} side="top">
        <button
          type="button"
          aria-label={t.nav.next}
          disabled={page >= total}
          onClick={() => onChange(page + 1)}
          className={btn}
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>
    </nav>
  );
}
