import { useEffect } from "react";

import { ManualFixtureState } from "../../components/types/fixture.ts";
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

  const findById = (
    assignmentObj: { fixtureAssignmentId: number },
    objs: { fixtureAssignmentId: number }[],
  ) =>
    objs.find(
      (obj) => obj.fixtureAssignmentId === assignmentObj.fixtureAssignmentId,
    );

  const mergeManualFixtureStates = (nextState: ManualFixtureState[]) => {
    // check if state contains state object
    // if so use latest channel info
    const prevState = [...manualFixtures];

    const filteredPrevState = prevState.filter(
      (prevStateObj) => !findById(prevStateObj, nextState),
    );

    updateManualFixtures([...filteredPrevState, ...nextState]);
  };

  function updateChannelOutput(
    actionObj: ActionObject,
    fixture: ParsedCompositeFixtureInfo,
  ) {
    const profileAdapter = new ProfileAdapter(
      actionObj.profileTarget,
      fixture.profileChannels!,
    );

    const valueRouter = new ValueRouter<ManualFixtureState>(
      actionObj,
      profileAdapter,
    );

    const manualFixtureStateObj = valueRouter
      .buildResult()
      .mutateOrMergeFixtureChannels(fixture);

    const mutatedFixture = fixture;
    console.log("stateOb", manualFixtureStateObj);

    return [manualFixtureStateObj, mutatedFixture];
  }

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;
      const manualObjs: ManualFixtureState[] = [];

      const fixturesWithUpdatedChannelOutput = compositeFixturesStore.map(
        (compFixture) => {
          if (
            selection.includes(compFixture.channel) ||
            fixtureChannelSelectionStore.has(compFixture.channel)
          ) {
            const [manualFixtureStateObj, mutatedFixture] = updateChannelOutput(
              action,
              compFixture,
            );

            manualObjs.push(manualFixtureStateObj);
            return mutatedFixture as ParsedCompositeFixtureInfo;
          }
          return compFixture;
        },
      );

      updateCompositeFixturesStore(fixturesWithUpdatedChannelOutput);
      mergeManualFixtureStates(manualObjs);
    }

    console.log("action", action);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, updateCompositeFixturesStore]);

  useEffect(() => {
    console.log("manualFixtures", manualFixtures);
  }, [manualFixtures]);
}
