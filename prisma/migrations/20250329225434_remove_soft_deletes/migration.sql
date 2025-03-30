/*
  Warnings:

  - You are about to drop the column `deleted` on the `AccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deleted";
