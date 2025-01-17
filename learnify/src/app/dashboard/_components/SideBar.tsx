"use client"
import Image from 'next/image'
import { HiOutlineHome, HiOutlinePower, HiOutlineShieldCheck, HiOutlineSquare3Stack3D } from 'react-icons/hi2'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

const SideBar = () => {
    const Menu = [
        {
            id : 1,
            name : 'Home',
            icon :  <HiOutlineHome />,
            path : '/dashboard'
        },
        {
            id : 2,
            name : 'Explore',
            icon : <HiOutlineSquare3Stack3D />,
            path : '/dashboard/explore'
        },
        {
            id : 3,
            name : 'Upgrade',
            icon : <HiOutlineShieldCheck />,
            path : '/dashboard/upgrade'
        },
        {
            id : 4,
            name : 'Logout',
            icon : <HiOutlinePower />,
            path : '/dashboard/logout'
        }
    ]
    const path = usePathname()
  return (
    <div className='fixed h-full md : w-64 p-4 shadow-md  '>
        <div className="flex items-center">
        <Image src="/logo.png" alt="logo" height={80} width={80} />
        <span className="ml-4 text-3xl font-bold">Learnify</span>
      </div>
        <hr className="my-5"/>
      <ul>
            {Menu.map((item) => (
                <Link href={item.path} >
                <div key={item.id} className={`flex items-center gap-2 text-gray-600 p-3 
                cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-black rounded-lg mb-3
                ${item.path==path && 'bg-gray-100 text-black'}`} >
                        <div className="text-2xl">{item.icon}</div>
                        <h2>{item.name}</h2>
                    
                </div>
                </Link>
            ))}
            
      </ul>
      <div className='absolute bottom-10 w-[80%]'>
        <Progress value={60} />
        <h2 className='text-sm my-2'>3 out of 5 course</h2>
        <h2 className='text-xs text-gray-500 '>ugrade your plan</h2>
      </div>
      
    </div>
  )
}

export default SideBar
