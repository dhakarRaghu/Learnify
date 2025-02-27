"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VideoQuizCard from "./VideoQuizCard";

import { Share2 } from "lucide-react";



export function ShareButton({ moduleId }: { moduleId: string }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/video-modules/${moduleId}`);
  }, [moduleId]);

  const share = () =>
    navigator.clipboard.writeText(shareUrl).then(() => alert("Link copied!"));

  return (
    <Button variant="outline" onClick={share}>
      Share
    </Button>
  );
}


interface QuizButtonProps {
  videoId: string;
}

export default function QuizButton({ videoId }: QuizButtonProps) {
  console.log("videoId", videoId);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <>
      <Button onClick={() => setShowQuiz(true)} disabled={!videoId}>
        Quiz
      </Button>
      {showQuiz && <VideoQuizCard videoId={videoId} onClose={() => setShowQuiz(false)} />}
    </>
  );
}

interface SummaryButtonProps {
  videoId: string;
  summary?: string  | null;
}

export function SummaryButton({ videoId, summary }: SummaryButtonProps) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <>
      <Button onClick={() => setShowSummary((prev) => !prev)} disabled={!videoId}>
        {showSummary ? "Hide Summary" : "Show Summary"}
      </Button>
      {showSummary && (
        <p className="mt-2 text-sm text-muted-foreground w-full">
          {summary || "No summary available."}
        </p>
      )}
    </>
  );
}