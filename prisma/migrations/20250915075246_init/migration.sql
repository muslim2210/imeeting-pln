-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterUnit` (
    `id` VARCHAR(191) NOT NULL,
    `officeName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterMeetingRoom` (
    `id` VARCHAR(191) NOT NULL,
    `officeId` VARCHAR(191) NOT NULL,
    `officeName` VARCHAR(191) NOT NULL,
    `roomName` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterJenisKonsumsi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxPrice` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `meetingRoomId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktuMulai` VARCHAR(191) NOT NULL,
    `waktuSelesai` VARCHAR(191) NOT NULL,
    `jumlahPeserta` INTEGER NOT NULL,
    `nominal` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingKonsumsi` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `jenisKonsumsiId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryBookings` (
    `id` VARCHAR(191) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryOffice` (
    `id` VARCHAR(191) NOT NULL,
    `officeName` VARCHAR(191) NOT NULL,
    `summaryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryRoom` (
    `id` VARCHAR(191) NOT NULL,
    `roomName` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `averageOccupancyPerMonth` INTEGER NOT NULL,
    `officeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SummaryConsumption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `totalPackage` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `MasterUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_meetingRoomId_fkey` FOREIGN KEY (`meetingRoomId`) REFERENCES `MasterMeetingRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingKonsumsi` ADD CONSTRAINT `BookingKonsumsi_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingKonsumsi` ADD CONSTRAINT `BookingKonsumsi_jenisKonsumsiId_fkey` FOREIGN KEY (`jenisKonsumsiId`) REFERENCES `MasterJenisKonsumsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryOffice` ADD CONSTRAINT `SummaryOffice_summaryId_fkey` FOREIGN KEY (`summaryId`) REFERENCES `SummaryBookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryRoom` ADD CONSTRAINT `SummaryRoom_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `SummaryOffice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SummaryConsumption` ADD CONSTRAINT `SummaryConsumption_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `SummaryRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
