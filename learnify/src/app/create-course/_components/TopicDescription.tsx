import { UserInputContext } from '@/app/_context/UserInputcontext';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext } from 'react'

const TopicDescription = () => {

  const {userCourseInput , setUserCourseInput} = useContext(UserInputContext);

  const handleTopicChange = (fieldName, value) => {
    setUserCourseInput((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10">
      {/* Topic Input */}
      <div className="mb-6">
        <label className="font-medium text-gray-700 mb-2 block">
          Write the topic for which you want to generate a course (e.g., Python Course, Yoga, etc.):
        </label>
        <Input placeholder={'Topic'} className="h-14 text-xl" 
        defaultValue={userCourseInput?.topic}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTopicChange('topic', e.target.value)} 
        />
      </div>

      {/* Course Description */}
      <div className="mt-6">
        <label className="font-medium text-gray-700 mb-2 block">
          Tell us more about your course, what you want to include in the course:
        </label>
        <Textarea placeholder="About your course" className="w-full" 
        defaultValue={userCourseInput?.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTopicChange('description', e.target.value)} />
      </div>
    </div>
  )
}

export default TopicDescription
