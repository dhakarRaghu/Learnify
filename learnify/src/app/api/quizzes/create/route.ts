import { NextRequest, NextResponse } from 'next/server';

import { YoutubeTranscript } from 'youtube-transcript';
import { strict_output } from '@/lib/gemini';
import {prisma } from '@/lib/db';

async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    console.error("Transcript Error:", error);
    return "";
  }
}

async function getQuestionsFromTranscript(transcript: string, videoTitle: string) {
  const questions = await strict_output(
    "You are a helpful AI that generates MCQ questions and answers, each answer max 15 words",
    new Array(5).fill(
      `Generate a random hard MCQ question about ${videoTitle} using this transcript: ${transcript}`
    ),
    {
      question: "question",
      answer: "answer with max length of 15 words",
      options: ["option1 with max 15 words", "option2 with max 15 words", "option3 with max 15 words"],
    }
  );
  return questions.map((q: any) => ({
    question: q.question,
    answer: q.answer,
    options: [q.answer, q.option1, q.option2, q.option3].sort(() => Math.random() - 0.5),
  }));
}

export async function POST(req: NextRequest) {
  const { videoId } = await req.json();

  if (!videoId) {
    return NextResponse.json({ error: 'videoId (YouTube ID) is required' }, { status: 400 });
  }

  try {
    const video = await prisma.video.findFirst({
      where: { videoId },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found in database' }, { status: 404 });
    }

    // Check for existing quizzes
    const existingQuizzes = await prisma.quiz.findMany({
      where: { videoId: video.id },
      take: 5,
    });

    if (existingQuizzes.length >= 5) {
      return NextResponse.json({ questions: existingQuizzes }, { status: 200 });
    }

    const transcript = await getTranscript(videoId);
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 400 });
    }

    const generatedQuestions = await getQuestionsFromTranscript(transcript, "Video Quiz");

    // Delete existing quizzes to ensure only 5 are stored
    await prisma.quiz.deleteMany({
      where: { videoId: video.id },
    });

    await prisma.quiz.createMany({
      data: generatedQuestions.map((q) => ({
        videoId: video.id,
        question: q.question,
        answer: q.answer,
        options: JSON.stringify(q.options),
      })),
    });

    const quizzes = await prisma.quiz.findMany({
      where: { videoId: video.id },
      take: 5, // Ensure only 5 are returned
    });

    return NextResponse.json({ questions: quizzes }, { status: 201 });
  } catch (error) {
    console.error("Quiz Creation Error:", error);
    return NextResponse.json({ error: 'Failed to generate quizzes' }, { status: 500 });
  }
}