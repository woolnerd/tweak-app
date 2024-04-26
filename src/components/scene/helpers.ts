import { db } from "../../db/client.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import {
  clearCacheOnScene,
  getAllFixturesFromSceneKeys,
  getManualFixtureKeys,
} from "../../util/fixture-cache.ts";
import { ManualFixtureState } from "../types/fixture.ts";

export const updateFixureAssignmentDb = async <T extends ManualFixtureState>(
  manualFixtureState: T[],
) => {
  new FixtureAssignment(db).batchUpdate(manualFixtureState);
};

export const handleRecPressCache = async () => {
  try {
    const keys = await getManualFixtureKeys();

    let cachedFixtures;

    if (keys) {
      cachedFixtures = await getAllFixturesFromSceneKeys(keys, id);
    } else {
      throw new Error("Something went wrong");
    }

    if (cachedFixtures) {
      updateFixureAssignmentDb(cachedFixtures)
        .then((res) => {
          console.log("Updated fixture assignments:");
        })
        .then((res) => {
          clearCacheOnScene(keys, id);
        });
    } else {
      throw new Error("Could not find results in cache");
    }
  } catch (e) {
    console.log(e);
  }
};
