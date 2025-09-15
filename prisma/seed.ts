import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const unitsUrl = process.env.API_MASTER_UNIT;
  const roomsUrl = process.env.API_MASTER_ROOM;
  const konsumsiUrl = process.env.API_MASTER_KONSUMSI;
  const summaryUrl = process.env.API_SUMMARY_BOOKINGS;



  if (!unitsUrl || !roomsUrl || !konsumsiUrl) {
    throw new Error("Environment variables API_MASTER_* belum diset!");
  }

  // Master Unit
  const units = await axios.get(unitsUrl);
  for (const u of units.data) {
    await prisma.masterUnit.upsert({
      where: { id: String(u.id) },
      update: {},
      create: { id: String(u.id), officeName: u.officeName },
    });
  }

  // Master Meeting Rooms
  const rooms = await axios.get(roomsUrl);
  for (const r of rooms.data) {
    await prisma.masterMeetingRoom.upsert({
    where: { id: r.id },
    update: {
      officeName: r.officeName,
      roomName: r.roomName,
      capacity: r.capacity
    },
    create: {
      id: r.id,
      officeId: r.officeId,
      officeName: r.officeName,
      roomName: r.roomName,
      capacity: r.capacity,
      createdAt: new Date(r.createdAt)
    },
  });
  }

  // Master Jenis Konsumsi
  const konsumsi = await axios.get(konsumsiUrl);
  for (const k of konsumsi.data) {
    await prisma.masterJenisKonsumsi.upsert({
      where: { id: String(k.id) },
      update: {},
      create: { id: String(k.id), name: k.name, maxPrice: k.maxPrice },
    });
  }

 // ================================
// Summary Bookings (from API)
// ================================
if (!summaryUrl) {
  throw new Error("Environment variable API_SUMMARY_BOOKINGS belum diset!");
}

const summaries = await axios.get(summaryUrl);

for (const s of summaries.data) {
  // Buat SummaryBookings
  await prisma.summaryBookings.upsert({
    where: { id: String(s.id) },
    update: {
      period: s.period,
      createdAt: new Date(s.createdAt),
    },
    create: {
      id: String(s.id),
      period: s.period,
      createdAt: new Date(s.createdAt),
    },
  });

  // Loop offices
  for (const o of s.data) {
    const officeId = `${s.id}-${o.officeName}`; // gabungan biar unik

    await prisma.summaryOffice.upsert({
      where: { id: officeId },
      update: { officeName: o.officeName },
      create: {
        id: officeId,
        officeName: o.officeName,
        summaryId: String(s.id),
      },
    });

    // Loop rooms
    for (const r of o.detailSummary) {
      const roomId = `${officeId}-${r.roomName}`;

      await prisma.summaryRoom.upsert({
        where: { id: roomId },
        update: {
          roomName: r.roomName,
          capacity: Number(r.capacity),
          averageOccupancyPerMonth: Number(r.averageOccupancyPerMonth),
        },
        create: {
          id: roomId,
          roomName: r.roomName,
          capacity: Number(r.capacity),
          averageOccupancyPerMonth: Number(r.averageOccupancyPerMonth),
          officeId: officeId,
        },
      });

      // Loop consumptions
      for (const c of r.totalConsumption) {
        const consumptionId = `${roomId}-${c.name}`;

        await prisma.summaryConsumption.upsert({
          where: { id: consumptionId },
          update: {
            name: c.name,
            totalPackage: Number(c.totalPackage),
            totalPrice: Number(c.totalPrice),
          },
          create: {
            id: consumptionId,
            name: c.name,
            totalPackage: Number(c.totalPackage),
            totalPrice: Number(c.totalPrice),
            roomId: roomId,
          },
        });
      }
    }
  }
}

 

  
}

main()
  .then(() => console.log("Seeding selesai 🚀"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
