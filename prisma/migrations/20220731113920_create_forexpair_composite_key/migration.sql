/*
  Warnings:

  - A unique constraint covering the columns `[symbol,currency_base]` on the table `forexpair` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "forexpair_symbol_currency_base_key" ON "forexpair"("symbol", "currency_base");
