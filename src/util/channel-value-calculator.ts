export default class ChannelValueCalculator {
  private percentage: number;

  private FULL_DMX_VALUE = 65535;

  private readonly calcPercentOfFullDMXVal: number;

  public readonly coarseValue: number;

  private readonly fineValue: number;

  constructor(percentage: number) {
    this.percentage = percentage;
    this.ensureBounds();
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

  private ensureBounds() {
    if (this.percentage < 0) {
      this.percentage = 0;
    }
    if (this.percentage > 100) {
      this.percentage = 100;
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

  static split16BitValues(sixteenBitValue: number) {
    const coarseIncrement = Math.floor(sixteenBitValue >> 8) & 0xff; // Coarse part
    const fineIncrement = Math.floor(sixteenBitValue) & 0xff; // Fine part

    return [coarseIncrement, fineIncrement];
  }

  static build16BitValue(coarseVal: number, fineVal: number) {
    return (coarseVal << 8) + fineVal;
  }
}
