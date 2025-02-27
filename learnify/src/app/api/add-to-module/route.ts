import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTranscript } from '@/lib/youtube';

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

// Utility to truncate text to 300 words
const truncateTo300Words = (text: string) => {
  const words = text.split(/\s+/).slice(0, 300);
  return words.join(" ") + (words.length < text.split(/\s+/).length ? "..." : "");
};

export async function POST(req: NextRequest) {
  const { userId, videoId, playlistId, moduleId, action, newModuleName } = await req.json();
  console.log("userId:", userId, "videoId:", videoId, "playlistId:", playlistId, "moduleId:", moduleId, "action:", action, "newModuleName:", newModuleName);

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  let targetModule;
  if (action === 'new') {
    targetModule = await prisma.videoModule.create({
      data: { name: newModuleName || `New Module ${new Date().toLocaleDateString()}`, userId },
    });
  } else if (action === 'existing') {
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

  if (videoId && !playlistId) {
    const details = await fetchVideoDetails(videoId);
    if (!details) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    const transcript = await getTranscript(videoId);
    const summary = transcript ? truncateTo300Words(transcript) : details.description?.slice(0, 200) || "No summary available.";

// First, try to find an existing video in this module with the same videoId
const existingVideo = await prisma.video.findFirst({
  where: {
    moduleId: targetModule.id,
    videoId: videoId,
  },
});

if (existingVideo) {
  // Optionally update it if needed:
  await prisma.video.update({
    where: { id: existingVideo.id },
    data: { moduleId: targetModule.id }, // update other fields if necessary
  });
} else {
  // Otherwise, create a new video record.
  await prisma.video.create({
    data: {
      name: details.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
      summary,
      moduleId: targetModule.id,
    },
  });
}   
  } else if (playlistId) {
    const playlistItems = await fetchPlaylistItems(playlistId);
    if (!playlistItems.length) {
      return NextResponse.json({ error: 'No videos in playlist' }, { status: 404 });
    }

    const playlistVideoIds = playlistItems.map((item: any) => item.snippet.resourceId.videoId);
    const existingVideos = await prisma.video.findMany({
      where: {
        moduleId: targetModule.id,
        videoId: { in: playlistVideoIds },
      },
      select: { videoId: true },
    });
    const existingVideoIds = existingVideos.map(v => v.videoId);

    console.log('Existing video IDs:', existingVideoIds);

    const newVideosData = await Promise.all(
      playlistItems
        .filter((item: any) => !existingVideoIds.includes(item.snippet.resourceId.videoId))
        .map(async (item: any) => {
          const transcript = await getTranscript(item.snippet.resourceId.videoId);
          const summary = transcript ? truncateTo300Words(transcript) : item.snippet.description?.slice(0, 200) || "No summary available.";
          return {
            name: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            videoId: item.snippet.resourceId.videoId,
            summary,
            moduleId: targetModule.id,
          };
        })
    );

    if (newVideosData.length > 0) {
      await prisma.video.createMany({
        data: newVideosData,
        skipDuplicates: true,
      });
    }
  } else {
    return NextResponse.json({ error: 'Either videoId or playlistId is required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits: user.credits - 1 },
  });

  return NextResponse.json({ module: targetModule }, { status: 201 });
}