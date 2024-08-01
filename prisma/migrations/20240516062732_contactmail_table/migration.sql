-- AlterTable
ALTER TABLE `contactmail` MODIFY `subject` VARCHAR(191) NOT NULL,
    MODIFY `body` LONGTEXT NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;
