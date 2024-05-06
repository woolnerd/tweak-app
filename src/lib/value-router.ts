import ProfileAdapter from "./adapters/profile-adapter.ts";
import { ActionObject } from "./command-line/types/command-line-types.ts";
import { ProfileTarget } from "./types/buttons.ts";
import {
  ManualFixtureObj,
  ManualFixtureState,
} from "../components/types/fixture.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class ValueRouter<T extends ManualFixtureObj> {
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

  createManualFixtureObj(
    fixture: T,
    manualFixturesStore: ManualFixtureState,
  ): ManualFixtureState {
    const manualFixtureObj = this.setUpManualFixture(
      fixture,
      manualFixturesStore,
    );

    this.mutateOrMergeOutputValues(manualFixtureObj);

    return {
      [fixture.channel]: manualFixtureObj,
    };
  }

  private setUpManualFixture(
    fixture: T,
    manualFixturesStore: ManualFixtureState,
  ) {
    const manualFixtureObj =
      fixture.channel in manualFixturesStore
        ? manualFixturesStore[fixture.channel]
        : {
            values: fixture.values,
            channel: fixture.channel,
            fixtureAssignmentId: fixture.fixtureAssignmentId,
            manualChannels: [],
          };

    const channelList = this.channelTuples.map((tuple) => tuple[0]);

    manualFixtureObj.manualChannels = Array.from(
      new Set((manualFixtureObj.manualChannels ?? []).concat(channelList)),
    );

    return manualFixtureObj;
  }

  private mutateOrMergeOutputValues(manualFixtureObj: ManualFixtureObj) {
    if (Object.keys(manualFixtureObj).length === 0) return;
    this.channelTuples.forEach((tuple) => {
      const channel = tuple[0];
      const tupleToMutateIdx = manualFixtureObj.values.findIndex(
        (fixtureTuple) => fixtureTuple[0] === channel,
      );

      if (tupleToMutateIdx === -1) {
        // don't mutate just push tuple into channel list.
        manualFixtureObj.values.push(tuple);
      } else {
        // otherwise mutate
        manualFixtureObj.values[tupleToMutateIdx] = tuple;
      }
    });

    manualFixtureObj?.values?.sort((a, b) => a[0] - b[0]);
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
