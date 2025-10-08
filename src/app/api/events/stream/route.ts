// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { bus, type EventPayload } from "@/lib/bus";

export const runtime = "nodejs";             // Edgeでの切断を避ける
export const dynamic = "force-dynamic";      // 常に動的実行
export const revalidate = 0;                 // キャッシュ無効

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();

  const write = (text: string) => writer.write(enc.encode(text));

  // 心拍（ProxyやKeep-Alive維持）
  const heartbeat = setInterval(() => {
    write(`event: ping\ndata: {}\n\n`);
  }, 15000);

  // 接続時に初回イベントを送る（接続確認＋初期再検証のトリガに使える）
  write(`event: hello\ndata: {}\n\n`);

  // bus購読
  const unsubscribe = bus.on((payload: unknown) => {
    // 簡易の型ガード／アサーション
    const ev = payload as EventPayload;
    if (ev && (ev.type === "bulkInvalidate" || (ev.type === "eventUpdated" && typeof ev.eventId === "number"))) {
      write(`event: update\ndata: ${JSON.stringify(ev)}\n\n`);
    }
  });

  // クライアント切断（AbortSignal）
  const close = () => {
    clearInterval(heartbeat);
    try { unsubscribe(); } catch { /* safe-ignore */ }
    // writer を閉じてストリームを終了
    writer.close().catch(() => {});
    try { req.signal.removeEventListener("abort", close); } catch { /* noop */ }
  };

  req.signal.addEventListener("abort", close);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      // 重要：一部環境で圧縮されるとSSEが壊れることがある
      "Content-Encoding": "none",
      "X-Accel-Buffering": "no", // Nginx等のバッファ無効化対策
    },
  });
}
