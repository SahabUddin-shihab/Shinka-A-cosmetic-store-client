-- CreateTable
CREATE TABLE `Email` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mail_type` INTEGER NULL,
    `mail_host` VARCHAR(191) NOT NULL,
    `mail_port` VARCHAR(191) NOT NULL,
    `email_from` VARCHAR(191) NOT NULL,
    `smtp_username` VARCHAR(191) NOT NULL,
    `smtp_password` VARCHAR(191) NOT NULL,
    `mail_encryption` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
