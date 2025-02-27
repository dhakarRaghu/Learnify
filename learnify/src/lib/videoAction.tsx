"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function deleteModule(moduleId: string, userId: string) {
  console.log('Deleting module:', moduleId , "userId : " ,userId ); ;

  const module = await prisma.videoModule.findUnique({
    where: { id: moduleId },
  });
  console.log('Module:', module?.name);
  if (!module || module.userId !== userId) {
    throw new Error('Module not found or unauthorized');
  }
  console.log('Deleting module:', module.name);
  await prisma.videoModule.delete({
    where: { id: moduleId },
  });
  revalidatePath('/video-modules/[moduleId]');
  redirect('/video-modules');
}

export async function deleteVideo(videoId: string, userId: string, moduleId: string) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { videoModule: true },
  });
  if (!video || video.videoModule!.userId !== userId) {
    throw new Error('Video not found or unauthorized');
  }
  await prisma.video.delete({
    where: { id: videoId },
  });
  revalidatePath(`/video-modules/${moduleId}`);
}

export async function handleSharedModule(moduleId: string, userId: string) {
  // 1. Check if the user already has a clone of this module.
  const existingClone = await prisma.videoModule.findFirst({
    where: {
      userId,
      originalModuleId: moduleId,
    },
  });
  if (existingClone) {
    return existingClone;
  }

  // 2. Fetch the original module (and its videos)
  const originalModule = await prisma.videoModule.findUnique({
    where: { id: moduleId },
    include: { videos: true },
  });
  if (!originalModule) {
    throw new Error("Module not found");
  }

  // 3. Create a clone for the current user with a new ID.
  const clonedModule = await prisma.videoModule.create({
    data: {
      userId,
      name: originalModule.name,
      originalModuleId: originalModule.id,
      videos: {
        create: originalModule.videos.map((v) => ({
          name: v.name,
          url: v.url,
          videoId: v.videoId,
          summary: v.summary,
        })),
      },
    },
    include: { videos: true },
  });

  return clonedModule;
}

export async function getALLmodules(userId: string) {
  const module = await prisma.videoModule.findMany({
    where: { userId },
    select: { id: true, name: true },
  })
  if (!module) {
    throw new Error('Module not found');
  }
  return module;
}
  

// import { prisma } from "@/lib/db";
