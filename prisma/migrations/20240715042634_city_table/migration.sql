-- AlterTable
ALTER TABLE `city` ADD COLUMN `state_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
