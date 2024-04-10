export default abstract class RangedValue {
  public value: number;
  protected lowerBound: number;
  protected upperBound: number;

  constructor(value: number, lowerBound: number, upperBound: number) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;

    if (this.boundsCheck(value)) {
      this.value = value;
    } else {
      throw new Error(`Value must be between ${this.lowerBound} and ${this.upperBound}`);
    }
  }

  protected boundsCheck(value: number): boolean {
    return value > this.lowerBound && value < this.upperBound;
  }
}
