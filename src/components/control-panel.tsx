import { useEffect, useState } from "react";
import { View } from "react-native";

import ControlPanelButton from "./control-panel-button.tsx";
import { useCompositeFixtureStore } from "../app/store/useCompositeFixtureStore.ts";
import controlPanelButtonData from "../db/button-data.ts";
import ProfileAdapter from "../lib/adapters/profile-adapter.ts";
import CommandLine from "../lib/command-line/command-line.ts";
import { ActionObject } from "../lib/command-line/types/command-line-types.ts";
import { ControlButton } from "../lib/types/buttons.ts";
import ValueRouter from "../lib/value-router.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";

type ControlPanelProps = {
  setControlPanelValue: any;
};
export default function ControlPanel({
  setControlPanelValue,
}: ControlPanelProps) {
  const [action, setAction] = useState<ActionObject | null>(null);
  const compositeFixtures = useCompositeFixtureStore(
    (state) => state.compositeFixtures,
  );
  const updateCompositeFixtures = useCompositeFixtureStore(
    (state) => state.updateCompositeFixtures,
  );

  const handleTouch = (data: ControlButton) => {
    const commandLineInstance = CommandLine.getInstance();
    const commandLineAction: ActionObject = commandLineInstance.process(data);
    setAction(commandLineAction);
  };

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

  const buildPanel = () =>
    controlPanelButtonData.map((col) => (
      <View
        key={col.id}
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        {col.buttons.map((buttonData) => (
          <ControlPanelButton
            key={buttonData.id}
            buttonData={buttonData}
            handleTouch={handleTouch}
          />
        ))}
      </View>
    ));
  return buildPanel();
}
