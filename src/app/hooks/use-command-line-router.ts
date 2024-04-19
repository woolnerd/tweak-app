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

  useEffect(() => {
    if (action !== null && action.complete) {
      const { selection } = action;
      console.log("compFixtures", compositeFixtures);

      const selectedCompositeFixtures = compositeFixtures.filter((fixture) =>
        selection.includes(fixture.channel),
      );
      console.log("selectedCompFix", selectedCompositeFixtures);

      const mutatedFixtures = selectedCompositeFixtures.map((fixture) => {
        const profileAdapter = new ProfileAdapter(
          action.profileTarget,
          fixture.profileChannels!,
        );

        const valueRouter = new ValueRouter<ParsedCompositeFixtureInfo>(
          action,
          profileAdapter,
        );

        valueRouter.buildResult().mutateOrMergeFixtureChannels(fixture);

        return fixture;
      });
      updateCompositeFixtures(mutatedFixtures);
    }

    console.log("action", action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, updateCompositeFixtures]);
}
