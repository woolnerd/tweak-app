import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import { ManualFixtureState } from "../Fixture/types/Fixture.ts";

const batchUpdateFixtureValuesInScene = async <
  T extends ManualFixtureState[number],
>(
  manualFixtureState: T[],
  sceneId: number,
) => {
  new ScenesToFixtureAssignments(db).batchUpdate(manualFixtureState, sceneId);
};

export default batchUpdateFixtureValuesInScene;
