import React, { useState } from "react";
import { View } from "react-native";

import controlPanelButtonData from "../../../db/button-data.ts";
import CommandLine from "../../../lib/command-line/command-line.ts";
import { ActionObject } from "../../../lib/command-line/types/command-line-types.ts";
import {
  Buttons,
  ControlButton,
  ProfileTarget,
} from "../../../lib/types/buttons.ts";
import useCommandLineRouter from "../../hooks/useCommandLineRouter.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import ControlPanelButton from "../ControlPanelButton/ControlPanelButton.tsx";

type ControlPanelProps = {
  allSelectionHasColorTemp: boolean;
  selectionColorTempMin: number;
  selectionColorTempMax: number;
  allSelectionHasTint: boolean;
  selectionPresent: boolean;
};
export default function ControlPanel({
  allSelectionHasColorTemp,
  selectionColorTempMax,
  selectionColorTempMin,
  allSelectionHasTint,
  selectionPresent,
}: ControlPanelProps): React.JSX.Element {
  const [action, setAction] = useState<ActionObject | null>(null);
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const handleTouch = (data: ControlButton) => {
    const commandLineInstance = CommandLine.getInstance(
      Array.from(fixtureChannelSelectionStore),
    );
    const commandLineAction: ActionObject = commandLineInstance.process(data);

    if (commandLineAction.profileTarget === ProfileTarget.EMPTY) {
      updateFixtureChannelSelectionStore(new Set(commandLineAction.selection));
    }
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
            allSelectionHasColorTemp={allSelectionHasColorTemp}
            selectionColorTempMax={selectionColorTempMax}
            selectionColorTempMin={selectionColorTempMin}
            allSelectionHasTint={allSelectionHasTint}
            selectionPresent={selectionPresent}
          />
        ))}
      </View>
    ));
  return buildPanel();
}
