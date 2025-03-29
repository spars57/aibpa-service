/*
  Warnings:

  - Added the required column `value` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "value" TEXT NOT NULL;
