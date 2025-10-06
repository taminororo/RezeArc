// src/app/api/events/route.ts
import { NextResponse } from "next/server";

// Prismaは使わず、ルートが動いているかだけ確認
export async function GET() {
  return NextResponse.json(
    { message: "API is alive 🚀" },
    { status: 200 }
  );
}
