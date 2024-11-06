import {
  buildPatchRowData,
  createAddress,
  handleFieldSelectionName,
  buildChannelObject,
  buildFixtureMap,
} from "../helpers.ts";
import {
  BuildChannelObjectArgs,
  BuildPatchRowDataArgs,
} from "../types/index.ts";

describe("buildChannelObject", () => {
  const manufacturers = [
    { id: 1, name: "Manufacturer A", notes: "A notes", website: "A.com" },
    { id: 2, name: "Manufacturer B", notes: "B notes", website: "B.com" },
  ];

  const fixtures = [
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
  ];

  const profiles = [
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
  ];

  const selectedChannel: BuildChannelObjectArgs = {
    channel: 1,
    selectedChannels: [1, 2, 3],
    addressStartSelection: 1,
    profileFootprint: 20,
    manufacturers,
    manufacturerSelection: 1,
    fixtures,
    fixtureSelection: 1,
    profiles,
    profileSelection: 1,
  };

  const unselectedChannel: BuildChannelObjectArgs = {
    channel: 10,
    selectedChannels: [1, 2, 3],
    addressStartSelection: 1,
    profileFootprint: 20,
    manufacturers,
    manufacturerSelection: 1,
    fixtures,
    fixtureSelection: 1,
    profiles,
    profileSelection: 1,
  };

  expect(buildChannelObject(selectedChannel)).toEqual({
    channel: 1,
    selected: true,
    startAddress: 1,
    endAddress: 20,
    manufacturerName: "Manufacturer A",
    fixtureName: "Fixture A",
    profileName: "Profile A",
  });

  expect(buildChannelObject(unselectedChannel)).toEqual({
    channel: 10,
    selected: false,
    startAddress: 0,
    endAddress: 0,
    manufacturerName: "-",
    fixtureName: "-",
    profileName: "-",
  });
});

describe("buildPatchRowData", () => {
  const fixtureMap = buildFixtureMap(
    [
      {
        channel: 1,
        endAddress: 20,
        fixtureAssignmentId: 1,
        fixtureName: "S60",
        manufacturerName: "Arri",
        profileName: "mode 6",
        startAddress: 1,
      },
      {
        channel: 2,
        endAddress: 60,
        fixtureAssignmentId: 21,
        fixtureName: "S60",
        manufacturerName: "Arri",
        profileName: "mode 6",
        startAddress: 41,
      },
    ],
    [1, 2],
  );

  test.skip("builds patch row data for selected channels", () => {
    // console.log({ fixtureMap });

    const args: BuildPatchRowDataArgs = {
      fixtureMap,
      selectedChannels: [1, 2],
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
        selected: true,
        startAddress: 41,
        endAddress: 60,
        manufacturerName: "Arri",
        fixtureName: "S60",
        profileName: "mode 6",
      },
    ]);
  });

  test.skip("returns empty patch rows when no channels are selected and showAllChannels is false", () => {
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

  test.skip("builds patch row data for all channels when showAllChannels is true", () => {
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
          notes: "Manuf notes",
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

  test.skip("handles non-selected channels correctly when showAllChannels is true", () => {
    const args = {
      fixtureMap,
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
