-- AlterTable
ALTER TABLE "etf" ADD COLUMN     "global" TEXT NOT NULL DEFAULT 'Level A',
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'Basic';

-- AlterTable
ALTER TABLE "indices" ADD COLUMN     "global" TEXT NOT NULL DEFAULT 'Level A',
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'Basic';

-- AlterTable
ALTER TABLE "stocks" ADD COLUMN     "global" TEXT NOT NULL DEFAULT 'Level A',
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'Basic';
