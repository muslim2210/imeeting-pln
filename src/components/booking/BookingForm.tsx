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

const formSchema = z.object({
  unitId: z.string().nonempty('Pilih Unit'),
  meetingRoomId: z.string().nonempty('Pilih Ruang Meeting'),
  tanggal: z.string().nonempty('Tanggal wajib diisi'),
  waktuMulai: z.string().nonempty('Waktu mulai wajib diisi'),
  waktuSelesai: z.string().nonempty('Waktu selesai wajib diisi'),
  jumlahPeserta: z.number().min(1, 'Jumlah peserta minimal 1'),
});

export function BookingForm({ createdBy }: { createdBy: string }) {
  const [units, setUnits] = React.useState<Unit[]>([])
  const [rooms, setRooms] = React.useState<MeetingRoom[]>([])
  const [jenisKonsumsiMaster, setJenisKonsumsiMaster] = React.useState<JenisKonsumsi[]>([])
  const [capacity, setCapacity] = React.useState<number>(0)
  const [selectedJenis, setSelectedJenis] = React.useState<JenisKonsumsi[]>([])
  const [nominal, setNominal] = React.useState<number>(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitId: '',
      meetingRoomId: '',
      tanggal: format(new Date(), 'yyyy-MM-dd'),
      waktuMulai: '',
      waktuSelesai: '',
      jumlahPeserta: 0,
    },
  })

  React.useEffect(() => {
    // get master unit
    axios.get('https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice')
      .then(res => setUnits(res.data))
    // get master jenis konsumsi
    axios.get('https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi')
      .then(res => setJenisKonsumsiMaster(res.data))
  }, [])

  // ambil rooms berdasarkan unit
  React.useEffect(() => {
    if (form.watch('unitId')) {
      axios.get('https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms')
        .then(res => {
          const filtered = res.data.filter((r: MeetingRoom) => r.officeId === form.watch('unitId'))
          setRooms(filtered)
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
      alert('Jumlah peserta melebihi kapasitas ruangan')
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
      createdBy,
    }

    console.log('Booking:', booking)
    // axios.post('/api/bookings', booking)
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

        <div>
          <FormLabel className='mb-2'>Kapasitas</FormLabel>
          <Input value={capacity} readOnly className='w-full md:w-[250px]'/>
        </div>

        <hr className='my-5'/>
        <FormLabel className='mb-3 text-md'>Informasi Rapat</FormLabel>

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

        <FormField
          control={form.control}
          name="jumlahPeserta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Peserta</FormLabel>
              <FormControl className='w-full md:w-[250px]'>
                <Input type="number" placeholder="Masukkan Jumlah Peserta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Input className='w-full md:w-[250px]' value={`Rp. ${nominal.toLocaleString()}`} readOnly />
        </div>
        
        <hr className='my-5'/>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="destructive">Batal</Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  )
}
