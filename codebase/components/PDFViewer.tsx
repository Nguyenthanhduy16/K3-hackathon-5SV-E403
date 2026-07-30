"use client";

import { useState, type PointerEvent } from "react";
import { VLearnMark } from "./VLearnLogo";
import { getSlide } from "@/lib/mock-data";
import type { Dict } from "@/lib/i18n";
import type { Annotation, AnnotationPoint, CourseDoc, MarkStyle, Slide, ToolId } from "@/lib/types";

interface Props {
  t: Dict;
  doc: CourseDoc;
  page: number;
  zoom: number;
  tool: ToolId;
  penStyle: MarkStyle;
  highlightStyle: MarkStyle;
  annotations: Annotation[];
  onAddAnnotation: (
    points: AnnotationPoint[],
    tool: Exclude<ToolId, "read">,
    style: MarkStyle,
  ) => void;
  /** Bề ngang tối đa của trang ở mức zoom 100% (px). */
  baseWidth: number;
}

/* ------------------------------------------------------------------ */
/* Slide giả lập — dựng bằng CSS thay cho việc render PDF thật          */
/* ------------------------------------------------------------------ */

function RedRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute right-0 bottom-0 left-0 h-[0.9cqw] bg-vin-red ${className}`}
    />
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <p className="inline-block text-[1.5cqw] font-extrabold tracking-[0.18em] text-vin-red">
      {text}
      <span className="mt-[0.4cqw] block h-[0.35cqw] w-full bg-vin-red/80" />
    </p>
  );
}

function CoverSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0d3a7d_0%,#12508f_45%,#0a2a5e_100%)]">
      {/* gợi hình khối toà nhà phía sau, thay cho ảnh nền thật */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[42%] opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#fff 0 1.4cqw,transparent 1.4cqw 3.2cqw)",
          maskImage: "linear-gradient(to top,#000 20%,transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-[18%] -right-[8%] h-[60%] w-[45%] rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative flex h-full flex-col items-center justify-center px-[8cqw] text-center text-white">
        <div className="flex items-center gap-[1.6cqw]">
          <VLearnMark className="h-[5cqw] w-auto" reversed />
          <span className="text-[3.4cqw] font-bold tracking-[0.1em]">
            VINUNIVERSITY
          </span>
        </div>

        <h2 className="mt-[4cqw] text-[5.2cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mt-[1.6cqw] text-[2.1cqw] font-medium italic text-white/85">
            {slide.subtitle}
          </p>
        )}
        <span className="mt-[2.2cqw] block h-[0.4cqw] w-[28cqw] bg-vin-red" />

        <p className="mt-[5cqw] text-[2.4cqw] font-bold">{slide.body}</p>
        <p className="mt-[0.8cqw] text-[1.8cqw] text-white/75">{slide.footnote}</p>
      </div>
      <RedRule />
    </div>
  );
}

function ThinkSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#0b2e63_0%,#0a2a5e_55%,#071f47_100%)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[4cqw] -translate-y-1/2 text-[38cqw] leading-none font-black text-white/[0.06] select-none"
      >
        ?
      </span>

      <div className="relative flex h-full flex-col px-[7cqw] py-[6cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />

        <div className="flex flex-1 items-center">
          <h2 className="max-w-[78cqw] text-[4.6cqw] leading-[1.25] font-extrabold">
            {slide.title}
          </h2>
        </div>

        <p className="text-[1.9cqw] font-medium text-white/70">{slide.footnote}</p>
      </div>
      <RedRule />
    </div>
  );
}

function SectionSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(120deg,#0a2a5e_0%,#154b96_100%)]">
      <div className="relative flex h-full flex-col justify-center px-[8cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <h2 className="mt-[3cqw] text-[5cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mt-[1.8cqw] max-w-[70cqw] text-[2.2cqw] text-white/80">
            {slide.subtitle}
          </p>
        )}
      </div>
      <RedRule />
    </div>
  );
}

function BulletsSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0e3573_0%,#0a2a5e_100%)]">
      <div className="relative flex h-full flex-col px-[7cqw] py-[5.5cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <h2 className="mt-[2.4cqw] text-[3.8cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        <ul className="mt-[2.8cqw] flex-1 space-y-[1.6cqw]">
          {slide.bullets?.map((b) => (
            <li key={b} className="flex gap-[1.6cqw]">
              <span className="mt-[0.9cqw] h-[1cqw] w-[1cqw] shrink-0 rotate-45 bg-vin-red" />
              <span className="text-[2.05cqw] leading-snug text-white/90">{b}</span>
            </li>
          ))}
        </ul>
        {slide.footnote && (
          <p className="text-[1.6cqw] text-white/55 italic">{slide.footnote}</p>
        )}
      </div>
      <RedRule />
    </div>
  );
}

function CompareSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0e3573_0%,#0a2a5e_100%)]">
      <div className="relative flex h-full flex-col px-[6cqw] py-[5cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <h2 className="mt-[2cqw] text-[3.6cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        <div className="mt-[2.6cqw] grid flex-1 grid-cols-2 gap-[2.4cqw]">
          {slide.columns?.map((col, i) => (
            <div
              key={col.heading}
              className={[
                "rounded-[1.4cqw] border p-[2.2cqw]",
                i === 0
                  ? "border-white/15 bg-white/[0.06]"
                  : "border-vin-red/40 bg-vin-red/[0.12]",
              ].join(" ")}
            >
              <p className="text-[1.9cqw] font-bold tracking-wide">{col.heading}</p>
              <ul className="mt-[1.4cqw] space-y-[1cqw]">
                {col.items.map((it) => (
                  <li
                    key={it}
                    className="flex gap-[1cqw] text-[1.65cqw] leading-snug text-white/85"
                  >
                    <span className="mt-[0.7cqw] h-[0.6cqw] w-[0.6cqw] shrink-0 rounded-full bg-white/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <RedRule />
    </div>
  );
}

function ChecklistSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#0e3573_0%,#0a2a5e_100%)]">
      <div className="relative flex h-full flex-col px-[7cqw] py-[5cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <h2 className="mt-[2cqw] text-[3.6cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        <ol className="mt-[2.4cqw] flex-1 space-y-[1.3cqw]">
          {slide.bullets?.map((b, i) => (
            <li key={b} className="flex items-start gap-[1.4cqw]">
              <span className="grid h-[2.6cqw] w-[2.6cqw] shrink-0 place-items-center rounded-full bg-vin-red text-[1.4cqw] font-black">
                {i + 1}
              </span>
              <span className="text-[1.9cqw] leading-snug text-white/90">{b}</span>
            </li>
          ))}
        </ol>
        {slide.footnote && (
          <p className="text-[1.6cqw] text-white/55 italic">{slide.footnote}</p>
        )}
      </div>
      <RedRule />
    </div>
  );
}

function QuoteSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(140deg,#071f47_0%,#0a2a5e_100%)]">
      <span
        aria-hidden="true"
        className="absolute top-[2cqw] left-[5cqw] text-[22cqw] leading-none font-black text-white/[0.07] select-none"
      >
        &ldquo;
      </span>
      <div className="relative flex h-full flex-col justify-center px-[9cqw] text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <blockquote className="mt-[2.6cqw] text-[3.4cqw] leading-snug font-bold italic">
          {slide.title}
        </blockquote>
        {slide.footnote && (
          <p className="mt-[2.4cqw] text-[1.8cqw] text-white/65">{slide.footnote}</p>
        )}
      </div>
      <RedRule />
    </div>
  );
}

function ClosingSlide({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(150deg,#0a2a5e_0%,#154b96_100%)]">
      <div className="relative flex h-full flex-col items-center justify-center px-[8cqw] text-center text-white">
        <Eyebrow text={slide.eyebrow ?? ""} />
        <h2 className="mt-[3cqw] text-[5cqw] leading-tight font-extrabold">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mt-[1.8cqw] text-[2.2cqw] text-white/80">{slide.subtitle}</p>
        )}
        <span className="mt-[2.6cqw] block h-[0.4cqw] w-[22cqw] bg-vin-red" />
        <p className="mt-[3cqw] font-mono text-[1.4cqw] text-white/50">
          {slide.footnote}
        </p>
      </div>
      <RedRule />
    </div>
  );
}

function SlideSurface({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return <CoverSlide slide={slide} />;
    case "think":
      return <ThinkSlide slide={slide} />;
    case "section":
      return <SectionSlide slide={slide} />;
    case "compare":
      return <CompareSlide slide={slide} />;
    case "checklist":
      return <ChecklistSlide slide={slide} />;
    case "quote":
      return <QuoteSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    default:
      return <BulletsSlide slide={slide} />;
  }
}

/* ------------------------------------------------------------------ */

type DrawingTool = Exclude<ToolId, "read">;

interface DraftStroke extends MarkStyle {
  pointerId: number;
  tool: DrawingTool;
  points: AnnotationPoint[];
}

const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 900;
const MIN_POINT_DISTANCE_SQUARED = 0.01;

function clampPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function pointFromClient(clientX: number, clientY: number, element: HTMLDivElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: clampPercent(((clientX - rect.left) / rect.width) * 100),
    y: clampPercent(((clientY - rect.top) / rect.height) * 100),
  };
}

function appendDistinctPoints(
  current: AnnotationPoint[],
  incoming: AnnotationPoint[],
) {
  const next = [...current];
  for (const point of incoming) {
    const last = next.at(-1);
    if (!last) {
      next.push(point);
      continue;
    }
    const dx = point.x - last.x;
    const dy = point.y - last.y;
    if (dx * dx + dy * dy >= MIN_POINT_DISTANCE_SQUARED) next.push(point);
  }
  return next;
}

function toSvgPoint(point: AnnotationPoint) {
  return {
    x: (point.x / 100) * VIEWBOX_WIDTH,
    y: (point.y / 100) * VIEWBOX_HEIGHT,
  };
}

function pointsToPath(points: AnnotationPoint[]) {
  const svgPoints = points.map(toSvgPoint);
  if (svgPoints.length < 2) return "";
  if (svgPoints.length === 2) {
    return `M ${svgPoints[0].x} ${svgPoints[0].y} L ${svgPoints[1].x} ${svgPoints[1].y}`;
  }

  let path = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
  for (let index = 1; index < svgPoints.length - 1; index += 1) {
    const point = svgPoints[index];
    const following = svgPoints[index + 1];
    const midpointX = (point.x + following.x) / 2;
    const midpointY = (point.y + following.y) / 2;
    path += ` Q ${point.x} ${point.y} ${midpointX} ${midpointY}`;
  }
  const last = svgPoints.at(-1)!;
  return `${path} L ${last.x} ${last.y}`;
}

function strokeWidth(tool: DrawingTool, size: number) {
  return tool === "pen" ? 2 + size * 2 : 18 + size * 8;
}

function AnnotationStroke({ annotation }: { annotation: Annotation }) {
  const width = strokeWidth(annotation.tool, annotation.size);
  const opacity = annotation.tool === "highlight" ? 0.42 : 1;

  if (annotation.points.length === 1) {
    const point = toSvgPoint(annotation.points[0]);
    return (
      <circle
        cx={point.x}
        cy={point.y}
        r={width / 2}
        fill={annotation.color}
        fillOpacity={opacity}
      />
    );
  }

  return (
    <path
      d={pointsToPath(annotation.points)}
      fill="none"
      stroke={annotation.color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function PDFViewer({
  t,
  doc,
  page,
  zoom,
  tool,
  penStyle,
  highlightStyle,
  annotations,
  onAddAnnotation,
  baseWidth,
}: Props) {
  const slide = getSlide(page, doc);
  const drawing = tool !== "read";
  const [draft, setDraft] = useState<DraftStroke | null>(null);

  function startStroke(e: PointerEvent<HTMLDivElement>) {
    if (!drawing || !e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) {
      return;
    }

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const style = tool === "pen" ? penStyle : highlightStyle;
    setDraft({
      pointerId: e.pointerId,
      tool,
      color: style.color,
      size: style.size,
      points: [pointFromClient(e.clientX, e.clientY, e.currentTarget)],
    });
  }

  function extendStroke(e: PointerEvent<HTMLDivElement>) {
    if (!draft || draft.pointerId !== e.pointerId) return;
    e.preventDefault();

    const samples = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const points = samples.map((sample) =>
      pointFromClient(sample.clientX, sample.clientY, e.currentTarget),
    );
    setDraft((current) =>
      current && current.pointerId === e.pointerId
        ? { ...current, points: appendDistinctPoints(current.points, points) }
        : current,
    );
  }

  function finishStroke(e: PointerEvent<HTMLDivElement>) {
    if (!draft || draft.pointerId !== e.pointerId) return;
    e.preventDefault();

    const points = appendDistinctPoints(draft.points, [
      pointFromClient(e.clientX, e.clientY, e.currentTarget),
    ]);
    onAddAnnotation(points, draft.tool, {
      color: draft.color,
      size: draft.size,
    });
    setDraft(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function cancelStroke(e: PointerEvent<HTMLDivElement>) {
    if (draft?.pointerId !== e.pointerId) return;
    setDraft(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  const visibleAnnotations = draft
    ? [
        ...annotations,
        {
          id: "draft-stroke",
          docId: doc.id,
          page,
          tool: draft.tool,
          color: draft.color,
          size: draft.size,
          points: draft.points,
        } satisfies Annotation,
      ]
    : annotations;

  return (
    <div
      className="mx-auto transition-[width] duration-200 ease-out"
      style={{ width: `calc(min(100%, ${baseWidth}px) * ${zoom / 100})` }}
    >
      <div className="rounded-[20px] border border-brand-100 bg-paper p-3 shadow-[0_12px_40px_-18px_rgba(13,42,99,0.45)] sm:p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {t.viewer.pageOf(page, doc.pages)}
          </span>
          <span className="truncate font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {doc.name}
          </span>
        </div>

        <div
          onPointerDown={startStroke}
          onPointerMove={extendStroke}
          onPointerUp={finishStroke}
          onPointerCancel={cancelStroke}
          onContextMenu={drawing ? (event) => event.preventDefault() : undefined}
          className={[
            "@container relative aspect-[16/9] w-full overflow-hidden rounded-[14px] shadow-inner select-none",
            drawing ? "cursor-crosshair" : "cursor-default",
          ].join(" ")}
          style={{ touchAction: drawing ? "none" : "auto" }}
        >
          <SlideSurface slide={slide} />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
          >
            {visibleAnnotations.map((annotation) => (
              <AnnotationStroke key={annotation.id} annotation={annotation} />
            ))}
          </svg>

          {drawing && !draft && (
            <span className="animate-fade-up pointer-events-none absolute top-[2cqw] right-[2cqw] rounded-full bg-slate-900/70 px-[1.6cqw] py-[0.7cqw] text-[1.3cqw] font-semibold text-white backdrop-blur-sm">
              {t.viewer.drawHint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
