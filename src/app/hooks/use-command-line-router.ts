import { useEffect } from "react";

import {
  ManualFixtureObj,
  ManualFixtureState,
} from "../../components/types/fixture.ts";
import ProfileAdapter from "../../lib/adapters/profile-adapter.ts";
import { ActionObject } from "../../lib/command-line/types/command-line-types.ts";
import ValueRouter from "../../lib/value-router.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../store/useManualFixtureStore.ts";

export default function useCommandLineRouter(action: ActionObject | null) {
  const { compositeFixturesStore, updateCompositeFixturesStore } =
    useCompositeFixtureStore((state) => state);

  const fixtureChannelSelectionStore = useFixtureChannelSelectionStore(
    (state) => state.fixtureChannelSelectionStore,
  );

  const { manualFixtures, updateManualFixtures } = useManualFixtureStore(
    (state) => state,
  );

  // const findById = (
  //   assignmentObj: { fixtureAssignmentId: number },
  //   objs: { fixtureAssignmentId: number }[],
  // ) =>
  //   objs.find(
  //     (obj) => obj.fixtureAssignmentId === assignmentObj.fixtureAssignmentId,
  //   );

  // const mergeManualFixtureStates = (nextState: ManualFixtureState) => {
  //   const prevState = manualFixtures;

  // const updatedState = nextState.reduce(
  //   (updatedStateAcc: ManualFixtureState, nextStateObj) => {
  //     updatedStateAcc[nextStateObj.channel] = nextStateObj;
  //     return updatedStateAcc;
  //   },
  //   prevState,
  // );

  // updateManualFixtures({ ...prevState, ...nextState });
  // };

  function updateChannelOutput(
    actionObj: ActionObject,
    fixture: ParsedCompositeFixtureInfo,
  ) {
    const profileAdapter = new ProfileAdapter(
      actionObj.profileTarget,
      fixture.profileChannels!,
    );

    const valueRouter = new ValueRouter<ManualFixtureObj>(
      actionObj,
      profileAdapter,
    );

    return valueRouter
      .buildResult()
      .createManualFixtureObj(fixture, manualFixtures);
  }

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;

      // pass the manualfixturestate to the updateFunc, returns the update manualState
      const nextManualFixtureState = compositeFixturesStore
        .filter(
          (compFixture) =>
            selection.includes(compFixture.channel) ||
            fixtureChannelSelectionStore.has(compFixture.channel),
        )
        .reduce(
          (stateObjAcc: ManualFixtureState, filteredCompFixtures) => ({
            ...stateObjAcc,
            ...updateChannelOutput(action, filteredCompFixtures),
          }),
          {},
        );

      updateManualFixtures({ ...manualFixtures, ...nextManualFixtureState });
    }

    console.log("action", action);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, updateCompositeFixturesStore]);

  useEffect(() => {
    console.log("manualFixtures", manualFixtures);
  }, [manualFixtures]);
}
