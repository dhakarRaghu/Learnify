import { NextRequest, NextResponse } from 'next/server';
import {prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId');

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

    const quizzes = await prisma.quiz.findMany({
      where: { videoId: video.id },
      take: 5,
    });

    return NextResponse.json({ questions: quizzes }, { status: 200 });
  } catch (error) {
    console.error("Quiz Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}