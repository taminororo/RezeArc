// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const BodySchema = z.object({
  event_id: z.number().int().nonnegative(),
  event_name: z.string().min(1),
  // UI側で保証される想定だが、サーバーでも厳密化
  // 整理券は3段階のみを受理（ただし後段の条件で上書き/無視されることあり）
  ticket_status: z.enum(["distributing", "limited", "ended"]).nullable().optional(),
  // 4段階の混雑状況は必須
  congestion_status: z.enum(["free", "slightly_crowded", "crowded", "offtime"]),
  // 任意（空文字は保存したくない場合は transform などで null に揃える）
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
    return NextResponse.json({ error: "Invalid body", detail: String(e) }, { status: 400 });
  }

  // パスの id と body.event_id の不整合は 409 で弾く（運用保守しやすい）
  if (body.event_id !== urlEventId) {
    return NextResponse.json(
      { error: "event_id mismatch between path and body" },
      { status: 409 }
    );
  }

  // 対象レコード取得（存在しない場合 404）
  const existing = await prisma.event.findUnique({
    where: { eventId: body.event_id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // 重要ロジック：
  // - レコード側の isDistributingTicket が true のときだけ body.ticket_status を反映
  // - false のときは ticket_status を null に矯正
  const nextTicketStatus =
    existing.isDistributingTicket
      ? body.ticket_status ?? existing.ticketStatus ?? "distributing" // POSTは「全属性を含める」想定だが念のため
      : null;

  const updated = await prisma.event.update({
    where: { eventId: body.event_id },
    data: {
      eventName: body.event_name,
      // isDistributingTicket は「レコードが持つ現在値」を維持（要件より、ここでは切り替えない）
      // もし管理画面でフラグ自体を切り替えたい場合は、別の専用APIにするのが安全です。
      ticketStatus: nextTicketStatus,
      congestionStatus: body.congestion_status,
      eventText: body.event_text?.trim() ? body.event_text : null,
    },
  });

  return NextResponse.json(
    {
      event_id: updated.eventId,
      event_name: updated.eventName,
      isDistributingTicket: updated.isDistributingTicket,
      ticket_status: updated.ticketStatus,
      congestion_status: updated.congestionStatus,
      event_text: updated.eventText,
      updated_at: updated.updatedAt,
    },
    { status: 200 }
  );
}
