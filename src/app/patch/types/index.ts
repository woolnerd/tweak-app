import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
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

export type ChannelObjectPatch = Omit<ChannelObject, "selected"> & {
  fixtureId: number;
  showId: number;
  profileId: number;
};

export type PatchRowData = {
  channel: number;
  startAddress: number;
  endAddress: number;
  manufacturerName: string;
  fixtureName: string;
  profileName: string;
  selected: boolean;
};

export type BuildPatchRowDataArgs = {
  compositeFixturesStore: ParsedCompositeFixtureInfo[];
  selectedChannels: number[];
  addressStartSelection: number;
  manufacturers: SelectManufacturer[];
  fixtures: SelectFixture[];
  profiles: SelectProfile[];
  manufacturerSelection: number;
  fixtureSelection: number;
  profileSelection: number;
  profile?: SelectProfile;
  showAllChannels: boolean;
};

export type FixtureMap = Record<number, ParsedCompositeFixtureInfo>;
