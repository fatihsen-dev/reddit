/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
