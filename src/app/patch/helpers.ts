import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import {
  PatchRowData,
  BuildPatchRowDataArgs,
  ChannelObjectDisplay,
  FixtureMap,
} from "./types/index.ts";

// eslint-disable-next-line import/prefer-default-export
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

export const buildPatchRowData = (args: BuildPatchRowDataArgs) => {
  const {
    compositeFixturesStore,
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
  const patchRows: (PatchRowData | ParsedCompositeFixtureInfo)[] = [];
  let fixtureOffset = -1;
  const fixtureMap = compositeFixturesStore.reduce(
    (acc: FixtureMap, fixture) => {
      acc[fixture.channel] = fixture;
      return acc;
    },
    {},
  );

  function createAddress(channel: number, calc: number) {
    return selectedChannels.includes(channel) ? calc : 0;
  }

  const profileFootprint = profile
    ? // either it has a lot of profile channels, or it is a single channel device.
      Object.keys(JSON.parse(profile.channels)).length
    : 1;

  const startAddressCalc = (addressGrp: number) =>
    fixtureOffset * profileFootprint + addressStartSelection;

  const endAddressCalc = (addressGrp: number) =>
    fixtureOffset * profileFootprint -
    1 +
    addressStartSelection +
    profileFootprint;

  function handleFieldSelectionName(
    channel: number,
    list: { id: number; name: string }[],
    selection: number,
  ) {
    const name = list.find((item) => item.id === selection)?.name;

    return selection && selectedChannels.includes(channel) && name ? name : "-";
  }

  function buildChannelObject(channel: number, addressGrp: number) {
    return {
      channel,
      selected: selectedChannels.includes(channel),
      startAddress: createAddress(channel, startAddressCalc(fixtureOffset)),
      endAddress: createAddress(channel, endAddressCalc(fixtureOffset)),
      manufacturerName: handleFieldSelectionName(
        channel,
        manufacturers,
        manufacturerSelection,
      ),
      fixtureName: handleFieldSelectionName(
        channel,
        fixtures,
        fixtureSelection,
      ),
      profileName: handleFieldSelectionName(
        channel,
        profiles,
        profileSelection,
      ),
      fixtureOffset,
    };
  }

  for (let channel = 1; channel <= CHANNEL_COUNT; channel += 1) {
    const channelIsSelected = selectedChannels.includes(channel);

    if (channelIsSelected) {
      fixtureOffset += 1;
    }

    if (channel in fixtureMap && !channelIsSelected) {
      patchRows.push(fixtureMap[channel]);
    } else if (showAllChannels) {
      patchRows.push(buildChannelObject(channel, fixtureOffset));
    }
  }

  return patchRows.sort((a, b) => a.channel - b.channel);
};
