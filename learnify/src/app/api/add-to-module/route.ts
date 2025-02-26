import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchVideoDetails = async (videoId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const data = await res.json();
  return data.items?.[0]?.snippet || null;
};

const fetchPlaylistItems = async (playlistId: string, limit: number = 50) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  let items: any[] = [];
  let nextPageToken = '';

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.items) items = items.concat(data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && items.length < limit);

  return items.slice(0, limit);
};

export async function POST(req: NextRequest) {
  const { userId, videoId, playlistId, moduleId, action } = await req.json();

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  // Check user credits (optional feature)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  let targetModule;

  // Handle module selection or creation
  if (action === 'new' || !moduleId) {
    targetModule = await prisma.videoModule.create({
      data: { name: `New Module ${new Date().toLocaleDateString()}`, userId },
    });
  } else if (action === 'existing' && moduleId) {
    targetModule = await prisma.videoModule.findUnique({ where: { id: moduleId } });
    if (!targetModule || targetModule.userId !== userId) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid action or moduleId' }, { status: 400 });
  }

  // Process single video
  if ((action === 'single' || action === 'new') && videoId) {
    const details = await fetchVideoDetails(videoId);
    if (!details) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    await prisma.video.upsert({
      where: { url: `https://www.youtube.com/watch?v=${videoId}` },
      update: { moduleId: targetModule.id },
      create: {
        name: details.title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        summary: details.description?.slice(0, 200),
        moduleId: targetModule.id,
      },
    });
  }

  // Process playlist
  if ((action === 'playlist' || (action === 'new' && playlistId)) && playlistId) {
    const playlistItems = await fetchPlaylistItems(playlistId);
    if (!playlistItems.length) {
      return NextResponse.json({ error: 'No videos in playlist' }, { status: 404 });
    }
    await prisma.video.createMany({
      data: playlistItems.map((item: any) => ({
        name: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        videoId: item.snippet.resourceId.videoId,
        summary: item.snippet.description?.slice(0, 200),
        moduleId: targetModule.id,
      })),
      skipDuplicates: true,
    });
  }

  // Optionally deduct credits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: user.credits - 1 },
  });

  return NextResponse.json({ module: targetModule }, { status: 201 });
}