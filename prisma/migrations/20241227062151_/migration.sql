/*
  Warnings:

  - You are about to drop the `master_free_catchment_stream_issue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `master_free_catchment_stream_issue`;

-- CreateTable
CREATE TABLE `master_free_catchment_stream_issues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
