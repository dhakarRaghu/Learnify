import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
  return (
    <div>
      <div className='flex justify-end items-center p-5 bg-white shadow-md'>
            <UserButton></UserButton>
      </div>
    </div>
  )
}

export default Header
