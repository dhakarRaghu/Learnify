"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function deleteModule(moduleId: string, userId: string) {
  const module = await prisma.videoModule.findUnique({
    where: { id: moduleId },
  });
  if (!module || module.userId !== userId) {
    throw new Error('Module not found or unauthorized');
  }
  await prisma.videoModule.delete({
    where: { id: moduleId },
  });
  revalidatePath('/video-modules/[moduleId]');
  redirect('/video-module');
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
  