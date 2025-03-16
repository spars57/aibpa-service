-- CreateTable
CREATE TABLE "AccessListType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccessListType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_uuid_key" ON "AccessToken"("uuid");

-- CreateIndex
CREATE INDEX "AccessToken_user_uuid_idx" ON "AccessToken"("user_uuid");

-- CreateIndex
CREATE INDEX "AccessToken_type_id_idx" ON "AccessToken"("type_id");

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "AccessListType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
