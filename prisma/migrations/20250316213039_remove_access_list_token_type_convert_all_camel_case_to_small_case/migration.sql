/*
  Warnings:

  - You are about to drop the column `type_id` on the `AccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `AccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `AccessToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AccessListType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_type_id_fkey";

-- DropIndex
DROP INDEX "AccessToken_type_id_idx";

-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "type_id",
DROP COLUMN "validFrom",
DROP COLUMN "validUntil",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "AccessListType";
