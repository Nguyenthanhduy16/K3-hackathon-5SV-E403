import { ALL_DOCS, COURSE_DAYS, findDayOfDoc, getSlide } from "./mock-data";
import type { CourseDoc } from "./types";

/**
 * Dữ liệu cấp BUỔI HỌC — phần được hardcode để xử lý nhóm câu hỏi mà
 * retrieval neo theo trang không trả lời được (P1).
 *
 * Khảo sát: 62,6% câu "tóm tắt / tổng hợp buổi học" bị bí, vì mỗi lượt hỏi
 * chỉ nhìn thấy đúng một trang. Ở đây mình dựng sẵn dàn ý buổi, takeaway,
 * thuật ngữ và dữ liệu vận hành lớp để tutor trả lời được ở phạm vi buổi/môn.
 */

export interface SessionSection {
  title: string;
  from: number;
  to: number;
  summary: string;
}

export interface GlossaryTerm {
  term: string;
  /** Các cách viết khác để bắt từ khoá (đã bỏ dấu khi so khớp). */
  aliases: string[];
  definition: string;
  page: number;
}

export interface SessionPack {
  docId: string;
  dayLabel: string;
  title: string;
  durationMin: number;
  totalPages: number;
  /** Câu hỏi dẫn dắt cả buổi — chính là slide trang 2. */
  hook: string;
  oneLiner: string;
  sections: SessionSection[];
  takeaways: string[];
  glossary: GlossaryTerm[];
}

const DAY6: SessionPack = {
  docId: "d6-main",
  dayLabel: "Day 6",
  title: "Quản lý sản phẩm & dự án AI",
  durationMin: 90,
  totalPages: 37,
  hook: "Team đã build 3 tuần. Nhưng stakeholder muốn đổi requirements. Làm sao xử lý?",
  oneLiner:
    "Cách lập kế hoạch, chốt phạm vi và đo chất lượng cho một sản phẩm AI khi kết quả còn bất định.",
  sections: [
    {
      title: "Mở đầu & câu hỏi dẫn nhập",
      from: 1,
      to: 2,
      summary:
        "Đặt tình huống stakeholder đổi yêu cầu sau 3 tuần build — câu hỏi xuyên suốt cả buổi.",
    },
    {
      title: "Phần 1 · Vì sao quản lý sản phẩm AI khác đi",
      from: 3,
      to: 6,
      summary:
        "Ba nguồn bất định của dự án AI, so sánh với phần mềm truyền thống, và năm chặng của vòng đời sản phẩm AI.",
    },
    {
      title: "Phần 2 · Khi requirements thay đổi giữa chừng",
      from: 7,
      to: 10,
      summary:
        "Scope creep vào cửa nào, quy trình bốn bước xử lý yêu cầu thay đổi, và nguyên tắc ưu tiên.",
    },
    {
      title: "Phần 3 · Đo lường và chất lượng",
      from: 11,
      to: 15,
      summary:
        "Quality bar viết bằng số, golden set 20–30 ca, hai nhóm rủi ro và checklist sáu mục trước demo.",
    },
    {
      title: "Phần 4 · Vận hành nhóm hằng ngày",
      from: 16,
      to: 36,
      summary:
        "Vai trò trong nhóm, nhịp làm việc theo tuần, cách ước lượng bằng vòng lặp, chi phí, an toàn và bàn giao.",
    },
    {
      title: "Kết & Q&A",
      from: 37,
      to: 37,
      summary: "Quay lại câu hỏi mở đầu và chốt ba điều mang về.",
    },
  ],
  takeaways: [
    "Kế hoạch AI là kế hoạch học — mỗi vòng lặp phải trả lời một câu hỏi.",
    "Thay đổi yêu cầu là tín hiệu, không phải tai nạn — hãy định lượng nó.",
    "Không có phép đo trung thực thì không có tiến bộ để báo cáo.",
  ],
  glossary: [
    {
      term: "Stakeholder",
      aliases: ["stakeholder", "ben lien quan"],
      definition:
        "Người bị ảnh hưởng bởi sản phẩm hoặc có quyền tác động tới nó: khách hàng, người dùng cuối, giảng viên phụ trách, phòng vận hành, người duyệt ngân sách. Điều cần nắm là ai ra quyết định cuối và mỗi người đo thành công bằng chỉ số nào.",
      page: 8,
    },
    {
      term: "Scope creep",
      aliases: ["scope creep", "pham vi phinh to", "phinh pham vi"],
      definition:
        "Phạm vi công việc phình dần bằng những yêu cầu nhỏ được thêm vào sau khi đã chốt. Bốn cửa quen thuộc: stakeholder mới xuất hiện, demo giữa kỳ gợi ý tính năng mới, tiêu chí thành công chưa viết thành số, và một lỗi lẻ bị nâng thành yêu cầu lớn.",
      page: 8,
    },
    {
      term: "Quality bar",
      aliases: ["quality bar", "nguong chat luong", "chuan chat luong"],
      definition:
        "Ngưỡng chất lượng viết bằng con số — tỷ lệ đạt, độ trễ tối đa, chi phí mỗi lượt — gắn với một lát cắt cụ thể. Chốt trước khi build và giữ nguyên sau đó; đổi quality bar giữa chừng là đổi luôn kết quả đo.",
      page: 12,
    },
    {
      term: "Golden set",
      aliases: ["golden set", "bo ca kiem thu", "test set"],
      definition:
        "Bộ ca kiểm thử tối thiểu chạy lại sau mỗi lần đổi prompt. 20–30 ca là đủ để thấy xu hướng ở giai đoạn prototype; trộn ca dễ, ca khó và ca hệ thống nên từ chối trả lời.",
      page: 13,
    },
    {
      term: "Eval",
      aliases: ["eval", "danh gia", "do luong chat luong"],
      definition:
        "Vòng đo chất lượng đầu ra của model trên golden set. Một vòng lặp gồm: đổi prompt hoặc dữ liệu → chạy eval → đọc kết quả → quyết định giữ, sửa hay bỏ.",
      page: 13,
    },
    {
      term: "Vòng lặp",
      aliases: ["vong lap", "iteration", "vong"],
      definition:
        "Đơn vị ước lượng thay cho giờ công. Một vòng = đổi prompt hoặc dữ liệu, chạy eval, đọc kết quả, ra quyết định. Ghi lại số vòng thực tế đã tốn để ước lượng lần sau.",
      page: 20,
    },
    {
      term: "Lát cắt",
      aliases: ["lat cat", "slice", "thin slice"],
      definition:
        "Phần nhỏ nhất của sản phẩm chạy được từ đầu đến cuối và đo được. Quality bar luôn gắn với một lát cắt cụ thể chứ không gắn với toàn bộ sản phẩm.",
      page: 12,
    },
  ],
};

/** Buổi khác chưa có bản tóm tắt soạn tay — dựng dàn ý tối thiểu từ slide. */
function genericPack(doc: CourseDoc): SessionPack {
  const day = findDayOfDoc(doc.id);
  const quarter = Math.max(1, Math.round(doc.pages / 4));
  return {
    docId: doc.id,
    dayLabel: day.label,
    title: day.topic,
    durationMin: 60,
    totalPages: doc.pages,
    hook: getSlide(Math.min(2, doc.pages), doc).title,
    oneLiner: day.topic,
    sections: [
      {
        title: "Mở đầu",
        from: 1,
        to: quarter,
        summary: getSlide(1, doc).title,
      },
      {
        title: "Nội dung chính",
        from: quarter + 1,
        to: doc.pages - quarter,
        summary: getSlide(quarter + 2, doc).title,
      },
      {
        title: "Tổng kết",
        from: Math.max(quarter + 2, doc.pages - quarter + 1),
        to: doc.pages,
        summary: getSlide(doc.pages, doc).title,
      },
    ],
    takeaways: getSlide(Math.min(4, doc.pages), doc).bullets ?? [
      "Chưa có bản tóm tắt soạn sẵn cho buổi này.",
    ],
    glossary: [],
  };
}

const PACKS: Record<string, SessionPack> = { [DAY6.docId]: DAY6 };

export function getSessionPack(doc: CourseDoc): SessionPack {
  return PACKS[doc.id] ?? genericPack(doc);
}

export function sectionOfPage(pack: SessionPack, page: number): SessionSection {
  return (
    pack.sections.find((s) => page >= s.from && page <= s.to) ?? pack.sections[0]
  );
}

/* ------------------------------------------------------------------ */
/* Vận hành lớp & nền tảng — nhóm câu hỏi bí 42,3%                     */
/* ------------------------------------------------------------------ */

export const COURSE_OPS = {
  code: "COMP2010",
  name: "Mini Hackathon AI — Batch 03",
  format: "1,5 ngày · nhóm 4-5 người · zone tối đa 5 nhóm, thi theo lớp",
  checkpoints: [
    { id: "Khai mạc", what: "Khai mạc + phát đề", k3: "09:00 ngày 1", k4: "14:00 ngày 1" },
    { id: "CP1", what: "Chốt Canvas", k3: "10:00 ngày 1", k4: "15:00 ngày 1" },
    { id: "CP2", what: "Show được thứ bấm được", k3: "12:00 ngày 1", k4: "17:00 ngày 1" },
    { id: "CP3", what: "AI chạy thật + đo lượt đầu", k3: "16:00 ngày 1", k4: "10:30 ngày 2" },
    { id: "CP4", what: "Chốt tiến độ", k3: "17:30 ngày 1", k4: "12:00 ngày 2" },
    { id: "CP5", what: "Xác minh + validation + dry run", k3: "09:00 ngày 2", k4: "14:00 ngày 2" },
    { id: "CP6", what: "Demo", k3: "10:00 ngày 2", k4: "15:00 ngày 2" },
  ],
  hardDeadline: {
    what: "Nộp AI Spec (spec.md)",
    when: "23:59 ngày 1",
    note: "Hạn cứng, không phụ thuộc khoá. Quality bar chốt tại thời điểm này và giữ nguyên sau đó.",
  },
  grading: {
    total: 100,
    parts: [
      { block: "Nộp checkpoint", points: 25, note: "5 điểm mỗi mốc CP1–CP5 · muộn = 0 cho mốc đó" },
      { block: "R1 · Bằng chứng & impact", points: 15, note: "spec.md §1-§2 + log khảo sát" },
      { block: "R2 · Lát cắt & thiết kế", points: 15, note: "spec.md §4" },
      { block: "R3 · Chỗ khó & rủi ro", points: 11, note: "spec.md §5-§6" },
      { block: "R4 · Kiểm thử", points: 15, note: "spec.md §7 + eval/" },
      { block: "R5 · Prototype chạy được", points: 8, note: "codebase/ + demo" },
      { block: "R6 · Validation với user", points: 8, note: "validation/" },
      { block: "R7 · Quy trình & repo", points: 3, note: "cấu trúc repo" },
    ],
  },
  repo: [
    "README.md — thành viên (mã HV + tên) + phân công có tên từng phần",
    "spec.md — AI Spec theo template",
    "demo-slides.pdf — slide 6 trang",
    "codebase/ — prototype, ghi rõ phần nào mock",
    "eval/ — golden set + bảng kết quả các lượt chạy",
    "validation/ — feedback log từ vòng user test",
    "reflection/ — mỗi người 1 file",
  ],
  rules: [
    "Prototype có 3 mức Sketch / Mock / Working — mức nào cũng bắt buộc ≥1 lời gọi AI chạy thật.",
    "Vibe-coding rule: dùng AI để build thoải mái, nhưng không giải thích được phần có tên mình thì phần đó 0 điểm (kiểm tra tại CP5).",
    "Quality bar chốt tại spec.md 23:59 ngày 1 và giữ nguyên sau đó.",
    "Chỉ dùng dữ liệu trong data/ hoặc dữ liệu giả tự sinh. Không commit API key.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Truy xuất trong phạm vi buổi — quét toàn bộ slide thay vì 1 trang    */
/* ------------------------------------------------------------------ */

export interface Hit {
  page: number;
  title: string;
  snippet: string;
  score: number;
}

const STOPWORDS = new Set([
  "la", "gi", "cua", "va", "cho", "khi", "nao", "thi", "co", "duoc", "trong",
  "mot", "cac", "nhung", "nay", "do", "toi", "ban", "minh", "hay", "ve", "voi",
  "de", "lam", "sao", "nhu", "the", "tren", "duoi", "ra", "vao", "bi", "boi",
  "hoi", "tra", "loi", "noi", "biet", "muon", "can", "phai", "khong", "cai",
  "the nao", "the?", "the", "a", "the", "is", "the", "what", "how", "why",
  "and", "for", "with", "that", "this", "does", "are", "you", "can", "give",
  "tom", "tat", "giai", "thich",
]);

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function deaccent(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function slideText(page: number, doc: CourseDoc): { title: string; body: string } {
  const s = getSlide(page, doc);
  const parts = [
    s.eyebrow,
    s.subtitle,
    s.body,
    ...(s.bullets ?? []),
    ...(s.columns ?? []).flatMap((c) => [c.heading, ...c.items]),
    s.footnote,
  ].filter(Boolean) as string[];
  return { title: s.title, body: parts.join(" · ") };
}

/** Tìm từ khoá trên toàn bộ slide của tài liệu đang mở. */
export function searchSession(doc: CourseDoc, query: string, limit = 5): Hit[] {
  const terms = deaccent(query)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  if (terms.length === 0) return [];

  const hits: Hit[] = [];
  for (let page = 1; page <= doc.pages; page += 1) {
    const { title, body } = slideText(page, doc);
    const hayTitle = deaccent(title);
    const hayBody = deaccent(body);

    let score = 0;
    for (const term of terms) {
      if (hayTitle.includes(term)) score += 3;
      if (hayBody.includes(term)) score += 1;
    }
    if (score === 0) continue;

    const sentence =
      body
        .split(" · ")
        .find((part) => terms.some((term) => deaccent(part).includes(term))) ?? body;

    hits.push({
      page,
      title,
      snippet: sentence.length > 150 ? `${sentence.slice(0, 147)}...` : sentence,
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score || a.page - b.page).slice(0, limit);
}

export interface CourseHit extends Hit {
  docId: string;
  /** Nhãn nguồn: "Day 3 · day03-ai-spec-writing.pdf". */
  source: string;
}

/**
 * Tìm trên toàn bộ tài liệu của môn — dùng cho phạm vi "Cả môn".
 * Mỗi tài liệu chỉ lấy kết quả tốt nhất để danh sách trải rộng các buổi
 * thay vì dồn hết vào một file.
 */
export function searchCourse(query: string, limit = 6): CourseHit[] {
  const best: CourseHit[] = [];
  for (const doc of ALL_DOCS) {
    const day = findDayOfDoc(doc.id);
    const top = searchSession(doc, query, 1)[0];
    if (top) {
      best.push({ ...top, docId: doc.id, source: `${day.label} · ${doc.name}` });
    }
  }
  return best.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Slide có bảng so sánh hai cột — dùng cho nhóm câu "khi nào dùng cái nào". */
export function findComparison(doc: CourseDoc, query: string) {
  const terms = deaccent(query)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  let best: { page: number; score: number } | null = null;
  for (let page = 1; page <= doc.pages; page += 1) {
    const slide = getSlide(page, doc);
    if (!slide.columns?.length) continue;
    const hay = deaccent(
      [slide.title, ...slide.columns.flatMap((c) => [c.heading, ...c.items])].join(" "),
    );
    const score = terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
    if (!best || score > best.score) best = { page, score };
  }
  if (!best) return null;
  return { page: best.page, slide: getSlide(best.page, doc), matched: best.score > 0 };
}

export const COURSE_STATS = {
  days: COURSE_DAYS.length,
  docs: COURSE_DAYS.reduce((n, d) => n + d.documents.length, 0),
  pages: COURSE_DAYS.reduce(
    (n, d) => n + d.documents.reduce((m, doc) => m + doc.pages, 0),
    0,
  ),
};
