-- AlterTable
ALTER TABLE `order` MODIFY `address` VARCHAR(255) NOT NULL,
    MODIFY `phone` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `subscriber` MODIFY `status` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `email_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NULL,
    `subject` TEXT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
