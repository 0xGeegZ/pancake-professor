/*
  Warnings:

  - A unique constraint covering the columns `[generated]` on the table `Strategie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[private]` on the table `Strategie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Strategie" ADD COLUMN     "generated" TEXT,
ADD COLUMN     "private" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActivated" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Strategie.generated_unique" ON "Strategie"("generated");

-- CreateIndex
CREATE UNIQUE INDEX "Strategie.private_unique" ON "Strategie"("private");
