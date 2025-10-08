// src/hooks/useLiveInvalidate.ts
"use client";
import { useEffect, useRef } from "react";
import useSWR, { mutate } from "swr"; // 既に使ってなければ `npm i swr`

// どのキーを再検証するかを親から渡す
export function useLiveInvalidate(keys: string[] | (() => string[])) {
  const connected = useRef(false);

  useEffect(() => {
    if (connected.current) return;
    connected.current = true;

    const es = new EventSource("/api/events/stream");

    es.addEventListener("update", (ev) => {
      try {
        const payload = JSON.parse((ev as MessageEvent).data) as
          | { type: "eventUpdated"; eventId: number }
          | { type: "bulkInvalidate" };

        const targetKeys = typeof keys === "function" ? keys() : keys;

        // 1) 全体再検証
        if (payload.type === "bulkInvalidate") {
          for (const k of targetKeys) mutate(k);
          return;
        }
        // 2) 部分更新: eventIdを含むキーだけピンポイントに
        if (payload.type === "eventUpdated") {
          for (const k of targetKeys) {
            // 例: /api/events と /api/events/:id の両方に対応
            if (k === "/api/events" || k === `/api/events/${payload.eventId}`) {
              mutate(k);
            }
          }
        }
      } catch (e) {
        // noop
      }
    });

    es.addEventListener("hello", () => {
      const targetKeys = typeof keys === "function" ? keys() : keys;
      for (const k of targetKeys) mutate(k);
    });

    es.addEventListener("error", () => {
      // サーバーが再起動しても再接続はEventSourceがやってくれる
    });

    return () => es.close();
  }, [keys]);
}
