import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
// import { toast } from 'sonner';


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
    // toast.error("Error fetching bookings:")
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


const bookingSchema = z.object({
  unitId: z.string(),
  meetingRoomId: z.string(),
  capacity: z.number(),
  tanggal: z.string(), // format YYYY-MM-DD
  waktuMulai: z.string(), // format HH:mm
  waktuSelesai: z.string(), // format HH:mm
  jumlahPeserta: z.number(),
  jenisKonsumsi: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      maxPrice: z.number(),
    })
  ),
  nominal: z.number(),
  userId: z.string(),
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      unitId,
      meetingRoomId,
      capacity,
      tanggal,
      waktuMulai,
      waktuSelesai,
      jumlahPeserta,
      jenisKonsumsi,
      nominal,
      userId,
    } = parsed.data;

    // Normalisasi tanggal supaya jam 00:00
    function normalizeDate(date: Date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      return d
    }

    const today = normalizeDate(new Date())
    const tanggalMeeting = normalizeDate(new Date(tanggal))

    if (tanggalMeeting < today) {
      // toast.error("Tanggal rapat tidak boleh lebih kecil dari hari ini")
      return NextResponse.json(
        { success: false, error: "Tanggal rapat tidak boleh lebih kecil dari hari ini" },
        { status: 400 }
      )
    }

    // Cek jika tanggal meeting == hari ini
    if (tanggalMeeting.getTime() === today.getTime()) {
      const now = new Date()

      // Buat date object sesuai tanggal meeting
      const [jamMulai, menitMulai] = waktuMulai.split(':').map(Number)
      const waktuMulaiDate = new Date(tanggal) // tanggal rapat
      waktuMulaiDate.setHours(jamMulai, menitMulai, 0, 0)

      if (waktuMulaiDate <= now) {
        // toast.error("Waktu mulai harus lebih besar dari waktu sekarang")
        return NextResponse.json(
          { success: false, error: "Waktu mulai harus lebih besar dari waktu sekarang" },
          { status: 400 }
        )
      }
    }


    if (jumlahPeserta > capacity) {
      // toast.error("Jumlah peserta melebihi kapasitas ruangan")
      return NextResponse.json(
        { success: false, error: "Jumlah peserta melebihi kapasitas ruangan" },
        { status: 400 }
      );
    }

    if (waktuMulai >= waktuSelesai) {
      // toast.error("Waktu mulai tidak boleh lebih besar/sama dengan waktu selesai")
      return NextResponse.json(
        { success: false, error: "Waktu mulai tidak boleh lebih besar/sama dengan waktu selesai" },
        { status: 400 }
      );
    }

    

    // Simpan ke DB
    const booking = await prisma.booking.create({
      data: {
        unitId,
        meetingRoomId,
        capacity,
        tanggal: tanggalMeeting,
        waktuMulai,
        waktuSelesai,
        jumlahPeserta,
        nominal,
        userId,
        konsumsi: {
        create: jenisKonsumsi.map((jk) => ({
          jenisKonsumsi: {
            connect: { id: jk.id }, // pakai id dari MasterJenisKonsumsi
          },
        })),
      },

      },
      include: { konsumsi: true },
    });
    // toast.success("Booking berhasil dibuat")
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
