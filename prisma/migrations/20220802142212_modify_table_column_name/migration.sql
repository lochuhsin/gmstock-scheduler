/*
  Warnings:

  - You are about to drop the column `symbol_update_date` on the `cryptocurrency` table. All the data in the column will be lost.
  - You are about to drop the column `symbol_update_date` on the `etf` table. All the data in the column will be lost.
  - You are about to drop the column `symbol_update_date` on the `forexpair` table. All the data in the column will be lost.
  - You are about to drop the column `symbol_update_date` on the `indices` table. All the data in the column will be lost.
  - You are about to drop the column `symbol_update_date` on the `stocks` table. All the data in the column will be lost.
  - Added the required column `table_update_date` to the `cryptocurrency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_update_date` to the `etf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_update_date` to the `forexpair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_update_date` to the `indices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_update_date` to the `stocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cryptocurrency" DROP COLUMN "symbol_update_date",
ADD COLUMN     "table_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "etf" DROP COLUMN "symbol_update_date",
ADD COLUMN     "table_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "forexpair" DROP COLUMN "symbol_update_date",
ADD COLUMN     "table_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "indices" DROP COLUMN "symbol_update_date",
ADD COLUMN     "table_update_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "stocks" DROP COLUMN "symbol_update_date",
ADD COLUMN     "table_update_date" TIMESTAMP(3) NOT NULL;
