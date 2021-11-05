/*
  Warnings:

  - You are about to drop the column `address` on the `Strategie` table. All the data in the column will be lost.
  - Added the required column `player` to the `Strategie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Strategie" DROP COLUMN "address",
ADD COLUMN     "player" TEXT NOT NULL;
