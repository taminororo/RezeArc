// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { eventId: "asc" },
  });

  // 型を安定化（不要なら素通しでOK）
  return NextResponse.json(
    events.map((e) => ({
      event_id: e.eventId,
      event_name: e.eventName,
      isDistributingTicket: e.isDistributingTicket,
      ticket_status: e.ticketStatus,       // null or distributing|limited|ended
      congestion_status: e.congestionStatus, // free|slightly_crowded|crowded|offtime
      event_text: e.eventText ?? null,
      image_path: e.imagePath ?? null,
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    })),
    { status: 200 }
  );
}
