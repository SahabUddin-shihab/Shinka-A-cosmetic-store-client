/*
  Warnings:

  - Added the required column `logo_dark` to the `setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_sidebar` to the `setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `setting` ADD COLUMN `logo_dark` VARCHAR(191) NOT NULL,
    ADD COLUMN `logo_sidebar` VARCHAR(191) NOT NULL;
