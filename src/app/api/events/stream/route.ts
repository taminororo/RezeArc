// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { bus, type EventPayload } from "@/lib/bus";

export const runtime = "nodejs"; // EdgeだとSSEが切れやすいのでNode推奨

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();

      // 接続直後にheart beat開始（Heroku/Render/Proxy対策）
      const interval = setInterval(() => {
        controller.enqueue(enc.encode(`event: ping\ndata: {}\n\n`));
      }, 15000);

      // ブロードキャストを購読
      // → bus.on のリスナーは unknown を受け取る設計のため、ここで EventPayload にアサートして扱う
      const unsubscribe = bus.on((payload: unknown) => {
        const ev = payload as EventPayload;
        controller.enqueue(enc.encode(`event: update\ndata: ${JSON.stringify(ev)}\n\n`));
      });

      // 初回は全体再検証させたい場合（任意）
      controller.enqueue(enc.encode(`event: hello\ndata: {}\n\n`));

      // 接続終了時の掃除
      const cancel = () => {
        clearInterval(interval);
        unsubscribe();
      };
      // @ts-expect-error - Web Streamsの仕様上close時hookがこれ
      controller.oncancel = cancel;
      // @ts-expect-error - Web Streamsの仕様上close時hookがこれ
      controller.onclose = cancel;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}