-- CreateTable
CREATE TABLE "loss_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_no" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "process" TEXT NOT NULL,
    "karigar" TEXT NOT NULL,
    "loss" REAL NOT NULL,
    "pure_gold_loss" REAL NOT NULL,
    "kt" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "weight_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_no" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "gross_wt" REAL NOT NULL,
    "net_wt" REAL NOT NULL,
    "pure_gold_weight" REAL NOT NULL,
    "kt" INTEGER NOT NULL
);
