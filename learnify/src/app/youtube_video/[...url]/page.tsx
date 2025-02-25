import React from 'react';

interface Props {
  params: Promise<{ url: string[] }>; // Catch-all segments
  searchParams: Promise<Record<string, string>>; // Query parameters
}

const fetchVideoDetails = async (videoId: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY; // Store in .env
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].snippet; // Contains title, description, etc.
  }
  return null;
};

const YoutubeVideo = async (props: Props) => {
  const { url } = await props.params;
  const searchParams = await props.searchParams;

  console.log("Received URL segments:", url);
  console.log("Search Params:", searchParams);

  // Reconstruct the full URL
  let protocol = decodeURIComponent(url[0]); // 'https:'
  const baseUrl = url.slice(1).join('/'); // 'www.youtube.com/watch'
  const queryString = new URLSearchParams(searchParams).toString(); // 'v=ZWTauP2vQKw'

  // Fix protocol if it’s malformed (e.g., 'https:' → 'https://')
  if (protocol.endsWith(':')) {
    protocol += '//';
  }
  const fullUrl = `${protocol}${baseUrl}${queryString ? '?' + queryString : ''}`;
  console.log("Reconstructed URL:", fullUrl);

  // Function to extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      let videoId: string | null = null;

      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.split('/')[1];
      } else if (urlObj.pathname.includes('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1];
      }

      return videoId || null;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const videoId = getYouTubeId(fullUrl);
  console.log("Extracted Video ID:", videoId);
  
  if (!videoId) {
    return <div>Invalid YouTube URL provided.</div>;
  }
  const videoDetails = await fetchVideoDetails(videoId);

  return (
    <div>
      <h1>YouTube Video Page</h1>
      <p>Full URL: {fullUrl}</p>
      <p>Video ID: {videoId}</p>
      {videoDetails && (
        <div>
          <h2>{videoDetails.title}</h2>
          <p>{videoDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default YoutubeVideo;