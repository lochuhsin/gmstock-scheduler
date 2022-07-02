/*
  Warnings:

  - The primary key for the `etf` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `indices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[symbol,country]` on the table `etf` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol,country]` on the table `indices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol,country]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "etf" DROP CONSTRAINT "etf_pkey";

-- AlterTable
ALTER TABLE "indices" DROP CONSTRAINT "indices_pkey";

-- AlterTable
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "etf_symbol_country_key" ON "etf"("symbol", "country");

-- CreateIndex
CREATE UNIQUE INDEX "indices_symbol_country_key" ON "indices"("symbol", "country");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_country_key" ON "stocks"("symbol", "country");
