/*
  Warnings:

  - You are about to drop the column `betAmount` on the `Strategie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Strategie" DROP COLUMN "betAmount",
ADD COLUMN     "betAmountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
