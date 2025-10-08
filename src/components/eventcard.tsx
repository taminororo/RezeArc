"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

export type EventCardProps = {
  imageSrc: string;
  title: string;
  statusTicket?: ReactNode;   // チケット状況コンポーネント（オプション）
  statusComponent: ReactNode; // 混雑状況コンポーネント
  className?: string;
  onClick?: () => void;
};

export default function EventCard({
  imageSrc,
  title,
  statusComponent,
  statusTicket,
  className = "",
  onClick,
}: EventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
         className={`
        w-full max-w-2xl 
        bg-[#fffdfa]
        rounded-2xl 
        p-4 
        ${className}
        relative
        border-[2px] border-[#434d6e]
      `}
      style={{
        boxShadow: "0 3px 0 0 #434d6e", // 下にだけ影
        position: "relative",
      }}
      }
    >
      {/* 左側: 画像とイベント名 */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 bg-secondly rounded-sm overflow-hidden">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
        <span className="text-lg font-medium text-[#fcf6ee]">{title}</span>
      </div>

      {/* 右側: 混雑状況 + チケット情報 */}
      <div className="flex flex-col items-end space-y-1">
        {statusTicket && <div>{statusTicket}</div>}
        {statusComponent}
      </div>
    </button>
  );
}
