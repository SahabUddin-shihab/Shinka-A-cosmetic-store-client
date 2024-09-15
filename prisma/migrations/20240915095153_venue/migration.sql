-- AlterTable
ALTER TABLE `order` ALTER COLUMN `created_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `venue` ADD COLUMN `image` VARCHAR(191) NULL;
