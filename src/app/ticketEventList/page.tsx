"use client";

import React from "react";
import Image from "next/image";

import Header from "@/components/header";
import EventCard from "@/components/eventcard";
import Footer from "@/components/footer";
import CongestionTag from "@/components/congestionTag";
import TicketTag from "@/components/ticketTag";

import { useState } from "react";
import EventSearchButton from "@/components/eventSearchButton";
import { useProjects, type Project } from "@/hooks/useProjects";


export default function TicketDistributionPage() {
    const { all, loading } = useProjects();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Project[]>([]);

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

            {/* メインコンテンツ */}
            <main className="flex-1 w-full flex flex-col items-center min-h-[800px]">
                {/* タイトル */}
                <h1 className="text-center text-2xl font-bold mt-4 text-font font-title">
                    整理券配布企画一覧
                </h1>

                {/* 検索ボタン */}
                <div className="p-6 space-y-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="企画名で検索"
                        className="border rounded px-3 py-2 w-72"
                    />

                    {/* 入力の度に自動で結果が反映される */}
                    <EventSearchButton
                        query={query}
                        allEvents={all}
                        onSuccess={setResults}
                    />

                    <p className="text-sm text-neutral-600 font-main_text">
                        表示件数: {results.length} / 全{all.length}件 {loading && "(読み込み中…)"}
                    </p>

                    <ul className="space-y-2">
                        {results.map((p) => (
                            <li key={p.id} className="border rounded px-3 py-2">
                                {p.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* イベント一覧カード群 */}
                <div className="w-full max-w-sm flex flex-col gap-4 mt-6 px-2">
                    {/* ここにEventCardを複数配置 */}
                    <EventCard
                        imageSrc="/event_photo1.svg"
                        title="お化け屋敷"
                        statusTicket={<TicketTag status="limited" />}
                        statusComponent={<CongestionTag status="crowded" />}
                        onClick={() => { /* クリック時の処理 */ }}
                    />
                    <EventCard
                        imageSrc="/event_photo2.svg"
                        title="ゲスト企画"
                        statusTicket={<TicketTag status="limited" />}
                        statusComponent={<CongestionTag status="offtime" />}
                        onClick={() => { /* クリック時の処理 */ }}
                    />
                </div>
            </main>

            {/* フッター */}
            <div className="w-full mt-auto">
                <Footer />
            </div>
        </div>
    );
}
