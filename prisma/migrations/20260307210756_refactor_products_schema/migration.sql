/*
  Warnings:

  - You are about to drop the column `regular_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sale_price` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `condition` VARCHAR(191) NULL,
    ADD COLUMN `selected_size` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `regular_price`,
    DROP COLUMN `sale_price`,
    ADD COLUMN `sizes` JSON NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 0;
