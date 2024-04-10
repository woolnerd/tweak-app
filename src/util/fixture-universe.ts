import Universe from "./universe.ts";

export interface FixtureMap {
  fixtureId: string;
  startAddress: number;
  endAddress: number;
}

export type UniverseConstruct = null[] | FixtureMap[];

const UNIVERSE_SIZE = 512;

export default class FixtureUniverse extends Universe<FixtureMap> {
  public get getFixtures() {
    return this.addresses;
  }

  public addFixture(fixture: FixtureMap) {
    FixtureUniverse.errorChecking(fixture, this.buildUniverse());

    this.addresses.push(fixture);

    // ensure sorted by start index
    this.addresses.sort((a, b) => a.startAddress - b.startAddress);
  }

  public removeFixture(fixture: FixtureMap) {
    const universe = this.buildUniverse();

    FixtureUniverse.errorChecking(fixture, universe);

    this.getFixtures.forEach((fixtureEle) => {
      for (
        let i = fixtureEle.startAddress;
        i <= fixtureEle.endAddress;
        i += 1
      ) {
        universe[i] = null;
      }
    });
  }

  public buildUniverse(): UniverseConstruct {
    const display = Array(UNIVERSE_SIZE).fill(null);

    this.getFixtures.forEach((fixture) => {
      for (let i = fixture.startAddress; i <= fixture.endAddress; i += 1) {
        display[i] = fixture.fixtureId;
      }
    });

    return display;
  }

  static addressConflict(
    fixture: FixtureMap,
    universe: UniverseConstruct,
  ): boolean {
    for (let i = fixture.startAddress; i <= fixture.endAddress; i += 1) {
      if (universe[i] !== null && typeof universe[i] === "string") return true;
    }

    return false;
  }

  static footprintTooLarge(
    fixture: FixtureMap,
    universe: UniverseConstruct,
  ): boolean {
    return fixture.endAddress > universe.length;
  }

  static errorChecking(fixture: FixtureMap, universe: UniverseConstruct) {
    if (fixture.startAddress >= UNIVERSE_SIZE || fixture.startAddress < 0) {
      throw new Error("Out of bounds");
    }

    if (FixtureUniverse.addressConflict(fixture, universe)) {
      throw new Error("Address not available");
    }

    if (FixtureUniverse.footprintTooLarge(fixture, universe)) {
      throw new Error("Fixture cannot fit at address");
    }
  }
}
