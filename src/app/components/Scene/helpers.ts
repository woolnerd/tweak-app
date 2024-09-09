import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
// import {
//   clearCacheOnScene,
//   getAllFixturesFromSceneKeys,
//   getManualFixtureKeys,
// } from "../../../util/fixture-cache.ts";
import { ManualFixtureState } from "../Fixture/types/Fixture.ts";

export const batchUpdateFixtureValuesInScene = async <
  T extends ManualFixtureState[number],
>(
  manualFixtureState: T[],
  sceneId: number,
) => {
  new ScenesToFixtureAssignments(db).batchUpdate(manualFixtureState, sceneId);
};

// TODO Reimplement caching
export const handleRecPressCache = async () => {
  // try {
  //   const keys = await getManualFixtureKeys();
  //   let cachedFixtures;
  //   if (keys) {
  //     cachedFixtures = await getAllFixturesFromSceneKeys(keys, id);
  //   } else {
  //     throw new Error("Something went wrong");
  //   }
  //   if (cachedFixtures) {
  //     batchUpdateFixtureValuesInScene(cachedFixtures)
  //       .then((res) => {
  //         console.log("Updated fixture assignments:");
  //       })
  //       .then((res) => {
  //         clearCacheOnScene(keys, id);
  //       });
  //   } else {
  //     throw new Error("Could not find results in cache");
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
};
