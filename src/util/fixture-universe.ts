import Universe from "./universe";

export interface FixtureMap {
  fixtureId: string;
  startAddress: number;
  endAddress: number;
}

export type UniverseConstruct = null[] | FixtureMap[];

const UNIVERSE_SIZE = 512;

export default class FixtureUniverse extends Universe<FixtureMap> {
  constructor(_number: number) {
    super(_number);
  }

  public get getFixtures() {
    return this._addresses;
  }

  public addFixture(fixture: FixtureMap) {
    this.errorChecking(fixture, this.buildUniverse());

    this._addresses.push(fixture);

    //ensure sorted by start index
    this._addresses.sort((a, b) => a.startAddress - b.startAddress);
  }

  public removeFixture(fixture: FixtureMap) {
    const universe = this.buildUniverse();

    this.errorChecking(fixture, universe);

    this.getFixtures.forEach((fixture) => {
      for (let i = fixture.startAddress; i <= fixture.endAddress; i++) {
        universe[i] = null;
      }
    });
  }

  public buildUniverse(): UniverseConstruct {
    const display = Array(UNIVERSE_SIZE).fill(null);

    this.getFixtures.forEach((fixture) => {
      for (let i = fixture.startAddress; i <= fixture.endAddress; i++) {
        display[i] = fixture.fixtureId;
      }
    });

    return display;
  }

  public addressConflict(fixture: FixtureMap, universe: UniverseConstruct): boolean {
    for (let i = fixture.startAddress; i <= fixture.endAddress; i++) {
      if (universe[i] !== null && typeof universe[i] === "string") return true;
    }

    return false;
  }

  public footprintTooLarge(fixture: FixtureMap, universe: UniverseConstruct): boolean {
    return fixture.endAddress > universe.length;
  }

  private errorChecking(fixture: FixtureMap, universe: UniverseConstruct) {
    if (fixture.startAddress >= UNIVERSE_SIZE || fixture.startAddress < 0) {
      throw new Error("Out of bounds");
    }

    if (this.addressConflict(fixture, universe)) {
      throw new Error("Address not available");
    }

    if (this.footprintTooLarge(fixture, universe)) {
      throw new Error("Fixture cannot fit at address");
    }
  }
}
