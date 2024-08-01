/*
  Warnings:

  - You are about to drop the column `stipe_key` on the `stripe` table. All the data in the column will be lost.
  - Added the required column `status` to the `stripe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_key` to the `stripe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stripe` DROP COLUMN `stipe_key`,
    ADD COLUMN `status` INTEGER NOT NULL,
    ADD COLUMN `stripe_key` LONGTEXT NOT NULL;
