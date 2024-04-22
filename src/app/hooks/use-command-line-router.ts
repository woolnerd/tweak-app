import { useEffect } from "react";

import ProfileAdapter from "../../lib/adapters/profile-adapter.ts";
import { ActionObject } from "../../lib/command-line/types/command-line-types.ts";
import ValueRouter from "../../lib/value-router.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";

export default function useCommandLineRouter(action: ActionObject | null) {
  const compositeFixtures = useCompositeFixtureStore(
    (state) => state.compositeFixtures,
  );
  const updateCompositeFixtures = useCompositeFixtureStore(
    (state) => state.updateCompositeFixtures,
  );

  function updateChannelOutput(
    fixture: ParsedCompositeFixtureInfo,
    actionObj: ActionObject,
  ) {
    const profileAdapter = new ProfileAdapter(
      actionObj.profileTarget,
      fixture.profileChannels!,
    );

    const valueRouter = new ValueRouter<ParsedCompositeFixtureInfo>(
      actionObj,
      profileAdapter,
    );

    valueRouter.buildResult().mutateOrMergeFixtureChannels(fixture);

    return fixture;
  }

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;
      console.log("compFixtures", compositeFixtures);

      const fixturesWithUpdatedChannelOutput = compositeFixtures.map(
        (compFixture) => {
          if (selection.includes(compFixture.channel)) {
            return updateChannelOutput(compFixture, action);
          }
          return compFixture;
        },
      );
      updateCompositeFixtures(fixturesWithUpdatedChannelOutput);
    }

    console.log("action", action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, updateCompositeFixtures]);
}
