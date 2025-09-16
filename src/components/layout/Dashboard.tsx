import Image from "next/image";
import CircularProgress from "../ui/CircularProgress";
import ProgressBarNumber from "../ui/ProgressBarNumber";
import { SummaryOffice } from "@/types/model";


interface DashboardProps {
  data: SummaryOffice[];   // sekarang array office
  period: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, period }) => {
  {
    console.warn('data props',data);
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">
          Data untuk periode {period} tidak ditemukan.
        </p>
      </div>
    );
  }

  

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        {data.map((office, idx) => (
          <div key={idx} className="space-y-4">
            {/* Office Name */}
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

            {/* Rooms */}
            {office.rooms.map((room, ridx) => {
              const capacity = Number(room.capacity);
              const average = Number(room.averageOccupancyPerMonth);
              const percent = ((average / capacity) * 100).toFixed(2);

              const totalPrice = room.consumptions.reduce(
                (sum, c) => sum + Number(c.totalPrice),
                0
              );

              return (
                <div
                  key={ridx}
                  className="p-4 bg-[#f2f2f2] rounded-md shadow-sm space-y-2"
                >
                  <h3 className="text-sm capitalize font-medium">
                    {room.roomName}
                  </h3>

                  <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500">
                        Presentase Pemakaian
                      </span>
                      <h1 className="text-xl font-bold">{percent}%</h1>
                    </div>

                    <CircularProgress
                      percentage={Number(percent)}
                      size={40}
                      strokeWidth={6}
                      progressColor="#00A3E9"
                    />
                  </div>

                  <div className="flex flex-col gap-0">
                    <span className="text-[10px] text-gray-500">
                      Nominal Konsumsi
                    </span>
                    <h1 className="text-xl font-bold">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </h1>
                  </div>

                  <div className="border-t pt-2 space-y-1">
                    {room.consumptions.map((c, cidx) => (
                      <div
                        key={cidx}
                        className="flex flex-row gap-3 items-center"
                      >
                        <div className="flex-1 text-sm font-medium flex items-center">
                          <span className="text-xs">{c.name}</span>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-xs">{c.totalPackage}</span>
                          <ProgressBarNumber
                            value={Number(c.totalPackage)}
                            max={200}
                            fillColor="#00A3E9"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
