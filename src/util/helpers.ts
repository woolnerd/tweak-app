/* eslint-disable import/prefer-default-export */

import {
  getManualFixtureKeys,
  getAllFixturesFromSceneKeys,
} from "./fixture-cache.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";

type FetchCallback = () => Promise<ParsedCompositeFixtureInfo[] | void>;

type SetCallback = (compositeFixtures: ParsedCompositeFixtureInfo[]) => void;

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
export function merge16BitValues(
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  values: ParsedCompositeFixtureInfo["values"],
) {
  // [ [1,128],[2,128] ]
  // [ [1,2], [3,4] ... ]
  const newValues: typeof values = [];
  values.forEach(([channel, dmxVal], idx) => {
    const coarseIdx = channelPairs16Bit.findIndex(
      ([coarse, fine]) => coarse === channel,
    );

    if (coarseIdx !== -1) {
      const coarseDmxVal = values[coarseIdx][1];
      const fineDmxVal = values[coarseIdx + 1][1];
      newValues.push([channel, coarseDmxVal * fineDmxVal]);
      values[coarseIdx + 1][1] = -1;
    } else if (dmxVal !== -1) {
      newValues.push([channel, dmxVal]);
    }
  });
  return newValues;
}

/**
 *
 * @param profileChannels {1: "Dimmer", 2: "Dimmer fine", 3: "Color Temp" ...}
 * @param values [ [1, 255], [2, 128], [3, 50] ]
 * @returns Mapped Profile object { "Dimmer": 255, "Dimmer fine": 128, "Color Temp": 50 }
 */
export function handleChannelValues(
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  values: ParsedCompositeFixtureInfo["values"],
  channelPairs16Bit: ParsedCompositeFixtureInfo["channelPairs16Bit"],
  is16Bit: ParsedCompositeFixtureInfo["is16Bit"],
  mergeFunc: (
    channelPairs: ParsedCompositeFixtureInfo["channelPairs16Bit"],
    valuesArg: ParsedCompositeFixtureInfo["values"],
  ) => number[][] = merge16BitValues,
): Record<string, number> | null {
  if (!profileChannels || !values) {
    return null;
  }

  const result: Record<string, number> = {};

  if (is16Bit) {
    values = merge16BitValues(channelPairs16Bit, values);
  }

  values.forEach((tuple, idx) => {
    const [key, value] = tuple;

    const profile = profileChannels[key];

    if (profile && value !== -1) {
      result[profile] = value;
    }
  });

  return result;
}
export function presentValueAsPercent(val: number) {
  let func = Math.trunc;
  if (val > 256) {
    val /= 256;
    func = Math.round;
  }
  return `${func((val / 255) * 100)}%`;
}
