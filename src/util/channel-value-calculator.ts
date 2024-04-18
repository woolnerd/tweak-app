/* eslint-disable no-bitwise */
export default class ChannelValueCalculator {
  private percentage: number;

  private FULL_DMX_VALUE = 256 * 256;

  constructor(percentage: number) {
    this.percentage = percentage;
  }

  public calc16BitValues(): number[] {
    return [this.getCoarseValue(), this.getFineValue()];
  }

  public getCoarseValue() {
    return Math.floor((this.FULL_DMX_VALUE * this.percentage) / 256);
  }

  private getFineValue() {
    return this.getCoarseValue() & 255;
  }
}
