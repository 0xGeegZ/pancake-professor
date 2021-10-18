-- AlterIndex
ALTER INDEX "Koi_id_key" RENAME TO "Koi.id_unique";

-- AlterIndex
ALTER INDEX "Project_slug_key" RENAME TO "Project.slug_unique";

-- AlterIndex
ALTER INDEX "Project_stripeCustomerId_key" RENAME TO "Project.stripeCustomerId_unique";

-- AlterIndex
ALTER INDEX "Project_stripeSubscriptionId_key" RENAME TO "Project.stripeSubscriptionId_unique";

-- AlterIndex
ALTER INDEX "User_email_key" RENAME TO "User.email_unique";
