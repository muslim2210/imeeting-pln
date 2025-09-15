// Master Data
export type Unit = {
  id: string;
  officeName: string;
};

export type MeetingRoom = {
  id: string;
  officeId: string; // relasi ke Unit
  officeName: string;
  roomName: string;
  capacity: number;
};

export type JenisKonsumsi = {
  id: string;
  name: string;   // "Snack Pagi", "Makan Siang", "Snack Sore"
  maxPrice: number;  // 20000 / 30000
};

// Booking (Form Data)
export type Booking = {
  id?: string; // opsional kalau dari API
  unitId: string;
  meetingRoomId: string;
  capacity: number; // auto isi dari room
  tanggal: string; // format yyyy-mm-dd
  waktuMulai: string; // format HH:mm
  waktuSelesai: string; // format HH:mm
  jumlahPeserta: number;
  jenisKonsumsi: JenisKonsumsi[];
  nominal: number;
  createdBy: string; // user/admin
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string; // ADMIN / USER
  token: string;
  createdAt: string; // format yyyy-mm-dd
  updatedAt: string; // format yyyy-mm-dd
};

export type BookingKonsumsi = {
  id: string;
  bookingId: string;
  jenisKonsumsiId: string;
};

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

export interface SummaryConsumption {
  id: string;
  name: string;
  totalPackage: number;
  totalPrice: number;
}

export interface SummaryRoom {
  id: string;
  roomName: string;
  capacity: number;
  averageOccupancyPerMonth: number;
  consumptions: SummaryConsumption[];
}

export interface SummaryOffice {
  id: string;
  officeName: string;
  rooms: SummaryRoom[];
}

export interface SummaryBooking {
  id: string;
  period: string;
  createdAt: string; // ISO string dari Date
  offices: SummaryOffice[];
}
