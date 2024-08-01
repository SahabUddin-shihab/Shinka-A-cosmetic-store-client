-- AlterTable
ALTER TABLE `event` ADD COLUMN `normalticket_name` VARCHAR(191) NOT NULL DEFAULT 'Normal ticket',
    ADD COLUMN `vip_price` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `vipticket_name` VARCHAR(191) NOT NULL DEFAULT 'VIP ticket',
    ADD COLUMN `vvip_price` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `vvipticket_name` VARCHAR(191) NOT NULL DEFAULT 'VVIP ticket';
