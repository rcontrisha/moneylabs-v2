/*
  Warnings:

  - You are about to drop the column `ctaLink` on the `cms_hero_slides` table. All the data in the column will be lost.
  - You are about to drop the column `ctaText` on the `cms_hero_slides` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `cms_hero_slides` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `cms_hero_slides` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `cms_hero_slides` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `cms_promo_banners` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `cms_promo_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cms_hero_slides` DROP COLUMN `ctaLink`,
    DROP COLUMN `ctaText`,
    DROP COLUMN `subtitle`,
    DROP COLUMN `tagline`,
    DROP COLUMN `title`,
    ADD COLUMN `altText` VARCHAR(191) NULL,
    ADD COLUMN `landing_page_id` VARCHAR(191) NULL,
    ADD COLUMN `link` VARCHAR(191) NULL DEFAULT '/shop';

-- AlterTable
ALTER TABLE `cms_promo_banners` DROP COLUMN `subtitle`,
    DROP COLUMN `title`,
    ADD COLUMN `landing_page_id` VARCHAR(191) NULL,
    MODIFY `link` VARCHAR(191) NULL DEFAULT '/',
    MODIFY `position` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `cms_site_config` ADD COLUMN `landingBlocks` JSON NULL,
    ADD COLUMN `landingDraft` JSON NULL,
    ADD COLUMN `landingPublished` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `cms_landing_pages` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `blocks` JSON NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cms_landing_pages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_landing_sections` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cms_landing_sections_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_landing_section_products` (
    `id` VARCHAR(191) NOT NULL,
    `landing_section_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `cms_landing_section_products_landing_section_id_idx`(`landing_section_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cms_hero_slides` ADD CONSTRAINT `cms_hero_slides_landing_page_id_fkey` FOREIGN KEY (`landing_page_id`) REFERENCES `cms_landing_pages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cms_promo_banners` ADD CONSTRAINT `cms_promo_banners_landing_page_id_fkey` FOREIGN KEY (`landing_page_id`) REFERENCES `cms_landing_pages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cms_landing_section_products` ADD CONSTRAINT `cms_landing_section_products_landing_section_id_fkey` FOREIGN KEY (`landing_section_id`) REFERENCES `cms_landing_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cms_landing_section_products` ADD CONSTRAINT `cms_landing_section_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
