/*
  Warnings:

  - Added the required column `ticket_id` to the `specification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_id` to the `venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `specification` ADD COLUMN `ticket_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `venue` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `city_id` INTEGER NOT NULL,
    ADD COLUMN `country_id` INTEGER NOT NULL,
    ADD COLUMN `google_map` LONGTEXT NULL DEFAULT 'Google Map',
    ADD COLUMN `latitude` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `longitude` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `state_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `venue` ADD CONSTRAINT `venue_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venue` ADD CONSTRAINT `venue_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venue` ADD CONSTRAINT `venue_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specification` ADD CONSTRAINT `specification_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `venu_ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
