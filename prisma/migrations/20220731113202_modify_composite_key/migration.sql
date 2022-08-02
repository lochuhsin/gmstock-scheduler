/*
  Warnings:

  - A unique constraint covering the columns `[symbol,mic_code]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stocks_symbol_country_key";

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_mic_code_key" ON "stocks"("symbol", "mic_code");
