// src/app/ticketEventList/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventCard from "@/components/eventCard";
import CongestionTag from "@/components/congestionTag";
import TicketTag from "@/components/ticketTag";

type ApiEvent = {
  event_id: number;
  event_name: string;
  isDistributingTicket: boolean;
  ticket_status: "distributing" | "limited" | "ended" | null;
  congestion_status: "free" | "slightly_crowded" | "crowded" | "offtime";
  event_text: string | null;
  updated_at: string;
  // 将来拡張: schema/seed では imagePath を持っているので両対応
  image_path?: string | null;  // APIがsnake_caseで返す場合
  imagePath?: string | null;   // APIがcamelCaseで返す場合
};

export default function TicketDistributionPage() {
  const [all, setAll] = React.useState<ApiEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error(`GET /api/events failed: ${res.status}`);
        const json: ApiEvent[] = await res.json();
        if (!aborted) setAll(Array.isArray(json) ? json : []);
      } catch (e: unknown) {
        if (!aborted) setError((e as Error)?.message ?? "unknown error");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // 1) 整理券を配布している企画のみ
  const distributing = React.useMemo(
    () => all.filter((e) => e.isDistributingTicket === true),
    [all]
  );

  // 2) 企画名検索（入力が空なら全件）
  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(
    () =>
      q
        ? distributing.filter((e) =>
            (e.event_name ?? "").toLowerCase().includes(q)
          )
        : distributing,
    [distributing, q]
  );

  return (
    <div className="relative min-h-screen w-full h-full flex flex-col items-center">
      {/* 背景画像 */}
      <div className="absolute inset-0 w-full -z-10">
        <Image
          src="/backgroundNormal.svg"
          alt="背景"
          fill
          className="object-cover opacity-80"
        />
      </div>

      {/* ヘッダー */}
      <div className="w-full mt-auto">
        <Header />
      </div>

      {/* メイン */}
      <main className="flex-1 w-full flex flex-col items-center min-h-[800px]">
        <h1 className="text-center text-2xl font-bold mt-4 text-font font-title ">
          整理券配布企画一覧
        </h1>

        {/* 検索UI */}
        <div className="p-6 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="企画名で検索（例：お化け屋敷）"
            className="border rounded px-3 py-2 w-72"
          />
          <p className="text-sm text-neutral-600">
            表示件数: {filtered.length} / 配布中 {distributing.length} 件 / 全{" "}
            {all.length} 件 {loading && "(読み込み中…)"}
            {error && <span className="text-rose-700 ml-2">エラー: {error}</span>}
          </p>
        </div>

        {/* カード一覧 */}
        <div className="w-full max-w-sm flex flex-col gap-4 mt-2 px-2">
          {filtered.map((ev) => {
            const img =
              ev.image_path ?? ev.imagePath ?? "/event_photo1.svg"; // 画像が未提供ならフォールバック
            return (
              <EventCard
                key={ev.event_id}
                imageSrc={img}
                title={ev.event_name}
                statusTicket={
                  ev.ticket_status ? <TicketTag status={ev.ticket_status} /> : undefined
                }
                statusComponent={<CongestionTag status={ev.congestion_status} />}
                onClick={() => {
                  // 詳細ページに繋ぐならここでrouter.pushなど
                }}
              />
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-slate-700 bg-white/70 rounded-lg p-4">
              条件に一致する企画はありません。
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
