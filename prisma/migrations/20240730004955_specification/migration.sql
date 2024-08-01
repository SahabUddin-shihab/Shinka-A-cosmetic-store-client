-- CreateTable
CREATE TABLE `venu_ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seats` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `venue_id` INTEGER NOT NULL,
    `ticket_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` DOUBLE NOT NULL DEFAULT 0.0,
    `level` VARCHAR(191) NOT NULL DEFAULT 'Normal Ticket',
    `venue_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `venu_ticket` ADD CONSTRAINT `venu_ticket_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venu_ticket` ADD CONSTRAINT `venu_ticket_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specification` ADD CONSTRAINT `specification_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specification` ADD CONSTRAINT `specification_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
