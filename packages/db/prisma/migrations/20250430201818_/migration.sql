/*
  Warnings:

  - You are about to drop the column `domainManager` on the `DomainManager` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomainManager" DROP COLUMN "domainManager";

-- CreateTable
CREATE TABLE "DomainEntry" (
    "ip" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "lastUsed" TEXT NOT NULL,
    "domainManagerId" TEXT,

    CONSTRAINT "DomainEntry_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE UNIQUE INDEX "DomainEntry_ip_key" ON "DomainEntry"("ip");

-- AddForeignKey
ALTER TABLE "DomainEntry" ADD CONSTRAINT "DomainEntry_domainManagerId_fkey" FOREIGN KEY ("domainManagerId") REFERENCES "DomainManager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
