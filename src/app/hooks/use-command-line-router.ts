import { useEffect } from "react";

import ProfileAdapter from "../../lib/adapters/profile-adapter.ts";
import { ActionObject } from "../../lib/command-line/types/command-line-types.ts";
import ValueRouter from "../../lib/value-router.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../store/useManualFixtureStore.ts";
import { ManualFixtureState } from "../../components/types/fixture.ts";

export default function useCommandLineRouter(action: ActionObject | null) {
  const compositeFixtures = useCompositeFixtureStore(
    (state) => state.compositeFixtures,
  );
  const updateCompositeFixtures = useCompositeFixtureStore(
    (state) => state.updateCompositeFixtures,
  );

  const fixtureChannelNumbers = useFixtureChannelSelectionStore(
    (state) => state.fixtureChannelNumbers,
  );

  const manualFixtures = useManualFixtureStore((state) => state.manualFixtures);
  const updateManualFixtures = useManualFixtureStore(
    (state) => state.updateManualFixtures,
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

    const valueRouter = new ValueRouter<ParsedCompositeFixtureInfo>(
      actionObj,
      profileAdapter,
    );

    const manualFixtureStateObj = valueRouter
      .buildResult()
      .mutateOrMergeFixtureChannels(fixture);

    const mutatedFixture = fixture;

    return [manualFixtureStateObj, mutatedFixture];
  }

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;
      const manualObjs: ManualFixtureState[] = [];

      const fixturesWithUpdatedChannelOutput = compositeFixtures.map(
        (compFixture) => {
          if (
            selection.includes(compFixture.channel) ||
            fixtureChannelNumbers.has(compFixture.channel)
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

      updateCompositeFixtures(fixturesWithUpdatedChannelOutput);
      mergeManualFixtureStates(manualObjs);
    }

    console.log("action", action);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, updateCompositeFixtures]);
}
