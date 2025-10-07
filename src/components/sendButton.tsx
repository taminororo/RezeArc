// src/components/sendButton.tsx
"use client";

import { useState } from "react";

type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";
type TicketStatus = "distributing" | "limited" | "ended";

type Props = {
  eventId: string;
  congestionStatus: CongestionStatus;
  ticketStatus: TicketStatus;
  eventText: string; // 必須ではないが空文字でもOK
};

export default function SendButton({
  eventId,
  congestionStatus,
  ticketStatus,
  eventText,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    // かんたんバリデーション
    const trimmedId = eventId.trim();
    if (!trimmedId) {
      setMessage("企画IDを入力してください。");
      setLoading(false);
      return;
    }
    if (!/^\d+$/.test(trimmedId)) {
      setMessage("企画IDは半角数字のみで入力してください。");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/events/${trimmedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // リクエストボディに props の値を送る
        body: JSON.stringify({
          congestionStatus,
          ticketStatus,
          eventText,
        }),
      });

      if (!res.ok) {
        // サーバーがエラー詳細を返す場合も拾う
        let detail = "";
        try {
          const data = await res.json();
          detail = data?.error || data?.message || "";
        } catch (_) {}
        throw new Error(detail || "API Error");
      }

      setMessage("送信に成功しました ✅");
    } catch (err: unknown) {
      console.error(err);
      setMessage(`送信に失敗しました ❌ ${err instanceof Error ? err.message : ""}`);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !eventId.trim();

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-full text-white font-medium shadow 
          ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-rose-700 hover:bg-rose-600"}`}
      >
        {loading ? "送信中..." : "送信する"}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
