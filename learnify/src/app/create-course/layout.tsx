import React from 'react'

import { ReactNode } from 'react';
import Header from '../dashboard/_components/Header';

const CreateCourseLayout = ({children}: {children: ReactNode}) => {
  return (
    <div>
      <div>
        <Header></Header>
        {children}
      </div>
    </div>
  )
}

export default CreateCourseLayout
