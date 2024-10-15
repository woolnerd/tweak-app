export type ChannelObject = {
  startAddress: number;
  endAddress: number;
  channel: number;
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
