import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
} from 'react-native';
import { controlPanelButtonData } from '@/util/helpers';
import { ControlPanelButton } from './control-panel-button';

type ControlPanelProps = {
  setControlPanelValue: any;
};
export const ControlPanel = ({ setControlPanelValue }: ControlPanelProps) => {
  // const [outputVal, setOutputVal] = useState<string | null>(null);

  const handleTouch = (val: string) => {
    setControlPanelValue(val);
  };

  const buildPanel = () => {
    return controlPanelButtonData.map((col) => (
      <View
        key={col.id}
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {col.buttons.map((buttonData) => (
          <ControlPanelButton key={buttonData.id} buttonData={buttonData} handleTouch={handleTouch} />
        ))}
      </View>
    ));
  };

  return buildPanel();
};

const styles = StyleSheet.create({
  touchpadBtn: {
    height: 48,
    width: '90%',
    backgroundColor: 'gray',
    marginVertical: 2,
    borderColor: 'blue',
    borderWidth: 2,
    gap: 2,
  },
});
