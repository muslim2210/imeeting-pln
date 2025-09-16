'use client';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { BookingsTable } from '@/components/booking/BookingTable';
// import { set } from 'zod';

const RuangMeeting = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])

  useEffect(() => {
    setLoading(true)
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((json) => setData(json.data))
      .finally(() => setLoading(false))
  }, [])


  return (
    <section className='px-2 md:px-4 py-12 mt-10 ml-0 md:ml-16'>
      <div className='flex flex-row gap-2 items-center justify-between mb-10'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Ruang Meeting</h1> 
          <span className='text-sm'>Ruang Meeting</span>
        </div>

        <Link href='/meeting/new'>       
          <Button className='flex items-center gap-2 text-white bg-primary'>
            <FaPlus size={16}/>
            <span className='text-xs'>Pesan Ruangan</span>
          </Button>
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      <BookingsTable data={data} />
    </section>
  )
}

export default RuangMeeting
