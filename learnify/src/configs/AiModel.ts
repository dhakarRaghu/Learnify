import { text } from "stream/consumers";

import {GoogleGenerativeAI} from '@google/generative-ai';

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  
  const model = genAI.getGenerativeModel({
   model : 'gemini-1.5-flash'
  });
  
  // const generationConfig = {
  //   temperature: 1,
  //   topP: 0.95,
  //   topK: 40,
  //   maxOutputTokens: 8192,
  //   responseMimeType: "application/json",
  // };
  

 export const GenerateCourseLayout = async (prompt : string) => {
  try {
    const response = await model.generateContent(prompt);
    const summary = response.response.text();
    return summary.trim() === "" ? "No Content available" : summary;
  }
  catch (error) {
    console.error("Error:", error);

  }
    };
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
