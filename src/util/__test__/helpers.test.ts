import {
  merge16BitValues,
  handleChannelValues,
  convertDmxValueToPercent,
  percentageToColorTemperature,
} from "../helpers.ts";

describe("Merge 16bit values", () => {
  test("it properly merges two tuples of dmx values", () => {
    const channelPairs16Bit = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const values = [
      [1, 128],
      [2, 128],
      [7, 255],
    ];

    const values8Bit = [
      [7, 255],
      [8, 255],
    ];

    expect(merge16BitValues(channelPairs16Bit, values)).toStrictEqual([
      [1, 32896],
      [7, 255],
    ]);
    expect(merge16BitValues(channelPairs16Bit, values8Bit)).toStrictEqual([
      [7, 255],
      [8, 255],
    ]);
  });

  describe("handleChannelValues properly merges 16bit channels, and 8bit channel with profile name", () => {
    test("it correctly handles 16bit channels", () => {
      const profileChannels1 = {
        1: "Dimmer",
        2: "Dimmer fine",
      };

      const values1 = [
        [1, 255],
        [2, 255],
        [3, 128],
        [4, 128],
      ];

      const channelPairs16Bit1 = [
        [1, 2],
        [3, 4],
      ];

      const { result: result1 } = handleChannelValues(
        profileChannels1,
        values1,
        channelPairs16Bit1,
        true,
        () => true,
      );

      expect(result1).toStrictEqual({ Dimmer: 65535 });

      const profileChannels2 = {
        3: "Color Temp",
        4: "Color Temp fine",
      };

      const values2 = [
        [1, 255],
        [2, 255],
        [3, 128],
        [4, 128],
      ];

      const channelPairs16Bit2 = [
        [1, 2],
        [3, 4],
      ];

      const { result: result2 } = handleChannelValues(
        profileChannels2,
        values2,
        channelPairs16Bit2,
        true,
        () => true,
      );
      expect(result2).toStrictEqual({ "Color Temp": 32896 });
    });

    test("it handles 16bit values that contain 0", () => {
      const profileChannels = {
        1: "Dimmer",
        2: "Dimmer fine",
        3: "Color Temp",
        4: "Color Temp fine",
      };
      const values = [
        [1, 255],
        [2, 0],
      ];
      const channelPairs16Bit = [
        [1, 2],
        [3, 4],
      ];

      const { result } = handleChannelValues(
        profileChannels,
        values,
        channelPairs16Bit,
        true,
        () => true,
      );

      expect(result).toStrictEqual({ Dimmer: 65280 });
    });
  });

  describe("Convert DMX Value to Percent", () => {
    test("presentValueAsPrecent returns the correct integer", () => {
      expect(convertDmxValueToPercent(65535)).toBe(100);
      expect(convertDmxValueToPercent(65025)).toBe(99);
      expect(convertDmxValueToPercent(49151)).toBe(75);
      expect(convertDmxValueToPercent(48905)).toBe(75);
      expect(convertDmxValueToPercent(45875)).toBe(70);
      expect(convertDmxValueToPercent(6554)).toBe(10);
      expect(convertDmxValueToPercent(257)).toBe(0);
      expect(convertDmxValueToPercent(255)).toBe(100);
      expect(convertDmxValueToPercent(128)).toBe(50);
    });
  });

  describe("Percentage to color temperature", () => {
    test("converts percentage to color temperature", () => {
      expect(percentageToColorTemperature(100, 2800, 10000)).toBe(10000);
      expect(percentageToColorTemperature(76, 2800, 10000)).toBe(8272);
      expect(percentageToColorTemperature(50, 2800, 10000)).toBe(6400);
      expect(percentageToColorTemperature(0, 2800, 10000)).toBe(2800);
    });
  });
});
