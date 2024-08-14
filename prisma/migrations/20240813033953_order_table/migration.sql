-- DropIndex
DROP INDEX `specification_ticket_id_fkey` ON `specification`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'Normal Ticket',
    ALTER COLUMN `created_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `specification` ADD COLUMN `sold_ticket` INTEGER NOT NULL DEFAULT 0;
