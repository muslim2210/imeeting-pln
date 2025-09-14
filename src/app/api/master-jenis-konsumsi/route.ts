import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jenisKonsumsi = await prisma.masterJenisKonsumsi.findMany();
    return NextResponse.json({ success: true, data: jenisKonsumsi });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch jenis konsumsi" }, { status: 500 });
  }
}
