// src/app/api/events/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // HMR耐性版を推奨（後述）

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventId: "asc" },
      // 最小のフィールドから確認してもOK:
      // select: { eventId: true, eventName: true },
    });

    return NextResponse.json(
      events.map((e) => ({
        event_id: e.eventId,
        event_name: e.eventName,
        isDistributingTicket: e.isDistributingTicket,
        ticket_status: e.ticketStatus,
        congestion_status: e.congestionStatus,
        event_text: e.eventText ?? null,
        image_path: e.imagePath ?? null,
        created_at: e.createdAt,
        updated_at: e.updatedAt,
      })),
      { status: 200 }
    );
  } catch (e) {
    // ここで必ず JSON でエラーを返す（HTML化を防ぐ）
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
