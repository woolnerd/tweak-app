import UniverseDataBuilder from "../universe-data-builder.ts";

describe("UniverseDataBuilder", () => {
  describe("toUniverseObject", () => {
    test("should initialize and populate universe object correctly", () => {
      const data = {
        addressStart: 1,
        addressEnd: 3,
        values: [
          [1, 100],
          [2, 150],
          [3, 200],
        ],
        profileChannels: null,
        channelPairs16Bit: [],
      };
      const builder = new UniverseDataBuilder(data);
      const result = builder.toUniverseObject();
      expect(result).toEqual({
        1: [100, 150, 200],
      });
    });

    test("should throw an error when addressStart, addressEnd, or values are null", () => {
      const data = {
        addressStart: null,
        addressEnd: 3,
        values: [
          [1, 100],
          [2, 150],
          [3, 200],
        ],
        profileChannels: null,
        channelPairs16Bit: [],
      };
      const builder = new UniverseDataBuilder(data);
      expect(() => builder.toUniverseObject()).toThrow(
        "Address start cannot be null",
      );
    });
  });

  describe("toUniverseTuples", () => {
    test("should convert data values into tuples correctly, applying transformations", () => {
      const data = {
        addressStart: 1,
        values: [
          [1, 100],
          [2, 150],
        ],
        profileChannels: null,
        channelPairs16Bit: [],
      };
      const builder = new UniverseDataBuilder(data);
      const result = builder.toUniverseTuples();
      expect(result).toEqual([
        [0, 100],
        [1, 150],
      ]);
    });
  });

  describe("buildDataOutput", () => {
    test("it should create an object with proper amount of universes", () => {});
  });
});
