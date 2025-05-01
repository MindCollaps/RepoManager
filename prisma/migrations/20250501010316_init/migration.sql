-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `git_access_token` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatar_url` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GitUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `git_access_token` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatar_url` VARCHAR(191) NULL,
    `custom` BOOLEAN NULL,

    UNIQUE INDEX `GitUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GitGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expires` BOOLEAN NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `deleteUsers` BOOLEAN NOT NULL DEFAULT true,
    `deleteSelf` BOOLEAN NOT NULL DEFAULT true,
    `repoOwner` VARCHAR(191) NOT NULL,
    `repoName` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `git_user_groups` (
    `git_user_id` INTEGER NOT NULL,
    `git_group_id` INTEGER NOT NULL,
    `repoState` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`git_user_id`, `git_group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `git_user_owners` (
    `owner_id` INTEGER NOT NULL,
    `git_user_id` INTEGER NOT NULL,

    PRIMARY KEY (`owner_id`, `git_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `git_group_owners` (
    `owner_id` INTEGER NOT NULL,
    `group_id` INTEGER NOT NULL,

    PRIMARY KEY (`owner_id`, `group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `style` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `ownerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupInviteToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `maxUse` INTEGER NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GroupInviteToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_invite_token_groups` (
    `token_id` INTEGER NOT NULL,
    `group_id` INTEGER NOT NULL,

    PRIMARY KEY (`token_id`, `group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_invite_token_users` (
    `token_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`token_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `git_user_groups` ADD CONSTRAINT `git_user_groups_git_user_id_fkey` FOREIGN KEY (`git_user_id`) REFERENCES `GitUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `git_user_groups` ADD CONSTRAINT `git_user_groups_git_group_id_fkey` FOREIGN KEY (`git_group_id`) REFERENCES `GitGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `git_user_owners` ADD CONSTRAINT `git_user_owners_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `git_user_owners` ADD CONSTRAINT `git_user_owners_git_user_id_fkey` FOREIGN KEY (`git_user_id`) REFERENCES `GitUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `git_group_owners` ADD CONSTRAINT `git_group_owners_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `git_group_owners` ADD CONSTRAINT `git_group_owners_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `GitGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupInviteToken` ADD CONSTRAINT `GroupInviteToken_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_invite_token_groups` ADD CONSTRAINT `group_invite_token_groups_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `GroupInviteToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_invite_token_groups` ADD CONSTRAINT `group_invite_token_groups_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `GitGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_invite_token_users` ADD CONSTRAINT `group_invite_token_users_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `GroupInviteToken`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_invite_token_users` ADD CONSTRAINT `group_invite_token_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `GitUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
