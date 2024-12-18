import {
  InsertFixture,
  InsertManufacturer,
  InsertProfile,
  InsertFixtureAssignment,
  InsertScene,
  InsertShow,
  InsertPatch,
  InsertSceneToFixtureAssignment,
} from "./types/tables.ts";

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
    {
      name: "Vortex",
      notes: "test",
      manufacturerId: 1,
      colorTempRangeLow: 2200,
      colorTempRangeHigh: 15000,
    },
    {
      name: "S60",
      notes: "test",
      manufacturerId: 2,
      colorTempRangeLow: 2800,
      colorTempRangeHigh: 10000,
    },
    {
      name: "S30",
      notes: "test",
      manufacturerId: 2,
      colorTempRangeLow: 2800,
      colorTempRangeHigh: 10000,
    },
    {
      name: "Q8",
      notes: "test",
      manufacturerId: 3,
      colorTempRangeLow: 2000,
      colorTempRangeHigh: 10000,
    },
    {
      name: "Q5",
      notes: "test",
      manufacturerId: 3,
      colorTempRangeLow: 2000,
      colorTempRangeHigh: 10000,
    },
    {
      name: "Single Channel",
      notes: "Single channel",
      manufacturerId: 4,
    },
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
    { name: "Generic", website: "", notes: "single channel device" },
  ],
  patches: [
    { fixtureId: 1, profileId: 11, startAddress: 1, showId: 1 },
    {
      fixtureId: 1,
      profileId: 11,
      startAddress: 21,
      showId: 1,
    },
    {
      fixtureId: 2,
      profileId: 11,
      startAddress: 41,
      showId: 1,
    },
    {
      fixtureId: 2,
      profileId: 11,
      startAddress: 61,
      showId: 1,
    },
    {
      fixtureId: 2,
      profileId: 11,
      startAddress: 81,
      showId: 1,
    },
    {
      fixtureId: 2,
      profileId: 11,
      startAddress: 101,
      showId: 1,
    },
    {
      fixtureId: 4,
      profileId: 7,
      startAddress: 121,
      showId: 1,
    },
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
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 1,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
        6: "Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 2,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 2,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
        6: "Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 3,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 3,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 4,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 4,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },

    {
      fixtureId: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
      }),
      name: "mode 1",
    },
    {
      fixtureId: 5,
      channels: JSON.stringify({
        1: "Red",
        2: "Green",
        3: "Blue",
        4: "Dimmer",
        5: "Dummy",
        6: " Dummy",
      }),
      name: "mode 2",
    },
    {
      fixtureId: 2,
      channels: JSON.stringify({
        1: "Dimmer",
        2: "Dimmer fine",
        3: "Color Temp",
        4: "Color Temp fine",
        5: "Green/Magenta Point",
        6: "Green/Magenta Point fine",
        7: "Crossfade color",
        8: "Crossfade color fine",
        9: "Red intensity",
        10: "Red intensity fine",
        11: "Green intensity",
        12: "Green intensity fine",
        13: "Blue intensity",
        14: "Blue intensity fine",
        15: "White intensity",
        16: "White intensity fine",
        17: "Fan control",
        18: "Preset",
        19: "Strobe",
        20: "Reserved for future use",
      }),
      name: "mode 6",
      channelPairs16Bit: JSON.stringify([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [11, 12],
        [13, 14],
        [15, 16],
      ]),
    },
    {
      fixtureId: 1,
      channels: JSON.stringify({
        1: "Dimmer",
        2: "Dimmer fine",
        3: "Color Temp",
        4: "Color Temp fine",
        5: "Green/Magenta Point",
        6: "Green/Magenta Point fine",
        7: "Crossfade color",
        8: "Crossfade color fine",
        9: "Red intensity",
        10: "Red intensity fine",
        11: "Green intensity",
        12: "Green intensity fine",
        13: "Blue intensity",
        14: "Blue intensity fine",
        15: "White intensity",
        16: "White intensity fine",
        17: "Fan control",
        18: "Reserved for future use",
      }),
      name: "mode 6",
      channelPairs16Bit: JSON.stringify([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [11, 12],
        [13, 14],
        [15, 16],
      ]),
    },
    {
      fixtureId: 6,
      channels: JSON.stringify({
        1: "Dimmer",
      }),
      name: "Dimmer",
    },
  ],
  fixtureAssignments: [
    {
      channel: 1,
      fixtureId: 1,
      profileId: 12,
      patchId: 1,
    },
    {
      channel: 2,
      fixtureId: 1,
      profileId: 12,
      patchId: 2,
    },
    {
      channel: 9,
      fixtureId: 2,
      profileId: 11,
      patchId: 3,
    },
    {
      channel: 10,
      fixtureId: 2,
      profileId: 11,
      patchId: 4,
    },
    {
      channel: 11,
      fixtureId: 2,
      profileId: 11,
      patchId: 5,
    },
    {
      channel: 12,
      fixtureId: 2,
      profileId: 11,
      patchId: 6,
    },
    {
      channel: 13,
      fixtureId: 6,
      profileId: 13,
      patchId: 7,
    },
  ],
  scenesToFixtureAssignments: [
    {
      fixtureAssignmentId: 1,
      sceneId: 1,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 2,
      sceneId: 1,
      values: JSON.stringify([
        [1, 128],
        [2, 128],
      ]),
    },
    {
      fixtureAssignmentId: 3,
      sceneId: 1,
      values: JSON.stringify([
        [1, 128],
        [2, 128],
      ]),
    },
    {
      fixtureAssignmentId: 4,
      sceneId: 1,
      values: JSON.stringify([
        [1, 128],
        [2, 128],
      ]),
    },
    {
      fixtureAssignmentId: 5,
      sceneId: 1,
      values: JSON.stringify([
        [1, 128],
        [2, 128],
      ]),
    },
    {
      fixtureAssignmentId: 6,
      sceneId: 1,
      values: JSON.stringify([
        [1, 128],
        [2, 128],
      ]),
    },
    {
      fixtureAssignmentId: 1,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 2,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 3,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 4,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 5,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 6,
      sceneId: 2,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 1,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 2,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 3,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 4,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 5,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 6,
      sceneId: 3,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 1,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 2,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 3,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 4,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 5,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 6,
      sceneId: 4,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 1,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 2,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 3,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 4,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 5,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
    {
      fixtureAssignmentId: 6,
      sceneId: 5,
      values: JSON.stringify([
        [1, 255],
        [2, 255],
      ]),
    },
  ],
  shows: [{ name: "my first show" }, { name: "my second show" }],
};

export const testData = [
  {
    startAddress: 1,
    endAddress: 5,
    channel: 1,
    fixtureAssignmentId: 1,
    fixtureName: "Vortex",
    fixtureNotes: "test",
    profileChannels: {
      "1": "Red",
      "2": "Green",
      "3": "Blue",
      "4": "Dimmer",
      "5": "Dummy",
    },
    profileName: "mode 1",
    sceneId: 1,
    title: "Vortex 1 at full",
    values: [[4, 255]],
  },
  {
    startAddress: 5,
    endAddress: 10,
    channel: 2,
    fixtureAssignmentId: 2,
    fixtureName: "Vortex",
    fixtureNotes: "test",
    profileChannels: {
      "1": "Red",
      "2": "Green",
      "3": "Blue",
      "4": "Dimmer",
      "5": "Dummy",
    },
    profileName: "mode 1",
    sceneId: 1,
    title: "Vortex 2 at 50%",
    values: [[4, 255]],
  },
  {
    startAddress: 10,
    endAddress: 11,
    channel: 10,
    fixtureAssignmentId: 3,
    fixtureName: "S60",
    fixtureNotes: "test",
    profileChannels: {
      "1": "Red",
      "2": "Green",
      "3": "Blue",
      "4": "Dimmer",
      "5": "Dummy",
    },
    profileName: "mode 1",
    sceneId: 1,
    title: "S60 1 at 50%",
    values: [[4, 255]],
  },
  {
    startAddress: 11,
    endAddress: 15,
    channel: 11,
    fixtureAssignmentId: 4,
    fixtureName: "S60",
    fixtureNotes: "test",
    profileChannels: {
      "1": "Red",
      "2": "Green",
      "3": "Blue",
      "4": "Dimmer",
      "5": "Dummy",
    },
    profileName: "mode 1",
    sceneId: 1,
    title: "S60 2 at 50%",
    values: [[4, 255]],
  },
];
