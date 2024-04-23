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

/**
 *
 * @param profileChannels {1: "Dimmer", 2: "Dimmer fine", 3: "Color Temp" ...}
 * @param values [ [1, 255], [2, 128], [3, 50] ]
 * @returns Mapped Profile object { "Dimmer": 255, "Dimmer fine": 128, "Color Temp": 50 }
 */
export function handleChannelValues(
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  values: ParsedCompositeFixtureInfo["values"],
): Record<string, number> | null {
  if (!profileChannels || !values) {
    return null;
  }

  const result = {};

  values.forEach((tuple, idx) => {
    const [key, value] = tuple;
    const profile = profileChannels[key];
    if (profile) {
      result[profile] = value;
    }
  });

  return result;
}
export function presentValueAsPercent(val: number) {
  return `${Math.trunc((val / 255) * 100)}%`;
}
