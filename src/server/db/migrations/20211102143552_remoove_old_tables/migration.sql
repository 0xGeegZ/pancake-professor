/*
  Warnings:

  - You are about to drop the `KoiHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pond` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PondHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Koi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KoiHistory" DROP CONSTRAINT "KoiHistory_koiId_fkey";

-- DropForeignKey
ALTER TABLE "Pond" DROP CONSTRAINT "Pond_userId_fkey";

-- DropForeignKey
ALTER TABLE "PondHistory" DROP CONSTRAINT "PondHistory_pondId_fkey";

-- DropForeignKey
ALTER TABLE "Koi" DROP CONSTRAINT "Koi_userId_fkey";

-- DropTable
DROP TABLE "KoiHistory";

-- DropTable
DROP TABLE "Pond";

-- DropTable
DROP TABLE "PondHistory";

-- DropTable
DROP TABLE "Koi";
