export default abstract class Universe<T> {
  protected addresses: T[];

  protected number: number;

  constructor(number: number) {
    this.number = number;
    this.addresses = [];
  }

  public get getNumber() {
    return this.number;
  }
}
