/*
  Warnings:

  - Made the column `playsCount` on table `Strategie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roundsCount` on table `Strategie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Strategie" ALTER COLUMN "playsCount" SET NOT NULL,
ALTER COLUMN "roundsCount" SET NOT NULL;
