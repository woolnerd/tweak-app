import {
  ParsedCompositeFixtureInfo,
  AddressTuples,
} from "../models/types/scene-to-fixture-assignment.ts";

function choose8bitOrBuildValueTupleFor16btest(
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

export function merge16BitValues(
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  values: ParsedCompositeFixtureInfo["values"],
): AddressTuples {
  if (!values || values.length === 0) return [];
  const compute16bitVal = (coarseVal: number, fineVal: number) =>
    coarseVal * 256 + fineVal;

  const newValues: typeof values = [];

  values.forEach(([channel, dmxVal]) => {
    choose8bitOrBuildValueTupleFor16btest(
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
 * @returns Percentage value
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
 * @returns Color temp value. Example: 3400, 5600
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
 * Converts an intensity level to a rounded percentage
 * @param percentage
 * @returns integer
 */
export function percentageToIntensityLevel(percentage: number) {
  return Math.round(percentage);
}
