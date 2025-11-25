/*
  Warnings:

  - You are about to drop the column `bcc` on the `email_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `cc` on the `email_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `email_metadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `email_metadata` DROP COLUMN `bcc`,
    DROP COLUMN `cc`,
    DROP COLUMN `to`;
