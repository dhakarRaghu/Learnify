"use client"

import { db } from '@/configs/db';
import { CourseList } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import CourseBasicInfo from './_components/CourseBasicInfo';

function CourseLayout({ params }: { params: any }) {
    const {user} = useUser();
    const [course, setCourse] = useState<any>({});

  useEffect(() => {
    params && GetCourse();
  }, [params , user]);

  const GetCourse = async() => {
  const result = await db.select().from(CourseList)
    .where(and(eq(CourseList.courseId, params?.courseId),
    eq(CourseList?.createdBy, user?.primaryEmailAddress?.emailAddress || '')))

    setCourse(result[0]);
    console.log('reult[0]', result[0]);
    const typedResult = result as any[];
    console.log('reult[0]sdfasdf', typedResult[0]['courseOutput'][0]);
  }; 

  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
        <h2 className='font-bold text-center text-2xl'>Course Layout</h2>

        {/* Basic Info */}
        <CourseBasicInfo course={course} />

        {/* course detail */}


        {/* List of Lesson */}

    </div>
  );
}

export default CourseLayout;