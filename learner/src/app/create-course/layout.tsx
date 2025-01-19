"use client"
import React, { useState } from 'react'
import { ReactNode } from 'react';
import Header from '../dashboard/_components/Header';
import { UserInputContext } from '../_context/UserInputcontext';

const CreateCourseLayout = ({children}: {children: ReactNode}) => {
  const [userCourseInput, setUserCourseInput] = useState([]);
  return (
    <div>
      <div>
        <UserInputContext.Provider value={{userCourseInput, setUserCourseInput}}>
          <>
        <Header></Header>
        {children}
          </>
        </UserInputContext.Provider>
      </div>
    </div>
  )
}

export default CreateCourseLayout
