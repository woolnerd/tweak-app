import { useEffect } from "react";

import ProfileAdapter from "../../lib/adapters/profile-adapter.ts";
import { ActionObject } from "../../lib/command-line/types/command-line-types.ts";
import { ProfileTarget } from "../../lib/types/buttons.ts";
import ValueRouter from "../../lib/value-router.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import { ManualFixtureState } from "../components/Fixture/types/Fixture.ts";
import useCompositeFixtureStore from "../store/useCompositeFixtureStore.ts";
import useFixtureChannelSelectionStore from "../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../store/useManualFixtureStore.ts";

export default function useCommandLineRouter(action: ActionObject | null) {
  const { compositeFixturesStore } = useCompositeFixtureStore((state) => state);

  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const { manualFixturesStore, updateManualFixturesStore } =
    useManualFixtureStore((state) => state);

  function updateChannelOutput(
    actionObj: ActionObject,
    fixture: ParsedCompositeFixtureInfo,
  ) {
    const profileAdapter = new ProfileAdapter(
      actionObj.profileTarget,
      fixture.profileChannels!,
    );

    const valueRouter = new ValueRouter(actionObj, profileAdapter, fixture);

    return valueRouter
      .buildResult()
      .createManualFixtureObj(manualFixturesStore);
  }

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;

      // when selecting channels with control buttons, and pressing "@", the profile target will be empty
      // but a selection is made
      if (action.profileTarget === ProfileTarget.EMPTY) {
        updateFixtureChannelSelectionStore(new Set(selection));
        return;
      }
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

      updateManualFixturesStore({
        ...manualFixturesStore,
        ...nextManualFixtureState,
      });
    }
  }, [action, updateManualFixturesStore]);
}
