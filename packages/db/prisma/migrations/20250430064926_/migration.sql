-- CreateTable
CREATE TABLE "DomainManager" (
    "id" TEXT NOT NULL,
    "domainManager" TEXT[],

    CONSTRAINT "DomainManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DomainManager_id_key" ON "DomainManager"("id");
