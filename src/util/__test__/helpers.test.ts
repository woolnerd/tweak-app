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
      [1, 16384],
      [7, 255],
    ]);
    expect(merge16BitValues(channelPairs16Bit, values8Bit)).toStrictEqual([
      [7, 255],
      [8, 255],
    ]);
  });

  describe("handleChannelValues properly merges 16bit channels, and 8bit channel with profile name", () => {
    test("it correctly handles 16bit channels", () => {
      const profileChannels = {
        1: "Dimmer",
        2: "Dimmer fine",
        3: "Color Temp",
        4: "Color Temp fine",
      };
      const values = [
        [1, 255],
        [2, 255],
      ];
      const channelPairs16Bit = [
        [1, 2],
        [3, 4],
      ];
      expect(
        handleChannelValues(profileChannels, values, channelPairs16Bit, true),
      ).toStrictEqual({ Dimmer: 65025 });
    });
  });

  describe("presentValueAsPrecent returns the properly formatted string with %", () => {
    expect(presentValueAsPercent(65025)).toBe("100%");
    expect(presentValueAsPercent(255)).toBe("100%");
    expect(presentValueAsPercent(128)).toBe("50%");
  });
});
