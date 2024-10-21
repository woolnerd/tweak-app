import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import {
  selectionHasColorTemp,
  selectionHasTint,
  selectionMaxColorTemp,
  selectionMinColorTemp,
  profileSearch,
} from "../ControlPanelButton/helpers.ts";

describe("ControlButton Helpers", () => {
  const fixturesWithTintAndColorTemp: ParsedCompositeFixtureInfo[] = [
    {
      fixtureAssignmentId: 1,
      channel: 1,
      values: [
        [1, 179],
        [2, 51],
        [3, 156],
        [4, 1],
      ],
      manufacturerName: "Arri",
      profileChannels: {
        "1": "Dimmer",
        "2": "Dimmer fine",
        "3": "Color Temp",
        "4": "Color Temp fine",
        "5": "Green/Magenta Point",
        "6": "Green/Magenta Point fine",
        "7": "Crossfade color",
        "8": "Crossfade color fine",
        "9": "Red intensity",
        "10": "Red intensity fine",
        "11": "Green intensity",
        "12": "Green intensity fine",
        "13": "Blue intensity",
        "14": "Blue intensity fine",
        "15": "White intensity",
        "16": "White intensity fine",
        "17": "Fan control",
        "18": "Preset",
        "19": "Strobe",
        "20": "Reserved for future use",
      },
      channelPairs16Bit: [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [11, 12],
        [13, 14],
        [15, 16],
      ],
      is16Bit: true,
      profileName: "mode 6",
      fixtureName: "Vortex",
      fixtureNotes: "test",
      sceneId: 1,
      startAddress: 1,
      endAddress: 20,
      colorTempLow: 2200,
      colorTempHigh: 15000,
    },
    {
      fixtureAssignmentId: 3,
      channel: 10,
      values: [
        [1, 179],
        [2, 51],
        [3, 35],
        [4, 143],
      ],
      manufacturerName: "Arri",
      profileChannels: {
        "1": "Dimmer",
        "2": "Dimmer fine",
        "3": "Color Temp",
        "4": "Color Temp fine",
        "5": "Green/Magenta Point",
        "6": "Green/Magenta Point fine",
        "7": "Crossfade color",
        "8": "Crossfade color fine",
        "9": "Red intensity",
        "10": "Red intensity fine",
        "11": "Green intensity",
        "12": "Green intensity fine",
        "13": "Blue intensity",
        "14": "Blue intensity fine",
        "15": "White intensity",
        "16": "White intensity fine",
        "17": "Fan control",
        "18": "Reserved for future use",
      },
      channelPairs16Bit: [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [11, 12],
        [13, 14],
        [15, 16],
      ],
      is16Bit: true,
      profileName: "mode 6",
      fixtureName: "S60",
      fixtureNotes: "test",
      sceneId: 1,
      startAddress: 41,
      endAddress: 60,
      colorTempLow: 2800,
      colorTempHigh: 10000,
    },
  ];

  const fixturesWithoutAllAttrs: ParsedCompositeFixtureInfo[] = [
    {
      fixtureAssignmentId: 1,
      channel: 1,
      values: [[1, 128]],
      manufacturerName: "Arri",
      profileChannels: { "1": "Dimmer" },
      channelPairs16Bit: [],
      is16Bit: false,
      profileName: "",
      fixtureName: "Dimmer",
      fixtureNotes: "test",
      sceneId: 1,
      startAddress: 1,
      endAddress: 1,
      colorTempLow: 99999,
      colorTempHigh: -1,
    },
    {
      fixtureAssignmentId: 2,
      channel: 10,
      values: [
        [1, 179],
        [2, 51],
        [3, 35],
        [4, 143],
      ],
      manufacturerName: "Arri",
      profileChannels: {
        "1": "Dimmer",
        "2": "Dimmer fine",
        "3": "Color Temp",
        "4": "Color Temp fine",
        "5": "Green/Magenta Point",
        "6": "Green/Magenta Point fine",
        "7": "Crossfade color",
        "8": "Crossfade color fine",
        "9": "Red intensity",
        "10": "Red intensity fine",
        "11": "Green intensity",
        "12": "Green intensity fine",
        "13": "Blue intensity",
        "14": "Blue intensity fine",
        "15": "White intensity",
        "16": "White intensity fine",
        "17": "Fan control",
        "18": "Reserved for future use",
      },
      channelPairs16Bit: [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
        [11, 12],
        [13, 14],
        [15, 16],
      ],
      is16Bit: true,
      profileName: "mode 6",
      fixtureName: "S60",
      fixtureNotes: "test",
      sceneId: 1,
      startAddress: 41,
      endAddress: 60,
      colorTempLow: 2800,
      colorTempHigh: 10000,
    },
  ];

  test("profile search", () => {
    const colorTempRegEx = /\b(color temp|cct)\b/i;
    const colorTintRegEx = /\b(tint|green\/magenta)\b/i;
    expect(profileSearch(fixturesWithTintAndColorTemp, colorTempRegEx)).toEqual(
      true,
    );

    expect(profileSearch(fixturesWithTintAndColorTemp, colorTintRegEx)).toBe(
      true,
    );

    expect(profileSearch(fixturesWithoutAllAttrs, colorTempRegEx)).toBe(false);
    expect(profileSearch(fixturesWithoutAllAttrs, colorTintRegEx)).toBe(false);
  });

  test("selectionHasColorTemp", () => {
    expect(selectionHasColorTemp(fixturesWithTintAndColorTemp)).toBe(true);
    expect(selectionHasColorTemp(fixturesWithoutAllAttrs)).toBe(false);
  });

  test("selectionHasTint", () => {
    expect(selectionHasTint(fixturesWithTintAndColorTemp)).toBe(true);
    expect(selectionHasTint(fixturesWithoutAllAttrs)).toBe(false);
  });

  test("selectionMaxColorTemp", () => {
    expect(selectionMaxColorTemp(fixturesWithTintAndColorTemp)).toBe(10000);
    expect(selectionMaxColorTemp(fixturesWithoutAllAttrs)).toBe(-1);
  });

  test("selectionMinColorTemp", () => {
    expect(selectionMinColorTemp(fixturesWithTintAndColorTemp)).toBe(2800);
    expect(selectionMinColorTemp(fixturesWithoutAllAttrs)).toBe(99999);
  });
});
