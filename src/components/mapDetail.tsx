"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CongestionPoint, { type CongestionStatus } from "./congestionPoint";

/**
 * API から返るイベント1件の型
 * /api/events: event_id / congestion_status などを返す
 */
type ApiEvent = {
  event_id: number;
  congestion_status: CongestionStatus;
  // ほかのフィールドも来るが今回は未使用
};

/**
 * マップ上に置くポイント定義
 * - id: これが event_id と一致する想定（不変）
 * - x, y: 画像左上を(0,0)・右下を(100,100)としたパーセンテージ座標
 * - label: デバッグ/将来のツールチップ用
 */
type MapPoint = {
  id: number;
  x: number; // %
  y: number; // %
  label?: string;
};

/** ここが「不変の割り当て表」: SVG 上の座標に応じて、恒久的に ID を割り当てる */
const POINTS: MapPoint[] = [
  { id: 1, x: 38.0, y: 16.0, label: "お化け屋敷" },
  { id: 2, x: 72.0, y: 83.0, label: "ゲスト企画" },
  { id: 3, x: 53.0, y: 16.0, label: "ワークショップ" },
  { id: 4, x: 66.0, y: 16.0, label: "8番出口" },
  { id: 5, x: 80.0, y: 16.0, label: "二人羽織" },
  { id: 6, x: 85.0, y: 36.0, label: "技大でバッティング" },
  { id: 7, x: 74.0, y: 55.0, label: "ビンゴ大会" },
  { id: 8, x: 59.0, y: 72.0, label: "ゲーム大会" },
  // 必要に応じて増やす
];

export default function MapDetail() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // 初期ロードで /api/events を取得
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch /api/events");
        const data: ApiEvent[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // event_id -> congestion_status のルックアップマップ
  const statusById = useMemo(() => {
    const map = new Map<number, CongestionStatus>();
    for (const e of events) map.set(e.event_id, e.congestion_status);
    return map;
  }, [events]);

  return (
    <div className="w-full">
      {/* 画像は拡大不可 → ただの静的表示。ラッパーは relative にして子を absolute 配置 */}
      <div className="relative mx-auto w-full max-w-5xl">
        {/* Next/Image で固定比率 & 画質確保 */}
        <Image
          src="/map_1Fv2.svg"
          alt="1F Map"
          width={1600}
          height={900}
          className="w-full h-auto select-none pointer-events-none"
          priority
        />

        {/* ポイント群（画像の上に絶対配置） */}
        <div className="absolute inset-0">
          {POINTS.map((p) => {
            const status = statusById.get(p.id) ?? "offtime";
            return (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {/* CongestionPoint に id と status を渡す */}
                <CongestionPoint id={p.id} status={status} />
              </div>
            );
          })}
        </div>

        {/* 参考: ローディング or 取得失敗の簡易表示（任意） */}
        {!loading && events.length === 0 && (
          <p className="absolute bottom-2 right-2 text-xs bg-white/80 px-2 py-1 rounded">
            データが見つかりません（全点 offtime 表示）
          </p>
        )}
      </div>
    </div>
  );
}
