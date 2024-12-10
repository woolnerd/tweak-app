import { handleChannelValues } from "../helpers.ts";
import { AddressTuples } from "../../../../models/types/scene-to-fixture-assignment.ts";

describe("handleChannelValues properly merges 16bit channels, and 8bit channel with profile name", () => {
  test("it correctly handles 16bit channels", () => {
    const profileChannels1 = {
      1: "Dimmer",
      2: "Dimmer fine",
    };

    const values1: AddressTuples = [
      [1, 255],
      [2, 255],
      [3, 128],
      [4, 128],
    ];

    const channelPairs16Bit1: AddressTuples = [
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

    const values2: AddressTuples = [
      [1, 255],
      [2, 255],
      [3, 128],
      [4, 128],
    ];

    const channelPairs16Bit2: AddressTuples = [
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
    const values: AddressTuples = [
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

  test("it handles 8bit channels", () => {
    const profileChannels = {
      1: "Dimmer",
    };
    const values: AddressTuples = [[1, 255]];

    const channelPairs16Bit = [];

    const { result } = handleChannelValues(
      profileChannels,
      values,
      channelPairs16Bit,
      true,
      () => true,
    );

    expect(result).toStrictEqual({ Dimmer: 255 });
  });
});
