/* eslint-disable no-bitwise */
export default class ChannelValueCalculator {
  private percentage: number;

  private FULL_DMX_VALUE = 65535;

  private readonly calcPercentOfFullDMXVal: number;

  private readonly coarseValue: number;

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

  private boundsCheck() {
    if (this.percentage < -100) {
      throw new Error("Percentage cannot be less than -100");
    }

    if (this.percentage > 100) {
      throw new Error("Percentage cannot be greater than 100");
    }
  }
}
