-- AlterTable
ALTER TABLE "Strategie" ALTER COLUMN "decreaseAmount" SET DEFAULT 0.0,
ALTER COLUMN "decreaseAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "increaseAmount" SET DEFAULT 0.0,
ALTER COLUMN "increaseAmount" SET DATA TYPE DOUBLE PRECISION;
