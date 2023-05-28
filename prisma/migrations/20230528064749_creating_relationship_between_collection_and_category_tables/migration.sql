/*
  Warnings:

  - Added the required column `categoryId` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "checkCollect" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
