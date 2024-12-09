import { ParsedCompositeFixtureInfo } from "../types/scene-to-fixture-assignment.ts";

const mockCompositeFixtures: ParsedCompositeFixtureInfo[] = [
  {
    fixtureAssignmentId: 1,
    channel: 1,
    values: [
      [1, 255],
      [2, 255],
    ],
    profileChannels: {
      1: "Dimmer",
      2: "Dimmer fine",
      3: "Color temp",
      4: "Color temp fine",
    },
    profileName: "Profile 1",
    fixtureName: "Fixture 1",
    fixtureNotes: "no notes",
    sceneId: 1,
    startAddress: 21,
    endAddress: 24,
    channelPairs16Bit: [
      [1, 2],
      [3, 4],
    ],
    is16Bit: true,
    manufacturerName: "arri",
    colorTempHigh: 10000,
    colorTempLow: 2800,
  },
  {
    fixtureAssignmentId: 2,
    channel: 2,
    values: [
      [1, 128],
      [2, 255],
    ],
    profileChannels: {
      1: "Dimmer",
      2: "red",
      3: "green",
      4: "blue",
    },
    profileName: "Profile 1",
    fixtureName: "Fixture 2",
    fixtureNotes: "no notes",
    sceneId: 1,
    startAddress: 1,
    endAddress: 20,
    colorTempLow: 2800,
    colorTempHigh: 10000,
    channelPairs16Bit: [],
    is16Bit: false,
    manufacturerName: "arri",
  },
];

const ScenesToFixtureAssignments = jest.fn().mockImplementation(() => ({
  getCompositeFixtureInfo: jest.fn().mockResolvedValue(mockCompositeFixtures),
}));

export default ScenesToFixtureAssignments;
