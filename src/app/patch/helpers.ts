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
      channelNum: dataObj.channelNum,
      profileId,
      fixtureId,
      showId,
    }));
}

export const generateChannelListDisplay = (args: {
  firstAddress: number;
  profileSize: number;
  profileSelection: number | null;
  addressTextInput: string;
  selectedChannels: number[];
  channelListCount: number;
}) => {
  const {
    firstAddress,
    profileSize,
    profileSelection,
    addressTextInput,
    selectedChannels,
    channelListCount,
  } = args;

  const channelList = [];
  let startAddress = firstAddress;
  let endAddress = profileSize + firstAddress - 1;

  for (let i = 1; i <= channelListCount; i += 1) {
    if (selectedChannels.includes(i) && profileSelection && addressTextInput) {
      channelList.push({
        channelNum: i,
        selected: true,
        startAddress,
        endAddress,
      });
      startAddress += profileSize;
      endAddress += profileSize;
    } else {
      channelList.push({
        channelNum: i,
        selected: false,
      });
    }
  }
  return channelList;
};
