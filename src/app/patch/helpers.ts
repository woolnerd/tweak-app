import { ChannelObjectDisplay } from "./types/index.ts";

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

export const generateChannelListDisplay = <
  T extends { channel: number },
>(args: {
  firstAddress: number;
  profileSize: number;
  profileSelection: number | null;
  addressStartSelection: number;
  selectedChannels: number[];
  channelListCount: number;
  fixtureList: T[];
}) => {
  const {
    firstAddress,
    profileSize,
    profileSelection,
    addressStartSelection,
    selectedChannels,
    channelListCount,
    fixtureList,
  } = args;

  const patchRows: {
    channel: number;
    startAddress: number;
    manufacturerName: string;
    fixtureName: string;
    profileName: string;
  }[] = [];
  let startAddress = firstAddress;
  let endAddress = profileSize + firstAddress - 1;

  const fixtureMap = fixtureList.reduce(
    (acc, fixture) => {
      acc[fixture.channel] = fixture;
      return acc;
    },
    {} as Record<number, T>,
  );
  // we take our compositeFixtureData
  // add endAddress
  // add ProfileName

  for (let i = 1; i <= channelListCount; i += 1) {
    if (i in fixtureMap && profileSelection && addressStartSelection) {
      const patchInfo = fixtureMap[i];
      patchRows.push({
        channel: patchInfo.channel,
        endAddress,
      });
      startAddress += profileSize;
      endAddress += profileSize;
    } else {
      patchRows.push({
        channel: i,
      });
    }
  }
  return patchRows;
};
