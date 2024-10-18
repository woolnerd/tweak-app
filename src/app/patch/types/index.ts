import {
  SelectManufacturer,
  SelectFixture,
  SelectProfile,
} from "../../../db/types/tables.ts";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";

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
  compositeFixturesStore: ParsedCompositeFixtureInfo[];
  showAllChannels: boolean;
}
export interface BuildChannelObjectArgs extends BasePatchObjArgs {
  channel: number;
  profileFootprint: number;
}

export type FixtureMap = Record<number, PatchRowData>;
