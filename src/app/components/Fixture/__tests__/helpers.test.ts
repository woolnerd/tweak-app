import {
  // handleChannelValues,
  processChannelValues,
  buildObjectDetailData,
  buildObjectDetailManualStyleObj,
} from "../helpers.ts";
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

    const is16Bit = true;

    const values = processChannelValues(values1, channelPairs16Bit1, is16Bit);

    // const { objectDetails: result1 } = handleChannelValues(
    //   profileChannels1,
    //   values1,
    //   channelPairs16Bit1,
    //   true,
    //   () => true,
    // );

    // expect(values).toStrictEqual([
    //   [1, 65535],
    //   [3, 32896],
    // ]);

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

    // const { objectDetails: result2 } = handleChannelValues(
    //   profileChannels2,
    //   values2,
    //   channelPairs16Bit2,
    //   true,
    //   () => true,
    // );
    // expect(result2).toStrictEqual({ "Color Temp": 32896 });
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

    // const { objectDetails } = handleChannelValues(
    //   profileChannels,
    //   values,
    //   channelPairs16Bit,
    //   true,
    //   () => true,
    // );

    // expect(objectDetails).toStrictEqual({ Dimmer: 65280 });
  });

  test("it handles 8bit channels", () => {
    const profileChannels = {
      1: "Dimmer",
    };
    const values: AddressTuples = [[1, 255]];

    const channelPairs16Bit = [];

    // const { objectDetails } = handleChannelValues(
    //   profileChannels,
    //   values,
    //   channelPairs16Bit,
    //   true,
    //   () => true,
    // );

    // expect(objectDetails).toStrictEqual({ Dimmer: 255 });
  });
});

describe("processChannelValues", () => {
  test("if the values belong to a 16Bit channel, they are become a 16Bit value dmx value", () => {
    const values: AddressTuples = [
      [1, 255],
      [2, 255],
      [3, 128],
      [4, 128],
    ];

    const channelPairs16Bit: AddressTuples = [
      [1, 2],
      [3, 4],
    ];

    const is16Bit = true;

    const processedValues = processChannelValues(
      values,
      channelPairs16Bit,
      is16Bit,
    );

    expect(processedValues).toStrictEqual([
      [1, 65535],
      [3, 32896],
    ]);
  });

  test("if the values belong to a 8Bit channel, they resolve to 8Bit value", () => {
    const values: AddressTuples = [
      [1, 255],
      [3, 128],
    ];

    const channelPairs16Bit: AddressTuples = [];

    const is16Bit = false;

    const processedValues = processChannelValues(
      values,
      channelPairs16Bit,
      is16Bit,
    );

    expect(processedValues).toStrictEqual([
      [1, 255],
      [3, 128],
    ]);
  });
});

describe("buildObjectDetailData", () => {
  test("should build object with profile field name, and the resolved value", () => {
    const profileChannels = {
      1: "Dimmer",
      2: "Dimmer fine",
      3: "Color Temp",
      4: "Color Temp fine",
    };

    const mutatedValues: AddressTuples = [
      [1, 65535],
      [3, 32896],
    ];

    const objectDetails = buildObjectDetailData(mutatedValues, profileChannels);

    expect(objectDetails).toStrictEqual({
      Dimmer: 65535,
      "Color Temp": 32896,
    });
  });
});

describe("buildObjectDetailManualStyleObject", () => {
  test("it builds an object to check if each profile channel is a manual style", () => {
    const values: AddressTuples = [
      [1, 65535],
      [3, 32896],
    ];

    const profileChannels = {
      1: "Dimmer",
      2: "Dimmer fine",
      3: "Color Temp",
      4: "Color Temp fine",
    };

    const isManualFixture = () => true;

    const manualStyleObject = buildObjectDetailManualStyleObj(
      values,
      profileChannels,
      isManualFixture,
    );

    expect(manualStyleObject).toStrictEqual({
      "Color Temp": true,
      Dimmer: true,
    });
  });
});
