/* eslint-disable import/prefer-default-export */

import {
  getManualFixtureKeys,
  getAllFixturesFromSceneKeys,
} from "./fixture-cache.ts";
import {
  ParsedCompositeFixtureInfo,
  AddressTuples,
} from "../models/types/scene-to-fixture-assignment.ts";

type FetchCallback = () => Promise<ParsedCompositeFixtureInfo[]>;

type SetCallback = (compositeFixtures: ParsedCompositeFixtureInfo[]) => void;

/**
 *
 * @param resultValueArray
 * @param tupleArray
 * @param compute16bitVal
 * @param channel
 * @param dmxVal
 * @param valuesArray
 */
function choose8bitOrBuildValueTupleFor16bit(
  resultValueArray: number[][],
  tupleArray: number[][],
  compute16bitVal: (coarseVal: number, fineVal: number) => number,
  channel: number,
  dmxVal: number,
  valuesArray: number[][],
) {
  const coarseIdx = tupleArray.findIndex(([coarse, _]) => coarse === channel);
  const isCoarse16BitChannel = coarseIdx !== -1;

  if (isCoarse16BitChannel) {
    const coarseDmxVal = dmxVal;
    const fineDmxVal = valuesArray[coarseIdx + 1][1];

    resultValueArray.push([channel, compute16bitVal(coarseDmxVal, fineDmxVal)]);
  }

  const fineIdx = tupleArray.findIndex(([_, fine]) => fine === channel);
  const isFine16BitChannel = fineIdx !== -1;

  if (!isCoarse16BitChannel && !isFine16BitChannel) {
    resultValueArray.push([channel, dmxVal]);
  }
}

/**
 *
 * @param channelPairs16Bit
 * @param values
 * @returns
 */
export function merge16BitValues(
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  values: ParsedCompositeFixtureInfo["values"],
): AddressTuples {
  const compute16bitVal = (coarseVal: number, fineVal: number) =>
    coarseVal * 256 + fineVal;

  const newValues: typeof values = [];

  values.forEach(([channel, dmxVal]) => {
    choose8bitOrBuildValueTupleFor16bit(
      newValues,
      channelPairs16Bit,
      compute16bitVal,
      channel,
      dmxVal,
      values,
    );
  });
  return newValues;
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
 * @param num
 * @returns
 */
function dynamicRound(num: number) {
  const decimalPart = num - Math.floor(num);

  if (decimalPart >= 0.5) {
    return Math.ceil(num);
  }
  return Math.floor(num);
}

/**
 * Handles 8-bit and 16-bit values and converts 0-100
 * @param val
 * @param rounding
 * @returns
 */
export function convertDmxValueToPercent(
  val: number,
  rounding: (n: number) => number = dynamicRound,
) {
  if (val > 256) {
    return Math.round((val / 65535) * 100 * 100) / 100;
  }

  return Math.round((val / 255) * 100 * 100) / 100;
}

/**
 * Converts a percentage (0-100) to Color Temperature integer
 * @param percentage
 * @param lowTemp
 * @param highTemp
 * @returns
 */
export function percentageToColorTemperature(
  percentage: number,
  lowTemp: number,
  highTemp: number,
) {
  percentage = Math.min(Math.max(percentage, 0), 100);

  const colorTempRange = highTemp - lowTemp;
  const colorTemp = lowTemp + colorTempRange * (percentage / 100); // not rounding

  return Math.round(colorTemp * 0.01) * 100;
}

/**
 *
 * @param percentage
 * @returns
 */
export function percentageToIntensityLevel(percentage: number) {
  return Math.round(percentage);
}

//* Not implemented -- remove?
export function mergeTupleArrays(
  dbStateArray: number[][],
  manualStateArray: number[][],
) {
  return dbStateArray.map(([dbStateFirst, dbStateSecond]) => {
    const matchingTuple = manualStateArray.find(
      ([manualFirst]) => manualFirst === dbStateFirst,
    );
    return matchingTuple || [dbStateFirst, dbStateSecond];
  });
}

// * Not implemented. Add cache work in the future.
export async function mergeCacheWithDBFixtures(
  selectedSceneId: number,
  fetchCallback: FetchCallback,
  setCallback: SetCallback,
) {
  try {
    const keys = await getManualFixtureKeys();
    if (keys) {
      const cachedFixtures = await getAllFixturesFromSceneKeys(
        keys,
        selectedSceneId,
      );

      const dbFixtures = await fetchCallback();

      if (cachedFixtures instanceof Array && dbFixtures instanceof Array) {
        setCallback(
          [...cachedFixtures, ...dbFixtures].sort(
            // sort by id, later use X,Y for draggable interface
            (a, b) => a.channel - b.channel,
          ),
        );
      } else {
        throw new Error();
      }

      return;
    }
    throw new Error("Something went wrong");
  } catch (err) {
    console.log(err);
  }
}
