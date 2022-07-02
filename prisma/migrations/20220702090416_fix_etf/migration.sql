/*
  Warnings:

  - A unique constraint covering the columns `[symbol,mic_code]` on the table `etf` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "etf_symbol_country_key";

-- CreateIndex
CREATE UNIQUE INDEX "etf_symbol_mic_code_key" ON "etf"("symbol", "mic_code");
