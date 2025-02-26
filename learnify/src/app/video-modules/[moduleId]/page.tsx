import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ moduleId: string }>;
}

export default async function VideoModulePage({ params }: Props) {
  const { moduleId } = await params;
  const module = await prisma.videoModule.findUnique({
    where: { id: moduleId },
    include: { videos: true },
  });

  if (!module) return <div>Module not found</div>;

  return (
    <div>
      <h1>{module.name}</h1>
      <h2>Videos</h2>
      <ul>
        {module.videos.map((video) => (
          <li key={video.id}>
            <strong>{video.name}</strong> - <a href={video.url}>{video.videoId}</a>
            <p>{video.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}