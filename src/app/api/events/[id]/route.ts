// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bus } from "@/lib/bus"; // ← 追加：SSE 用ブロードキャスト

// Edge だと SSE が切れやすいので Node 実行を明示（任意だが推奨）
export const runtime = "nodejs";

// event_id は params から受け取るので BodySchema から削除
const BodySchema = z.object({
  ticket_status: z.enum(["distributing", "limited", "ended"]).nullable().optional(),
  congestion_status: z.enum(["free", "slightly_crowded", "crowded", "offtime"]),
  event_text: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // URLの {id} は event_id のこと（フロントで数字のみ保証）
  const { id } = await context.params;
  const urlEventId = Number(id);
  if (!Number.isInteger(urlEventId) || urlEventId < 0) {
    return NextResponse.json({ error: "Invalid path id" }, { status: 400 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid body", detail: String(e) },
      { status: 400 }
    );
  }

  // 対象レコード取得
  const existing = await prisma.event.findUnique({
    where: { eventId: urlEventId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // isDistributingTicket が false の場合 ticket_status は null に強制
  const nextTicketStatus =
    existing.isDistributingTicket
      ? body.ticket_status ?? existing.ticketStatus ?? "distributing"
      : null;

  const updated = await prisma.event.update({
    where: { eventId: urlEventId },
    data: {
      ticketStatus: nextTicketStatus,
      congestionStatus: body.congestion_status,
      eventText: body.event_text?.trim() ? body.event_text : null,
    },
  });

  // --- ここで通知を発火（SSE購読側が mutate して最新化）---
  try {
    bus.emit({ type: "eventUpdated", eventId: updated.eventId });
  } catch {
    // 通知で失敗してもDB更新は成功しているので API は 200 を返す
  }

  return NextResponse.json(
    {
      event_id: updated.eventId,
      isDistributingTicket: updated.isDistributingTicket,
      ticket_status: updated.ticketStatus,
      congestion_status: updated.congestionStatus,
      event_text: updated.eventText,
      updated_at: updated.updatedAt,
    },
    { status: 200 }
  );
}
