/*
  Warnings:

  - A unique constraint covering the columns `[symbol,currency_base]` on the table `cryptocurrency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cryptocurrency_symbol_currency_base_key" ON "cryptocurrency"("symbol", "currency_base");
