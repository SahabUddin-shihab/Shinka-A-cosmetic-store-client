/*
  Warnings:

  - Added the required column `country_id` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `country_id` INTEGER NOT NULL,
    ADD COLUMN `state_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
