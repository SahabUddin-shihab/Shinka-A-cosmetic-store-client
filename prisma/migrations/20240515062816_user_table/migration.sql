-- AlterTable
ALTER TABLE `user` MODIFY `email_verified` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `remember_token` VARCHAR(191) NULL;
