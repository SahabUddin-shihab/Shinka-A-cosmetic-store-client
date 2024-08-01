/*
  Warnings:

  - You are about to alter the column `qr_code` on the `event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `qr_code` INTEGER NOT NULL;
