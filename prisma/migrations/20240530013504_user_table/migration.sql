-- AlterTable
ALTER TABLE `event` MODIFY `google_map` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;
