-- DropForeignKey
ALTER TABLE "Koi" DROP CONSTRAINT "Koi_userId_fkey";

-- AddForeignKey
ALTER TABLE "Koi" ADD CONSTRAINT "Koi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Koi.id_unique" RENAME TO "Koi_id_key";

-- RenameIndex
ALTER INDEX "Project.slug_unique" RENAME TO "Project_slug_key";

-- RenameIndex
ALTER INDEX "Project.stripeCustomerId_unique" RENAME TO "Project_stripeCustomerId_key";

-- RenameIndex
ALTER INDEX "Project.stripeSubscriptionId_unique" RENAME TO "Project_stripeSubscriptionId_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
