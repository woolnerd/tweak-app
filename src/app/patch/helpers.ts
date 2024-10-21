import {
  PatchRowData,
  BuildPatchRowDataArgs,
  BuildChannelObjectArgs,
  ChannelObjectDisplay,
  FixtureMap,
  FixtureDataForPatch,
} from "./types/index.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";

export function payLoadWithAddresses(args: {
  showId: number;
  profileId: number;
  fixtureId: number;
  channelObjsToDisplay: ChannelObjectDisplay[];
}) {
  const { showId, profileId, fixtureId, channelObjsToDisplay } = args;

  return channelObjsToDisplay
    .filter((mixedObjs) => mixedObjs.selected)
    .map((dataObj) => ({
      startAddress: dataObj.startAddress as number,
      endAddress: dataObj.endAddress as number,
      channel: dataObj.channel,
      profileId,
      fixtureId,
      showId,
    }));
}

// export const buildPatchRowData = (args: BuildPatchRowDataArgs) => {
//   const {
//     compositeFixturesStore,
//     selectedChannels,
//     addressStartSelection,
//     profile,
//     manufacturers,
//     manufacturerSelection,
//     fixtures,
//     fixtureSelection,
//     profiles,
//     profileSelection,
//     showAllChannels,
//   } = args;
//   const CHANNEL_COUNT = 50;
//   const patchRows: PatchRowData[] = [];
//   const fixtureMap = compositeFixturesStore.reduce(
//     (acc: FixtureMap, fixture) => {
//       acc[fixture.channel] = {
//         channel: fixture.channel,
//         manufacturerName: fixture.manufacturerName,
//         fixtureName: fixture.fixtureName,
//         profileName: fixture.profileName,
//         startAddress: fixture.startAddress,
//         endAddress: fixture.endAddress,
//         selected: selectedChannels.includes(fixture.channel),
//       };
//       return acc;
//     },
//     {},
//   );

//   function createAddress(channel: number, calc: number) {
//     return selectedChannels.includes(channel) ? calc : 0;
//   }

//   const profileFootprint = profile
//     ? // either it has a lot of profile channels, or it is a single channel device.
//       Object.keys(JSON.parse(profile.channels)).length
//     : 1;

//   const startAddressCalc = (fixtureOffset: number) =>
//     fixtureOffset * profileFootprint + addressStartSelection;

//   const endAddressCalc = (fixtureOffset: number) =>
//     fixtureOffset * profileFootprint -
//     1 +
//     addressStartSelection +
//     profileFootprint;

//   function handleFieldSelectionName(
//     channel: number,
//     list: { id: number; name: string }[],
//     selection: number,
//   ) {
//     const name = list.find((item) => item.id === selection)?.name;

//     return selection && selectedChannels.includes(channel) && name ? name : "-";
//   }

//   function buildChannelObject(channel: number) {
//     const channelIndex = selectedChannels.findIndex(
//       (selected) => selected === channel,
//     );
//     return {
//       channel,
//       selected: selectedChannels.includes(channel),
//       startAddress: createAddress(channel, startAddressCalc(channelIndex)),
//       endAddress: createAddress(channel, endAddressCalc(channelIndex)),
//       manufacturerName: handleFieldSelectionName(
//         channel,
//         manufacturers,
//         manufacturerSelection,
//       ),
//       fixtureName: handleFieldSelectionName(
//         channel,
//         fixtures,
//         fixtureSelection,
//       ),
//       profileName: handleFieldSelectionName(
//         channel,
//         profiles,
//         profileSelection,
//       ),
//     };
//   }

//   for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) {
//     const channelIsSelected = selectedChannels.includes(channel);

//     if (channel in fixtureMap && !channelIsSelected) {
//       patchRows.push(fixtureMap[channel]);
//     } else if (showAllChannels) {
//       patchRows.push(buildChannelObject(channel));
//     }
//   }

//   return patchRows.sort((a, b) => a.channel - b.channel);
// };

export const createAddress = (
  channel: number,
  calc: number,
  selectedChannels: number[],
) => (selectedChannels.includes(channel) ? calc : 0);

export const handleFieldSelectionName = <
  T extends { id: number; name: string },
>(
  channel: number,
  list: T[],
  selection: number,
  selectedChannels: number[],
) => {
  const name = list.find((item) => item.id === selection)?.name;
  return selection && selectedChannels.includes(channel) && name ? name : "-";
};

export const buildChannelObject = (args: BuildChannelObjectArgs) => {
  const {
    channel,
    selectedChannels,
    addressStartSelection,
    profileFootprint,
    manufacturers,
    manufacturerSelection,
    fixtures,
    fixtureSelection,
    profiles,
    profileSelection,
  } = args;

  const channelIndex = selectedChannels.findIndex(
    (selected) => selected === channel,
  );
  const startAddressCalc = (fixtureOffset: number) =>
    fixtureOffset * profileFootprint + addressStartSelection;

  const endAddressCalc = (fixtureOffset: number) =>
    fixtureOffset * profileFootprint -
    1 +
    addressStartSelection +
    profileFootprint;

  return {
    channel,
    selected: selectedChannels.includes(channel),
    startAddress: createAddress(
      channel,
      startAddressCalc(channelIndex),
      selectedChannels,
    ),
    endAddress: createAddress(
      channel,
      endAddressCalc(channelIndex),
      selectedChannels,
    ),
    manufacturerName: handleFieldSelectionName(
      channel,
      manufacturers,
      manufacturerSelection,
      selectedChannels,
    ),
    fixtureName: handleFieldSelectionName(
      channel,
      fixtures,
      fixtureSelection,
      selectedChannels,
    ),
    profileName: handleFieldSelectionName(
      channel,
      profiles,
      profileSelection,
      selectedChannels,
    ),
  };
};

export function buildFixtureMap(
  patchFixtureData: FixtureDataForPatch[],
  selectedChannels: number[],
) {
  return patchFixtureData.reduce((acc: FixtureMap, fixture) => {
    acc[fixture.channel] = {
      channel: fixture.channel,
      manufacturerName: fixture.manufacturerName,
      fixtureName: fixture.fixtureName,
      profileName: fixture.profileName,
      startAddress: fixture.startAddress,
      endAddress: fixture.endAddress,
      selected: selectedChannels.includes(fixture.channel),
    };
    return acc;
  }, {});
}

export const buildPatchRowData = (args: BuildPatchRowDataArgs) => {
  const {
    fixtureMap,
    selectedChannels,
    addressStartSelection,
    profile,
    manufacturers,
    manufacturerSelection,
    fixtures,
    fixtureSelection,
    profiles,
    profileSelection,
    showAllChannels,
  } = args;

  const CHANNEL_COUNT = 50;
  const patchRows: PatchRowData[] = [];
  const profileFootprint = profile
    ? Object.keys(JSON.parse(profile.channels)).length
    : 1;

  for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) {
    const channelIsSelected = selectedChannels.includes(channel);

    if (channel in fixtureMap && !channelIsSelected) {
      patchRows.push(fixtureMap[channel]);
    } else if (showAllChannels) {
      patchRows.push(
        buildChannelObject({
          channel,
          selectedChannels,
          addressStartSelection,
          profileFootprint,
          manufacturers,
          manufacturerSelection,
          fixtures,
          fixtureSelection,
          profiles,
          profileSelection,
        }),
      );
    }
  }

  return patchRows.sort((a, b) => a.channel - b.channel);
};
