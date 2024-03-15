-- CreateTable
CREATE TABLE "Fixture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "assigned" BOOLEAN NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    CONSTRAINT "Fixture_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "fixtureAssignmentId" INTEGER,
    CONSTRAINT "Profile_fixtureAssignmentId_fkey" FOREIGN KEY ("fixtureAssignmentId") REFERENCES "FixtureAssignment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfilesOnFixtures" (
    "fixtureId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    PRIMARY KEY ("fixtureId", "profileId"),
    CONSTRAINT "ProfilesOnFixtures_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProfilesOnFixtures_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FixtureAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "channel" INTEGER NOT NULL,
    "value" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SceneList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    CONSTRAINT "SceneList_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Patch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fixtureId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "startAddress" INTEGER NOT NULL,
    "endAddress" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    CONSTRAINT "Patch_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Patch_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Patch_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FixtureToFixtureAssignment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FixtureToFixtureAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "Fixture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FixtureToFixtureAssignment_B_fkey" FOREIGN KEY ("B") REFERENCES "FixtureAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FixtureAssignmentToScene" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FixtureAssignmentToScene_A_fkey" FOREIGN KEY ("A") REFERENCES "FixtureAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FixtureAssignmentToScene_B_fkey" FOREIGN KEY ("B") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SceneToSceneList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SceneToSceneList_A_fkey" FOREIGN KEY ("A") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SceneToSceneList_B_fkey" FOREIGN KEY ("B") REFERENCES "SceneList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FixtureToFixtureAssignment_AB_unique" ON "_FixtureToFixtureAssignment"("A", "B");

-- CreateIndex
CREATE INDEX "_FixtureToFixtureAssignment_B_index" ON "_FixtureToFixtureAssignment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FixtureAssignmentToScene_AB_unique" ON "_FixtureAssignmentToScene"("A", "B");

-- CreateIndex
CREATE INDEX "_FixtureAssignmentToScene_B_index" ON "_FixtureAssignmentToScene"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SceneToSceneList_AB_unique" ON "_SceneToSceneList"("A", "B");

-- CreateIndex
CREATE INDEX "_SceneToSceneList_B_index" ON "_SceneToSceneList"("B");

