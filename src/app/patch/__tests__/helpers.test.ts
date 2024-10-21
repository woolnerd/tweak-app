import {
  buildPatchRowData,
  createAddress,
  handleFieldSelectionName,
  buildChannelObject,
  buildFixtureMap,
} from "../helpers.ts";
import { BuildPatchRowDataArgs } from "../types/index.ts";

describe("buildPatchRowData", () => {
  const fixtureMap = buildFixtureMap(
    [
      {
        channel: 1,
        values: [[1, 128]],
        channelPairs16Bit: [],
        colorTempHigh: 10000,
        colorTempLow: 2800,
        endAddress: 60,
        fixtureAssignmentId: 3,
        fixtureName: "S60",
        fixtureNotes: "test",
        is16Bit: true,
        manufacturerName: "Arri",
        profileChannels: {
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
        },
        profileName: "mode 6",
        sceneId: 1,
        startAddress: 41,
      },
      {
        channel: 2,
        values: [[1, 128]],
        channelPairs16Bit: [],
        colorTempHigh: 10000,
        colorTempLow: 2800,
        endAddress: 60,
        fixtureAssignmentId: 3,
        fixtureName: "S60",
        fixtureNotes: "test",
        is16Bit: true,
        manufacturerName: "Arri",
        profileChannels: {
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
        },
        profileName: "mode 6",
        sceneId: 1,
        startAddress: 41,
      },
    ],
    [1, 2, 3],
  );

  test("builds patch row data for selected channels", () => {
    console.log({ fixtureMap });

    const args: BuildPatchRowDataArgs = {
      fixtureMap,
      selectedChannels: [1],
      addressStartSelection: 5,
      manufacturers: [
        { id: 1, name: "Manufacturer A", notes: "A notes", website: "A.com" },
        { id: 2, name: "Manufacturer B", notes: "B notes", website: "B.com" },
      ],
      manufacturerSelection: 1,
      fixtures: [
        {
          id: 1,
          name: "Fixture A",
          notes: "A notes",
          manufacturerId: 1,
          colorTempRangeHigh: 10000,
          colorTempRangeLow: 2800,
        },
        {
          id: 2,
          name: "Fixture B",
          notes: "B notes",
          manufacturerId: 1,
          colorTempRangeHigh: 10000,
          colorTempRangeLow: 2800,
        },
      ],
      fixtureSelection: 1,
      profiles: [
        {
          id: 1,
          name: "Profile A",
          channels: JSON.stringify({
            1: "Channel 1",
            2: "Channel 2",
            3: "Channel 3",
          }),
          fixtureId: 1,
          channelPairs16Bit: JSON.stringify([]),
        },
      ],
      profileSelection: 1,
      showAllChannels: false,
      profile: {
        id: 1,
        name: "Profile A",
        channels: JSON.stringify({
          1: "Channel 1",
          2: "Channel 2",
          3: "Channel 3",
        }),
        fixtureId: 1,
        channelPairs16Bit: JSON.stringify([]),
      },
    };

    const result = buildPatchRowData(args);

    expect(result.slice(0, 2)).toEqual([
      {
        channel: 1,
        selected: true,
        startAddress: 5,
        endAddress: 9,
        manufacturerName: "Manufacturer A",
        fixtureName: "Fixture A",
        profileName: "Profile A",
      },
      {
        channel: 2,
        selected: false,
        startAddress: 0,
        endAddress: 0,
        manufacturerName: "-",
        fixtureName: "-",
        profileName: "-",
      },
    ]);
  });

  test("returns empty patch rows when no channels are selected and showAllChannels is false", () => {
    const args = {
      fixtureMap: {
        1: {
          channel: 1,
          selected: true,
          startAddress: 5,
          endAddress: 9,
          manufacturerName: "Manufacturer A",
          fixtureName: "Fixture A",
          profileName: "Profile A",
        },
      },
      selectedChannels: [],
      addressStartSelection: 5,
      manufacturers: [],
      manufacturerSelection: 0,
      fixtures: [],
      fixtureSelection: 0,
      profiles: [],
      profileSelection: 0,
      showAllChannels: false,
    };

    const result = buildPatchRowData(args);

    expect(result).toEqual([]);
  });

  test("builds patch row data for all channels when showAllChannels is true", () => {
    const args = {
      fixtureMap: {
        channel: 1,
        selected: true,
        startAddress: 5,
        endAddress: 9,
        manufacturerName: "Manufacturer A",
        fixtureName: "Fixture A",
        profileName: "Profile A",
      },
      selectedChannels: [1],
      addressStartSelection: 5,
      manufacturers: [
        {
          id: 1,
          name: "Manufacturer A",
          website: "A website",
        },
      ],
      manufacturerSelection: 1,
      fixtures: [
        { id: 1, name: "Fixture A", notes: "A notes", manufacturerId: 1 },
      ],
      fixtureSelection: 1,
      profiles: [{ id: 1, name: "Profile A" }],
      profileSelection: 1,
      showAllChannels: true,
    };

    const result = buildPatchRowData(args);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          channel: 1,
          selected: true,
          startAddress: 5,
          endAddress: 9,
          manufacturerName: "Manufacturer A",
          fixtureName: "Fixture A",
          profileName: "Profile A",
        }),
      ]),
    );
  });

  test("handles non-selected channels correctly when showAllChannels is true", () => {
    const args = {
      compositeFixturesStore: [],
      selectedChannels: [],
      addressStartSelection: 5,
      manufacturers: [],
      manufacturerSelection: 0,
      fixtures: [],
      fixtureSelection: 0,
      profiles: [],
      profileSelection: 0,
      showAllChannels: true,
    };

    const result = buildPatchRowData(args);

    expect(result.length).toBe(50);
    expect(result[0]).toEqual({
      channel: 1,
      selected: false,
      startAddress: 0,
      endAddress: 0,
      manufacturerName: "-",
      fixtureName: "-",
      profileName: "-",
    });
  });
});

describe("createAddress", () => {
  test("returns calc value when channel is selected", () => {
    const result = createAddress(1, 10, [1, 2, 3]);
    expect(result).toBe(10);
  });

  test("returns 0 when channel is not selected", () => {
    const result = createAddress(4, 10, [1, 2, 3]);
    expect(result).toBe(0);
  });
});

describe("handleFieldSelectionName", () => {
  test("returns the correct name when channel is selected and selection exists", () => {
    const list = [
      { id: 1, name: "Name A" },
      { id: 2, name: "Name B" },
    ];
    const result = handleFieldSelectionName(1, list, 1, [1, 2]);
    expect(result).toBe("Name A");
  });

  test('returns "-" when channel is not selected', () => {
    const list = [
      { id: 1, name: "Name A" },
      { id: 2, name: "Name B" },
    ];
    const result = handleFieldSelectionName(3, list, 1, [1, 2]);
    expect(result).toBe("-");
  });

  test('returns "-" when selection does not exist', () => {
    const list = [
      { id: 1, name: "Name A" },
      { id: 2, name: "Name B" },
    ];
    const result = handleFieldSelectionName(1, list, 3, [1, 2]);
    expect(result).toBe("-");
  });
});
