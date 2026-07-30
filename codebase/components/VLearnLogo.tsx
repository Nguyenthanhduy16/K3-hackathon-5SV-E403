"use client";

/**
 * Logo VLearn.
 *
 * Phần hình lấy nguyên toạ độ và mã màu từ file gốc
 * https://vlearn.dev/brand/vinuni-mark.svg — tam giác đỏ #c72127 và biểu tượng
 * chữ V #134d8b. viewBox được cắt sát khung hình (bbox 126,113 → 486,476) để
 * logo không bị lọt thỏm trong khoảng trắng thừa của file gốc.
 *
 * Wordmark theo lockup chính: chữ "V" đỏ, "Learn" navy đậm.
 */

export const BRAND_RED = "#c72127";
export const BRAND_NAVY = "#134d8b";
const WORDMARK_NAVY = "#12365e";

interface MarkProps {
  className?: string;
  /** Đảo màu cho nền tối: chữ V chuyển trắng, tam giác giữ đỏ. */
  reversed?: boolean;
}

export function VLearnMark({ className = "", reversed = false }: MarkProps) {
  return (
    <svg
      viewBox="126 113 360 363"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <polygon points="126,115 213.5,202.5 126,290" fill={BRAND_RED} />
      <polygon
        points="486,113 486,296 306,476 133.5,303.5 225,212 306,293 387,212"
        fill={reversed ? "#ffffff" : BRAND_NAVY}
      />
    </svg>
  );
}

export default function VLearnLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`} aria-label="VLearn">
      <VLearnMark className="h-[26px] w-auto" />
      <span
        aria-hidden="true"
        className="text-[19px] leading-none font-extrabold tracking-[-0.015em]"
      >
        <span style={{ color: BRAND_RED }}>V</span>
        <span className="text-[#12365e] dark:text-white">Learn</span>
      </span>
    </span>
  );
}

export { WORDMARK_NAVY };
