import { View } from "react-native";

import ControlPanelButton from "./control-panel-button.tsx";
import controlPanelButtonData, { ControlButton } from "../db/button-data.ts";

// send the button object to an instance of ActionRouter
// ActionRouter handles the logic of what the button directive is.
// If is is a DirectAction ie intensity or color level,
// those can happen instantaneously.
// Also, keep a stack for undoing all actions.

// If the button is a CommandAction, that is sent to the CLI for parsing
type ControlPanelProps = {
  setControlPanelValue: any;
};
export default function ControlPanel({
  setControlPanelValue,
}: ControlPanelProps) {
  // const [outputVal, setOutputVal] = useState<string | null>(null);

  const handleTouch = (data: ControlButton) => {
    // setControlPanelValue(val);
    // if (data.type === Buttons.DIRECT_ACTION_BUTTON) {
    //   const action = new DirectAction(data);
    // }
    console.log(data.label);
  };

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
