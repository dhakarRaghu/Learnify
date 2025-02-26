import React from 'react';
import VideoOptionsForm from './VideoOptionForm';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

interface Props {
  params: Promise<{ url: string[] }>;
  searchParams: Promise<Record<string, string>>;
}

const getYouTubeId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.searchParams.get('v') ||
      (urlObj.hostname.includes('youtu.be') ? urlObj.pathname.split('/')[1] : null) ||
      (urlObj.pathname.includes('/embed/') ? urlObj.pathname.split('/embed/')[1] : null)
    );
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export default async function YoutubeVideo({ params, searchParams }: Props) {
  const session = await getAuthSession();
  if (!session) redirect('/login');
  const { url } = await params;
  const queryParams = await searchParams;

  let protocol = decodeURIComponent(url[0]);
  const baseUrl = url.slice(1).join('/');
  const queryString = new URLSearchParams(queryParams).toString();
  if (protocol.endsWith(':')) protocol += '//';
  const fullUrl = `${protocol}${baseUrl}${queryString ? '?' + queryString : ''}`;

  const videoId = getYouTubeId(fullUrl);
  if (!videoId) return <div>Invalid YouTube URL provided.</div>;

  const userId = session.user.id;
  console.log("User ID:", userId);
  const modules = await prisma.videoModule.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  return (
    <div>
       <VideoOptionsForm
        videoId={videoId}
        playlistId={queryParams.list || null}
        userId={userId}
        modules={modules}
      />
      <h1>YouTube Video Page</h1>
      <p><strong>Full URL:</strong> {fullUrl}</p>
      {/* <p><strong>Video ID:</strong> {videoId}</p> */}
      {/* {videoDetails ? (
        <div>
          <h2>{videoDetails.title}</h2>
          <p>{videoDetails.description}</p>
        </div>
      ) : (
        <p>No video details found.</p>
      )} */}
      {/* {playlistVideos && (
        <div>
          <h2>Playlist Videos (up to 50)</h2>
          <ul>
            {playlistVideos.map((item, index) => (
              <li key={index}>
                <strong>{item.snippet.title}</strong> (Video ID: {item.snippet.resourceId.videoId})
              </li>
            ))}
          </ul>
        </div>
      )} */}
     
    </div>
  );
}
