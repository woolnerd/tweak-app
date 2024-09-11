import { AddressTuples } from "../../../../models/types/scene-to-fixture-assignment.ts";

export type ManualFixtureObj = {
  fixtureAssignmentId: number;
  channel: number;
  values: AddressTuples;
  manualChannels?: number[];
};

export type ManualFixtureState = {
  [channel: number]: ManualFixtureObj;
};
