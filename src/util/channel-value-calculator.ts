/* eslint-disable no-bitwise */
export default class ChannelValueCalculator {
  private percentage: number;

  private FULL_DMX_VALUE = 65535;

  private readonly calcPercentOfFullDMXVal: number;

  public readonly coarseValue: number;

  private readonly fineValue: number;

  constructor(percentage: number) {
    this.percentage = percentage;
    this.boundsCheck();
    this.calcPercentOfFullDMXVal = Math.round(
      (this.FULL_DMX_VALUE * this.percentage) / 100,
    );
    this.coarseValue = this.calcPercentOfFullDMXVal / 256;
    this.fineValue = this.calcPercentOfFullDMXVal % 256;
  }

  public calc16BitValues(): number[] {
    return [Math.trunc(this.coarseValue), Math.trunc(this.fineValue)];
  }

  public calc8BitValues(): number[] {
    return [Math.trunc(this.coarseValue)];
  }

  private boundsCheck() {
    if (this.percentage < -100) {
      throw new Error("Percentage cannot be less than -100");
    }

    if (this.percentage > 100) {
      throw new Error("Percentage cannot be greater than 100");
    }
  }

  /**
   * Converts a tuple to a percentage, checking if 8 bit or 16 bit.
   * @param dmxValues number[[]]
   * @returns number representing an percent as an integer.
   */
  static dmxToPercentage(dmxValues: number[][]) {
    const channel1 = dmxValues[0][1] + 1;
    if (dmxValues.length === 2) {
      const channel2 = dmxValues[1][1] + 1;
      // 16-bit
      return Math.trunc(((channel1 * channel2) / 65536) * 100);
    }
    // 8- Bit
    return Math.trunc((channel1 / 255) * 100);
  }
}
