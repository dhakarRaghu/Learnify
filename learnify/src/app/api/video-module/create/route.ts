import { NextRequest, NextResponse } from 'next/server';
import {prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { url, userId } = await req.json();

  if (!url || !userId) {
    return NextResponse.json({ error: 'URL and userId are required' }, { status: 400 });
  }

  // Basic YouTube URL validation (simplified for demo)
  const videoIdMatch = url.match(/(?:v=)([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }

  const module = await prisma.videoModule.create({
    data: {
      name: `Module from URL: ${videoId.slice(0, 8)}`, // Truncate for brevity
      userId,
      videos: {
        create: {
          url,
          videoId,
          name: `Video ${videoId.slice(0, 8)}`, // Placeholder name
        },
      },
    },
  });

  return NextResponse.json({ moduleId: module.id }, { status: 201 });
}