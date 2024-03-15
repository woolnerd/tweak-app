-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fixture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "manufacturerId" INTEGER NOT NULL,
    CONSTRAINT "Fixture_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fixture" ("assigned", "id", "manufacturerId", "name", "notes") SELECT "assigned", "id", "manufacturerId", "name", "notes" FROM "Fixture";
DROP TABLE "Fixture";
ALTER TABLE "new_Fixture" RENAME TO "Fixture";
CREATE UNIQUE INDEX "Fixture_name_key" ON "Fixture"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
