"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { HiClipboardDocumentCheck, HiLightBulb, HiMiniSquare3Stack3D } from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputcontext";

const CreateCourse = () => {
  const StepperOption = [
    {
      id: 1,
      name: "Category",
      icon: <HiMiniSquare3Stack3D className="text-5xl" />,
      content: "Choose a category for your course. This will help students find it easily.",
    },
    {
      id: 2,
      name: "Topic & Description",
      icon: <HiLightBulb className="text-5xl" />,
      content: "Provide a title and description for your course. Make it engaging and detailed.",
    },
    {
      id: 3,
      name: "Options",
      icon: <HiClipboardDocumentCheck className="text-5xl" />,
      content: "Configure your course options, such as pricing and publication settings.",
    },
  ];

  const { userCourseInput,setUserCourseInput } = useContext(UserInputContext);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log("User Course Input:", userCourseInput);
  }, [userCourseInput]);

  const checkStatus=() =>{
    if(userCourseInput?.length==0) return true;
    if(activeIndex == 0 && (userCourseInput?.category?.length==0 || userCourseInput?.category ==undefined)) return true;
    if(activeIndex == 1 && (userCourseInput?.topic?.length==0 || userCourseInput?.topic ==undefined)) return true;
    if (
      activeIndex === 2 &&
      (
        !userCourseInput?.Difficultylevel ||
        !userCourseInput?.duration ||
        !userCourseInput?.displayvideo ||
        userCourseInput?.numberOfChapters == null
      )
    ) {
      return true;
    }return false;
  }


  return (
    <div className="bg-gray-50 min-h-screen p-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-16">
        <h1 className="text-5xl font-extrabold text-primary mb-6">Create Your Course</h1>
        <p className="text-lg text-gray-500 text-center">
          Follow the steps below to create an amazing course for your audience!
        </p>
      </div>

      {/* Stepper Section */}
      <div className="flex justify-center items-center mb-20">
        {StepperOption.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {/* Step Icon and Name */}
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full p-6 shadow-lg ${
                  activeIndex === index
                    ? "bg-blue-600 text-white"
                    : activeIndex > index
                    ? "bg-blue-300 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.icon}
              </div>
              <h2 className="hidden md:block md:text-lg font-medium mt-4 text-gray-800">{item.name}</h2>
            </div>
            {/* Connector Line */}
            {index < StepperOption.length - 1 && (
              <div
                className={`w-20 h-1 mx-4 md:w-28 ${
                  activeIndex > index ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Content Section */}
      <div >
        {activeIndex==0 ? <SelectCategory /> :
         activeIndex==1 ?<TopicDescription/>:
         activeIndex==2 ?<SelectOption/>: null
       }
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mt-16">
        {/* Previous Button */}
        <Button
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          className={`px-8 py-3 text-lg rounded-lg transition ${
            activeIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          Previous
        </Button>

        {/* Next or Generate Course Button */}
        <Button disabled={checkStatus()}
          onClick={() => {
            if (activeIndex === StepperOption.length - 1) {
              console.log("Generating Course..."); // Add your logic here
            } else {
              setActiveIndex((prev) => prev + 1);
            }
          }}
          className={`px-8 py-3 text-lg rounded-lg transition ${
            activeIndex === StepperOption.length - 1
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {activeIndex === StepperOption.length - 1 ? "Generate Course" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default CreateCourse;
