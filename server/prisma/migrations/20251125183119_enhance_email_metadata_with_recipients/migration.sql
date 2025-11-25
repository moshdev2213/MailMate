-- AlterTable
ALTER TABLE `email_metadata` ADD COLUMN `bcc` TEXT NULL,
    ADD COLUMN `cc` TEXT NULL,
    ADD COLUMN `to` TEXT NULL;
