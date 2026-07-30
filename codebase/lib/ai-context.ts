import { getSlide } from "./mock-data";
import {
  COURSE_OPS,
  COURSE_STATS,
  getSessionPack,
  searchCourse,
  searchSession,
  sectionOfPage,
} from "./session-data";
import type { AnswerBlock, CourseDoc, ScopeLevel } from "./types";

/**
 * Cầu nối giữa lớp truy xuất (mock, chạy trong client) và lời gọi AI thật.
 *
 * Phần "chọn phạm vi" vẫn nằm ở `ai-mock.ts` — đây là lõi xử lý P1 và chạy
 * hoàn toàn trong frontend. File này chỉ lo hai việc:
 *   1. Gom nội dung của phạm vi đã chọn thành một khối văn bản (grounding
 *      context) để gửi kèm câu hỏi lên `/api/chat`.
 *   2. Chuyển câu trả lời dạng text của model thành `AnswerBlock[]` để tái
 *      dùng UI khối có cấu trúc sẵn có.
 */

/* ------------------------------------------------------------------ */
/* 1. Dựng grounding context theo phạm vi                              */
/* ------------------------------------------------------------------ */

function slideText(doc: CourseDoc, page: number): string {
  const slide = getSlide(page, doc);
  const lines: string[] = [`[Trang ${page}] ${slide.title}`];
  if (slide.subtitle) lines.push(slide.subtitle);
  if (slide.body) lines.push(slide.body);
  if (slide.bullets?.length) lines.push(...slide.bullets.map((b) => `- ${b}`));
  if (slide.columns?.length) {
    for (const col of slide.columns) {
      lines.push(`${col.heading}:`);
      lines.push(...col.items.map((i) => `  - ${i}`));
    }
  }
  if (slide.footnote) lines.push(`(${slide.footnote})`);
  return lines.join("\n");
}

export function buildScopeContext(
  question: string,
  doc: CourseDoc,
  page: number,
  level: ScopeLevel,
): string {
  const pack = getSessionPack(doc);
  const parts: string[] = [];

  if (level === "page") {
    const section = sectionOfPage(pack, page);
    parts.push(
      `Tài liệu đang mở: ${doc.name} (${pack.dayLabel} — ${pack.title}).`,
      `Người học đang đọc trang ${page}/${pack.totalPages}, thuộc mục "${section.title}" (trang ${section.from}–${section.to}).`,
      `Nội dung trang đang mở:\n${slideText(doc, page)}`,
    );
    return parts.join("\n\n");
  }

  if (level === "session") {
    parts.push(
      `Tài liệu: ${doc.name} — ${pack.dayLabel}: ${pack.title} (${pack.totalPages} slide, ~${pack.durationMin} phút).`,
      `Câu hỏi dẫn dắt cả buổi: "${pack.hook}"`,
      `Tóm tắt một câu: ${pack.oneLiner}`,
      `Dàn ý buổi học:\n${pack.sections
        .map((s) => `- [trang ${s.from}–${s.to}] ${s.title}: ${s.summary}`)
        .join("\n")}`,
      `Ba điều mang về:\n${pack.takeaways.map((x) => `- ${x}`).join("\n")}`,
      `Thuật ngữ trong buổi:\n${pack.glossary
        .map((g) => `- ${g.term} (trang ${g.page}): ${g.definition}`)
        .join("\n")}`,
    );
    const hits = searchSession(doc, question, 5);
    if (hits.length) {
      parts.push(
        `Các slide khớp nhất với câu hỏi:\n${hits
          .map((h) => `- [trang ${h.page}] ${h.title}: ${h.snippet}`)
          .join("\n")}`,
      );
    }
    parts.push(`Người học đang đứng ở trang ${page}:\n${slideText(doc, page)}`);
    return parts.join("\n\n");
  }

  // level === "course"
  const ops = COURSE_OPS;
  parts.push(
    `Môn ${ops.code} — ${ops.name}. Hình thức: ${ops.format}. Quy mô: ${COURSE_STATS.days} buổi, ${COURSE_STATS.docs} tài liệu, ${COURSE_STATS.pages} slide.`,
    `Các mốc checkpoint:\n${ops.checkpoints
      .map((c) => `- ${c.id} — ${c.what} (Khoá 3: ${c.k3} · Khoá 4: ${c.k4})`)
      .join("\n")}`,
    `Hạn cứng: ${ops.hardDeadline.what} — ${ops.hardDeadline.when}. ${ops.hardDeadline.note}`,
    `Cách chấm (tổng ${ops.grading.total} điểm):\n${ops.grading.parts
      .map((p) => `- ${p.block}: ${p.points} điểm (${p.note})`)
      .join("\n")}`,
    `Cấu trúc repo nộp bài:\n${ops.repo.map((r) => `- ${r}`).join("\n")}`,
    `Luật chung:\n${ops.rules.map((r) => `- ${r}`).join("\n")}`,
  );
  const hits = searchCourse(question, 6);
  if (hits.length) {
    parts.push(
      `Các slide khớp nhất trên toàn môn:\n${hits
        .map((h) => `- [${h.source} · trang ${h.page}] ${h.title}: ${h.snippet}`)
        .join("\n")}`,
    );
  }
  return parts.join("\n\n");
}

/* ------------------------------------------------------------------ */
/* 2. Lịch sử hội thoại gửi kèm                                        */
/* ------------------------------------------------------------------ */

export interface AiTurn {
  role: "user" | "assistant";
  text: string;
}

/* ------------------------------------------------------------------ */
/* 3. Text của model → AnswerBlock[]                                   */
/* ------------------------------------------------------------------ */

/** Bỏ các ký hiệu markdown mà UI không render (đậm, nghiêng, code). */
function stripInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/**
 * Model trả về text thuần (có thể lẫn chút markdown). Gom các dòng gạch đầu
 * dòng thành khối `bullets`, dòng đánh số thành `steps`, còn lại là `text` —
 * dòng tiêu đề ngay trước danh sách trở thành title của danh sách đó.
 */
export function parseAiBlocks(raw: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  let paragraph: string[] = [];
  let pendingTitle: string | undefined;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ kind: "text", text: paragraph.join("\n") });
    paragraph = [];
  };

  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = stripInline(lines[i].replace(/^#{1,4}\s*/, ""));

    if (!line) {
      flushParagraph();
      i += 1;
      continue;
    }

    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const step = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bullet || step) {
      const isStep = Boolean(step);
      const items: string[] = [];
      while (i < lines.length) {
        const l = stripInline(lines[i].replace(/^#{1,4}\s*/, ""));
        const m = isStep ? /^\d+[.)]\s+(.*)$/.exec(l) : /^[-*•]\s+(.*)$/.exec(l);
        if (!m) break;
        items.push(m[1]);
        i += 1;
      }
      blocks.push(
        isStep
          ? { kind: "steps", title: pendingTitle, items }
          : { kind: "bullets", title: pendingTitle, items },
      );
      pendingTitle = undefined;
      continue;
    }

    // Dòng ngắn kết thúc bằng ":" ngay trước một danh sách → làm title.
    const next = i + 1 < lines.length ? stripInline(lines[i + 1]) : "";
    if (line.endsWith(":") && line.length < 80 && /^([-*•]|\d+[.)])\s/.test(next)) {
      flushParagraph();
      pendingTitle = line.slice(0, -1);
      i += 1;
      continue;
    }

    paragraph.push(line);
    i += 1;
  }
  flushParagraph();

  return blocks.length ? blocks : [{ kind: "text", text: raw.trim() }];
}
