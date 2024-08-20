import { Pressable, Text, StyleSheet } from "react-native";

import {
  Buttons,
  ControlButton,
  ProfileTarget,
} from "../../../lib/types/buttons.ts";

export default function ControlPanelButton({
  buttonData,
  handleTouch,
  allSelectionHasColorTemp,
  selectionColorTempMax,
  selectionColorTempMin,
  allSelectionHasTint,
  selectionPresent,
}: {
  buttonData: ControlButton;
  handleTouch: (data: ControlButton) => void;
  allSelectionHasColorTemp: boolean;
  selectionColorTempMax: number;
  selectionColorTempMin: number;
  allSelectionHasTint: boolean;
  selectionPresent: boolean;
}) {
  const disableColorTemp =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.COLOR_TEMP &&
    !allSelectionHasColorTemp;

  const disableTint =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.TINT &&
    !allSelectionHasTint;

  const disableTempMax =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.COLOR_TEMP &&
    Number(buttonData.label) > selectionColorTempMax;

  const disableTempMin =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.COLOR_TEMP &&
    Number(buttonData.label) < selectionColorTempMin;

  const shouldDisable = disableColorTemp || disableTempMax || disableTempMin;
  return (
    <Pressable
      key={buttonData.id}
      style={styles.touchpadBtn}
      onPressIn={() => handleTouch(buttonData)}
      disabled={shouldDisable}>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          padding: 15,
          fontWeight: "800",
          backgroundColor: `${shouldDisable ? "gray" : buttonData.styles.color}`,
        }}>
        {buttonData.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchpadBtn: {
    height: 48,
    width: "90%",
    backgroundColor: "gray",
    marginVertical: 2,
    borderColor: "blue",
    borderWidth: 2,
    gap: 2,
  },
});
