"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type Question = {
  id?: string;
  question: string;
  answer: string;
  options: string; // JSON string from Prisma
};

type Props = {
  videoId: string;
  onClose: () => void;
};

const VideoQuizCard = ({ videoId, onClose }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionState, setQuestionState] = useState<Record<string, boolean | null>>({});
  const { toast } = useToast();
  // Fetch existing quizzes
  const { data: existingQuizzes, isLoading: isFetching } = useQuery({
    queryKey: ['quizzes', videoId],
    queryFn: async () => {
      const response = await axios.get<{ questions: Question[] }>(`/api/quizzes?videoId=${videoId}`);
      console.log("Fetched Quizzes:", response.data);
      return response.data.questions;
    },
    staleTime: Infinity, // Keep cached indefinitely unless invalidated
  });

  // Generate new quizzes if none exist
  const { mutate: generateQuizzes, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const response = await axios.post<{ questions: Question[] }>("/api/quizzes/create", {
        videoId,
      });
      console.log("Generated Quizzes:", response.data);
      return response.data.questions;
    },
    onSuccess: (fetchedQuestions) => {
      setQuestions(fetchedQuestions);
      toast({
        title: "Success",
        description: "Quizzes generated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Quiz Generation Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quizzes",
        variant: "destructive",
      });
    },
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (existingQuizzes && existingQuizzes.length > 0) {
      setQuestions(existingQuizzes);
    } else {
      generateQuizzes();
    }
  }, [existingQuizzes, generateQuizzes]);

  const checkAnswer = () => {
    const newQuestionState = { ...questionState };
    questions.forEach((question) => {
      const userAnswer = answers[question.id || question.question];
      if (!userAnswer) return;
      newQuestionState[question.id || question.question] = userAnswer === question.answer;
    });
    setQuestionState(newQuestionState);
  };

  if (isFetching || isGenerating) {
    return <div className="flex h-full items-center justify-center">Loading quizzes...</div>;
  }

  if (!questions.length) {
    return <div className="flex h-full items-center justify-center">No quizzes available.</div>;
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-1/3 bg-white dark:bg-neutral-900 p-6 shadow-lg z-50 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Video Quiz</h1>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="space-y-4">
        {questions.map((question, index) => {
          let options: string[];
          try {
            options = JSON.parse(question.options);
            if (!Array.isArray(options)) throw new Error("Parsed options is not an array");
          } catch (error) {
            console.error("Error parsing options:", error, "Question:", question);
            options = [question.answer]; // Fallback to just the answer
          }

          const validOptions = options.filter(opt => opt !== null && typeof opt === "string");

          return (
            <div
              key={question.id || index}
              className={cn("p-3 border border-secondary rounded-lg", {
                "bg-green-700": questionState[question.id || question.question] === true,
                "bg-red-700": questionState[question.id || question.question] === false,
                "bg-secondary": questionState[question.id || question.question] === null,
              })}
            >
              <h2 className="text-lg font-semibold">{question.question}</h2>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(value) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id || question.question]: value,
                    }))
                  }
                >
                  {validOptions.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${question.id || index}-${optIndex}`}
                      />
                      <Label htmlFor={`${question.id || index}-${optIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
        <Button className="w-full mt-2" size="lg" onClick={checkAnswer}>
          Check Answers
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VideoQuizCard;