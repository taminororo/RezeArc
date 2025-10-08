// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { bus, type EventPayload } from "@/lib/bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  let closed = false;
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const safeEnqueue = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(enc.encode(chunk));
        } catch {
          // enqueue後にクローズ済みなどで失敗した場合でも黙って終了
          closed = true;
          cleanup();
        }
      };

      // EventPayload の型ガード
      const isEventPayload = (v: unknown): v is EventPayload => {
        if (typeof v !== "object" || v === null) return false;
        const obj = v as Record<string, unknown>;
        if (obj.type === "bulkInvalidate") return true;
        if (obj.type === "eventUpdated" && typeof obj.eventId === "number") return true;
        return false;
      };

      // 1) 接続直後の合図（クライアント側で初回revalidateに利用）
      safeEnqueue(`event: hello\ndata: {}\n\n`);

      // 2) 心拍（Proxy/Keep-Alive維持）
      const heartbeat = setInterval(() => {
        safeEnqueue(`event: ping\ndata: {}\n\n`);
      }, 15000);

      // 3) bus購読（更新のたびにpush）
      const onUpdate = (payload: unknown) => {
        if (!isEventPayload(payload)) return;
        safeEnqueue(`event: update\ndata: ${JSON.stringify(payload)}\n\n`);
      };
      bus.on("update", onUpdate);

      // 4) 後始末をひとまとめに
      const cleanup = () => {
        if (closed) return;
        closed = true;
        try {
          bus.off("update", onUpdate);
        } catch {}
        try {
          clearInterval(heartbeat);
        } catch {}
        try {
          controller.close();
        } catch {}
      };

      // 5) クライアント切断（AbortSignal）
      req.signal.addEventListener("abort", cleanup);

      // 6) まれにランタイム側で早期closeされるケースもあるので oncancel/onerror もケア
      // @ts-expect-error - Web Streams の型定義に oncancel がないため期待的に無視
      controller.oncancel = cleanup;
      // @ts-expect-error - Web Streams の型定義に onerror がないため期待的に無視
      controller.onerror = cleanup;
    },
    cancel() {
      // ここには来ないことが多いが念のため
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      // 圧縮は中間で壊れる場合があるので付けない（Content-Encodingはレスポンス側で付けない）
    },
  });
}