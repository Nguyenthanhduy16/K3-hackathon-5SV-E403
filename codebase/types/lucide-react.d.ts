declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  export const ArrowLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Bot: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const CircleAlert: LucideIcon;
  export const CircleCheck: LucideIcon;
  export const CirclePlay: LucideIcon;
  export const Copy: LucideIcon;
  export const Download: LucideIcon;
  export const FileText: LucideIcon;
  export const Flag: LucideIcon;
  export const Highlighter: LucideIcon;
  export const Info: LucideIcon;
  export const Layers: LucideIcon;
  export const Library: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Minimize2: LucideIcon;
  export const Minus: LucideIcon;
  export const Moon: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const MousePointer2: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Paperclip: LucideIcon;
  export const PenLine: LucideIcon;
  export const Plus: LucideIcon;
  export const Printer: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Save: LucideIcon;
  export const ScrollText: LucideIcon;
  export const SendHorizontal: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Sun: LucideIcon;
  export const ThumbsDown: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const Trash2: LucideIcon;
  export const Undo2: LucideIcon;
  export const UserRound: LucideIcon;
  export const Wand2: LucideIcon;
  export const X: LucideIcon;
}
