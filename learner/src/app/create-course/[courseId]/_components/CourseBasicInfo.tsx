import React from 'react'

function CourseBasicInfo({ course }) {

    console.log("Course Data:", course?.courseOutput?.course?.name); 
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 '>
            <div>
                <h2>{course?.courseOutput?.course?.name || 'no name'}</h2>
            </div>
            <div>

            </div>
        </div>
    </div>
  )
}

export default CourseBasicInfo
