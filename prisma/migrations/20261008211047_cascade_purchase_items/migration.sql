-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_gamesPurchased" (
    "purchaseId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "acquisitionPrice" REAL NOT NULL,
    "discount" REAL NOT NULL,

    PRIMARY KEY ("purchaseId", "gameId"),
    CONSTRAINT "gamesPurchased_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "gamesPurchased_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_gamesPurchased" ("acquisitionPrice", "discount", "gameId", "purchaseId") SELECT "acquisitionPrice", "discount", "gameId", "purchaseId" FROM "gamesPurchased";
DROP TABLE "gamesPurchased";
ALTER TABLE "new_gamesPurchased" RENAME TO "gamesPurchased";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
