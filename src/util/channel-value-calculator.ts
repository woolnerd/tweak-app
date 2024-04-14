/* eslint-disable no-bitwise */
export default class ChannelValueCalculator {
  private percentage: number;

  private FULL_DMX_VALUE = 256 * 256;

  public calc16BitValues(): number[] {
    return [this.getCoarseValue(), this.getFineValue()];
  }

  private getCoarseValue() {
    return Math.floor((65536 * this.percentage) / 256);
  }

  private getFineValue() {
    return this.getCoarseValue() & 255;
  }
}
