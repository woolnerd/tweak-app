import { Pressable, Text, StyleSheet } from "react-native";

import {
  selectionHasColorTemp,
  selectionHasTint,
  selectionMaxColorTemp,
  selectionMinColorTemp,
} from "./helpers.ts";
import {
  Buttons,
  ControlButton,
  ProfileTarget,
} from "../../../lib/types/buttons.ts";
import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";

export default function ControlPanelButton({
  buttonData,
  handleTouch,
  selectedFixtures,
  goToOut,
}: {
  buttonData: ControlButton;
  handleTouch: (data: ControlButton) => void;
  selectedFixtures: ParsedCompositeFixtureInfo[];
  goToOut: boolean;
}) {
  const noFixturesSelected = selectedFixtures.length === 0;

  const isColorTempButton =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.COLOR_TEMP;

  const isTintButton =
    buttonData.type === Buttons.DIRECT_ACTION_BUTTON &&
    buttonData.profileTarget === ProfileTarget.TINT;

  const disableColorTemp =
    isColorTempButton && !selectionHasColorTemp(selectedFixtures);

  const disableTint = isTintButton && !selectionHasTint(selectedFixtures);

  const disableTempMax =
    isColorTempButton &&
    Number(buttonData.label) > selectionMaxColorTemp(selectedFixtures);

  const disableTempMin =
    isColorTempButton &&
    Number(buttonData.label) < selectionMinColorTemp(selectedFixtures);

  const disable = noFixturesSelected
    ? false
    : disableColorTemp || disableTint || disableTempMax || disableTempMin;

  if (goToOut && buttonData.id === "button13") {
    handleTouch({
      id: "button13",
      type: Buttons.DIRECT_ACTION_BUTTON,
      label: "0%",
      value: 0,
      styles: { color: "red" },
      profileTarget: ProfileTarget.DIMMER,
    });
    // setGoToOut(false);
    console.log({ goToOut });
  }

  return (
    <Pressable
      key={buttonData.id}
      style={styles.touchpadBtn}
      onPressIn={() => handleTouch(buttonData)}
      disabled={disable}>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          padding: 15,
          fontWeight: "800",
          backgroundColor: `${disable ? "gray" : buttonData.styles.color}`,
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
