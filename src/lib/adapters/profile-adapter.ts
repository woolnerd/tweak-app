import ChannelValueCalculator from "../../util/channel-value-calculator.ts";

export default class ProfileAdapter {
  profile: Record<number, string>;

  calc: ChannelValueCalculator;

  target: string;

  constructor(target: string, profile: Record<number, string>) {
    this.profile = profile;
    this.target = target;
  }

  parse(): string[][] {
    // find the channel that contains the target string
    // return it's key -- this key is the address that needs to mutated in the channels output
    // somehow determine 8bit vs 16bit
    const matchingChannels = Object.entries(this.profile).filter((channel) =>
      channel[1].toUpperCase().includes(this.target),
    );

    if (matchingChannels.length === 0) {
      console.log("Profile Target Not Found");
      return [];
    }

    return matchingChannels;
  }
}
