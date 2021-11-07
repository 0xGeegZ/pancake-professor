/*
  Warnings:

  - Made the column `generated` on table `Strategie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `private` on table `Strategie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isActivated` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Strategie" ALTER COLUMN "generated" SET NOT NULL,
ALTER COLUMN "private" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isActivated" SET NOT NULL;
