import { PrismaClient } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import VideoDropdown from "./VideoDropdown";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "@/components/UserAccountNav";
import SignInButton from "@/components/SignInButton";

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ videoIndex?: string }>;
}

export default async function VideoModulePage({ params, searchParams }: Props) {
  const session = await getAuthSession();
  const { moduleId } = await params;
  const { videoIndex: videoIndexParam } = await searchParams;
  const userId = "cm7ltbgxy000075zz07dd8nm5"; // Replace with auth

  const modules = await prisma.videoModule.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  const currentModule = await prisma.videoModule.findUnique({
    where: { id: moduleId },
    include: { videos: true },
  });

  if (!currentModule) {
    notFound();
  }

  const currentVideoIndex = Number.parseInt(videoIndexParam || "0", 10) || 0;
  const currentVideo = currentModule.videos[currentVideoIndex];
  const prevVideo = currentModule.videos[currentVideoIndex - 1];
  const nextVideo = currentModule.videos[currentVideoIndex + 1];

  const links = modules.map((module) => ({
    label: module.name,
    href: `/video-modules/${module.id}`,
    icon: (
      <div className="h-5 w-5 rounded-md bg-muted flex items-center justify-center text-xs flex-shrink-0">
        {module.name.slice(0, 3).toUpperCase()}
      </div>
    ),
  }));

  return (
    <div className="flex h-screen w-full flex-1 bg-background">
      <Sidebar className="w-16 hover:w-56 transition-all duration-300 ease-in-out group">
        <SidebarBody className="flex flex-col justify-between gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <Logo />
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 px-1">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(
                      currentModule.id === link.href.split('/')[2] && 'bg-gray-100 dark:bg-neutral-800'
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="px-1">
            <Separator className="mb-3" />
            <div className="flex items-center gap-2">
              {session?.user ? (
                <UserAccountNav user={session.user} />
              ) : (
                <SignInButton />
              )}
              <span className="hidden group-hover:block text-sm truncate">{session?.user.name}</span>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="border-b px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-semibold truncate">{currentModule.name}</h1>
          <VideoDropdown
            videos={currentModule.videos}
            moduleId={moduleId}
            currentVideoIndex={currentVideoIndex}
          />
        </header>
        <div className="flex-1 overflow-y-auto">
          {currentVideo ? (
            <div className="h-full flex flex-col">
              <div className="relative w-full" style={{ paddingBottom: '39.375%' /* 16:9 adjusted */ }}>
                <iframe
                  width="70%"
                  height="70%"
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                  title={currentVideo.name || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 h-full w-full rounded-md"
                />
              </div>
              <div className="p-4 flex-1">
                <h2 className="mb-3 text-lg font-semibold">{currentVideo.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentVideo.summary || "No summary available."}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  {prevVideo ? (
                    <Link
                      href={`/video-modules/${moduleId}?videoIndex=${currentVideoIndex - 1}`}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-xs">Previous</span>
                        <span className="line-clamp-1 font-medium">{prevVideo.name}</span>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextVideo && (
                    <Link
                      href={`/video-modules/${moduleId}?videoIndex=${currentVideoIndex + 1}`}
                      className="flex items-center gap-1 text-right text-sm text-muted-foreground hover:text-primary"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs">Next</span>
                        <span className="line-clamp-1 font-medium">{nextVideo.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No videos in this module.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 px-1 py-1 text-sm font-medium">
    <div className="h-7 w-12 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
      LEARN
    </div>
    <span className="hidden group-hover:block">Learnify</span>
  </Link>
);