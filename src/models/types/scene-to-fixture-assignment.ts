interface CompositeFixtureInfo {
  fixtureAssignmentId: number;
  channel: number;
  title: string | null;
  profileName: string | null;
  fixtureName: string | null;
  fixtureNotes: string | null;
  sceneId: number | null;
  addressStart: number | null;
  addressEnd: number | null;
  colorTempLow: number | null;
  colorTempHigh: number | null;
  is16Bit: boolean;
}

export interface ParsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: number[][];
  profileChannels: Record<number, string> | null;
  channelPairs16Bit: number[][];
}

export interface UnparsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: string | null;
  profileChannels: string | null;
  channelPairs16Bit: string;
}
