/*
  Warnings:

  - You are about to drop the column `type` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `type`,
    ADD COLUMN `ticket_type` VARCHAR(191) NOT NULL DEFAULT 'Normal Ticket',
    ALTER COLUMN `created_at` DROP DEFAULT;
