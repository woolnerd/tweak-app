interface CompositeFixtureInfo {
  fixtureAssignmentId: number;
  channel: number;
  profileName: string;
  fixtureName: string;
  fixtureNotes: string;
  sceneId: number;
  startAddress: number;
  colorTempLow: number;
  colorTempHigh: number;
}

type ProfileDescription = string;
type DmxValue = number;
type Address = number;
type ProfileKey = number;
export type ProfileChannels = Record<ProfileKey, ProfileDescription>;
export type AddressTuples = [Address, DmxValue][];

export interface ParsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: AddressTuples;
  profileChannels: ProfileChannels;
  channelPairs16Bit: number[][];
  is16Bit: boolean;
  endAddress: number;
}

export interface UnparsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: string;
  profileChannels: string;
  channelPairs16Bit: string;
}
