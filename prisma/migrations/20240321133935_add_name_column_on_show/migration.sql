/*
  Warnings:

  - Added the required column `name` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Show" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Show";
DROP TABLE "Show";
ALTER TABLE "new_Show" RENAME TO "Show";
CREATE UNIQUE INDEX "Show_name_key" ON "Show"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
