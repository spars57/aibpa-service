/*
  Warnings:

  - You are about to drop the column `chat_uuid` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `UserSettings` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Chat` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `UserSettings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
ALTER TYPE "UserSettingsKey" ADD VALUE 'OPENAI_API_KEY';

-- DropIndex
DROP INDEX "Chat_chat_uuid_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chat_uuid",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_uuid_key" ON "Chat"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_uuid_key" ON "UserSettings"("uuid");
