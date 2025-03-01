import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gemini";

interface VideoRanking {
  videoId: string;
  viewCount: number;
  subscriberCount: number;
  title: string;
  description: string;
  transcriptSnippet?: string;
}

interface VideoPrefs {
  prioritize?: "views" | "subscribers" | "balanced";
  minViews?: number;
  minSubscribers?: number;
  duration?: "short" | "medium" | "long" | "any";
}

// Fetch video and channel details for ranking
async function fetchVideoAndChannelDetails(videoIds: string[]): Promise<VideoRanking[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YouTube API key not configured");

  try {
    const videoRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,snippet&id=${videoIds.join(",")}`
    );
    const videos = videoRes.data.items || [];
    const channelIds = videos.map((video: any) => video.snippet.channelId);

    const channelRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&part=statistics&id=${channelIds.join(",")}`
    );
    const channels = channelRes.data.items || [];

    const channelSubscribers = new Map(
      channels.map((channel: any) => [
        channel.id,
        parseInt(channel.statistics.subscriberCount || "0", 10),
      ])
    );

    const rankedVideos = await Promise.all(
      videos.map(async (video: any) => {
        const transcript = await getTranscriptSnippet(video.id);
        return {
          videoId: video.id,
          viewCount: parseInt(video.statistics.viewCount || "0", 10),
          subscriberCount: channelSubscribers.get(video.snippet.channelId) || 0,
          title: video.snippet.title,
          description: video.snippet.description || "",
          transcriptSnippet: transcript,
        };
      })
    );

    return rankedVideos;
  } catch (error) {
    console.error("Failed to fetch video/channel details:", error);
    return [];
  }
}

// Fetch a snippet of the transcript for relevance checking
async function getTranscriptSnippet(videoId: string): Promise<string> {
  try {
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
    return transcriptArr.slice(0, 10).map(t => t.text).join(" ") || "";
  } catch {
    return "";
  }
}

export async function searchYoutube(
  searchQuery: string,
  prefs: VideoPrefs = { prioritize: "balanced", duration: "medium", minViews: 10000, minSubscribers: 5000 }
): Promise<string | null> {
  searchQuery = encodeURIComponent(searchQuery + " educational tutorial");
  const durationFilter = prefs.duration || "medium";

  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=${durationFilter}&videoEmbeddable=true&type=video&maxResults=15&order=relevance&relevanceLanguage=en&videoDefinition=high`
    );

    if (!data || !data.items || data.items.length === 0) {
      console.log("No YouTube results found for:", searchQuery);
      return null;
    }

    const videoIds = data.items.map((item: any) => item.id.videoId).filter(Boolean);
    if (!videoIds.length) return null;

    const rankedVideos = await fetchVideoAndChannelDetails(videoIds);
    if (!rankedVideos.length) return null;

    let filteredVideos = rankedVideos.filter(
      v => (prefs.minViews ? v.viewCount >= prefs.minViews : true) &&
           (prefs.minSubscribers ? v.subscriberCount >= prefs.minSubscribers : true) &&
           (v.transcriptSnippet || v.description) // Ensure content exists
    );

    if (!filteredVideos.length) {
      console.log("No videos meet criteria for:", searchQuery);
      return null;
    }

    const sortFn = {
      views: (a: VideoRanking, b: VideoRanking) => b.viewCount - a.viewCount,
      subscribers: (a: VideoRanking, b: VideoRanking) => b.subscriberCount - a.subscriberCount,
      balanced: (a: VideoRanking, b: VideoRanking) =>
        b.viewCount * 0.7 + b.subscriberCount * 0.3 - (a.viewCount * 0.7 + a.subscriberCount * 0.3),
    }[prefs.prioritize || "balanced"];

    const bestVideo = filteredVideos.sort(sortFn)[0];
    console.log(
      `Selected: "${bestVideo.title}" (Views: ${bestVideo.viewCount}, Subs: ${bestVideo.subscriberCount})`
    );
    return bestVideo.videoId;
  } catch (error) {
    console.error("YouTube search failed:", error);
    return null;
  }
}

export async function getTranscript(videoId: string): Promise<string> {
  try {
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
    if (!transcriptArr || transcriptArr.length === 0) throw new Error("No transcript available");
    return transcriptArr.map(t => t.text).join(" ").replaceAll("\n", "").trim();
  } catch (error) {
    console.log(`Transcript fetch failed for ${videoId}:`, error);
    const details = await fetchVideoDetails(videoId);
    return details?.description.slice(0, 500) + (details?.description.length > 500 ? "..." : "") || "";
  }
}

export async function getQuestionsFromTranscript(transcript: string, courseTitle: string) {
  if (transcript.length < 100) {
    console.log("Transcript too short:", transcript.length);
    return [];
  }

  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };

  try {
    const questions: Question[] = await strict_output(
      "You are an AI generating diverse, high-quality MCQs from transcripts",
      new Array(5).fill(
        `Generate a unique, challenging MCQ about "${courseTitle}" using this transcript: ${transcript.slice(0, 2000)}. Ensure relevance and avoid repetition.`
      ),
      {
        question: "question",
        answer: "answer with max length of 15 words",
        option1: "option1 with max length of 15 words",
        option2: "option2 with max length of 15 words",
        option3: "option3 with max length of 15 words",
      }
    );

    const uniqueQuestions = questions
      .filter((q, i, self) => q.question && self.findIndex(t => t.question === q.question) === i)
      .slice(0, 5);
    return uniqueQuestions;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [];
  }
}

async function fetchVideoDetails(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet&id=${videoId}`
    );
    const data = await res.json();
    return data.items?.[0]?.snippet || null;
  } catch (error) {
    console.error("Failed to fetch video details:", error);
    return null;
  }
}
// import axios from "axios";
// import { YoutubeTranscript } from "youtube-transcript";
// import { strict_output } from "./gemini";

// export async function searchYoutube(searchQuery: string) {
//   // hello world => hello+world
//   searchQuery = encodeURIComponent(searchQuery);
//   const { data } = await axios.get(
//     `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
//   );
//   if (!data) {
//     // console.log("youtube fail");
//     return null;
//   }
//   if (data.items[0] == undefined) {
//     // console.log("youtube fail");
//     return null;
//   }
//   return data.items[0].id.videoId;
// }

// export async function getTranscript(videoId: string) {
//   try {
//     let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
//       lang: "en",
//     //   country: "EN",
//     });
//     let transcript = "";
//     for (let t of transcript_arr) {
//       transcript += t.text + " ";
//     }
//     return transcript.replaceAll("\n", "");
//   } catch (error) {
//     return "";
//   }
// }

// export async function getQuestionsFromTranscript(
//   transcript: string,
//   course_title: string
// ) {
//   type Question = {
//     question: string;
//     answer: string;
//     option1: string;
//     option2: string;
//     option3: string;
//   };
//   const questions: Question[] = await strict_output(
//     "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words",
//     new Array(5).fill(
//       `You are to generate a random hard mcq question about ${course_title} with context of the following transcript: ${transcript}`
//     ),
//     {
//       question: "question",
//       answer: "answer with max length of 15 words",
//       option1: "option1 with max length of 15 words",
//       option2: "option2 with max length of 15 words",
//       option3: "option3 with max length of 15 words",
//     }
//   );
//   return questions;
// }