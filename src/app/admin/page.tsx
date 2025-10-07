// src/app/admin/page.tsx
"use client";

import React, { useState } from "react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionTitle from "@/components/questionTitle";
import IdTextbox from "@/components/idTextbox";
import CongestionRadioButton from "@/components/congestionRadioButton";
import TicketRadioButton from "@/components/ticketRadioButton";
import TextField from "@/components/textField";
import SendButton from "@/components/sendButton";

// 型は各コンポーネント側に合わせる
type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";
type TicketStatus = "distributing" | "limited" | "ended";

export default function AdminSettingsPage() {
  const [eventId, setEventId] = useState("");
  const [congestion, setCongestion] = useState<CongestionStatus>("free");
  const [ticket, setTicket] = useState<TicketStatus>("distributing");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-dvh w-full bg-[#e2e2e2] text-black">
      <Header />

      {/* ページ本体 */}
      <main className="mx-auto w-full max-w-[390px] bg-white">
        {/* 画面内余白 */}
        <div className="px-6 pt-10 pb-20">
          {/* タイトル */}
          <h1 className="text-center text-2xl font-bold mb-8">管理者設定</h1>

          {/* 企画情報 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="企画情報" />
            <div className="mt-3">
              <label className="block text-sm mb-2">企画ID</label>
              <IdTextbox
                value={eventId}
                onChange={setEventId}
                placeholder="半角数字で入力"
                maxLength={6}
                required
                className="w-full"
              />
            </div>
          </section>

          {/* 混雑状況 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="混雑状況" />
            <div className="mt-3">
              <CongestionRadioButton value={congestion} onChange={setCongestion} />
            </div>
          </section>

          {/* 整理券配布状況 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="整理券配布状況" />
            <div className="mt-3">
              <TicketRadioButton value={ticket} onChange={setTicket} />
            </div>
          </section>

          {/* 企画説明 */}
          <section className="space-y-3 mb-10">
            <QuestionTitle text="企画説明" />
            <div className="mt-3">
              {/* 仕様上 TextField は input ですが、見た目をエリアっぽく高さだけ出します */}
              <div className="rounded-md border border-black p-3">
                <TextField value={description} onChange={setDescription} />
                {/* 高さを稼ぐための余白（スマホのモックに寄せる） */}
                <div className="h-24" />
              </div>
            </div>
          </section>

          {/* 送信ボタン */}
          <div className="flex justify-center">
            <SendButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
