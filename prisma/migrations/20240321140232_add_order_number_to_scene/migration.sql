/*
  Warnings:

  - Added the required column `orderNumber` to the `Scene` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL
);
INSERT INTO "new_Scene" ("id", "name") SELECT "id", "name" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
