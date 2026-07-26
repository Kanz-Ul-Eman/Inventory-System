-- AlterTable
ALTER TABLE `Category` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Category_active_idx` ON `Category`(`active`);

-- CreateIndex
CREATE INDEX `Category_name_idx` ON `Category`(`name`);
