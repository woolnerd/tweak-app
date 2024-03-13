export default abstract class Universe<T> {
  protected _addresses: T[];
  protected _number: number;

  constructor(number: number) {
    this._number = number;
    this._addresses = [];
  }

  public get number() {
    return this._number;
  }
}
