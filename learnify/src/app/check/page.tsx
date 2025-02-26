import React from 'react';
import { PrismaClient } from '@prisma/client';
import VideoOptionsForm from '../../app/add/[...url]/VideoOptionForm';
import { fetchPlaylistItems, fetchVideoDetails } from '@/lib/getVideoDetail';

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ url: string[] }>;
  searchParams: Promise<Record<string, string>>;
}

// const fetchVideoDetails = async (videoId: string) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const response = await fetch(
//     `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
//   );
//   const data = await response.json();
//   return data.items?.[0]?.snippet || null;
// };

// const fetchPlaylistItems = async (playlistId: string, limit: number = 50) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   let items: any[] = [];
//   let nextPageToken = '';

//   do {
//     const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&key=${apiKey}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.items) items = items.concat(data.items);
//     nextPageToken = data.nextPageToken;
//   } while (nextPageToken && items.length < limit);

//   return items.slice(0, limit);
// };

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
  const { url } = await params;
  const queryParams = await searchParams;

  let protocol = decodeURIComponent(url[0]);
  const baseUrl = url.slice(1).join('/');
  const queryString = new URLSearchParams(queryParams).toString();
  if (protocol.endsWith(':')) protocol += '//';
  const fullUrl = `${protocol}${baseUrl}${queryString ? '?' + queryString : ''}`;

  const videoId = getYouTubeId(fullUrl);
  if (!videoId) return <div>Invalid YouTube URL provided.</div>;

  const videoDetails = await fetchVideoDetails(videoId);
  const playlistVideos = queryParams.list ? await fetchPlaylistItems(queryParams.list, 50) : null;



  const userId = 'cm7ltbgxy000075zz07dd8nm5'; // Replace with auth
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
      <p><strong>Video ID:</strong> {videoId}</p>
      {videoDetails ? (
        <div>
          <h2>{videoDetails.title}</h2>
          <p>{videoDetails.description}</p>
        </div>
      ) : (
        <p>No video details found.</p>
      )}
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
// import React from 'react';

// interface Props {
//   params: Promise<{ url: string[] }>; // Catch-all segments
//   searchParams: Promise<Record<string, string>>; // Query parameters
// }

// // Function to fetch video details (for a single video)
// const fetchVideoDetails = async (videoId: string) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const response = await fetch(
//     `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
//   );
//   const data = await response.json();
//   if (data.items && data.items.length > 0) {
//     return data.items[0].snippet; // Contains title, description, etc.
//   }
//   return null;
// };

// // Function to fetch all videos from a playlist (up to a given limit)
// const fetchPlaylistItems = async (playlistId: string, limit: number = 50) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   let items: any[] = [];
//   let nextPageToken = '';
  
//   do {
//     const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&key=${apiKey}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.items) {
//       items = items.concat(data.items);
//     }
//     nextPageToken = data.nextPageToken;
//   } while (nextPageToken && items.length < limit);
  
//   // Return only up to the requested limit
//   return items.slice(0, limit);
// };

// const YoutubeVideo = async (props: Props) => {
//   // Await both route params and query parameters
//   const { url } = await props.params;
//   const searchParams = await props.searchParams;

//   console.log("Received URL segments:", url);
//   console.log("Search Params:", searchParams);

//   // Reconstruct the full URL.
//   // Expecting url[0] to be the protocol (encoded) and the rest to be the base URL.
//   let protocol = decodeURIComponent(url[0]); // e.g. 'https:'
//   const baseUrl = url.slice(1).join('/'); // e.g. 'www.youtube.com/watch'
//   const queryString = new URLSearchParams(searchParams).toString(); // e.g. 'v=...&list=...'

//   // Fix protocol if it’s missing slashes (e.g., 'https:' should become 'https://')
//   if (protocol.endsWith(':')) {
//     protocol += '//';
//   }
//   const fullUrl = `${protocol}${baseUrl}${queryString ? '?' + queryString : ''}`;
//   console.log("Reconstructed URL:", fullUrl);

//   // Function to extract the YouTube video ID from a URL.
//   const getYouTubeId = (url: string): string | null => {
//     try {
//       const urlObj = new URL(url);
//       let videoId: string | null = null;

//       // For standard YouTube URLs (watch?v=VIDEO_ID)
//       if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
//         videoId = urlObj.searchParams.get('v');
//       }
//       // For shortened URLs (youtu.be/VIDEO_ID)
//       else if (urlObj.hostname.includes('youtu.be')) {
//         videoId = urlObj.pathname.split('/')[1];
//       }
//       // For embed URLs
//       else if (urlObj.pathname.includes('/embed/')) {
//         videoId = urlObj.pathname.split('/embed/')[1];
//       }

//       return videoId || null;
//     } catch (error) {
//       console.error("Invalid URL:", error);
//       return null;
//     }
//   };

//   // Extract the video ID from the reconstructed URL
//   const videoId = getYouTubeId(fullUrl);
//   console.log("Extracted Video ID:", videoId);
  
//   if (!videoId) {
//     return <div>Invalid YouTube URL provided.</div>;
//   }
  
//   // Fetch details for the individual video
//   const videoDetails = await fetchVideoDetails(videoId);

//   // If the URL has a playlist ID, fetch the playlist items
//   let playlistVideos: any[] | null = null;
//   if (searchParams.list) {
//     playlistVideos = await fetchPlaylistItems(searchParams.list, 50);
//     console.log(`Fetched ${playlistVideos.length} videos from playlist ${searchParams.list}`);
//   }

//   return (
//     <div>
//       <h1>YouTube Video Page</h1>
//       <p><strong>Full URL:</strong> {fullUrl}</p>
//       <p><strong>Video ID:</strong> {videoId}</p>
//       {videoDetails ? (
//         <div>
//           <h2>{videoDetails.title}</h2>
//           <p>{videoDetails.description}</p>
//         </div>
//       ) : (
//         <p>No video details found.</p>
//       )}
//       {playlistVideos && (
//         <div>
//           <h2>Playlist Videos (up to limit)</h2>
//           <ul>
//             {playlistVideos.map((item, index) => (
//               <li key={index}>
//                 <strong>{item.snippet.title}</strong> (Video ID: {item.snippet.resourceId.videoId})
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default YoutubeVideo;
