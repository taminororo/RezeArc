// src/components/congestionTag.tsx
import React from "react";

export type CongestionStatus =
  | "free"              // 空いてる
  | "slightly_crowded"  // やや混雑
  | "crowded"           // 混雑
  | "offtime";          // 企画時間外

type CongestionTagProps = {
  /** 混雑状況（4択のいずれか） */
  status: CongestionStatus;
  /** 余白・配置を上書きしたい場合に使用 */
  className?: string;
  /** スクリーンリーダー向けの説明を追加したい場合 */
  ariaLabelSuffix?: string;
};

const LABELS: Record<CongestionStatus, string> = {
  free: "空いてる",
  slightly_crowded: "やや混雑",
  crowded: "混雑",
  offtime: "企画時間外",
};

const STYLE: Record<CongestionStatus, string> = {
<<<<<<< HEAD
  free: "bg-not_crowded text-font border-main",
  slightly_crowded: "bg-slightly_crowded text-font border-main",
  crowded: "bg-crowded text-font border-main",
  offtime: "bg-after_hours text-font border-main",
=======
  free: "bg-not_crowded text-font border-main font-main_text",
  slightly_crowded: "bg-slightly_crowded text-font border-main font-main_text",
  crowded: "bg-crowded text-font border-main font-main_text",
  offtime: "bg-after_hours text-font border-main font-main_text",
>>>>>>> 3db8284aa20105ba73bab998df3bcb2c333551e9
};

export default function CongestionTag({
  status,
  className = "",
  ariaLabelSuffix,
}: CongestionTagProps) {
  const label = LABELS[status];
  const base =
<<<<<<< HEAD
    "flex items-center justify-center rounded-lg w-[110px] h-[25px] text-base text-medium tracking-wide " +
=======
    "inline-flex items-center rounded-full w-[110px] h-[25px] px-4 py-1.5 text-base font-semibold tracking-wide " +
>>>>>>> 3db8284aa20105ba73bab998df3bcb2c333551e9
    "border shadow-sm transition-colors";
  const classes = `${base} ${STYLE[status]} ${className}`;

  // 状態更新時の読み上げ反映を促す
  const ariaLabel = ariaLabelSuffix ? `${label}、${ariaLabelSuffix}` : label;

  return (
    <span className={classes} aria-live="polite" aria-label={ariaLabel}>
      {label}
    </span>
  );
}
