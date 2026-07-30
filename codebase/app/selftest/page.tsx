import { buildAnswer } from "@/lib/ai-mock";
import { findDoc, DEFAULT_DOC_ID } from "@/lib/mock-data";

const QUESTIONS = [
  "Tóm tắt buổi học hôm nay",
  "Tóm tắt trang này",
  "Buổi này gồm những phần nào?",
  "hôm nay học gì",
  "Scope creep là gì?",
  "Stakeholder là gì?",
  "Deadline nộp spec là khi nào?",
  "Bài này chấm bao nhiêu điểm?",
  "Cấu trúc repo nộp bài thế nào?",
  "Bạn làm được gì?",
  "So sánh phần mềm truyền thống và sản phẩm AI",
  "golden set",
  "quality bar",
  "Giải thích nội dung dễ hiểu hơn",
  "Tạo 3 câu hỏi ôn tập",
  "Cho tôi một ví dụ thực tế",
  "Vì sao ước lượng dự án AI hay sai?",
  "blockchain",
  "Summarise today's session",
  "When is the spec deadline?",
];

export default function SelfTest() {
  const doc = findDoc(DEFAULT_DOC_ID);
  const rows = QUESTIONS.map((q) => {
    const a = buildAnswer(q, doc, 2, "vi", "auto");
    return {
      q,
      intent: a.intent,
      scope: a.scope.level,
      expanded: a.scope.expandedFromPage ?? null,
      blocks: a.blocks.map((b) => b.kind).join(","),
      cites: a.citations.join("/"),
      len: a.plain.length,
    };
  });

  const forced = ["page", "session", "course"].flatMap((s) =>
    ["golden set", "Deadline nộp spec là khi nào?"].map((q) => {
      const a = buildAnswer(q, doc, 2, "vi", s as "page");
      return {
        s: `${s} / ${q}`,
        scope: a.scope.level,
        blocks: a.blocks.map((b) => b.kind).join(","),
      };
    }),
  );

  const courseHits = buildAnswer("golden set", doc, 2, "vi", "course").blocks
    .flatMap((b) => (b.kind === "hits" ? b.items : []))
    .map((h) => `${h.source ?? "?"} p${h.page} — ${h.title}`);

  return (
    <pre>
      {rows
        .map(
          (r) =>
            `${r.intent.padEnd(16)} | ${r.scope.padEnd(7)} | exp=${String(r.expanded).padEnd(4)} | cites=${r.cites.padEnd(14)} | ${r.blocks.padEnd(28)} | len=${r.len} | ${r.q}`,
        )
        .join("\n")}
      {"\n\nFORCED SCOPE:\n"}
      {forced.map((f) => `${f.s} -> ${f.scope} | ${f.blocks}`).join("\n")}
      {"\n\nCOURSE HITS for 'golden set':\n"}
      {courseHits.join("\n")}
    </pre>
  );
}
