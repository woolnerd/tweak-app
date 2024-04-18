/* eslint-disable import/prefer-default-export */
import { SetStateAction, Dispatch } from "react";

import {
  getManualFixtureKeys,
  getAllFixturesFromSceneKeys,
} from "./fixture-cache.ts";
import {
  FixtureControlData,
  FixtureAssignmentResponse,
} from "../components/types/fixture.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";

type FetchCallback = () => Promise<ParsedCompositeFixtureInfo[] | void>;

// type SetCallback = (
//   arr: (FixtureControlData | Awaited<FetchCallback>)[],
// ) => Dispatch<SetStateAction<FixtureAssignmentResponse>>;

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
            (a, b) => a.fixtureAssignmentId - b.fixtureAssignmentId,
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

export function handleChannelValues(
  profileChannels: ParsedCompositeFixtureInfo["profileChannels"],
  values: ParsedCompositeFixtureInfo["values"],
): Record<string, number> | null {
  if (!profileChannels || !values) {
    return null;
  }

  const result = {};

  values.forEach((tuple) => {
    const [key, value] = tuple;
    const profile = profileChannels[key.toString()];
    if (profile) {
      result[profile] = value;
    }
  });

  // parsedValues.forEach((value) => {
  //   const [key, outputVal] = value;
  //   // output.push([parsedProfileChannels[key], outputVal]);
  //   output.push(`${Math.trunc((outputVal / 255) * 100)}%`);
  // });

  return result;
}
export function presentValueAsPercent(val: number) {
  return `${Math.trunc((val / 255) * 100)}%`;
}
