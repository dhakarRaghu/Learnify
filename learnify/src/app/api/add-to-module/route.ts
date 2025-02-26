import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${
      nextPageToken ? `&pageToken=${nextPageToken}` : ''
    }&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.items) items = items.concat(data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && items.length < limit);

  return items.slice(0, limit);
};

export async function POST(req: NextRequest) {
  const { userId, videoId, playlistId, moduleId, action, newModuleName } = await req.json();
  console.log("userId:", userId , "videoId:", videoId, "playlistId:", playlistId, "moduleId:", moduleId, "action:", action, "newModuleName:", newModuleName);

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  // Check user exists and has enough credits
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  let targetModule;
  if (action === 'new') {
    // Create a new module for the user
    targetModule = await prisma.videoModule.create({
      data: { name: newModuleName || `New Module ${new Date().toLocaleDateString()}`, userId },
    });
  } else if (action === 'existing') {
    // Use an existing module – moduleId must be provided
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId required for existing module' }, { status: 400 });
    }
    targetModule = await prisma.videoModule.findUnique({ where: { id: moduleId } });
    if (!targetModule || targetModule.userId !== userId) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
console.log('targetModule:', targetModule.name);

  // Handle single video addition
  if (videoId && !playlistId) {
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
  // Handle playlist addition
  else if (playlistId) {
    const playlistItems = await fetchPlaylistItems(playlistId);
    if (!playlistItems.length) {
      return NextResponse.json({ error: 'No videos in playlist' }, { status: 404 });
    }
    
    // Extract video IDs from the playlist items
    const playlistVideoIds = playlistItems.map(
      (item: any) => item.snippet.resourceId.videoId
    );
    
    // Fetch videos already present in this module (based on videoId)
    const existingVideos = await prisma.video.findMany({
      where: {
        moduleId: targetModule.id,
        videoId: { in: playlistVideoIds },
      },
      select: { videoId: true },
    });
    const existingVideoIds = existingVideos.map(v => v.videoId);

    console.log('Existing video IDs:', existingVideoIds);

    // Filter out videos that already exist in the module
    const newVideosData = playlistItems
      .filter((item: any) => !existingVideoIds.includes(item.snippet.resourceId.videoId))
      .map((item: any) => ({
        name: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        videoId: item.snippet.resourceId.videoId,
        summary: item.snippet.description?.slice(0, 200),
        moduleId: targetModule.id,
      }));

    if (newVideosData.length > 0) {
      await prisma.video.createMany({
        data: newVideosData,
        skipDuplicates: true,
      });
    }
  } else {
    return NextResponse.json({ error: 'Either videoId or playlistId is required' }, { status: 400 });
  }

  // Deduct one credit from the user
  await prisma.user.update({
    where: { id: userId },
    data: { credits: user.credits - 1 },  // deduct more credits for multiple video or playlists
  });

  return NextResponse.json({ module: targetModule }, { status: 201 });
}
