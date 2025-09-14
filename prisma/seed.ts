import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

async function main() {
  const unitsUrl = process.env.API_MASTER_UNIT;
  const roomsUrl = process.env.API_MASTER_ROOM;
  const konsumsiUrl = process.env.API_MASTER_KONSUMSI;

  console.log("unitsUrl:", process.env.API_MASTER_UNIT);
  console.log("roomsUrl:", process.env.API_MASTER_ROOM);
  console.log("konsumsiUrl:", process.env.API_MASTER_KONSUMSI);


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
}

main()
  .then(() => console.log("Seeding selesai 🚀"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
