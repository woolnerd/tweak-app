import FixtureUniverse, { FixtureMap } from "../fixture-universe.ts";

describe("Universe", () => {
  let universe: FixtureUniverse;
  let fixtureMap1: FixtureMap;
  let fixtureMap2: FixtureMap;

  beforeEach(() => {
    universe = new FixtureUniverse(1);

    fixtureMap1 = {
      fixtureId: "123",
      startAddress: 41,
      endAddress: 60,
    };

    fixtureMap2 = {
      fixtureId: "456",
      startAddress: 1,
      endAddress: 20,
    };

    universe.addFixture(fixtureMap1);
    universe.addFixture(fixtureMap2);
  });

  test("assigns universe number to 1", () => {
    // eslint-disable-next-line dot-notation
    expect(universe["number"]).toEqual(1);
  });

  test("displays utilized fixture channels", () => {
    const display = universe.buildUniverse();

    expect(display[1]).toBe("456");
    expect(display[20]).toBe("456");
    expect(display[10]).toBe("456");
    expect(display[21]).toBeNull();

    expect(display[41]).toBe("123");
    expect(display[60]).toBe("123");
    expect(display[50]).toBe("123");
    expect(display[61]).toBeNull();

    expect(display[0]).toBeNull();
    expect(display[511]).toBeNull();
    expect(display[512]).toBe(undefined);
  });

  test("returns fixtures sorted by starting index", () => {
    expect(universe.getFixtures[0]).toBe(fixtureMap2);
    expect(universe.getFixtures[1]).toBe(fixtureMap1);
  });

  test("throws an error if address is not available", () => {
    expect(() => {
      universe.addFixture({
        fixtureId: "678",
        startAddress: 17,
        endAddress: 36,
      });
    }).toThrow("Address not available");
  });

  test("throws an error if fixture cannot fit", () => {
    expect(() => {
      universe.addFixture({
        fixtureId: "999",
        startAddress: 500,
        endAddress: 519,
      });
    }).toThrow("Fixture cannot fit at address");
  });

  test("throws an error if start address it out of bounds", () => {
    expect(() => {
      universe.addFixture({
        fixtureId: "999",
        startAddress: 512,
        endAddress: 532,
      });
    }).toThrow("Out of bounds");

    expect(() => {
      universe.addFixture({
        fixtureId: "999",
        startAddress: -1,
        endAddress: -20,
      });
    }).toThrow("Out of bounds");
  });
});
