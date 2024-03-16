/*
  Warnings:

  - You are about to drop the `_FixtureToFixtureAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `fixtureAssignmentId` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `fixtureId` to the `FixtureAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `FixtureAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_FixtureToFixtureAssignment_B_index";

-- DropIndex
DROP INDEX "_FixtureToFixtureAssignment_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FixtureToFixtureAssignment";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FixtureAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "channel" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "FixtureAssignment_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FixtureAssignment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FixtureAssignment" ("channel", "id", "title", "value") SELECT "channel", "id", "title", "value" FROM "FixtureAssignment";
DROP TABLE "FixtureAssignment";
ALTER TABLE "new_FixtureAssignment" RENAME TO "FixtureAssignment";
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "channels" TEXT NOT NULL
);
INSERT INTO "new_Profile" ("channels", "id", "name") SELECT "channels", "id", "name" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
