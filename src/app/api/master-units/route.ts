import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const units = await prisma.masterUnit.findMany({
      orderBy: { officeName: "asc" },
    });
    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
  }
}
