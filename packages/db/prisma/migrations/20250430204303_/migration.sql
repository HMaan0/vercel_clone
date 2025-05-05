/*
  Warnings:

  - You are about to drop the column `domainManagerId` on the `DomainEntry` table. All the data in the column will be lost.
  - You are about to drop the `DomainManager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DomainEntry" DROP CONSTRAINT "DomainEntry_domainManagerId_fkey";

-- AlterTable
ALTER TABLE "DomainEntry" DROP COLUMN "domainManagerId";

-- DropTable
DROP TABLE "DomainManager";
