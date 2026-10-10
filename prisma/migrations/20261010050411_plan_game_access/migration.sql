-- CreateTable
CREATE TABLE "PlanGame" (
    "planId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    PRIMARY KEY ("planId", "gameId"),
    CONSTRAINT "PlanGame_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlanGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
