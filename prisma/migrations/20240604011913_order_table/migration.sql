/*
  Warnings:

  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1,
    MODIFY `google_map` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subscriber` ADD COLUMN `is_verified` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;
