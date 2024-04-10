import { SetStateAction, Dispatch } from "react";

import {
  getManualFixtureKeys,
  getAllFixturesFromSceneKeys,
} from "./fixture-cache.ts";
import {
  FixtureControlData,
  FixtureAssignmentResponse,
} from "../components/types/fixture.ts";
import { Button } from "react-native";

type FetchCallback = () => Promise<FixtureControlData[] | undefined>;

type SetCallback = (
  arr: (FixtureControlData | Awaited<FetchCallback>)[],
) => Dispatch<SetStateAction<FixtureAssignmentResponse>>;

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
