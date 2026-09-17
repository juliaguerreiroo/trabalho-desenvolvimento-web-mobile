-- CreateTable
CREATE TABLE "Library" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "gamesOnLibrary" (
    "libraryId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "timePlayed" INTEGER NOT NULL,

    PRIMARY KEY ("libraryId", "gameId"),
    CONSTRAINT "gamesOnLibrary_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gamesOnLibrary_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalPrice" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "gamesPurchased" (
    "purchaseId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "acquisitionPrice" REAL NOT NULL,
    "discount" REAL NOT NULL,

    PRIMARY KEY ("purchaseId", "gameId"),
    CONSTRAINT "gamesPurchased_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gamesPurchased_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_userId_key" ON "Library"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToGame_AB_unique" ON "_CategoryToGame"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToGame_B_index" ON "_CategoryToGame"("B");
