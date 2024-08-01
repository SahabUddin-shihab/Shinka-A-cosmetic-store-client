/*
  Warnings:

  - Added the required column `loginpage_image` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `setting` ADD COLUMN `loginpage_image` VARCHAR(191) NOT NULL;
