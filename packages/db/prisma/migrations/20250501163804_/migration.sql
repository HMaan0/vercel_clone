/*
  Warnings:

  - A unique constraint covering the columns `[ip]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_ip_key" ON "Project"("ip");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ip_fkey" FOREIGN KEY ("ip") REFERENCES "DomainEntry"("ip") ON DELETE SET NULL ON UPDATE CASCADE;
