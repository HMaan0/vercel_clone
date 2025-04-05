/*
  Warnings:

  - The `logs` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "workingDir" TEXT,
DROP COLUMN "logs",
ADD COLUMN     "logs" TEXT[];
