/*
  Warnings:

  - Added the required column `size` to the `Pond` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Pond` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pond" ADD COLUMN     "size" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "PondHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ph" INTEGER NOT NULL,
    "kh" INTEGER NOT NULL,
    "temp" INTEGER NOT NULL,
    "pondId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PondHistory" ADD FOREIGN KEY ("pondId") REFERENCES "Pond"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
