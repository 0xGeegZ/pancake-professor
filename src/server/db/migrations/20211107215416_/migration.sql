-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "generated" TEXT NOT NULL,
    "private" TEXT NOT NULL,
    "name" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategie" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player" TEXT NOT NULL,
    "generated" TEXT NOT NULL,
    "private" TEXT NOT NULL,
    "startedAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL,
    "maxLooseAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "minWinAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "roundsCount" INTEGER NOT NULL DEFAULT 0,
    "playsCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.address_unique" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User.generated_unique" ON "User"("generated");

-- CreateIndex
CREATE UNIQUE INDEX "User.private_unique" ON "User"("private");

-- CreateIndex
CREATE UNIQUE INDEX "Strategie.generated_unique" ON "Strategie"("generated");

-- CreateIndex
CREATE UNIQUE INDEX "Strategie.private_unique" ON "Strategie"("private");

-- CreateIndex
CREATE UNIQUE INDEX "Project.slug_unique" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project.stripeCustomerId_unique" ON "Project"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Project.stripeSubscriptionId_unique" ON "Project"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategie" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
