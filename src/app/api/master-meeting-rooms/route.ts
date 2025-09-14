import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.masterMeetingRoom.findMany({
      orderBy: { roomName: "asc" },
    });
    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch meeting rooms" }, { status: 500 });
  }
}
