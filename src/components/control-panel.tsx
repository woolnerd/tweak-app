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
    // setControlPanelValue(val);
    const commandLineInstance = CommandLine.getInstance();
    const commandLineAction: ActionObject = commandLineInstance.process(data);
    setAction(commandLineAction);
  };

  useEffect(() => {
    // error handler has ensured that our selection is valid, ie in our scene.
    // action.selection then iterates over the fixture assignments
    // checks their profiles for the the target
    // determines which address to effect.
    // so we need our ProfileAdapter to help route this.
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

        const valueRouter = new ValueRouter(action, profileAdapter);

        const channelsTuples = valueRouter.buildResult();
        console.log("tuples", channelsTuples);

        channelsTuples.forEach((tuple) => {
          const channel = tuple[0];
          const tupleToMutateIdx = fixture.values!.findIndex(
            (fixtureTuple) => fixtureTuple[0] === channel,
          );

          if (tupleToMutateIdx === -1) {
            // don't mutate just push tuple into channel list.
            fixture.values!.push(tuple);
          } else {
            // otherwise mutate
            fixture.values![tupleToMutateIdx] = tuple;
          }
        });

        return fixture;
      });
      updateCompositeFixtures(mutatedFixtures);
    }

    console.log("action", action);
  }, [action]);

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
