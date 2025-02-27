/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,videoId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Video_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Video_moduleId_videoId_key" ON "Video"("moduleId", "videoId");
