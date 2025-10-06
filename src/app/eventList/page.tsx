"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventCard from "@/components/eventCard";
import CongestionTag from "@/components/congestionTag";

type ApiEvent = {
  event_id: number;
  event_name: string;
  isDistributingTicket: boolean;
  congestion_status: "free" | "slightly_crowded" | "crowded" | "offtime";
  event_text: string | null;
  image_path: string | null;
  updated_at: string;
};

export default function Home() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const data: ApiEvent[] = await res.json();
        // isDistributingTicket === false のみ抽出
        setEvents(data.filter((e) => e.isDistributingTicket === false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
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
      <Header />

      {/* メイン */}
      <main className="flex-1 w-full flex flex-col items-center min-h-[800px]">
        <h1 className="text-center text-2xl font-bold mt-4 text-black">
          企画一覧
        </h1>

        {loading && <p className="mt-4 text-gray-600">読み込み中...</p>}

        <div className="w-full max-w-sm flex flex-col gap-4 mt-6 px-2">
          {events.map((e) => (
            <EventCard
              key={e.event_id}
              imageSrc={e.image_path ?? "/event_photo1.svg"}
              title={e.event_name}
              statusComponent={<CongestionTag status={e.congestion_status} />}
              onClick={() => {
                console.log("clicked:", e.event_id);
              }}
            />
          ))}
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
