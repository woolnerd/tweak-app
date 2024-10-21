import {
  SelectManufacturer,
  SelectFixture,
  SelectProfile,
} from "../../../db/types/tables.ts";

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

export type PatchRowData = {
  selected: boolean;
  channel: number;
  startAddress: number;
  endAddress: number;
  manufacturerName: string;
  fixtureName: string;
  profileName: string;
};

export type FixtureDataForPatch = Omit<PatchRowData, "selected"> & {
  fixtureAssignmentId: number;
};

interface BasePatchObjArgs {
  selectedChannels: number[];
  addressStartSelection: number;
  manufacturers: SelectManufacturer[];
  fixtures: SelectFixture[];
  profiles: SelectProfile[];
  manufacturerSelection: number;
  fixtureSelection: number;
  profileSelection: number;
  profile?: SelectProfile;
}
export interface BuildPatchRowDataArgs extends BasePatchObjArgs {
  showAllChannels: boolean;
  fixtureMap: Record<number, PatchRowData>;
}
export interface BuildChannelObjectArgs extends BasePatchObjArgs {
  channel: number;
  profileFootprint: number;
}

export type FixtureMap = Record<number, PatchRowData>;
