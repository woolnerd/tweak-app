import { useState } from "react";
import { View } from "react-native";

import ControlPanelButton from "./control-panel-button.tsx";
import useCommandLineRouter from "../app/hooks/use-command-line-router.ts";
import controlPanelButtonData from "../db/button-data.ts";
import CommandLine from "../lib/command-line/command-line.ts";
import { ActionObject } from "../lib/command-line/types/command-line-types.ts";
import { ControlButton } from "../lib/types/buttons.ts";

type ControlPanelProps = {
  // setControlPanelValue: any;
};
export default function ControlPanel() {
  const [action, setAction] = useState<ActionObject | null>(null);

  const handleTouch = (data: ControlButton) => {
    const commandLineInstance = CommandLine.getInstance();
    const commandLineAction: ActionObject = commandLineInstance.process(data);
    setAction(commandLineAction);
  };

  useCommandLineRouter(action);

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
