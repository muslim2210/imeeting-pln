'use client'

import * as React from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { Booking, JenisKonsumsi, MeetingRoom, Unit } from '@/types/model'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
  unitId: z.string().nonempty('Pilih Unit'),
  meetingRoomId: z.string().nonempty('Pilih Ruang Meeting'),
  tanggal: z.string().nonempty('Tanggal wajib diisi'),
  waktuMulai: z.string().nonempty('Waktu mulai wajib diisi'),
  waktuSelesai: z.string().nonempty('Waktu selesai wajib diisi'),
  jumlahPeserta: z.number().min(1, 'Jumlah peserta minimal 1'),
});

export function BookingForm() {
  const [units, setUnits] = React.useState<Unit[]>([])
  const [rooms, setRooms] = React.useState<MeetingRoom[]>([])
  const [jenisKonsumsiMaster, setJenisKonsumsiMaster] = React.useState<JenisKonsumsi[]>([])
  const [capacity, setCapacity] = React.useState<number>(0)
  const [selectedJenis, setSelectedJenis] = React.useState<JenisKonsumsi[]>([])
  const [nominal, setNominal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitId: '',
      meetingRoomId: '',
      tanggal: format(new Date(), 'yyyy-MM-dd'),
      waktuMulai: '',
      waktuSelesai: '',
      jumlahPeserta: undefined,

    },
  })

  React.useEffect(() => {
    // get master unit
    axios.get(`${process.env.NEXT_PUBLIC_API_MASTER_UNIT}`)
      .then(res => setUnits(res.data))
    // get master jenis konsumsi
    axios.get(`${process.env.NEXT_PUBLIC_API_MASTER_KONSUMSI}`)
      .then(res => setJenisKonsumsiMaster(res.data))
  }, [])

  // ambil rooms berdasarkan unit
  React.useEffect(() => {
    if (form.watch('unitId')) {
      axios.get(`${process.env.NEXT_PUBLIC_API_MASTER_ROOM}`)
        .then(res => {
          console.log("📌 Semua rooms:", res)
          const filtered = res.data.filter((r: MeetingRoom) => r.officeId === form.watch('unitId'))
          setRooms(filtered)
          console.log("📌 Rooms:", filtered)
        })
    }
  }, [form.watch('unitId')])

  // update kapasitas otomatis
  React.useEffect(() => {
    const selectedRoom = rooms.find(r => r.id === form.watch('meetingRoomId'))
    if (selectedRoom) {
      setCapacity(selectedRoom.capacity)
    } else {
      setCapacity(0)
    }
  }, [form.watch('meetingRoomId'), rooms])

  // kalkulasi otomatis jenis konsumsi & nominal
  React.useEffect(() => {
    const mulai = form.watch('waktuMulai')
    const selesai = form.watch('waktuSelesai')
    const peserta = form.watch('jumlahPeserta')

    if (!mulai || !selesai) return

    const [startHour] = mulai.split(':').map(Number)
    const [endHour] = selesai.split(':').map(Number)

    const konsumsi: JenisKonsumsi[] = []

    // rule snack siang
    if (startHour < 11 || endHour <= 11) {
      const item = jenisKonsumsiMaster.find(j => j.name.toLowerCase().includes('snack'))
      if (item) konsumsi.push(item)
    }
    // rule makan siang
    if ((startHour < 14 && endHour > 11)) {
      const item = jenisKonsumsiMaster.find(j => j.name.toLowerCase().includes('makan'))
      if (item) konsumsi.push(item)
    }
    // rule snack sore
    if (startHour >= 14 || endHour > 14) {
      const item = jenisKonsumsiMaster.find(j => j.name.toLowerCase().includes('sore'))
      if (item) konsumsi.push(item)
    }

    setSelectedJenis(konsumsi)

    // nominal
    const maxPrice = konsumsi.reduce((acc, cur) => acc + cur.maxPrice, 0)
    setNominal(peserta * maxPrice)

  }, [form.watch('waktuMulai'), form.watch('waktuSelesai'), form.watch('jumlahPeserta'), jenisKonsumsiMaster])

  function onSubmit(values: z.infer<typeof formSchema>) {
  if (values.jumlahPeserta > capacity) {
    toast.error('Jumlah peserta melebihi kapasitas ruangan')
    return
  }

  const booking: Booking = {
    unitId: values.unitId,
    meetingRoomId: values.meetingRoomId,
    capacity: capacity,
    tanggal: values.tanggal,
    waktuMulai: values.waktuMulai,
    waktuSelesai: values.waktuSelesai,
    jumlahPeserta: values.jumlahPeserta,
    jenisKonsumsi: selectedJenis,
    nominal: nominal,
    userId: user?.id || '',
  }

  setLoading(true)
  axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`, booking)
    .then(res => {
      if (res.data.success) {
        toast.success('Booking berhasil disimpan')
        form.reset()
        setCapacity(0)
        setSelectedJenis([])
        setNominal(0)
        router.push('/meeting')
      } else {
        toast.error(res.data.error || res.data.message || 'Gagal menyimpan booking')
      }
    })
    .catch(err => {
      const errData = err.response?.data
      const errorMessage =
        errData?.error ||
        errData?.message ||
        err.message ||
        'Terjadi kesalahan'
      toast.error(errorMessage)
      console.error("Error:", errData || err.message)
    })
    .finally(() => {
      setLoading(false)
    })
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-md shadow-md p-3 md:p-5 bg-white mt-5">
        <h1 className="text-lg font-bold">Informasi ruang Meeting</h1>
        <div className="flex flex-col gap-3 md:flex-row md:gap-5">
          {/* select unit */}
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} >
                  <FormControl className='w-full md:w-[250px]'>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.officeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* select meeting room */}
          <FormField
            control={form.control}
            name="meetingRoomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruang Meeting</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className='w-full md:w-[250px]'>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Ruang Meeting" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.roomName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* kapasitas */}
        <div>
          <FormLabel className='mb-2'>Kapasitas</FormLabel>
          <Input value={capacity || 0} readOnly className='w-full md:w-[250px]'/>

        </div>

        <hr className='my-5'/>
        <FormLabel className='mb-3 text-md'>Informasi Rapat</FormLabel>

        {/* tanggal, waktu mulai, waktu selesai, jumlah peserta */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-5">
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Rapat</FormLabel>
                <FormControl className='w-full md:w-[250px]'>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waktuMulai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Mulai</FormLabel>
                <FormControl className='w-full md:w-[250px]'>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waktuSelesai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Selesai</FormLabel>
                <FormControl className='w-full md:w-[250px]'>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* jumlah peserta */}
        <FormField
          control={form.control}
          name="jumlahPeserta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Peserta</FormLabel>
              <FormControl className='w-full md:w-[250px]'>
                <Input
                type="number"
                placeholder="Masukkan Jumlah Peserta"
                // Kalau null/undefined → tampilkan string kosong
                value={field.value ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    field.onChange(undefined); // kosong → undefined (biar zod validasi)
                  } else {
                    const n = Number(v);
                    if (!Number.isNaN(n)) {
                      field.onChange(n);
                    }
                  }
                }}
                onBlur={field.onBlur}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* jenis konsumsi */}
        <div>
          <FormLabel>Jenis Konsumsi</FormLabel>
          <div className="flex flex-col space-y-2 mt-2">
            {selectedJenis.map((jk) => (
              <div key={jk.id} className="flex items-center space-x-2">
                <Checkbox checked disabled />
                <span>{jk.name}</span>
              </div>
            ))}
            {selectedJenis.length === 0 && <span className="text-sm text-muted-foreground">Otomatis terisi sesuai waktu</span>}
          </div>
        </div>

        <div>
          <FormLabel className='mb-2'>Nominal Konsumsi</FormLabel>
          <Input className='w-full md:w-[250px]' value={`Rp. ${(isNaN(nominal) ? 0 : nominal).toLocaleString()}`}
            readOnly
          />
        </div>
        
        <hr className='my-5'/>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="destructive">Batal</Button>
          <Button type="submit">
            {loading ? (
              'Loading...'
            ) : (
              'Simpan'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
