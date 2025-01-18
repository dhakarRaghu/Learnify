"use client";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HiClipboardDocumentCheck, HiLightBulb, HiMiniSquare3Stack3D } from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputcontext";
import { GenerateCourseLayout } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

const stepperOptions = [
  {
    id: 1,
    name: "Category",
    icon: <HiMiniSquare3Stack3D className="text-4xl md:text-5xl" />,
    content: "Choose a category for your course. This will help students find it easily.",
  },
  {
    id: 2,
    name: "Topic & Description",
    icon: <HiLightBulb className="text-4xl md:text-5xl" />,
    content: "Provide a title and description for your course. Make it engaging and detailed.",
  },
  {
    id: 3,
    name: "Options",
    icon: <HiClipboardDocumentCheck className="text-4xl md:text-5xl" />,
    content: "Configure your course options, such as pricing and publication settings.",
  },
];

const CreateCourse: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log("User Course Input:", userCourseInput);
  }, [userCourseInput]);

  const checkStatus = () => {
    if (!userCourseInput) return true;
    if (activeIndex === 0 && !userCourseInput.category) return true;
    if (activeIndex === 1 && !userCourseInput.topic) return true;
    if (
      activeIndex === 2 &&
      (!userCourseInput.Difficultylevel ||
        !userCourseInput.duration ||
        !userCourseInput.displayvideo ||
        userCourseInput.numberOfChapters == null)
    ) {
      return true;
    }
    return false;
  };

  const generateCourseLayout = async () => {
    setLoading(true);
    try {
      const BASIC_PROMPT = "Generate A Course Tutorial on the following details with fields: Course Name, Description, Chapter Name, About, and Duration.";
      const USER_INPUT_PROMPT = `
        Category: '${userCourseInput?.category || "Not Provided"}',
        Topic: '${userCourseInput?.topic || "Not Provided"}',
        Level: '${userCourseInput?.Difficultylevel || "Not Provided"}',
        Duration: '${userCourseInput?.duration || "Not Provided"}'
        NumberOfChapters: '${userCourseInput?.numberOfChapters || "Not Provided"}'
      `;
      const FINAL_PROMPT = `${BASIC_PROMPT} ${USER_INPUT_PROMPT} in JSON format`;
      console.log(FINAL_PROMPT);
      const result = await GenerateCourseLayout(FINAL_PROMPT);
      console.log("Result:", result);
      await saveCourseLayoutInDb(result);
    } catch (error) {
      console.error("Error generating course layout:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourseLayoutInDb = async (courseLayout: any) => {
    const id = uuidv4();
    try {
      const result = await db.insert(CourseList).values({
        courseId: id,
        name: userCourseInput?.topic || "Unknown Topic",
        level: userCourseInput?.Difficultylevel || "Unknown Level",
        category: userCourseInput?.category || "Unknown Category",
        courseOutput: courseLayout,
        createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown Email",
        userName: user?.fullName || "Unknown User",
        userProfileImage: user?.imageUrl || "",
      });
      console.log("Course Layout Saved in DB:", result);
    } catch (error) {
      console.error("Error saving course layout:", error);
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Create Your Course</h1>
          <p className="text-lg text-muted-foreground">
            Follow the steps below to create an amazing course for your audience!
          </p>
        </header>

        <nav className="flex justify-center items-center mb-12" aria-label="Course creation progress">
          {stepperOptions.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full p-4 md:p-6 shadow-lg transition-colors ${
                    activeIndex === index
                      ? "bg-primary text-primary-foreground"
                      : activeIndex > index
                      ? "bg-primary/60 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  aria-current={activeIndex === index ? "step" : undefined}
                >
                  {item.icon}
                </div>
                <h2 className="sr-only md:not-sr-only md:text-sm font-medium mt-2 text-foreground">{item.name}</h2>
              </div>
              {index < stepperOptions.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 md:w-24 md:mx-4 transition-colors ${
                    activeIndex > index ? "bg-primary" : "bg-muted"
                  }`}
                  aria-hidden="true"
                ></div>
              )}
            </React.Fragment>
          ))}
        </nav>

        <section className="mb-12">
          {activeIndex === 0 && <SelectCategory />}
          {activeIndex === 1 && <TopicDescription />}
          {activeIndex === 2 && <SelectOption />}
        </section>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            variant="outline"
            className="px-6 py-2 text-base"
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (activeIndex === stepperOptions.length - 1) {
                generateCourseLayout();
              } else {
                setActiveIndex((prev) => prev + 1);
              }
            }}
            disabled={checkStatus()}
            variant="default"
            className="px-6 py-2 text-base"
          >
            {activeIndex === stepperOptions.length - 1 ? "Generate Course" : "Next"}
          </Button>
        </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  );
};

export default CreateCourse;

