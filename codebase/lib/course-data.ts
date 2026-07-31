import slideManifest from "@/public/slides/day01-slide-blue-v0/manifest.json";
import type { Annotation, ChatMsg, CourseDay, CourseDoc, Slide } from "./types";

export const COURSE_CODE = "COMP2010";
export const DEFAULT_DOC_ID = "day01-slide-blue-v0";
export const DEFAULT_PAGE = 1;
export const DEFAULT_ZOOM = 100;

/**
 * Danh mục này chỉ chứa deck PDF thật hiện có trên nhánh main.
 * Không tạo tên tài liệu giả cho Day 2–Day 6 khi repo chưa có file tương ứng.
 */
export const COURSE_DAYS: CourseDay[] = [
  {
    id: "day-1",
    label: "Day 1",
    topic: "AI & LLM Foundation",
    topicEn: "AI & LLM Foundation",
    status: "ACTIVE",
    studying: true,
    documents: [
      {
        id: DEFAULT_DOC_ID,
        name: "day01-slide-blue-v0.pdf",
        meta: "AI IN ACTION · Day 1",
        pages: slideManifest.pageCount,
        assetBase: "/slides/day01-slide-blue-v0",
        sourcePath: slideManifest.source,
      },
    ],
  },
];

export const ALL_DOCS: CourseDoc[] = COURSE_DAYS.flatMap((day) => day.documents);

export function findDoc(docId: string): CourseDoc {
  return ALL_DOCS.find((doc) => doc.id === docId) ?? ALL_DOCS[0];
}

export function findDayOfDoc(docId: string): CourseDay {
  return COURSE_DAYS.find((day) => day.documents.some((doc) => doc.id === docId)) ?? COURSE_DAYS[0];
}

/** URL ảnh WebP của đúng trang PDF nguồn. */
export function getSlidePageImage(doc: CourseDoc, page: number): string {
  const safePage = Math.min(Math.max(page, 1), doc.pages);
  return `${doc.assetBase}/page-${safePage.toString().padStart(2, "0")}.webp`;
}

/**
 * Nội dung dùng cho retrieval được trích tự động từ chính PDF trong manifest.
 * Phần hiển thị không dùng object này; PDFViewer render ảnh trang thật.
 */
export function getSlide(page: number, doc: CourseDoc): Slide {
  const safePage = Math.min(Math.max(page, 1), doc.pages);
  const extracted = slideManifest.pages[safePage - 1];
  const lines = extracted.text.split("\n").map((line) => line.trim()).filter(Boolean);
  return {
    page: safePage,
    kind: safePage === 1 ? "cover" : "bullets",
    title: extracted.title || `Trang ${safePage}`,
    bullets: lines.slice(1),
    footnote: `${doc.name} · trang ${safePage}/${doc.pages}`,
  };
}

/** Không chèn sẵn ghi chú giả lên slide thật. */
export const SEED_ANNOTATIONS: Annotation[] = [];
export const SEED_MESSAGES: ChatMsg[] = [];

export const PEN_COLORS = ["#e0212b", "#0d2a63", "#2557d9", "#16a34a", "#111827"];
export const HIGHLIGHT_COLORS = ["#facc15", "#86efac", "#93c5fd", "#fda4af", "#c4b5fd"];
export const ZOOM_STEPS = [50, 67, 80, 90, 100, 111, 125, 150, 175, 200];
