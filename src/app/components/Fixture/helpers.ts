import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import { merge16BitValues } from "../../../util/helpers.ts";
import { AddressTuples } from "../../../models/types/scene-to-fixture-assignment.ts";

/**
 *
 * @param profileChannels example: {1: "Dimmer", 2: "Dimmer fine", 3: "Color Temp" ...}
 * @param values example: [ [1, 255], [2, 128], [3, 50] ]
 * @returns Mapped Profile object example: { "Dimmer": 255, "Dimmer fine": 128, "Color Temp": 50 }
 */
export function handleChannelValues(
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  values: ParsedCompositeFixtureInfo["values"],
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  is16Bit: ParsedCompositeFixtureInfo["is16Bit"],
  manualFixtureCheckCB: (channel: number) => boolean,
  mergeFunc: (
    channelPairs: ParsedCompositeFixtureInfo["channelPairs16Bit"],
    valuesArg: ParsedCompositeFixtureInfo["values"],
  ) => AddressTuples = merge16BitValues,
): {
  result: Record<string, number>;
  manualStyleChannels: Record<string, boolean>;
} {
  const result: Record<string, number> = {};
  const manualStyleChannels: Record<string, boolean> = {};

  if (is16Bit) {
    values = mergeFunc(channelPairs16Bit, values);
  }

  buildResultAndManualStyleObj(
    values,
    profileChannels,
    result,
    manualFixtureCheckCB,
    manualStyleChannels,
  );

  return { result, manualStyleChannels };
}

/**
 *
 * @param values
 * @param profileChannels
 * @param result
 * @param callback
 * @param manualStyleObj
 * @returns
 */

//* Needs refactoring -- break into smaller functions to return separate values
function buildResultAndManualStyleObj(
  values: ParsedCompositeFixtureInfo["values"],
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  result: Record<string, number>,
  callback: (channel: number) => boolean,
  manualStyleObj: Record<string, boolean>,
) {
  if (!profileChannels || !values || !result) {
    return { result, manualStyleObj };
  }

  values.forEach((tuple, idx) => {
    const [key, value] = tuple;
    const profile = profileChannels[key];

    if (profile && value !== -1) {
      result[profile] = value;
    }

    if (callback(key)) {
      manualStyleObj[profile] = true;
    }
  });

  return { result, manualStyleObj };
}
