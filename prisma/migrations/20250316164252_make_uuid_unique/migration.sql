/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
