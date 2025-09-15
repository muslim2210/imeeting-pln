import { SummaryBooking } from "@/types/model"; // interface dari kamu
import Image from "next/image";
import CircularProgress from "../ui/CircularProgress";
import ProgressBarNumber from "../ui/ProgressBarNumber";

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
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
                    className="p-4 bg-[#f2f2f2] rounded-md shadow-sm space-y-2"
                  >
                    <h3 className="text-sm capitalize font-medium">{room.roomName}</h3>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500">Presentase Pemakaian</span>
                        <h1 className="text-xl font-bold">{percent}%</h1>
                      </div>

                      <CircularProgress percentage={Number(percent)} size={40} strokeWidth={6} progressColor="#00A3E9" />
                    </div>

                    <div className="flex flex-col gap-0">
                      <span className="text-[10px] text-gray-500">Nominal Konsumsi</span>
                      <h1 className="text-xl font-bold">Rp {totalPrice.toLocaleString("id-ID")}</h1>
                    </div>

                    <div className="border-t pt-2 space-y-1">
                      {room.consumptions.map((c) => (
                        <div key={c.id} className="flex flex-row gap-3 items-center">
                          <div className="flex-1 text-sm font-medium flex items-center">
                            <span className="text-xs">{c.name}</span> 
                          </div>

                          <div className="flex-1 flex flex-col gap-1">
                            <span className="text-xs">{c.totalPackage}</span>
                            <ProgressBarNumber value={Number(c.totalPackage)} max={200} fillColor="#00A3E9" />
                          </div>
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
