import { SummaryBooking } from "@/types/model"; // interface dari kamu
import Image from "next/image";

interface DashboardProps {
  data: SummaryBooking[];
  period: string; // periode aktif
}

export const Dashboard: React.FC<DashboardProps> = ({ data, period }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">Data untuk periode {period} tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Grid per office */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {data.map((summary) =>
          summary.offices.map((office) => (
            <div key={office.id} className="space-y-4 ">
              <div className="flex items-center space-x-2">
                <Image
                  src="/img/Generation.png"
                  alt="generation"
                  width={50}
                  height={50}
                  priority
                  className="h-5 w-5"
                />
                <h2 className="text-md font-semibold text-gray-500">
                  {office.officeName}
                </h2>
              </div>

              {/* Card per room */}
              {office.rooms.map((room) => {
                const percent = (
                  (room.averageOccupancyPerMonth / room.capacity) *
                  100
                ).toFixed(2);

                const totalPrice = room.consumptions.reduce(
                  (sum, c) => sum + c.totalPrice,
                  0
                );

                return (
                  <div
                    key={room.id}
                    className="p-4 bg-slate-400 rounded-xl shadow-sm space-y-2"
                  >
                    <h3 className="font-medium">{room.roomName}</h3>
                    <p>Persentase Pemakaian: {percent}%</p>
                    <p>Nominal Konsumsi: Rp {totalPrice.toLocaleString("id-ID")}</p>

                    <div className="border-t pt-2 space-y-1">
                      {room.consumptions.map((c) => (
                        <div key={c.id} className="flex justify-between text-sm">
                          <span>{c.name}</span>
                          <span>{c.totalPackage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
