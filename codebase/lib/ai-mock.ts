import { getSlide } from "./mock-data";
import {
  COURSE_OPS,
  COURSE_STATS,
  deaccent,
  findComparison,
  getSessionPack,
  searchCourse,
  searchSession,
  sectionOfPage,
} from "./session-data";
import type {
  Answer,
  AnswerBlock,
  CourseDoc,
  Intent,
  Lang,
  RetrievalScope,
  ScopeChoice,
  ScopeLevel,
} from "./types";

/**
 * Bộ trả lời giả lập — không gọi API.
 *
 * Thiết kế bám điểm đau P1: retrieval cũ neo theo TRANG nên nhóm câu hỏi cấp
 * BUỔI bí 62,6%. Ở đây mỗi lượt hỏi đi qua hai bước:
 *   1. Đoán ý định (theo đúng 8 nhóm trong bảng khảo sát).
 *   2. Nới phạm vi truy xuất tương ứng: trang → buổi → môn.
 * Nội dung cấp buổi/môn lấy từ `session-data.ts` (hardcode), nội dung cấp
 * trang lấy từ slide đang mở.
 */

/* ------------------------------------------------------------------ */
/* 1. Đoán ý định                                                      */
/* ------------------------------------------------------------------ */

const PATTERNS: { intent: Intent; re: RegExp }[] = [
  {
    intent: "tutor-probe",
    re: /\b(ban la ai|ban ten|ban lam duoc gi|giup duoc gi|ban co the lam|lam duoc nhung gi|who are you|what can you do|how can you help)\b/,
  },
  {
    intent: "ops",
    re: /\b(deadline|han nop|hen nop|nop bai|nop spec|checkpoint|cp[1-6]|moc|lich|thoi gian bieu|may gio|diem|cham diem|rubric|repo|cau truc thu muc|quy dinh|luat|the le|bao nhieu diem)\b/,
  },
  // Cấp buổi phải xét TRƯỚC cấp trang: "tóm tắt buổi học hôm nay" có chữ
  // "nay" nên rất dễ bị bắt nhầm thành câu hỏi về trang đang mở.
  {
    intent: "session-summary",
    re: /\b(tom tat|tom luoc|tong hop|tong ket|recap|summar|overview)\w*\b.{0,40}\b(buoi|hom nay|bai hoc|bai giang|ca bai|toan bo|session|lecture|day ?[1-6])\b|^\s*(tom tat buoi|tom tat bai|hom nay hoc gi|buoi nay hoc gi|buoi hom nay hoc gi)/,
  },
  {
    intent: "page-summary",
    re: /\b(tom tat|tom luoc|summar)\w*\b.{0,24}\b(trang nay|trang hien tai|trang dang doc|slide nay|doan nay|this page|this slide|current page|trang \d+)\b/,
  },
  {
    intent: "session-outline",
    re: /\b(gom (nhung|may)|co (may|nhung))\b.{0,16}\b(phan|muc|chuong)\b|\b(dan y|outline|cau truc buoi|bo cuc buoi|muc luc)\b/,
  },
  {
    intent: "compare",
    re: /\b(so sanh|khac nhau|khac gi|khac biet|versus|\bvs\b|khi nao dung|nen dung cai nao|compar\w*|difference)\b/,
  },
  {
    intent: "quiz",
    re: /\b(cau hoi on tap|on tap|quiz|kiem tra kien thuc|revision question|test me)\b/,
  },
  { intent: "example", re: /\b(vi du|example|thuc te|real.?world|case study)\b/ },
  {
    intent: "definition",
    re: /\b(la gi|nghia la|dinh nghia|thuat ngu|what is|what does .* mean|defin\w*)\b/,
  },
  {
    intent: "page-explain",
    re: /\b(giai thich|de hieu hon|noi de hieu|don gian hon|explain|simpler|slide nay|trang nay|doan nay|doan dang doc)\b/,
  },
  {
    intent: "mechanism",
    re: /\b(vi sao|tai sao|co che|hoat dong (nhu )?the nao|van hanh ra sao|how does .* work|why)\b/,
  },
];

export function classifyIntent(question: string): Intent {
  const q = deaccent(question);
  for (const { intent, re } of PATTERNS) {
    if (re.test(q)) return intent;
  }
  return "keyword";
}

/* ------------------------------------------------------------------ */
/* 2. Nới phạm vi                                                      */
/* ------------------------------------------------------------------ */

const INTENT_SCOPE: Record<Intent, ScopeLevel> = {
  "session-summary": "session",
  "session-outline": "session",
  ops: "course",
  "tutor-probe": "page",
  compare: "session",
  keyword: "session",
  definition: "session",
  mechanism: "session",
  "page-summary": "page",
  "page-explain": "page",
  quiz: "page",
  example: "page",
};

function buildScope(
  level: ScopeLevel,
  doc: CourseDoc,
  page: number,
  lang: Lang,
  autoExpanded: boolean,
): RetrievalScope {
  const pack = getSessionPack(doc);
  const vi = lang === "vi";

  if (level === "course") {
    return {
      level,
      label: vi ? `Cả môn · ${COURSE_OPS.code}` : `Whole course · ${COURSE_OPS.code}`,
      detail: vi
        ? `${COURSE_STATS.days} buổi · ${COURSE_STATS.docs} tài liệu · ${COURSE_STATS.pages} slide`
        : `${COURSE_STATS.days} sessions · ${COURSE_STATS.docs} files · ${COURSE_STATS.pages} slides`,
      expandedFromPage: autoExpanded ? page : undefined,
    };
  }
  if (level === "session") {
    return {
      level,
      label: vi ? `Cả buổi · ${pack.dayLabel}` : `Whole session · ${pack.dayLabel}`,
      detail: vi
        ? `${pack.totalPages} slide · ${pack.sections.length} mục`
        : `${pack.totalPages} slides · ${pack.sections.length} sections`,
      expandedFromPage: autoExpanded ? page : undefined,
    };
  }
  const section = sectionOfPage(pack, page);
  return {
    level,
    label: vi ? `Trang ${page}` : `Page ${page}`,
    detail: `${section.title} (${section.from}–${section.to})`,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Dựng câu trả lời                                                 */
/* ------------------------------------------------------------------ */

function plainOf(blocks: AnswerBlock[]): string {
  const lines: string[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case "text":
        lines.push(b.text);
        break;
      case "callout":
        lines.push(b.text);
        break;
      case "bullets":
        if (b.title) lines.push(b.title);
        lines.push(...b.items.map((i) => `• ${i}`));
        break;
      case "steps":
        if (b.title) lines.push(b.title);
        lines.push(...b.items.map((i, n) => `${n + 1}. ${i}`));
        break;
      case "outline":
        if (b.title) lines.push(b.title);
        lines.push(
          ...b.items.map((i) => `• [${i.from}–${i.to}] ${i.title} — ${i.summary}`),
        );
        break;
      case "table":
        if (b.title) lines.push(b.title);
        lines.push(b.head.join(" | "));
        lines.push(...b.rows.map((r) => r.join(" | ")));
        break;
      case "terms":
        lines.push(
          ...b.items.map((i) => `• ${i.term} (trang ${i.page}): ${i.definition}`),
        );
        break;
      case "hits":
        if (b.title) lines.push(b.title);
        lines.push(...b.items.map((i) => `• Trang ${i.page} — ${i.title}: ${i.snippet}`));
        break;
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

function sessionSummary(doc: CourseDoc, lang: Lang): AnswerBlock[] {
  const pack = getSessionPack(doc);
  const vi = lang === "vi";

  return [
    {
      kind: "text",
      text: vi
        ? `${pack.dayLabel} — ${pack.title}. ${pack.totalPages} slide, khoảng ${pack.durationMin} phút, chia làm ${pack.sections.length} mục. Cả buổi xoay quanh một câu hỏi: “${pack.hook}”`
        : `${pack.dayLabel} — ${pack.title}. ${pack.totalPages} slides, about ${pack.durationMin} minutes, in ${pack.sections.length} sections. The whole session circles one question: “${pack.hook}”`,
    },
    {
      kind: "outline",
      title: vi ? "Dàn ý buổi học" : "Session outline",
      items: pack.sections.map((s) => ({
        title: s.title,
        from: s.from,
        to: s.to,
        summary: s.summary,
      })),
    },
    {
      kind: "bullets",
      title: vi ? "Ba điều mang về" : "Three takeaways",
      items: pack.takeaways,
    },
    {
      kind: "bullets",
      title: vi ? "Thuật ngữ xuất hiện trong buổi" : "Terms introduced",
      items: pack.glossary.map((g) =>
        vi ? `${g.term} — trang ${g.page}` : `${g.term} — page ${g.page}`,
      ),
    },
    {
      kind: "callout",
      tone: "info",
      text: vi
        ? "Muốn đi sâu mục nào, bấm vào khoảng trang ở dàn ý — mình sẽ mở đúng slide đó."
        : "To go deeper, click a page range in the outline — I'll open that slide.",
    },
  ];
}

function sessionOutline(doc: CourseDoc, lang: Lang): AnswerBlock[] {
  const pack = getSessionPack(doc);
  const vi = lang === "vi";
  return [
    {
      kind: "text",
      text: vi
        ? `${pack.dayLabel} có ${pack.sections.length} mục trên ${pack.totalPages} slide:`
        : `${pack.dayLabel} has ${pack.sections.length} sections across ${pack.totalPages} slides:`,
    },
    {
      kind: "outline",
      items: pack.sections.map((s) => ({
        title: s.title,
        from: s.from,
        to: s.to,
        summary: s.summary,
      })),
    },
  ];
}

function opsAnswer(question: string, lang: Lang): AnswerBlock[] {
  const q = deaccent(question);
  const vi = lang === "vi";

  if (/diem|cham|rubric/.test(q)) {
    return [
      {
        kind: "text",
        text: vi
          ? `Tổng ${COURSE_OPS.grading.total} điểm, chia hai phần: 25 điểm nộp checkpoint và 75 điểm chấm trên artifact trong repo.`
          : `${COURSE_OPS.grading.total} points total: 25 for checkpoint submissions and 75 graded on the artifacts in your repo.`,
      },
      {
        kind: "table",
        head: vi ? ["Khối", "Điểm", "Chấm ở đâu"] : ["Block", "Points", "Graded on"],
        rows: COURSE_OPS.grading.parts.map((p) => [p.block, String(p.points), p.note]),
      },
      {
        kind: "callout",
        tone: "warn",
        text: vi
          ? "Nộp muộn một mốc = 0 điểm cho mốc đó. Mỗi thành viên nộp riêng, cả nhóm dùng chung một link repo."
          : "A late checkpoint scores 0 for that milestone. Everyone submits individually with the same repo link.",
      },
    ];
  }

  if (/repo|thu muc|cau truc|nop bai/.test(q)) {
    return [
      {
        kind: "text",
        text: vi
          ? "Một repo cho cả nhóm, cấu trúc như sau. Spec chốt 23:59 ngày 1, bản hoàn chỉnh trước CP6."
          : "One repo per team with this structure. The spec is due 23:59 on day 1, the full version before CP6.",
      },
      { kind: "bullets", items: [...COURSE_OPS.repo] },
    ];
  }

  if (/deadline|han nop|hen nop|nop spec|may gio/.test(q)) {
    return [
      {
        kind: "callout",
        tone: "warn",
        text: vi
          ? `${COURSE_OPS.hardDeadline.what}: ${COURSE_OPS.hardDeadline.when}. ${COURSE_OPS.hardDeadline.note}`
          : `${COURSE_OPS.hardDeadline.what}: ${COURSE_OPS.hardDeadline.when}. ${COURSE_OPS.hardDeadline.note}`,
      },
      {
        kind: "table",
        title: vi ? "Các mốc còn lại" : "Remaining milestones",
        head: vi ? ["Mốc", "Nội dung", "Khoá 3", "Khoá 4"] : ["Milestone", "What", "K3", "K4"],
        rows: COURSE_OPS.checkpoints.map((c) => [c.id, c.what, c.k3, c.k4]),
      },
    ];
  }

  if (/quy dinh|luat|the le/.test(q)) {
    return [
      {
        kind: "text",
        text: vi ? "Bốn luật chung của sự kiện:" : "The four ground rules:",
      },
      { kind: "bullets", items: [...COURSE_OPS.rules] },
    ];
  }

  return [
    {
      kind: "text",
      text: vi
        ? `${COURSE_OPS.name} · ${COURSE_OPS.format}. Lịch 6 mốc như sau:`
        : `${COURSE_OPS.name} · ${COURSE_OPS.format}. The six milestones:`,
    },
    {
      kind: "table",
      head: vi ? ["Mốc", "Nội dung", "Khoá 3", "Khoá 4"] : ["Milestone", "What", "K3", "K4"],
      rows: COURSE_OPS.checkpoints.map((c) => [c.id, c.what, c.k3, c.k4]),
    },
    {
      kind: "callout",
      tone: "warn",
      text: vi
        ? `Hạn cứng: ${COURSE_OPS.hardDeadline.what} — ${COURSE_OPS.hardDeadline.when}.`
        : `Hard deadline: ${COURSE_OPS.hardDeadline.what} — ${COURSE_OPS.hardDeadline.when}.`,
    },
  ];
}

function tutorProbe(lang: Lang): AnswerBlock[] {
  const vi = lang === "vi";
  return [
    {
      kind: "text",
      text: vi
        ? "Mình là VLearn Tutor, trợ lý học tập trong màn hình đọc học liệu VLearn. Mình giúp bạn hiểu nội dung đang đọc và tìm lại phần liên quan trong học liệu khi cần."
        : "I'm VLearn Tutor, the study assistant inside the VLearn reader. I help you understand what you're reading and find relevant material when needed.",
    },
    {
      kind: "bullets",
      title: vi ? "Mình có thể giúp" : "I can help with",
      items: vi
        ? [
            "Tóm tắt hoặc giải thích trang đang mở.",
            "Tóm tắt cả buổi học khi câu hỏi cần nhìn rộng hơn.",
            "Tìm slide/tài liệu liên quan và đưa trích dẫn để bạn kiểm chứng.",
            "Tạo câu hỏi ôn tập từ nội dung học liệu.",
          ]
        : [
            "Summarising or explaining the open page.",
            "Summarising a whole session when the question needs broader context.",
            "Finding relevant slides or files with citations you can check.",
            "Creating revision questions from the learning material.",
          ],
    },
  ];
}
function compareAnswer(
  doc: CourseDoc,
  question: string,
  lang: Lang,
): { blocks: AnswerBlock[]; pages: number[] } {
  const vi = lang === "vi";
  const found = findComparison(doc, question);

  if (!found?.slide.columns?.length) {
    return keywordAnswer(doc, question, lang);
  }

  const [a, b] = found.slide.columns;
  const rows: string[][] = [];
  const rowCount = Math.max(a.items.length, b.items.length);
  for (let i = 0; i < rowCount; i += 1) {
    rows.push([a.items[i] ?? "—", b.items[i] ?? "—"]);
  }

  return {
    pages: [found.page],
    blocks: [
      {
        kind: "text",
        text: vi
          ? `Slide ${found.page} của buổi này so sánh trực tiếp hai bên — “${found.slide.title}”.`
          : `Slide ${found.page} in this session compares the two directly — “${found.slide.title}”.`,
      },
      { kind: "table", head: [a.heading, b.heading], rows },
      {
        kind: "callout",
        tone: "info",
        text: vi
          ? "Nguyên tắc chọn: nếu tiêu chí đạt/không đạt viết được thành câu lệnh kiểm thử thì làm như phần mềm truyền thống; nếu phải chấm bằng người hoặc bằng tỷ lệ thì đi đường sản phẩm AI."
          : "Rule of thumb: if pass/fail can be written as a test assertion, treat it like traditional software; if it needs a human judge or a pass rate, treat it as an AI product.",
      },
    ],
  };
}

function definitionAnswer(
  doc: CourseDoc,
  question: string,
  lang: Lang,
): { blocks: AnswerBlock[]; pages: number[] } {
  const pack = getSessionPack(doc);
  const q = deaccent(question);
  const vi = lang === "vi";

  const term = pack.glossary.find(
    (g) => q.includes(deaccent(g.term)) || g.aliases.some((a) => q.includes(a)),
  );

  if (!term) return keywordAnswer(doc, question, lang);

  const alsoOn = searchSession(doc, term.term, 4).filter((h) => h.page !== term.page);

  const blocks: AnswerBlock[] = [
    { kind: "terms", items: [{ term: term.term, definition: term.definition, page: term.page }] },
  ];

  if (alsoOn.length) {
    blocks.push({
      kind: "hits",
      title: vi ? "Còn được nhắc ở" : "Also mentioned on",
      items: alsoOn.map((h) => ({ page: h.page, title: h.title, snippet: h.snippet })),
    });
  }

  return { blocks, pages: [term.page, ...alsoOn.map((h) => h.page)] };
}

function keywordAnswer(
  doc: CourseDoc,
  question: string,
  lang: Lang,
): { blocks: AnswerBlock[]; pages: number[] } {
  const pack = getSessionPack(doc);
  const hits = searchSession(doc, question, 5);
  const vi = lang === "vi";

  if (hits.length === 0) {
    return {
      pages: [],
      blocks: [
        {
          kind: "callout",
          tone: "warn",
          text: vi
            ? `Mình đã quét cả ${pack.totalPages} slide của ${pack.dayLabel} nhưng không thấy nội dung khớp. Có thể chủ đề này nằm ở buổi khác — bạn thử đổi phạm vi sang “Cả môn”, hoặc hỏi lại bằng từ khoá trong slide.`
            : `I scanned all ${pack.totalPages} slides of ${pack.dayLabel} and found nothing matching. It may live in another session — try switching the scope to “Whole course”, or rephrase using a term from the slides.`,
        },
      ],
    };
  }

  return {
    pages: hits.map((h) => h.page),
    blocks: [
      {
        kind: "text",
        text: vi
          ? `Tìm thấy ${hits.length} slide liên quan trong ${pack.dayLabel}:`
          : `Found ${hits.length} related slides in ${pack.dayLabel}:`,
      },
      {
        kind: "hits",
        items: hits.map((h) => ({ page: h.page, title: h.title, snippet: h.snippet })),
      },
    ],
  };
}

/** Phạm vi "Cả môn" — quét mọi tài liệu, kết quả kèm nhãn buổi + tên file. */
function courseAnswer(question: string, lang: Lang): AnswerBlock[] {
  const hits = searchCourse(question, 6);
  const vi = lang === "vi";

  if (hits.length === 0) {
    return [
      {
        kind: "callout",
        tone: "warn",
        text: vi
          ? `Mình đã quét ${COURSE_STATS.docs} tài liệu (${COURSE_STATS.pages} slide) của môn nhưng không thấy nội dung khớp. Có thể tài liệu đó chưa được upload lên VLearn.`
          : `I scanned all ${COURSE_STATS.docs} files (${COURSE_STATS.pages} slides) in this course and found nothing matching. That material may not be uploaded to VLearn yet.`,
      },
    ];
  }

  return [
    {
      kind: "text",
      text: vi
        ? `Tìm thấy ${hits.length} slide liên quan trên toàn môn:`
        : `Found ${hits.length} related slides across the course:`,
    },
    {
      kind: "hits",
      items: hits.map((h) => ({
        page: h.page,
        title: h.title,
        snippet: h.snippet,
        docId: h.docId,
        source: h.source,
      })),
    },
  ];
}

function pageAnswer(
  doc: CourseDoc,
  page: number,
  intent: Intent,
  lang: Lang,
): AnswerBlock[] {
  const slide = getSlide(page, doc);
  const vi = lang === "vi";
  const points =
    slide.bullets ??
    slide.columns?.map((c) => `${c.heading}: ${c.items.join("; ")}`) ??
    [slide.body ?? slide.title];

  if (intent === "quiz") {
    return [
      {
        kind: "text",
        text: vi
          ? `Ba câu ôn tập cho trang ${page} — “${slide.title}”:`
          : `Three revision questions for page ${page} — “${slide.title}”:`,
      },
      {
        kind: "steps",
        items: vi
          ? [
              "Nêu hai lý do khiến ước lượng thời gian cho dự án AI thường sai, và mỗi lý do cần dữ liệu gì để cải thiện?",
              "Stakeholder yêu cầu đổi phạm vi ở tuần thứ ba. Viết ra bốn bước bạn sẽ làm, theo đúng thứ tự.",
              "Quality bar khác gì với “làm cho tốt”? Cho một ví dụ quality bar viết đúng cách.",
            ]
          : [
              "Give two reasons AI project estimates usually slip, and what data would improve each.",
              "A stakeholder asks to change scope in week three. Write the four steps you'd take, in order.",
              "How is a quality bar different from “make it good”? Give one well-written example.",
            ],
      },
      {
        kind: "callout",
        tone: "info",
        text: vi
          ? "Trả lời thử một câu, mình sẽ nhận xét."
          : "Answer one and I'll give you feedback.",
      },
    ];
  }

  if (intent === "example") {
    return [
      {
        kind: "text",
        text: vi
          ? `Một ví dụ sát với trang ${page}: nhóm làm trợ lý ôn tập cho sinh viên, sau 3 tuần giảng viên đề nghị thêm chức năng chấm bài tự luận.`
          : `An example close to page ${page}: a team building a revision assistant is asked, after three weeks, to add automatic essay grading.`,
      },
      {
        kind: "steps",
        items: vi
          ? [
              "Làm rõ: chấm tự luận để tiết kiệm thời gian chấm, hay để sinh viên nhận phản hồi sớm hơn?",
              "Định lượng: cần thêm golden set riêng, khoảng 2 tuần và một vòng eval mới.",
              "Đưa lựa chọn: hoãn tính năng tra cứu slide để đổi lấy chấm bài, hoặc giữ nguyên và làm ở đợt sau.",
              "Chốt: giảng viên chọn phương án hoãn — nhóm cập nhật spec ngay trong ngày.",
            ]
          : [
              "Clarify: is grading meant to save marking time, or give students faster feedback?",
              "Quantify: it needs its own golden set, roughly two weeks and a fresh eval round.",
              "Offer options: drop slide lookup in exchange for grading, or defer it.",
              "Commit: the lecturer defers it — the team updates the spec the same day.",
            ],
      },
    ];
  }

  if (intent === "page-explain") {
    return [
      {
        kind: "text",
        text: vi
          ? `Mình diễn đạt lại trang ${page} theo cách đời thường: hãy tưởng tượng nhóm bạn nấu một món mới cho quán. Không thể biết trước món đó ngon tới đâu, nên phải nấu thử, cho vài người nếm, ghi lại điểm số rồi mới đưa vào thực đơn. Slide “${slide.title}” nói đúng chuyện đó với sản phẩm AI: làm một lát nhỏ → đo → sửa → mới mở rộng.`
          : `Page ${page} in everyday language: imagine cooking a new dish for a restaurant. You can't know how good it is up front, so you cook a test batch, let people taste it, write down the scores, and only then put it on the menu. “${slide.title}” says the same about AI products: build a thin slice → measure → fix → then scale.`,
      },
      { kind: "bullets", title: vi ? "Ý trên slide" : "On the slide", items: points },
    ];
  }

  // page-summary và mặc định
  return [
    {
      kind: "text",
      text: vi
        ? `Trang ${page} có tiêu đề “${slide.title}”. Ý chính:`
        : `Page ${page} is titled “${slide.title}”. Key points:`,
    },
    { kind: "bullets", items: points },
  ];
}

function mechanismAnswer(
  doc: CourseDoc,
  question: string,
  lang: Lang,
): { blocks: AnswerBlock[]; pages: number[] } {
  const vi = lang === "vi";
  const hits = searchSession(doc, question, 3);
  const blocks: AnswerBlock[] = [
    {
      kind: "text",
      text: vi
        ? "Lý do nằm ở chỗ kết quả của model là phân phối xác suất chứ không phải trạng thái đúng/sai: cùng một đầu vào có thể cho hai câu trả lời khác nhau, nên bạn không kiểm soát được chất lượng bằng cách viết thêm điều kiện — chỉ kiểm soát được bằng cách đo trên một bộ ca cố định rồi so sánh giữa các vòng."
        : "The reason is that a model's output is a probability distribution rather than a right/wrong state: the same input can produce two different answers, so you can't control quality by adding conditions — only by measuring against a fixed test set and comparing across iterations.",
    },
  ];
  if (hits.length) {
    blocks.push({
      kind: "hits",
      title: vi ? "Chỗ nói kỹ hơn trong buổi" : "Where the session covers it",
      items: hits.map((h) => ({ page: h.page, title: h.title, snippet: h.snippet })),
    });
  }
  return { blocks, pages: hits.map((h) => h.page) };
}

/* ------------------------------------------------------------------ */
/* Điểm vào                                                            */
/* ------------------------------------------------------------------ */

export function buildAnswer(
  question: string,
  doc: CourseDoc,
  page: number,
  lang: Lang,
  choice: ScopeChoice,
): Answer {
  const intent = classifyIntent(question);
  const wanted = INTENT_SCOPE[intent];
  // Câu hỏi vận hành lớp không có phiên bản "cấp trang", nên luôn trả lời ở cấp môn.
  const pinnedToCourse = intent === "ops";
  const level: ScopeLevel = pinnedToCourse
    ? "course"
    : choice === "auto"
      ? wanted
      : choice;
  const autoExpanded = level !== "page" && choice !== level;

  let blocks: AnswerBlock[] = [];
  let citations: number[] = [];

  if (intent === "tutor-probe") {
    blocks = tutorProbe(lang);
  } else if (pinnedToCourse) {
    blocks = opsAnswer(question, lang);
  } else if (level === "page") {
    blocks = pageAnswer(doc, page, intent, lang);
    citations = [page];
  } else if (level === "course") {
    blocks = courseAnswer(question, lang);
  } else {
    switch (intent) {
      case "session-summary":
        blocks = sessionSummary(doc, lang);
        citations = getSessionPack(doc).sections.map((s) => s.from);
        break;
      case "session-outline":
        blocks = sessionOutline(doc, lang);
        citations = getSessionPack(doc).sections.map((s) => s.from);
        break;
      case "compare": {
        const r = compareAnswer(doc, question, lang);
        blocks = r.blocks;
        citations = r.pages;
        break;
      }
      case "definition": {
        const r = definitionAnswer(doc, question, lang);
        blocks = r.blocks;
        citations = r.pages;
        break;
      }
      case "mechanism": {
        const r = mechanismAnswer(doc, question, lang);
        blocks = r.blocks;
        citations = r.pages;
        break;
      }
      default: {
        const r = keywordAnswer(doc, question, lang);
        blocks = r.blocks;
        citations = r.pages;
      }
    }
  }

  return {
    intent,
    scope: buildScope(level, doc, page, lang, autoExpanded),
    blocks,
    plain: plainOf(blocks),
    citations: [...new Set(citations)].sort((a, b) => a - b),
  };
}

/** Đổi cách diễn đạt khi người dùng bấm "Tạo lại câu trả lời". */
export function rephrase(answer: Answer, lang: Lang): Answer {
  const lead: AnswerBlock = {
    kind: "text",
    text:
      lang === "en"
        ? "Let me put that another way."
        : "Mình thử diễn đạt theo cách khác nhé.",
  };
  const blocks = [lead, ...answer.blocks];
  return { ...answer, blocks, plain: plainOf(blocks) };
}

/** Độ trễ giả lập 1–2 giây; câu cấp buổi/môn "nghĩ" lâu hơn một chút. */
export function replyDelay(question: string, level: ScopeLevel): number {
  const base = level === "page" ? 850 : 1150;
  return base + Math.min(question.length, 100) * 7;
}
