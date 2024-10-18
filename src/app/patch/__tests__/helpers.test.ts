import {
  buildPatchRowData,
  createAddress,
  handleFieldSelectionName,
  buildChannelObject,
} from "../helpers.ts";

// describe("buildPatchRowData", () => {
//   test("builds patch row data for selected channels", () => {
//     const args = {
//       compositeFixturesStore: [
//         {
//           channel: 1,
//           manufacturerName: "Manufacturer A",
//           fixtureName: "Fixture A",
//           profileName: "Profile A",
//           startAddress: 10,
//           endAddress: 20,
//         },
//         {
//           channel: 2,
//           manufacturerName: "Manufacturer B",
//           fixtureName: "Fixture B",
//           profileName: "Profile B",
//           startAddress: 30,
//           endAddress: 40,
//         },
//       ],
//       selectedChannels: [1],
//       addressStartSelection: 5,
//       manufacturers: [
//         { id: 1, name: "Manufacturer A" },
//         { id: 2, name: "Manufacturer B" },
//       ],
//       manufacturerSelection: 1,
//       fixtures: [
//         { id: 1, name: "Fixture A" },
//         { id: 2, name: "Fixture B" },
//       ],
//       fixtureSelection: 1,
//       profiles: [
//         {
//           id: 1,
//           name: "Profile A",
//           channels: JSON.stringify({
//             1: "Channel 1",
//             2: "Channel 2",
//             3: "Channel 3",
//           }),
//           fixtureId: 1,
//           ChannelPairs16Bit: JSON.stringify([]),
//         },
//       ],
//       profileSelection: 1,
//       showAllChannels: false,
//       profile: {
//         id: 1,
//         name: "Profile A",
//         channels: JSON.stringify({
//           1: "Channel 1",
//           2: "Channel 2",
//           3: "Channel 3",
//         }),
//         fixtureId: 1,
//         ChannelPairs16Bit: JSON.stringify([]),
//       },
//     };

//     const result = buildPatchRowData(args);

//     expect(result.slice(0, 2)).toEqual([
//       {
//         channel: 1,
//         selected: true,
//         startAddress: 5,
//         endAddress: 9,
//         manufacturerName: "Manufacturer A",
//         fixtureName: "Fixture A",
//         profileName: "Profile A",
//       },
//       {
//         channel: 2,
//         selected: false,
//         startAddress: 0,
//         endAddress: 0,
//         manufacturerName: "-",
//         fixtureName: "-",
//         profileName: "-",
//       },
//     ]);
//   });

//   test("returns empty patch rows when no channels are selected and showAllChannels is false", () => {
//     const args = {
//       compositeFixturesStore: [],
//       selectedChannels: [],
//       addressStartSelection: 5,
//       manufacturers: [],
//       manufacturerSelection: 0,
//       fixtures: [],
//       fixtureSelection: 0,
//       profiles: [],
//       profileSelection: 0,
//       showAllChannels: false,
//     };

//     const result = buildPatchRowData(args);

//     expect(result).toEqual([]);
//   });

//   test("builds patch row data for all channels when showAllChannels is true", () => {
//     const args = {
//       compositeFixturesStore: [],
//       selectedChannels: [1],
//       addressStartSelection: 5,
//       manufacturers: [
//         {
//           id: 1,
//           name: "Manufacturer A",
//           website: "A website",
//         },
//       ],
//       manufacturerSelection: 1,
//       fixtures: [
//         { id: 1, name: "Fixture A", notes: "A notes", manufacturerId: 1 },
//       ],
//       fixtureSelection: 1,
//       profiles: [{ id: 1, name: "Profile A" }],
//       profileSelection: 1,
//       showAllChannels: true,
//     };

//     const result = buildPatchRowData(args);

//     expect(result).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           channel: 1,
//           selected: true,
//           startAddress: 5,
//           endAddress: 9,
//           manufacturerName: "Manufacturer A",
//           fixtureName: "Fixture A",
//           profileName: "Profile A",
//         }),
//       ]),
//     );
//   });

//   test("handles non-selected channels correctly when showAllChannels is true", () => {
//     const args = {
//       compositeFixturesStore: [],
//       selectedChannels: [],
//       addressStartSelection: 5,
//       manufacturers: [],
//       manufacturerSelection: 0,
//       fixtures: [],
//       fixtureSelection: 0,
//       profiles: [],
//       profileSelection: 0,
//       showAllChannels: true,
//     };

//     const result = buildPatchRowData(args);

//     expect(result.length).toBe(50);
//     expect(result[0]).toEqual({
//       channel: 1,
//       selected: false,
//       startAddress: 0,
//       endAddress: 0,
//       manufacturerName: "-",
//       fixtureName: "-",
//       profileName: "-",
//     });
//   });
// });

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
