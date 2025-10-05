"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

// --- 各カードの型定義 ---
export type EventCardProps = {
  imageSrc: string;
  title: string;
  topTagComponent?: ReactNode;     // 上のタグ
  bottomTagComponent?: ReactNode;  // 下のタグ
  onClick?: () => void;
};

// --- イベントリスト全体の型定義 ---
type EventListProps = {
  events: EventCardProps[];
  className?: string;
};

export default function EventList({ events, className = "" }: EventListProps) {
  // イベントがない場合は何も表示しない
  if (!events || events.length === 0) return null;

  return (
    <div
      className={`w-full max-w-2xl bg-[#eee9e9] rounded-2xl p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col divide-y divide-gray-400">
        {events.map((event, index) => (
          <button
            key={index}
            type="button"
            onClick={event.onClick}
            className={`w-full flex items-center justify-between p-4 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 ${
              index !== 0 ? "pt-6" : ""
            }`}
          >
            {/* 左側：画像とイベント名 */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gray-300 rounded-sm overflow-hidden">
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-medium text-[#111827]">
                {event.title}
              </span>
            </div>

            {/* 右側：タグ2つ */}
            <div className="flex flex-col items-end gap-2">
              {event.topTagComponent && <div>{event.topTagComponent}</div>}
              {event.bottomTagComponent && <div>{event.bottomTagComponent}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
