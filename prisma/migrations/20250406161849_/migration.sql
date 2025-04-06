-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "git_access_token" TEXT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gitUserId" INTEGER,
    "avatar_url" TEXT,
    CONSTRAINT "User_gitUserId_fkey" FOREIGN KEY ("gitUserId") REFERENCES "GitUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GitUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "git_access_token" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "expires" BOOLEAN NOT NULL,
    "expiryDate" DATETIME,
    "repoState" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gitGroupId" INTEGER,
    "avatar_url" TEXT,
    CONSTRAINT "GitUser_gitGroupId_fkey" FOREIGN KEY ("gitGroupId") REFERENCES "GitGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GitGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expires" BOOLEAN NOT NULL,
    "expiryDate" DATETIME,
    "deleteUsers" BOOLEAN NOT NULL DEFAULT true,
    "deleteSelf" BOOLEAN NOT NULL DEFAULT true,
    "repoOwner" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "GitGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GitUser_email_key" ON "GitUser"("email");
