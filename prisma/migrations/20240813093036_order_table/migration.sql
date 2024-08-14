/*
  Warnings:

  - You are about to drop the column `ticket_type` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `ticket_type`,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'Normal Ticket',
    ALTER COLUMN `created_at` DROP DEFAULT;
