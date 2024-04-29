import {
  merge16BitValues,
  handleChannelValues,
  presentValueAsPercent,
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

      // current output values, we don't know what the latest values are from this
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

      // current output values, we don't know what the latest values are from this
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

  describe("Calculating percentage for display", () => {
    test("presentValueAsPrecent returns the properly formatted string with % ", () => {
      expect(presentValueAsPercent(65535)).toBe("100%");
      expect(presentValueAsPercent(65025)).toBe("99%");
      expect(presentValueAsPercent(49151)).toBe("75%");
      expect(presentValueAsPercent(48905)).toBe("75%");
      expect(presentValueAsPercent(45875)).toBe("70%");
      expect(presentValueAsPercent(6554)).toBe("10%");
      expect(presentValueAsPercent(257)).toBe("0%");
      expect(presentValueAsPercent(255)).toBe("100%");
      expect(presentValueAsPercent(128)).toBe("50%");
    });
  });
});
