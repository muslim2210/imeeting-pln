import { Button } from '@/components/ui/button'
import Link from 'next/link';
import React from 'react'
import { FaPlus } from "react-icons/fa6";

const RuangMeeting = () => {
  return (
    <section className='px-2 md:px-4 py-12 mt-10 ml-0 md:ml-16'>
      <div className='flex flex-row gap-2 items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Ruang Meeting</h1> 
          <span className='text-sm'>Ruang Meeting</span>
        </div>

        <Link href='/meeting/new'>       
          <Button variant='default' className='flex items-center gap-2 text-white'>
            <FaPlus size={16}/>
            <span className='text-xs'>Pesan Ruangan</span>
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default RuangMeeting
