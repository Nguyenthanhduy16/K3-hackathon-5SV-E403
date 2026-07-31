export type Lang = "vi" | "en";
export type Theme = "light" | "dark";

/** Công cụ đang chọn trên toolbar. */
export type ToolId = "read" | "pen" | "highlight";

/** Trạng thái panel chatbot. */
export type ChatState = "closed" | "open" | "minimized";

export interface CourseDoc {
  id: string;
  name: string;
  /** Mã tài liệu hiển thị dưới tên file trên header. */
  meta: string;
  pages: number;
  /** Thư mục public chứa ảnh từng trang được sinh trực tiếp từ PDF nguồn. */
  assetBase: string;
  /** Đường dẫn PDF gốc trong repo để truy vết nguồn. */
  sourcePath: string;
}

export interface CourseDay {
  id: string;
  /** Nhãn buổi học, ví dụ "Day 1". */
  label: string;
  topic: string;
  topicEn: string;
  status: "ACTIVE" | "LOCKED";
  studying?: boolean;
  documents: CourseDoc[];
}

export interface AnnotationPoint {
  /** Tọa độ theo % chiều rộng/cao của slide. */
  x: number;
  y: number;
}

/** Một nét bút / vệt highlight người dùng vẽ lên slide. */
export interface Annotation {
  id: string;
  docId: string;
  page: number;
  tool: Exclude<ToolId, "read">;
  color: string;
  /** 1 | 2 | 3 — độ dày. */
  size: number;
  /** Các điểm của nét vẽ, dùng tọa độ tương đối để không lệch khi zoom. */
  points: AnnotationPoint[];
}

export interface MarkStyle {
  color: string;
  size: number;
}

export type ChatRole = "user" | "assistant";

/* ---------------- Phạm vi truy xuất (P1) ---------------- */

/** Lựa chọn của người dùng trên thanh phạm vi. */
export type ScopeChoice = "auto" | "page" | "session" | "course";
/** Phạm vi thực sự được dùng cho một lượt trả lời. */
export type ScopeLevel = "page" | "session" | "course";

export interface RetrievalScope {
  level: ScopeLevel;
  /** Nhãn ngắn: "Cả buổi · Day 1". */
  label: string;
  /** Dòng phụ: "23 slide · 3 mục". */
  detail: string;
  /** Có giá trị khi hệ thống tự nới phạm vi từ trang đang đọc. */
  expandedFromPage?: number;
}

/** Nhóm câu hỏi lấy theo bảng khảo sát tỉ lệ bí. */
export type Intent =
  | "session-summary"
  | "session-outline"
  | "ops"
  | "tutor-probe"
  | "compare"
  | "keyword"
  | "definition"
  | "mechanism"
  | "page-summary"
  | "page-explain"
  | "quiz"
  | "example";

/* ---------------- Khối nội dung trong câu trả lời ---------------- */

export interface OutlineItem {
  title: string;
  from: number;
  to: number;
  summary: string;
}

export interface TermItem {
  term: string;
  definition: string;
  page: number;
}

export interface HitItem {
  page: number;
  title: string;
  snippet: string;
  /** Có giá trị khi kết quả nằm ở tài liệu khác (phạm vi "Cả môn"). */
  docId?: string;
  source?: string;
}

export type AnswerBlock =
  | { kind: "text"; text: string }
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "steps"; title?: string; items: string[] }
  | { kind: "outline"; title?: string; items: OutlineItem[] }
  | { kind: "table"; title?: string; head: string[]; rows: string[][] }
  | { kind: "terms"; items: TermItem[] }
  | { kind: "hits"; title?: string; items: HitItem[] }
  | { kind: "callout"; tone: "info" | "warn"; text: string };

/** Nguồn kiểm chứng đi kèm câu trả lời, có thể là slide hoặc tài liệu vận hành. */
export interface AnswerSource {
  key: string;
  title: string;
  detail: string;
  docId?: string;
  /** Rỗng với nguồn không có số trang, ví dụ README hoặc rubric. */
  pages: number[];
}

export interface Answer {
  intent: Intent;
  scope: RetrievalScope;
  blocks: AnswerBlock[];
  /** Bản văn xuôi để sao chép và để hiển thị khi thu nhỏ. */
  plain: string;
  /** Các trang được trích dẫn — bấm được để nhảy tới. */
  citations: number[];
  /** Danh sách nguồn luôn được giữ lại kể cả khi AI sinh lại phần câu chữ. */
  sources: AnswerSource[];
}

/**
 * `seedKey` dùng cho hội thoại mẫu — nội dung lấy từ từ điển nên đổi được
 * theo ngôn ngữ. Tin nhắn phát sinh lúc chạy dùng `content` trực tiếp.
 */
export interface ChatMsg {
  id: string;
  role: ChatRole;
  content?: string;
  seedKey?: "sampleQuestion" | "sampleAnswer";
  sourcePage?: number;
  time: string;
  feedback?: "up" | "down";
  /** Câu trả lời có cấu trúc — khi có, hiển thị thay cho `content`. */
  blocks?: AnswerBlock[];
  scope?: RetrievalScope;
  citations?: number[];
  sources?: AnswerSource[];
  intent?: Intent;
}

export type SlideKind =
  | "cover"
  | "think"
  | "section"
  | "bullets"
  | "compare"
  | "checklist"
  | "quote"
  | "closing";

export interface Slide {
  page: number;
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  columns?: { heading: string; items: string[] }[];
  footnote?: string;
}

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "success" | "danger";
}
