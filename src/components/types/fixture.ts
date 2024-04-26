export type FixtureControlData = {
  channel: number;
  values: string;
  title?: string;
  profileChannels: string;
  profileName?: string | null;
  fixtureName: string;
  fixtureNotes?: string | null;
  fixtureId?: number | null;
  fixtureAssignmentId: number;
  sceneId: number;
  startAddress: number;
  endAddress: number;
};

export type FixtureAssignmentResponse = {
  fixtureAssignmentId: number;
  channel: number;
  values: string | null;
  title: string | null;
  profileChannels: string | null;
  profileName: string | null;
  fixtureName: string | null;
  fixtureNotes: string | null;
  sceneId: number;
  startAddress: number;
  endAddress: number;
}[];

export type ManualFixtureState = {
  fixtureAssignmentId: number;
  channel: number;
  values: number[][];
  manualChannels: number[];
};
