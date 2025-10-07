"use client";

import React from "react";
import Image from "next/image";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CongestionTag from "@/components/congestionTag";
import TicketTag from "@/components/ticketTag";
import TicketEventList from "@/components/ticketEventTopCard";
import DetailCard from "@/components/detailCard";
import AllMap from "@/components/mapAll";

export default function TicketDistributionPage() {
    return (
        <div className="relative flex-1 w-full flex flex-col items-center">
            {/* 背景画像 */}
            <div className="absolute inset-0 w-full -z-10">
                <Image
                    src="/backgroundTop.svg"
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
            <main className="flex-1 w-full flex flex-col items-center min-h-[1428px]">
                {/* タイトル */}
                <div className="flex flex-col items-center mt-24 mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-black drop-shadow-sm mb-2">
                        45th技大祭
                    </h1>
                    <p className="text-lg md:text-xl text-black tracking-wide">
                        9/12sat　9/14sun
                    </p>
                </div>

                <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
                    整理券 残りわずか
                    <Image
                        src="/attention_logo.svg"
                        alt="注意アイコン"
                        width={36}
                        height={36}
                        className="inline-block align-middle"
                    />
                </h2>

                <div className="px-8 mt-3 mb-8 w-full max-w-2xl">
                    <TicketEventList
                        events={[
                            {
                                imageSrc: "/event_photo1.svg",
                                title: "お化け屋敷",
                                topTagComponent: <TicketTag status="limited" />,
                                bottomTagComponent: <CongestionTag status="free" />,
                                onClick: () => { },
                            },
                            {
                                imageSrc: "/event_photo2.svg",
                                title: "ゲスト企画",
                                topTagComponent: <TicketTag status="limited" />,
                                bottomTagComponent: <CongestionTag status="crowded" />,
                                onClick: () => { },
                            },
                        ]}
                    />
                </div>

                <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
                    企画情報をCheck
                </h2>

                <div className="px-8 mt-3 mb-3 w-full max-w-2xl">
                    <DetailCard
                        title={
                            <h3 className="px-2 text-lg sm:text-lg font-semibold mt-6 mb-4">
                                <span className="text-[#d72660]">企画</span>
                                <span className="text-black">を見る</span>
                            </h3>
                        }
                        description="全ての企画の詳細情報と混雑状況をチェック"
                        onClick={() => { }}
                    />
                </div>

                <div className="px-8 mt-3 mb-8 w-full max-w-2xl">
                    <DetailCard
                        title={
                            <h3 className="px-2 text-lg sm:text-lg font-semibold mt-6 mb-4">
                                <span className="text-[#d72660]">整理券配布企画</span>
                                <span className="text-black">を見る</span>
                            </h3>
                        }
                        description="整理券配布企画の残り状況をチェック"
                        onClick={() => { }}
                    />
                </div>

                <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
                    全体MAP
                </h2>
                <AllMap />
            </main>

            {/* フッター */}
            <div className="w-full mt-auto">
                <Footer />
            </div>
        </div>
    );
}
