import ChannelValueCalculator from "../../util/channel-value-calculator.ts";

export default class ProfileAdapter {
  profile: Record<number, string>;

  calc: ChannelValueCalculator;

  parse(commandEvents: string[]) {
    return this.profile;
  }
}
