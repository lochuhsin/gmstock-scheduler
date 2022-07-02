-- CreateTable
CREATE TABLE "stocks" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "mic_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latest_date" TIMESTAMP(3) NOT NULL,
    "oldest_date" TIMESTAMP(3) NOT NULL,
    "ishistorydatafinished" BOOLEAN NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "forexpair" (
    "symbol" TEXT NOT NULL,
    "currency_group" TEXT NOT NULL,
    "currency_base" TEXT NOT NULL,
    "currency_quote" TEXT NOT NULL,
    "latest_date" TIMESTAMP(3) NOT NULL,
    "oldest_date" TIMESTAMP(3) NOT NULL,
    "ishistorydatafinished" BOOLEAN NOT NULL,

    CONSTRAINT "forexpair_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "cryptocurrency" (
    "symbol" TEXT NOT NULL,
    "available_exchange" TEXT NOT NULL,
    "currency_base" TEXT NOT NULL,
    "currency_quote" TEXT NOT NULL,
    "latest_date" TIMESTAMP(3) NOT NULL,
    "oldest_date" TIMESTAMP(3) NOT NULL,
    "ishistorydatafinished" BOOLEAN NOT NULL,

    CONSTRAINT "cryptocurrency_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "etf" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "mic_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latest_date" TIMESTAMP(3) NOT NULL,
    "oldest_date" TIMESTAMP(3) NOT NULL,
    "ishistorydatafinished" BOOLEAN NOT NULL,

    CONSTRAINT "etf_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "indices" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "latest_date" TIMESTAMP(3) NOT NULL,
    "oldest_date" TIMESTAMP(3) NOT NULL,
    "ishistorydatafinished" BOOLEAN NOT NULL,

    CONSTRAINT "indices_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "stocksdata" (
    "symbol" TEXT NOT NULL,
    "record_date_time" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "forexpairdata" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "record_date_time" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL,

    CONSTRAINT "forexpairdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cryptocurrencydata" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "record_date_time" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL,

    CONSTRAINT "cryptocurrencydata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etfdata" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "record_date_time" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL,

    CONSTRAINT "etfdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicesdata" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "record_date_time" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL,

    CONSTRAINT "indicesdata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocksdata_symbol_record_date_time_key" ON "stocksdata"("symbol", "record_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "forexpairdata_symbol_record_date_time_key" ON "forexpairdata"("symbol", "record_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "cryptocurrencydata_symbol_record_date_time_key" ON "cryptocurrencydata"("symbol", "record_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "etfdata_symbol_record_date_time_key" ON "etfdata"("symbol", "record_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "indicesdata_symbol_record_date_time_key" ON "indicesdata"("symbol", "record_date_time");
