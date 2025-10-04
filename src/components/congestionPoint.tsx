"use client";

import React from "react";

type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";

type Props = {
  status: CongestionStatus;
};

/**
 * CongestionPoint
 * - 混雑状況に応じて色を変える丸い点
 * - props: status ("free" | "slightly_crowded" | "crowded" | "offtime")
 */
export default function CongestionPoint({ status }: Props) {
  // 状態ごとの色マッピング
  const colorMap: Record<CongestionStatus, string> = {
    free: "bg-green-500", // 空いてる
    slightly_crowded: "bg-yellow-400", // やや混雑
    crowded: "bg-red-500", // 混雑
    offtime: "bg-gray-400", // 企画時間外
  };

  return (
    <span
      className={`inline-block h-4 w-4 rounded-full ${colorMap[status]}`}
      aria-label={status}
    />
  );
}
