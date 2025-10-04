"use client";

import React from "react";

export type DetailCardProps = {
  title?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
};

export default function DetailCard({
  title = "企画を見る",
  description = "全ての企画の詳細情報と混雑状況をチェック",
  className = "",
  onClick,
}: DetailCardProps) {
  return (
    <div
      className={
        "w-full max-w-3xl rounded-2xl p-8 sm:p-10 bg-[#e6e2e2] shadow-sm " +
        className
      }
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <h3 className="text-2xl sm:text-3xl font-semibold text-[#111827] mb-4">
        {title}
      </h3>
      <p className="text-base sm:text-lg text-[#111827]">
        {description}
      </p>
    </div>
  );
}