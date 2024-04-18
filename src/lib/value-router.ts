import ProfileAdapter from "./adapters/profile-adapter.ts";
import { ActionObject } from "./command-line/types/command-line-types.ts";
import ChannelValueCalculator from "../util/channel-value-calculator.ts";

export default class ValueRouter {
  profileAdapter: ProfileAdapter;

  actionObject: ActionObject;

  constructor(actionObject: ActionObject, profileAdapter: ProfileAdapter) {
    this.actionObject = actionObject;
    this.profileAdapter = profileAdapter;
  }

  buildResult() {
    // [ [ '1', 'Dimmer' ], [ '2', 'Dimmer fine' ] ]
    const channels = this.profileAdapter.parse();
    const calculator = new ChannelValueCalculator(this.actionObject.directive);
    if (channels.length === 2) {
      const values = calculator.calc16BitValues();

      return [
        [parseInt(channels[0][0], 10), values[0]],
        [parseInt(channels[1][0], 10), values[1]],
      ];
    }
    if (channels.length === 1) {
      return [[parseInt(channels[0][0], 10), calculator.getCoarseValue()]];
    }

    return [[0, 0]];
  }
}
