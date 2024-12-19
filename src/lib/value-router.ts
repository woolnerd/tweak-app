import ProfileAdapter from "./adapters/profile-adapter.ts";
import { ActionObject } from "./command-line/types/command-line-types.ts";
import { ProfileTarget } from "./types/buttons.ts";
import {
  ManualFixtureObj,
  ManualFixtureState,
} from "../app/components/Fixture/types/Fixture.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class ValueRouter {
  profileAdapter: ProfileAdapter;

  actionObject: ActionObject;

  channels: string[][];

  values: number[];

  calculator: ChannelValueCalculator;

  channelTuples: number[][];

  fixture: ParsedCompositeFixtureInfo;

  constructor(
    actionObject: ActionObject,
    profileAdapter: ProfileAdapter,
    fixture: ParsedCompositeFixtureInfo,
  ) {
    this.actionObject = { ...actionObject };
    this.profileAdapter = profileAdapter;
    this.fixture = { ...fixture };
    this.channels = this.profileAdapter.extractChannels();

    if (this.checkIfProfileTargetsColorTemp()) {
      this.convertColorTempToPercentage(fixture);
    }

    this.calculator = new ChannelValueCalculator(this.actionObject.directive);
  }

  createManualFixtureObj(
    manualFixturesStore: ManualFixtureState,
  ): ManualFixtureState {
    const manualFixtureObj = this.setUpManualFixture(manualFixturesStore);

    this.mutateOrMergeOutputValues(manualFixtureObj);

    return {
      [this.fixture.channel]: manualFixtureObj,
    };
  }

  private setUpManualFixture(manualFixturesStore: ManualFixtureState) {
    const manualFixtureObj =
      this.fixture.channel in manualFixturesStore
        ? manualFixturesStore[this.fixture.channel]
        : {
            values: this.fixture.values,
            channel: this.fixture.channel,
            fixtureAssignmentId: this.fixture.fixtureAssignmentId,
            manualChannels: [],
          };

    const channelList = this.channelTuples.map(([channel, _]) => channel);

    manualFixtureObj.manualChannels = Array.from(
      new Set((manualFixtureObj.manualChannels ?? []).concat(channelList)),
    );

    return manualFixtureObj;
  }

  private mutateOrMergeOutputValues(manualFixtureObj: ManualFixtureObj) {
    if (Object.keys(manualFixtureObj).length === 0) return;

    this.channelTuples.forEach(([channel, output]) => {
      // const channel = tuple[0];
      const idxOfTupleToMutate = manualFixtureObj.values.findIndex(
        ([manualChannel, _]) => manualChannel === channel,
      );

      if (idxOfTupleToMutate === -1) {
        // don't mutate just push tuple into channel list.
        manualFixtureObj.values.push([channel, output]);
      } else {
        // otherwise mutate
        manualFixtureObj.values[idxOfTupleToMutate] = [channel, output];
      }
    });

    manualFixtureObj?.values?.sort((a, b) => a[0] - b[0]);
  }

  // outputs a tuple of [ channel, Value (btw 0-255) ]
  buildResult() {
    if (this.channelIs16Bit()) {
      this.values = this.calculator.calc16BitValues();
      this.channelTuples = this.parse16BitChannels();
    } else if (this.channelIs8Bit()) {
      this.values = this.calculator.calc8BitValues();
      this.channelTuples = this.parse8BitChannel();
    } else {
      throw new Error("Could not route Values");
    }

    return this;
  }

  convertColorTempToPercentage(fixture: ParsedCompositeFixtureInfo) {
    if (!this.fixture?.colorTempLow || !this.fixture?.colorTempHigh) {
      throw new Error("Fixture must have color temp channels");
    }
    const minTemperature = this.fixture.colorTempLow;
    const maxTemperature = this.fixture.colorTempHigh;
    let temperature;
    // bump temp to max or min if value is past max or min
    if (this.actionObject.directive <= minTemperature) {
      temperature = minTemperature;
    } else if (this.actionObject.directive >= maxTemperature) {
      temperature = maxTemperature;
    } else {
      temperature = this.actionObject.directive;
    }

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
    const [coarseOutputValue, fineOutputValue] = this.values;
    const coarseChannelNumber = parseInt(this.channels[0][0], 10);
    const fineChannelNumber = parseInt(this.channels[1][0], 10);
    return [
      [coarseChannelNumber, coarseOutputValue],
      [fineChannelNumber, fineOutputValue],
    ];
  }

  parse8BitChannel() {
    const coarseChannelNumber = parseInt(this.channels[0][0], 10);
    const [coarseOutputValue, _] = this.values;
    return [[coarseChannelNumber, coarseOutputValue]];
  }
}
