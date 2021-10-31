/*
  Warnings:

  - You are about to drop the column `amount` on the `Strategie` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentAmount` to the `Strategie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAmount` to the `Strategie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Strategie" DROP COLUMN "amount",
ADD COLUMN     "currentAmount" INTEGER NOT NULL,
ADD COLUMN     "startedAmount" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Player";
