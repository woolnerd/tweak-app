export type FixtureMap = {
  fixtureId: string;
  startAddress: number;
  endAddress: number;
};

export type UniverseConstructed = null[] | FixtureMap[];

const UNIVERSE_SIZE = 512;

export default class Universe {
  private _addresses: FixtureMap[];
  private _number: number;

  constructor(_number: number) {
    this._addresses = [];
    this._number = _number;
  }

  public get getFixtures() {
    return this._addresses;
  }

  public get number() {
    return this._number;
  }

  public addFixture(fixture: FixtureMap) {
    const universe = this.buildUniverse();

    if (fixture.startAddress >= UNIVERSE_SIZE || fixture.startAddress < 0) {
      throw new Error('Out of bounds');
    }

    if (this.addressConflict(fixture, universe)) {
      throw new Error('Address not available');
    }

    if (this.footprintTooLarge(fixture, universe)) {
      throw new Error('Fixture cannot fit at address');
    }

    this._addresses.push(fixture);

    //ensure sorted by start index
    this._addresses.sort((a, b) => a.startAddress - b.startAddress);
  }

  public buildUniverse(): UniverseConstructed {
    const display = Array(UNIVERSE_SIZE).fill(null);

    this.getFixtures.forEach((fixture) => {
      for (let i = fixture.startAddress; i <= fixture.endAddress; i++) {
        display[i] = fixture.fixtureId;
      }
    });

    return display;
  }

  public addressConflict(
    fixture: FixtureMap,
    universe: UniverseConstructed
  ): boolean {
    for (let i = fixture.startAddress; i <= fixture.endAddress; i++) {
      if (universe[i] !== null && typeof universe[i] === 'string') return true;
    }

    return false;
  }

  public footprintTooLarge(
    fixture: FixtureMap,
    universe: UniverseConstructed
  ): boolean {
    return fixture.endAddress > universe.length;
  }
}
