-- CreateTable
CREATE TABLE "Status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productID" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "transactionDate" DATETIME NOT NULL,
    "createBy" TEXT NOT NULL,
    "createOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_status_fkey" FOREIGN KEY ("status") REFERENCES "Status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
