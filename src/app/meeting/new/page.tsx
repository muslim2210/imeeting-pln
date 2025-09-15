import { BookingForm } from '@/components/booking/BookingForm';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import React from 'react'
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const FormRuangMeeting = () => {
  return (
    <section className='px-2 md:px-4 py-12 mt-10 ml-0 md:ml-16 bg-gray-100'>
      {/* title */}
      <div className='flex flex-row gap-5 items-center'>
        <Link href='/meeting'>       
          <Button size={"sm"} variant='default' className='flex items-center justify-center text-white'>
            <MdChevronLeft />
          </Button>
        </Link>

        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold'>Ruang Meeting</h1> 
          <div className='flex flex-row gap-2 items-center'>
            <span className='text-sm text-gray-500'>Ruang Meeting</span> 
            <MdChevronRight className='mt-1'/>
            <span className='text-sm text-blue-500'>Pesan Ruangan</span>
          </div>
        </div>

        
      </div>

      {/* form */}
      <BookingForm createdBy={''} />
    </section>
  )
}

export default FormRuangMeeting
