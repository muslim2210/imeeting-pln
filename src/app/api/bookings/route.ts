import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET /api/bookings
export async function GET() {
  try {
    const bookings: Awaited<ReturnType<typeof prisma.booking.findMany>> =
      await prisma.booking.findMany({
        include: {
          unit: true,
          meetingRoom: true,
          user: true,
          konsumsi: {
            include: { jenisKonsumsi: true },
          },
        },
      });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/bookings
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const booking = await prisma.booking.create({
      data: {
        unitId: body.unitId,
        meetingRoomId: body.meetingRoomId,
        capacity: body.capacity,
        tanggal: new Date(body.tanggal),
        waktuMulai: body.waktuMulai,
        waktuSelesai: body.waktuSelesai,
        jumlahPeserta: body.jumlahPeserta,
        nominal: body.nominal,
        jenisKonsumsi: body.jenisKonsumsi, // array JSON
        createdBy: body.createdBy || "User",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
