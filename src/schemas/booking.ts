import { z } from "zod";

// Schema untuk konsumsi
export const jenisKonsumsiSchema = z.object({
  id: z.string(),
  name: z.string(),
  maxPrice: z.number(),
});

// Schema utama Booking
export const bookingSchema = z.object({
  unitId: z.string().min(1, "Unit harus dipilih"),
  meetingRoomId: z.string().min(1, "Ruang meeting harus dipilih"),
  capacity: z.number().min(1, "Kapasitas tidak valid"),
  userId: z.string().min(1, "User harus dipilih"),
  tanggal: z.string().min(1, "Tanggal rapat wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),

  jumlahPeserta: z
    .number()
    .min(1, "Jumlah peserta minimal 1"),

  jenisKonsumsi: z.array(jenisKonsumsiSchema).nonempty("Jenis konsumsi wajib ada"),

  nominal: z.number().min(0, "Nominal tidak valid"),

  createdBy: z.string().optional(),
})
.refine(
  (data) => {
    // validasi waktu selesai >= waktu mulai
    return data.waktuMulai <= data.waktuSelesai;
  },
  {
    message: "Waktu selesai harus lebih besar atau sama dengan waktu mulai",
    path: ["waktuSelesai"],
  }
)
.refine(
  (data) => {
    // validasi peserta <= kapasitas
    return data.jumlahPeserta <= data.capacity;
  },
  {
    message: "Jumlah peserta tidak boleh melebihi kapasitas ruangan",
    path: ["jumlahPeserta"],
  }
);

// Tipe hasil infer dari schema
export type BookingForm = z.infer<typeof bookingSchema>;

// Default Values
export const defaultBookingValues: BookingForm = {
  unitId: "",
  meetingRoomId: "",
  capacity: 0,
  tanggal: "",
  waktuMulai: "",
  waktuSelesai: "",
  jumlahPeserta: 1,
  jenisKonsumsi: [],
  nominal: 0,
  userId: "",
  createdBy: "User", // atau bisa isi dynamic dari auth
};
