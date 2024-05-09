import { Pressable, Text, StyleSheet } from "react-native";

import { ControlButton } from "../../../lib/types/buttons.ts";

export default function ControlPanelButton({
  buttonData,
  handleTouch,
}: {
  buttonData: ControlButton;
  handleTouch: (data: ControlButton) => void;
}) {
  return (
    <Pressable
      key={buttonData.id}
      style={styles.touchpadBtn}
      onPressIn={() => handleTouch(buttonData)}>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          padding: 15,
          fontWeight: "800",
          backgroundColor: `${buttonData.styles.color}`,
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
