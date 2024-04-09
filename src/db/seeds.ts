const fixture = { name: "Vortex", notes: "test" };
const manufacturer = { name: "Creamsource", website: "www.creamsource.com" };
const patch = {
  fixtureId: 1,
  profileId: 1,
  startAddress: 81,
  endAddress: 90,
  showId: 1,
};
const profile = {
  channelCount: 4,
  channels: JSON.stringify({ 1: "Red", 2: "Green", 3: "Blue", 4: "Intensity" }),
  name: "mode 6",
};
import {
  InsertFixture,
  InsertManufacturer,
  InsertProfile,
  InsertFixtureAssignment,
  InsertScene,
  InsertShow,
  InsertPatch,
  InsertSceneToFixtureAssignment,
} from "@/db/types/tables";

export type Seeds = {
  fixtures: InsertFixture[];
  manufacturers: InsertManufacturer[];
  patches: InsertPatch[];
  scenes: InsertScene[];
  profiles: InsertProfile[];
  fixtureAssignments: InsertFixtureAssignment[];
  shows: InsertShow[];
  scenesToFixtureAssignments: InsertSceneToFixtureAssignment[];
};

export const seeds: Seeds = {
  fixtures: [
    { name: "Vortex", notes: "test", manufacturerId: 1 },
    { name: "S60", notes: "test", manufacturerId: 2 },
    { name: "S30", notes: "test", manufacturerId: 2 },
    { name: "Q8", notes: "test", manufacturerId: 3 },
    { name: "Q5", notes: "test", manufacturerId: 3 },
  ],
  manufacturers: [
    {
      name: "Creamsource",
      website: "www.creamsource.com",
      notes: "test notes creamsource",
    },
    { name: "Arri", website: "www.arri.com", notes: "test notes arri" },
    {
      name: "Aputure",
      website: "www.aputure.com",
      notes: "test notes aputure",
    },
  ],
  patches: [
    { fixtureId: 1, profileId: 1, startAddress: 1, endAddress: 5, showId: 1 },
    { fixtureId: 1, profileId: 1, startAddress: 5, endAddress: 10, showId: 1 },
    { fixtureId: 2, profileId: 1, startAddress: 10, endAddress: 11, showId: 1 },
    { fixtureId: 2, profileId: 1, startAddress: 11, endAddress: 15, showId: 1 },
    { fixtureId: 2, profileId: 1, startAddress: 11, endAddress: 15, showId: 1 },
  ],
  scenes: [
    { name: "Bedroom Night Look 1", showId: 1, order: 1 },
    { name: "Bedroom Night Look 2", showId: 1, order: 2 },
    { name: "Demo look", showId: 1, order: 3 },
    { name: "Exterior street look", showId: 1, order: 4 },
    { name: "Camera test", showId: 1, order: 5 },
  ],
  profiles: [
    {
      fixtureId: 1,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 1,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
        6: "Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 2,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 2,
      channelCount: 6,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
        6: "Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 3,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 3,
      channelCount: 6,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 4,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 4,
      channelCount: 6,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 5,
      channelCount: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 5,
      channelCount: 6,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Intensity",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },
  ],
  fixtureAssignments: [
    {
      channel: 1,
      fixtureId: 1,
      profileId: 1,
      title: "Vortex 1 at full",
      values: JSON.stringify([[1, 255]]),
    },
    {
      channel: 2,
      fixtureId: 1,
      profileId: 1,
      title: "Vortex 2 at 50%",
      values: JSON.stringify([[1, 128]]),
    },
    {
      channel: 10,
      fixtureId: 2,
      profileId: 1,
      title: "S60 1 at 50%",
      values: JSON.stringify([[1, 128]]),
    },
    {
      channel: 11,
      fixtureId: 2,
      profileId: 1,
      title: "S60 2 at 50%",
      values: JSON.stringify([[1, 128]]),
    },
    {
      channel: 11,
      fixtureId: 2,
      profileId: 1,
      title: "Different scene (2)",
      values: JSON.stringify([[1, 0]]),
    },
  ],
  scenesToFixtureAssignments: [
    { fixtureAssignmentId: 1, sceneId: 1 },
    { fixtureAssignmentId: 2, sceneId: 1 },
    { fixtureAssignmentId: 3, sceneId: 1 },
    { fixtureAssignmentId: 4, sceneId: 1 },
    { fixtureAssignmentId: 5, sceneId: 2 },
  ],
  shows: [{ name: "my first show" }, { name: "my second show" }],
};
