export type ManualFixtureObj = {
  fixtureAssignmentId: number;
  channel: number;
  values: number[][];
  manualChannels?: number[];
};

export type ManualFixtureState = {
  [channel: number]: ManualFixtureObj;
};
