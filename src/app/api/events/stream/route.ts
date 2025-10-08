// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { bus, type EventPayload } from "@/lib/bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  const write = (s: string) => writer.write(enc.encode(s));

  // 心拍（プロキシ維持）
  const heartbeat = setInterval(() => write(`event: ping\ndata: {}\n\n`), 15000);

  // 接続直後
  write(`event: hello\ndata: {}\n\n`);

  // 購読（重要：同じ bus を見れているかの核心）
  const onUpdate = (payload: EventPayload) => {
    write(`event: update\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  bus.on("update", onUpdate);

  const close = () => {
    clearInterval(heartbeat);
    bus.off("update", onUpdate);
    try { writer.close(); } catch {}
  };
  req.signal.addEventListener("abort", close);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Content-Encoding": "none",
      "X-Accel-Buffering": "no",
    },
  });
}
