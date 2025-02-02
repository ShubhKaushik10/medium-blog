/*
  Warnings:

  - You are about to drop the column `postedOn` on the `AllPost` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `AllPost` table. All the data in the column will be lost.
  - Added the required column `isPublished` to the `AllPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllPost" DROP COLUMN "postedOn",
DROP COLUMN "published",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL;
