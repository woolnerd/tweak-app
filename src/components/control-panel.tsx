import { View } from "react-native";

import ControlPanelButton from "./control-panel-button.tsx";
import { controlPanelButtonData } from "../util/helpers.ts";

type ControlPanelProps = {
  setControlPanelValue: any;
};
export default function ControlPanel({
  setControlPanelValue,
}: ControlPanelProps) {
  // const [outputVal, setOutputVal] = useState<string | null>(null);

  const handleTouch = (val: string) => {
    setControlPanelValue(val);
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
