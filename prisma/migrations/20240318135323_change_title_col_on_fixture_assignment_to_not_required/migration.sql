-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FixtureAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "channel" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "FixtureAssignment_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FixtureAssignment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FixtureAssignment" ("channel", "fixtureId", "id", "profileId", "title", "value") SELECT "channel", "fixtureId", "id", "profileId", "title", "value" FROM "FixtureAssignment";
DROP TABLE "FixtureAssignment";
ALTER TABLE "new_FixtureAssignment" RENAME TO "FixtureAssignment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
