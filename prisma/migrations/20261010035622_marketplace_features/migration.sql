/*
  Warnings:

  - Added the required column `ownerId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxDiscount` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGames` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PlanSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "PlanSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlanSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "currentDiscount" REAL NOT NULL DEFAULT 0,
    "discountUpdatedAt" DATETIME,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Game_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("id", "name") SELECT "id", "name" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE INDEX "Game_ownerId_idx" ON "Game"("ownerId");
CREATE TABLE "new_Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "maxGames" INTEGER NOT NULL,
    "minDiscount" REAL NOT NULL DEFAULT 5,
    "maxDiscount" REAL NOT NULL
);
INSERT INTO "new_Plan" ("id", "name", "price") SELECT "id", "name", "price" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PlanSubscription_userId_expiresAt_idx" ON "PlanSubscription"("userId", "expiresAt");
