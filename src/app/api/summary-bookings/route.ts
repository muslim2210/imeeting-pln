import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const summaryBookings = await prisma.summaryBookings.findMany({
      include: {
        offices: {
          include: {
            rooms: {
              include: {
                consumptions: true, // ambil semua konsumsi per room
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: summaryBookings });
  } catch (error) {
    console.error("❌ Error fetching summary bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary bookings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
