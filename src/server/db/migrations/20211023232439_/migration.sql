/*
  Warnings:

  - A unique constraint covering the columns `[generated]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[private]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `generated` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `private` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "generated" TEXT NOT NULL,
ADD COLUMN     "private" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.generated_unique" ON "User"("generated");

-- CreateIndex
CREATE UNIQUE INDEX "User.private_unique" ON "User"("private");
