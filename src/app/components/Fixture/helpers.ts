import {
  ParsedCompositeFixtureInfo,
  AddressTuples,
} from "../../../models/types/scene-to-fixture-assignment.ts";
import { merge16BitValues } from "../../../util/helpers.ts";

/**
 * @param values example: [ [1, 255], [2, 128], [3, 50] ]
 * @param channelPairs16Bit represents the channels pairs that are 16Bit [ [1,2], [3,4]]
 * @param is16Bit a boolean check if 16Bit channel
 * @param mergeFunc function to create 16Bit value from 2 8Bit values (coarse and fine)
 * @returns Mapped Profile object example: { "Dimmer": 255, "Dimmer fine": 128, "Color Temp": 50 }
 */

export const processChannelValues = (
  values: ParsedCompositeFixtureInfo["values"],
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  is16Bit: ParsedCompositeFixtureInfo["is16Bit"],
  mergeFunc: (
    channelPairs: ParsedCompositeFixtureInfo["channelPairs16Bit"],
    valuesArg: ParsedCompositeFixtureInfo["values"],
  ) => AddressTuples = merge16BitValues,
) => {
  if (is16Bit) {
    values = mergeFunc(channelPairs16Bit, values);
  }
  return values;
};

/**
 * @param values [[1, 65535], [3, 32896]]
 * @param profileChannels { 1: "Dimmer", 2: "Dimmer fine", 3: "Color Temp", 4: "Color Temp fine", }
 * @returns detailData: {Dimmer: 65535, Color Temp: 32896 }
 */

export function buildObjectDetailData(
  values: ParsedCompositeFixtureInfo["values"],
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
) {
  if (!profileChannels || !values) {
    return {};
  }

  return values.reduce(
    (detailData: Record<string, number>, [address, value]) => {
      const profile = profileChannels[address];

      if (profile && value !== -1) {
        detailData[profile] = value;
      }

      return detailData;
    },
    {},
  );
}

/**
 * @param values [ [1, 65535], [3, 32896] ];
 * @param profileChannels { 1: "Dimmer", 2: "Dimmer fine", 3: "Color Temp", 4: "Color Temp fine", }
 * @param isManualFixture a function to check if the fixture is a manually selected, returns a boolean
 * @returns manualStyleObj: {"Color Temp": true, "Dimmer": true}
 */

export function buildObjectDetailManualStyleObj(
  values: ParsedCompositeFixtureInfo["values"],
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  isManualFixture: (channel: number) => boolean,
) {
  if (!profileChannels || !values) {
    return {};
  }

  return values.reduce(
    (manualStyleObj: Record<string, boolean>, [address, _]) => {
      const profile = profileChannels[address];

      if (isManualFixture(address)) {
        manualStyleObj[profile] = true;
      }

      return manualStyleObj;
    },
    {},
  );
}
