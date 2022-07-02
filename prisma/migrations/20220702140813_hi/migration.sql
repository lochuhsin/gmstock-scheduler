/*
  Warnings:

  - The primary key for the `cryptocurrency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `forexpair` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "cryptocurrency" DROP CONSTRAINT "cryptocurrency_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "cryptocurrency_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "etf" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "etf_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "forexpair" DROP CONSTRAINT "forexpair_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "forexpair_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "indices" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "indices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stocks" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "stocks_pkey" PRIMARY KEY ("id");
