/*
  Warnings:

  - Added the required column `channels` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "channels" TEXT NOT NULL,
    "fixtureAssignmentId" INTEGER,
    CONSTRAINT "Profile_fixtureAssignmentId_fkey" FOREIGN KEY ("fixtureAssignmentId") REFERENCES "FixtureAssignment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("fixtureAssignmentId", "id", "name") SELECT "fixtureAssignmentId", "id", "name" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
