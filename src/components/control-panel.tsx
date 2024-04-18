import { useEffect, useState } from "react";
import { View } from "react-native";

import ControlPanelButton from "./control-panel-button.tsx";
import { useCompositeFixtureStore } from "../app/store/useCompositeFixtureStore.ts";
import controlPanelButtonData from "../db/button-data.ts";
import CommandLine from "../lib/command-line/command-line.ts";
import { ActionObject } from "../lib/command-line/types/command-line-types.ts";
import { ControlButton } from "../lib/types/buttons.ts";

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

    console.log(action);
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
