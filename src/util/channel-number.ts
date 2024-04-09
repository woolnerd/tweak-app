import RangedValue from "./ranged-value";

export class ChannelNumber extends RangedValue {
  constructor(value: number) {
    const LOW_CHANNEL_BOUND = 0;
    const HIGH_CHANNEL_BOUND = 511;

    super(value, LOW_CHANNEL_BOUND, HIGH_CHANNEL_BOUND);
  }
}
