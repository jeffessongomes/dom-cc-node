/*
  Warnings:

  - You are about to drop the column `productId` on the `collections` table. All the data in the column will be lost.
  - Added the required column `collectId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_productId_fkey";

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "collectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_collectId_fkey" FOREIGN KEY ("collectId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
