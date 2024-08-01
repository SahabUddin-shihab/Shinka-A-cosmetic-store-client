/*
  Warnings:

  - Added the required column `qr_code` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `qr_code` BIGINT NOT NULL;
