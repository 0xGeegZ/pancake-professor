-- CreateTable
CREATE TABLE "Strategie" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "maxLooseAmount" INTEGER NOT NULL,
    "minWinAmount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Strategie.id_unique" ON "Strategie"("id");

-- AddForeignKey
ALTER TABLE "Strategie" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
