-- CreateEnum
CREATE TYPE "Lib" AS ENUM ('node', 'vite', 'next');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('processing', 'deployed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "github" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "ip" TEXT,
    "instanceId" TEXT,
    "repo" TEXT,
    "lib" "Lib" NOT NULL,
    "prisma" BOOLEAN,
    "port" TEXT,
    "logs" TEXT,
    "State" "State" NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_github_key" ON "User"("github");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
