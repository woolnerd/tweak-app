import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import controlPanelButtonData from "../../../db/button-data.ts";
import CommandLine from "../../../lib/command-line/command-line.ts";
import { ActionObject } from "../../../lib/command-line/types/command-line-types.ts";
import {
  ControlButton,
  ProfileTarget,
  Buttons,
  COMMAND,
} from "../../../lib/types/buttons.ts";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import useCommandLineRouter from "../../hooks/useCommandLineRouter.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import ControlPanelButton from "../ControlPanelButton/ControlPanelButton.tsx";
import { log } from "console";

type ControlPanelProps = {
  selectedFixtures: ParsedCompositeFixtureInfo[];
  goToOut: boolean;
  setGoToOut: (arg: boolean) => void;
  setLoadFixtures: (arg: boolean) => void;
};
export default function ControlPanel({
  selectedFixtures,
  goToOut,
  setGoToOut,
  setLoadFixtures,
}: ControlPanelProps): React.JSX.Element[] {
  const [action, setAction] = useState<ActionObject | null>(null);
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);
  const { updateManualFixturesStore } = useManualFixtureStore((state) => state);

  const handleTouch = useCallback(
    (data: ControlButton) => {
      const commandLineInstance = CommandLine.getInstance(
        Array.from(fixtureChannelSelectionStore),
      );
      const commandLineAction: ActionObject = commandLineInstance.process(data);

      if (commandLineAction.profileTarget === ProfileTarget.EMPTY) {
        updateFixtureChannelSelectionStore(
          new Set(commandLineAction.selection),
        );
      }
      setAction(commandLineAction);
      // console.log({ fixtureChannelSelectionStore });
    },

    [fixtureChannelSelectionStore, updateFixtureChannelSelectionStore],
  );

  useCommandLineRouter(action);

  useEffect(() => {
    if (goToOut) {
      const mockZeroButton = {
        id: "button13",
        type: Buttons.DIRECT_ACTION_BUTTON,
        label: "0%",
        value: 0,
        styles: { color: "red" },
        profileTarget: ProfileTarget.DIMMER,
      };

      handleTouch(mockZeroButton);
      setGoToOut(false);
    }
  }, [
    action,
    goToOut,
    setGoToOut,
    updateFixtureChannelSelectionStore,
    handleTouch,
  ]);

  useEffect(() => {
    if (action?.directive === COMMAND.CLEAR) {
      updateFixtureChannelSelectionStore(new Set());
      updateManualFixturesStore([]);
      setLoadFixtures(true);
    }
  }, [
    action,
    updateFixtureChannelSelectionStore,
    updateManualFixturesStore,
    setLoadFixtures,
  ]);

  useEffect(() => {
    if (!goToOut) updateFixtureChannelSelectionStore(new Set());
  }, [goToOut, updateFixtureChannelSelectionStore]);

  const buildPanel = () =>
    controlPanelButtonData.map((col) => (
      <View
        key={col.id}
        style={{
          flex: 2,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        {col.buttons.map((buttonData) => (
          <ControlPanelButton
            key={buttonData.id}
            buttonData={buttonData}
            handleTouch={handleTouch}
            selectedFixtures={selectedFixtures}
          />
        ))}
      </View>
    ));
  return buildPanel();
}
