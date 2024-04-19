import ProfileAdapter from "./adapters/profile-adapter.ts";
import { ActionObject } from "./command-line/types/command-line-types.ts";
import { ProfileTarget } from "./types/buttons.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class ValueRouter {
  profileAdapter: ProfileAdapter;

  actionObject: ActionObject;

  channels: string[][];

  values: number[];

  calculator: ChannelValueCalculator;

  constructor(actionObject: ActionObject, profileAdapter: ProfileAdapter) {
    this.actionObject = actionObject;
    this.profileAdapter = profileAdapter;
    this.channels = this.profileAdapter.extractChannels();
    this.calculator = new ChannelValueCalculator(this.actionObject.directive);
    this.values = this.calculator.calc16BitValues();
  }

  buildResult() {
    if (this.checkIfProfileTargetsColorTemp()) {
      this.convertColorTempToPercentage();
    }

    if (this.channelIs16Bit()) {
      return this.parse16BitChannels();
    }
    if (this.channelIs8Bit()) {
      return this.parse8BitChannel();
    }

    throw new Error("Could not route Values");
  }

  convertColorTempToPercentage() {
    const minTemperature = 2800;
    const maxTemperature = 10_000;
    const temperature = this.actionObject.directive;
    console.log("inittemp", temperature);

    const percentage =
      ((temperature - minTemperature) / (maxTemperature - minTemperature)) *
      1000;
    console.log("convercolotempt", Number(percentage.toFixed(2)));

    this.actionObject.directive = Number(percentage.toFixed(2));
  }

  checkIfProfileTargetsColorTemp() {
    return this.actionObject.profileTarget === ProfileTarget.COLOR_TEMP;
  }

  channelIs16Bit() {
    return this.channels.length === 2;
  }

  channelIs8Bit() {
    return this.channels.length === 2;
  }

  parse16BitChannels() {
    return [
      [parseInt(this.channels[0][0], 10), this.values[0]],
      [parseInt(this.channels[1][0], 10), this.values[1]],
    ];
  }

  parse8BitChannel() {
    return [
      [parseInt(this.channels[0][0], 10), this.calculator.getCoarseValue()],
    ];
  }
}
