/*
  Warnings:

  - Added the required column `frontend_url` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `setting` ADD COLUMN `frontend_url` VARCHAR(191) NOT NULL;
