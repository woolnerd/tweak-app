import ProfileAdapter from "./adapters/profile-adapter.ts";
import { ActionObject } from "./command-line/types/command-line-types.ts";
import { ProfileTarget } from "./types/buttons.ts";
import { ManualFixtureState } from "../components/types/fixture.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class ValueRouter<T extends ManualFixtureState> {
  profileAdapter: ProfileAdapter;

  actionObject: ActionObject;

  channels: string[][];

  values: number[];

  calculator: ChannelValueCalculator;

  channelTuples: number[][];

  constructor(actionObject: ActionObject, profileAdapter: ProfileAdapter) {
    this.actionObject = actionObject;
    this.profileAdapter = profileAdapter;
    this.channels = this.profileAdapter.extractChannels();

    if (this.checkIfProfileTargetsColorTemp()) {
      this.convertColorTempToPercentage();
    }

    this.calculator = new ChannelValueCalculator(this.actionObject.directive);
  }

  mutateOrMergeFixtureChannels(fixture: T): ManualFixtureState {
    this.channelTuples.forEach((tuple) => {
      const channel = tuple[0];
      const tupleToMutateIdx = fixture.values!.findIndex(
        (fixtureTuple) => fixtureTuple[0] === channel,
      );

      if (tupleToMutateIdx === -1) {
        // don't mutate just push tuple into channel list.
        fixture.values!.push(tuple);
      } else {
        // otherwise mutate
        fixture.values![tupleToMutateIdx] = tuple;
      }
      fixture.values.sort((a, b) => a[0] - b[0]);
    });
    return {
      fixtureAssignmentId: fixture.fixtureAssignmentId,
      channel: fixture.channel,
      values: fixture.values,
    };
  }

  // outputs a tuple of [ channel, Value (btw 0-255) ]
  buildResult() {
    if (this.channelIs16Bit()) {
      this.values = this.calculator.calc16BitValues();
      this.channelTuples = this.parse16BitChannels();

      return this;
    }

    if (this.channelIs8Bit()) {
      this.values = this.calculator.calc8BitValues();
      this.channelTuples = this.parse8BitChannel();

      return this;
    }

    throw new Error("Could not route Values");
  }

  convertColorTempToPercentage() {
    const minTemperature = 2800; // hardcoded for now, but needs to be part of profile
    const maxTemperature = 10_000;
    const temperature = this.actionObject.directive;

    const percentage =
      ((temperature - minTemperature) / (maxTemperature - minTemperature)) *
      100;
    this.actionObject.directive = Number(percentage.toFixed(2));
  }

  checkIfProfileTargetsColorTemp() {
    return this.actionObject.profileTarget === ProfileTarget.COLOR_TEMP;
  }

  channelIs16Bit() {
    return this.channels.length === 2;
  }

  channelIs8Bit() {
    return this.channels.length === 1;
  }

  parse16BitChannels() {
    const coarseChannelNumber = parseInt(this.channels[0][0], 10);
    const coarseOutputValue = this.values[0];
    const fineChannelNumber = parseInt(this.channels[1][0], 10);
    const fineOutputValue = this.values[1];
    return [
      [coarseChannelNumber, coarseOutputValue],
      [fineChannelNumber, fineOutputValue],
    ];
  }

  parse8BitChannel() {
    const coarseChannelNumber = parseInt(this.channels[0][0], 10);
    const coarseOutputValue = this.values[0];
    return [[coarseChannelNumber, coarseOutputValue]];
  }
}
