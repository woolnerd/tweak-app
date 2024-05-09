import { ManualFixtureState } from "../../app/components/Fixture/types/Fixture.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import { ActionObject } from "../command-line/types/command-line-types.ts";
import { ProfileTarget } from "../types/buttons.ts";

export const profile = { 1: "DIMMER" };
export const fixture: ParsedCompositeFixtureInfo = {
  values: [
    [4, 255],
    [5, 255],
  ],
  channelPairs16Bit: [
    [1, 2],
    [4, 5],
  ],
  fixtureAssignmentId: 1,
  channel: 1,
  profileChannels: profile,
  profileName: "test",
  sceneId: 1,
  addressStart: 1,
  addressEnd: 10,
  title: "test",
  fixtureName: "fixture1",
  fixtureNotes: "test notes",
  colorTempHigh: 10000,
  colorTempLow: 2800,
  is16Bit: true,
};

export const profileColorTemp = {
  1: "DIMMER",
  2: "DIMMER fine",
  3: "COLOR TEMP",
  4: "COLOR TEMP fine",
};

export const fixtureColorTemp: ParsedCompositeFixtureInfo = {
  values: [
    [3, 255],
    [4, 255],
  ],
  channelPairs16Bit: [
    [1, 2],
    [3, 4],
  ],
  fixtureAssignmentId: 1,
  channel: 1,
  profileChannels: profile,
  profileName: "test",
  sceneId: 1,
  addressStart: 1,
  addressEnd: 10,
  title: "test",
  fixtureName: "fixture1",
  fixtureNotes: "test notes",
  colorTempHigh: 10000,
  colorTempLow: 2800,
  is16Bit: true,
};

export const manualFixtureStateObj: ManualFixtureState = {
  1: {
    values: [
      [1, 0],
      [2, 0],
    ],
    fixtureAssignmentId: 1,
    channel: 1,
    manualChannels: [1, 2],
  },
};

export const profile16bit = {
  1: "Dimmer",
  2: "Dimmer fine",
  3: "Color Temp",
  4: "Color temp fine",
};

export const profile8bit = {
  1: "Dimmer",
  2: "Color Temp",
};

export const actionObjectDimmer: ActionObject = {
  selection: [1],
  directive: 100,
  profileTarget: ProfileTarget.DIMMER,
  complete: true,
};

export function makeActionObj(temp: number) {
  return {
    selection: [1],
    directive: temp,
    profileTarget: ProfileTarget.COLOR_TEMP,
    complete: true,
  };
}
