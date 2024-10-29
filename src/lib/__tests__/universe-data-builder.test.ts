import UniverseDataBuilder, {
  UniverseDataObjectCollection,
  PickFixtureInfo,
} from "../universe-data-builder.ts";

describe("UniverseDataBuilder", () => {
  describe("toUniverseTuples", () => {
    test("should convert data values into tuples correctly, applying transformations", () => {
      const data: PickFixtureInfo = {
        startAddress: 1,
        endAddress: 4,
        values: [
          [1, 100],
          [2, 150],
        ],
      };
      const builder = new UniverseDataBuilder(data);
      const result = builder.buildUniverses();
      expect(result).toEqual({
        1: [
          [0, 100],
          [1, 150],
        ],
      });
    });
  });

  describe("buildDataOutput", () => {
    test("it should create an object with proper amount of universes, and address vaues 0-indexed", () => {
      const data: PickFixtureInfo = {
        startAddress: 1,
        endAddress: 4,
        values: [
          [1, 100],
          [2, 150],
        ],
      };
      const builder = new UniverseDataBuilder(data);
      expect(builder.buildUniverses()).toStrictEqual({
        1: [
          [0, 100],
          [1, 150],
        ],
      });
    });
  });
  describe("deriveUniverseFromAddress", () => {
    test("should return the correct universe number when the start address is a multiple of UNIVERSE_SIZE", () => {
      const universeDataBuilder = new UniverseDataBuilder({
        startAddress: 1023,
        endAddress: 1027,
        values: [[2, 255]],
      });
      const result = universeDataBuilder.deriveUniverseFromAddress(1023);
      expect(result).toBe(3);
    });
  });

  describe("clampAddressToUniverseSize", () => {
    test("should return the correct address in context of a single universe", () => {
      const universeDataBuilder = new UniverseDataBuilder({
        startAddress: 1023,
        endAddress: 1027,
        values: [[2, 255]],
      });
      expect(universeDataBuilder.clampAddressToUniverseSize(1024)).toBe(0);
      expect(universeDataBuilder.clampAddressToUniverseSize(1023)).toBe(511);
      expect(universeDataBuilder.clampAddressToUniverseSize(512)).toBe(0);
      expect(universeDataBuilder.clampAddressToUniverseSize(2)).toBe(2);
    });
  });
  describe("mergeUniverseData", () => {
    test("it should create an object with universe keys, and tuples as values", () => {
      const data: UniverseDataObjectCollection[] = [
        {
          1: [
            [1, 100],
            [2, 150],
          ],
        },
        {
          1: [
            [3, 100],
            [4, 150],
          ],
        },
        {
          2: [
            [1, 100],
            [2, 150],
          ],
        },
      ];
      const result = UniverseDataBuilder.mergeUniverseData(data);
      expect(result).toStrictEqual({
        1: [
          [1, 100],
          [2, 150],
          [3, 100],
          [4, 150],
        ],
        2: [
          [1, 100],
          [2, 150],
        ],
      });
    });
  });

  describe("mapAddresses", () => {
    test("it maps channel tuples to map with keys as address and values as output value", () => {
      const channelTuples1 = [
        [1, 128],
        [2, 0],
        [3, 255],
        [4, 0],
      ];

      expect(UniverseDataBuilder.mapAddresses(channelTuples1)).toEqual({
        1: 128,
        2: 0,
        3: 255,
        4: 0,
      });
    });
  });

  describe("fillUniverseOutputValuesWithZero", () => {
    test("it creates an array of 512 output numbers", () => {
      const channelTuples1 = [
        [0, 128],
        [1, 0],
        [2, 255],
        [3, 0],
      ];

      const filledOutputValues =
        UniverseDataBuilder.fillUniverseOutputValuesWithZero(channelTuples1);
      expect(filledOutputValues.length).toBe(511);
      expect(filledOutputValues[0]).toBe(128);

      expect(filledOutputValues[1]).toBe(0);
      expect(filledOutputValues[2]).toBe(255);
      expect(filledOutputValues[3]).toBe(0);
    });
  });
});
