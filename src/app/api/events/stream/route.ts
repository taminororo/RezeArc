// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { bus, type EventPayload } from "@/lib/bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const ts = new TransformStream();
  const writer = ts.writable.getWriter();
  const enc = new TextEncoder();

  let closed = false;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let onUpdate: ((p: EventPayload) => void) | null = null;

  const safeWrite = (s: string) => {
    if (closed) return;
    try {
      writer.write(enc.encode(s));
    } catch {
      // ここで例外が出た = 閉じている。確実にクリーンアップ。
      doCleanup();
    }
  };

  const doCleanup = () => {
    if (closed) return;
    closed = true;
    try { if (onUpdate) bus.off("update", onUpdate); } catch {}
    try { if (heartbeat) clearInterval(heartbeat); } catch {}
    try { writer.close(); } catch {}
  };

  // クライアント切断時
  req.signal.addEventListener("abort", doCleanup);

  // 接続直後: hello
  safeWrite(`event: hello\ndata: {}\n\n`);

  // 心拍（プロキシ維持）
  heartbeat = setInterval(() => {
    // ここも safeWrite 経由にすることで閉じたあとに書かない
    safeWrite(`event: ping\ndata: {}\n\n`);
  }, 15000);

  // bus 購読
  onUpdate = (payload: EventPayload) => {
    // 型は bus.ts 側で担保済み
    safeWrite(`event: update\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  bus.on("update", onUpdate);

  // Response 返却
  const res = new Response(ts.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });

  return res;
}
