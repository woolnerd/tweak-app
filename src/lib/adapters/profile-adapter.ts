export default class ProfileAdapter {
  profile: Record<number, string>;

  target: string;

  constructor(target: string, profile: Record<number, string>) {
    this.profile = profile;
    this.target = target;
  }

  extractChannels(): string[][] {
    // find the channel that contains the target string
    // return it's key -- this key is the address that needs to mutated in the channels output
    // somehow determine 8bit vs 16bit
    const matchingChannels = Object.entries(this.profile).filter((channel) =>
      channel[1].toUpperCase().includes(this.target.toUpperCase()),
    );

    if (matchingChannels.length < 1) {
      throw Error("Did not find matching channel");
    }

    if (matchingChannels.length > 2) {
      throw Error("Found too many possible channels");
    }

    return matchingChannels;
  }
}
