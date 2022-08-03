/*
  Warnings:

  - Added the required column `symbol_update_date` to the `cryptocurrency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol_update_date` to the `etf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol_update_date` to the `forexpair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol_update_date` to the `indices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol_update_date` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cryptocurrency" ADD COLUMN     "symbol_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "etf" ADD COLUMN     "symbol_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "forexpair" ADD COLUMN     "symbol_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "indices" ADD COLUMN     "symbol_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "stocks" ADD COLUMN     "symbol_update_date" TIMESTAMP(3) NOT NULL;
