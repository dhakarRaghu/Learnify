"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Addcourse = () => {
    const {user} = useUser()
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h2 className='text-3xl'>hello ,
         <span className='font-bold'>{user?.fullName}</span></h2>
         <p className='sm text-gray-500'>Create new course with AI , Share with friends and Earn form it</p>
      </div>
      <Link href={'/create-course'}>
        <Button>
          + Create AI courses
        </Button>
      </Link>
    </div>
  )
}

export default Addcourse
