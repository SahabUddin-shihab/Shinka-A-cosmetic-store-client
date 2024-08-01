-- CreateTable
CREATE TABLE `footer_banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `award_title` VARCHAR(191) NOT NULL,
    `award_heading` VARCHAR(191) NOT NULL,
    `award_icon` VARCHAR(191) NULL,
    `main_image` VARCHAR(191) NOT NULL,
    `rating_text` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
