/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useMemo } from "react";
import { MdChevronRight } from "react-icons/md";
import { SummaryBooking, SummaryOffice, SummaryRoom, SummaryConsumption } from "@/types/model";
import { Dashboard } from "@/components/layout/Dashboard";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";

// Ambil semua data summary booking dan mapping ke model kita
const getSummaryBookings = async (): Promise<SummaryBooking[]> => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_API_SUMMARY_BOOKINGS as string
    );
    const apiData = res.data as any[]; // data mentah

    // map API ke model SummaryBooking
    return apiData.map((item) => ({
      id: item.id,
      period: item.period,
      createdAt: item.createdAt,
      offices: item.data.map((office: any): SummaryOffice => ({
        id: crypto.randomUUID(), // karena API tidak ada id untuk office
        officeName: office.officeName,
        rooms: office.detailSummary.map((room: any): SummaryRoom => ({
          id: crypto.randomUUID(),
          roomName: room.roomName,
          capacity: Number(room.capacity),
          averageOccupancyPerMonth: Number(room.averageOccupancyPerMonth),
          consumptions: room.totalConsumption.map((c: any): SummaryConsumption => ({
            id: crypto.randomUUID(),
            name: c.name,
            totalPackage: Number(c.totalPackage),
            totalPrice: Number(c.totalPrice),
          })),
        })),
      })),
    }));
  } catch (err) {
    console.error("❌ Error fetching summary bookings:", err);
    throw err;
  }
};

// Generate periode 1 tahun penuh
const generatePeriods = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months.map((m) => `${m}-2024`);
};

const HomePage = () => {
  const [period, setPeriod] = useState<string>("Jan-2024");
  const [allData, setAllData] = useState<SummaryBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = generatePeriods();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await getSummaryBookings();
        setAllData(json);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data berdasarkan periode yang dipilih
  const filteredData = useMemo(() => {
    return allData.filter((item) => item.period === period);
  }, [allData, period]);

  return (
    <section className="px-2 md:px-4 py-12 mt-10 ml-0 md:ml-16">
      {/* Header */}
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/img/Settings.svg" alt="generation" width={50} height={50} priority className="h-5 w-5 mt-1" />
          <h1 className="text-xl font-semibold uppercase">Dashboard</h1>
        </div>
        <MdChevronRight />
      </div>
      <hr className="my-2" />

      {/* Filter Periode */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="mr-2 font-medium text-sm text-gray-500">Periode :</label>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="max-w-full h-[180px] bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <p className="text-red-500 font-medium mt-4">
          Gagal memuat data: {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && filteredData.length === 0 && (
        <p className="text-gray-600 font-medium mt-4">
          Data tidak ditemukan untuk periode {period}
        </p>
      )}

      {/* Data */}
      {!loading && !error && filteredData.length > 0 && (
        <Dashboard data={filteredData[0].offices} period={period} />
      )}
    </section>
  );
};

export default HomePage;
