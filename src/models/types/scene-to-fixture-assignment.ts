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
}

export interface ParsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: number[][];
  profileChannels: Record<number, string> | null;
}

export interface UnparsedCompositeFixtureInfo extends CompositeFixtureInfo {
  values: string | null;
  profileChannels: string | null;
}
