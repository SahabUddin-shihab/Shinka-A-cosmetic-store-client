/*
  Warnings:

  - Added the required column `seats` to the `specification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `specification` DROP FOREIGN KEY `specification_ticket_id_fkey`;

-- AlterTable
ALTER TABLE `specification` ADD COLUMN `seats` INTEGER NOT NULL;
