/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_B_fkey";

-- AlterTable
ALTER TABLE "Strategie" ADD COLUMN     "color" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT E'';

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "_ProjectToUser";
