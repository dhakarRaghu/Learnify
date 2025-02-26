import { prisma } from "@/lib/db";
import { YoutubeTranscript } from "youtube-transcript";

interface Props {
  params: Promise<{ moduleId: string }>;
}

async function fetchTranscriptText(videoId: string): Promise<string> {
  try {
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    let transcript = "";
    for (const segment of transcriptArr) {
      transcript += segment.text + " ";
    }
    return transcript.replace(/\n/g, "").trim();
  } catch (error) {
    return "Transcript not available";
  }
}

export default async function VideoModulePage({ params }: Props) {
  const { moduleId } = await params;
  const videoModule = await prisma.videoModule.findUnique({
    where: { id: moduleId },
    include: { videos: true },
  });

  if (!videoModule) return <div>Module not found</div>;

  // Fetch transcript for each video in parallel using fetchTranscriptText
  const transcripts = await Promise.all(
    videoModule.videos.map(async (video) => {
      const transcript = await fetchTranscriptText(video.videoId);
      return { videoId: video.videoId, transcript };
    })
  );

  // Create a mapping from videoId to its transcript for easy lookup
  const transcriptMap = transcripts.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.videoId] = curr.transcript;
    return acc;
  }, {});

  return (
    <div>
      <h1>{videoModule.name}</h1>
      <h2>Videos</h2>
      <ul>
        {videoModule.videos.map((video) => (
          <li key={video.id}>
            <strong>{video.name}</strong> -{" "}
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              {video.videoId}
            </a>
            <p>{video.summary}</p>
            <h3>Transcript</h3>
            <p>{transcriptMap[video.videoId]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
