export type ChannelObject = {
  startAddress: number;
  endAddress: number;
  channelNum: number;
  selected: boolean;
};

export type ChannelObjectDisplay = Omit<
  ChannelObject,
  "startAddress" | "endAddress"
> & {
  endAddress?: number;
  startAddress?: number;
};

export type ChannelObjectPatch = Omit<ChannelObject, "selected"> & {
  fixtureId: number;
  showId: number;
  profileId: number;
};
