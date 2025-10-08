// src/app/ticketEventList/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import useSWR from "swr";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventCard from "@/components/eventCard";
import CongestionTag from "@/components/congestionTag";
import TicketTag from "@/components/ticketTag";
import { useLiveInvalidate } from "@/hooks/useLiveInvalidate";

type ApiEvent = {
  event_id: number;
  event_name: string;
  isDistributingTicket: boolean;
  ticket_status: "distributing" | "limited" | "ended" | null;
  congestion_status: "free" | "slightly_crowded" | "crowded" | "offtime";
  event_text: string | null;
  updated_at: string;
  image_path?: string | null; // snake_case対応
  imagePath?: string | null;  // camelCase対応
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`GET ${url} failed: ${r.status}`);
    return r.json();
  });

export default function TicketDistributionPage() {
  // SWR で一覧取得（フォーカス時再検証はSSEに任せる）
  const { data, isLoading, error } = useSWR<ApiEvent[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
  });

  // SSE購読 → /api/events を mutate
  useLiveInvalidate(["/api/events"]);

  const [query, setQuery] = React.useState("");

  // 1) 配布中のみ
  const distributing = React.useMemo(() => {
    const all = data ?? [];
    return all.filter((e) => e.isDistributingTicket === true);
  }, [data]);

  // 2) 企画名検索（空なら全件）
  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return distributing;
    return distributing.filter((e) => (e.event_name ?? "").toLowerCase().includes(q));
  }, [distributing, q]);

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
        <h1 className="text-center text-2xl font-bold mt-4 text-black">
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
            {(data ?? []).length} 件 {isLoading && "(読み込み中…)"}
            {error && <span className="text-rose-700 ml-2">エラー: {String(error.message ?? error)}</span>}
          </p>
        </div>

        {/* カード一覧 */}
        <div className="w-full max-w-sm flex flex-col gap-4 mt-2 px-2">
          {!isLoading &&
            filtered.map((ev) => {
              const img = ev.image_path ?? ev.imagePath ?? "/event_photo1.svg";
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
                    // 詳細ページに繋ぐならここで router.push など
                  }}
                />
              );
            })}

          {!isLoading && filtered.length === 0 && (
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
