"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
import { Booking } from "@/types/model"

interface BookingsTableProps {
  data: Booking[]
}

export const BookingsTable: React.FC<BookingsTableProps> = ({ data }) => {
  return (
    <>  
      <div className="w-full overflow-x-auto hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Ruang</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Peserta</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Konsumsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((booking, idx) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  {new Date(booking.tanggal).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  {booking.waktuMulai} - {booking.waktuSelesai}
                </TableCell>
                <TableCell>{booking.unit.officeName}</TableCell>
                <TableCell>{booking.meetingRoom.roomName}</TableCell>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{booking.jumlahPeserta}</TableCell>
                <TableCell>
                  Rp {booking.nominal.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {booking.konsumsi.map((k) => (
                      <span
                        key={k.id}
                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                      >
                        {k.jenisKonsumsi.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
          >
            <h2 className="text-lg font-semibold mb-1">
              {item.meetingRoom.roomName}
            </h2>
            <p className="text-sm text-gray-600">
              Unit: <span className="font-medium">{item.unit.officeName}</span>
            </p>
            <p className="text-sm text-gray-600">
              Pemesan: <span className="font-medium">{item.user.name}</span>
            </p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {item.tanggal}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {item.waktuMulai} – {item.waktuSelesai}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
