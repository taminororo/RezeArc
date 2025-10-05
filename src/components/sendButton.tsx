"use client";

// クリックでAPIにPOSTリクエストを送り、成功・失敗メッセージを表示するボタンコンポーネント
// loading状態の管理とスタイルの変更も含む
// APIエンドポイントは仮のものなので、実際には適切なURLに変更してください
// 例: fetch("/api/send", { method: "POST", ... })

import { useState } from "react";

export default function SendButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    try {
      // 仮のPOSTリクエスト（API未実装なので失敗するかモック用）
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ example: "data" }),
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      setMessage("送信に成功しました ✅");
    } catch (err) {
      setMessage("送信に失敗しました ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 rounded-full  text-white font-medium shadow 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-rose-700 hover:bg-rose-600"}`}
      >
        {loading ? "送信中..." : "送信する"}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
