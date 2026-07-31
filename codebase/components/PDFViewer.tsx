"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { getSlidePageImage } from "@/lib/course-data";
import type {
  Annotation,
  AnnotationPoint,
  CourseDoc,
  MarkStyle,
  ToolId,
} from "@/lib/types";
import type { Dict } from "@/lib/i18n";

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
  baseWidth: number;
}

type DrawingTool = Exclude<ToolId, "read">;

interface DraftStroke extends MarkStyle {
  pointerId: number;
  tool: DrawingTool;
  points: AnnotationPoint[];
}

const VIEWBOX_WIDTH = 1920;
const VIEWBOX_HEIGHT = 1080;
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

function appendDistinctPoints(current: AnnotationPoint[], incoming: AnnotationPoint[]) {
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
    path += ` Q ${point.x} ${point.y} ${(point.x + following.x) / 2} ${(point.y + following.y) / 2}`;
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
  const drawing = tool !== "read";
  const [draft, setDraft] = useState<DraftStroke | null>(null);
  const slideImage = getSlidePageImage(doc, page);

  function startStroke(event: PointerEvent<HTMLDivElement>) {
    if (!drawing || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const style = tool === "pen" ? penStyle : highlightStyle;
    setDraft({
      pointerId: event.pointerId,
      tool,
      color: style.color,
      size: style.size,
      points: [pointFromClient(event.clientX, event.clientY, event.currentTarget)],
    });
  }

  function extendStroke(event: PointerEvent<HTMLDivElement>) {
    if (!draft || draft.pointerId !== event.pointerId) return;
    event.preventDefault();
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    const points = samples.map((sample) =>
      pointFromClient(sample.clientX, sample.clientY, event.currentTarget),
    );
    setDraft((current) =>
      current?.pointerId === event.pointerId
        ? { ...current, points: appendDistinctPoints(current.points, points) }
        : current,
    );
  }

  function finishStroke(event: PointerEvent<HTMLDivElement>) {
    if (!draft || draft.pointerId !== event.pointerId) return;
    event.preventDefault();
    const points = appendDistinctPoints(draft.points, [
      pointFromClient(event.clientX, event.clientY, event.currentTarget),
    ]);
    onAddAnnotation(points, draft.tool, {
      color: draft.color,
      size: draft.size,
    });
    setDraft(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function cancelStroke(event: PointerEvent<HTMLDivElement>) {
    if (draft?.pointerId !== event.pointerId) return;
    setDraft(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const visibleAnnotations: Annotation[] = draft
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
        },
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
          <span className="truncate font-mono text-[11px] text-slate-400 dark:text-slate-500" title={doc.sourcePath}>
            {doc.name}
          </span>
        </div>

        <div
          onPointerDown={startStroke}
          onPointerMove={extendStroke}
          onPointerUp={finishStroke}
          onPointerCancel={cancelStroke}
          onContextMenu={drawing ? (event) => event.preventDefault() : undefined}
          className={`relative aspect-video w-full overflow-hidden rounded-[14px] bg-slate-950 shadow-inner select-none ${drawing ? "cursor-crosshair" : "cursor-default"}`}
          style={{ touchAction: drawing ? "none" : "auto" }}
        >
          <Image
            key={slideImage}
            src={slideImage}
            alt={`${doc.name} · ${t.viewer.pageOf(page, doc.pages)}`}
            fill
            priority={page <= 2}
            unoptimized
            draggable={false}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="pointer-events-none object-contain"
          />

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
            <span className="animate-fade-up pointer-events-none absolute top-3 right-3 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {t.viewer.drawHint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
