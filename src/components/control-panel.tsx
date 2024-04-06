import { View, Text, StyleSheet, GestureResponderEvent, Pressable } from "react-native"
import { ControlPanelContext } from "@/app/contexts/control-panel"
import { SyntheticEvent, useContext, useState, Dispatch, SetStateAction } from "react"

type ControlPanelProps = {
  setControlPanelValue: any;
}
export const ControlPanel = ({setControlPanelValue}: ControlPanelProps) => {
  // const [outputVal, setOutputVal] = useState<string | null>(null);

  const handleTouch = (val: string) => {
    setControlPanelValue(val)
  }

  const buildPanel = () => {
    return (
      [ 1, 2, 3, 4, 5].map((col: number) =>
        <View key={ `column-${col}`} style={{ flex: 1, flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
          {[['Full', 'green'], ['90%', 'gray'], ['80%', 'gray'], ['75%', 'gray'], ['70%', 'gray'], ['60%', 'gray'], ['50%', 'gray'], ['40%', 'gray'], ['30%', 'gray'], ['25%', 'gray'],['20%', 'gray'], ['10%', 'gray'], ['0%', 'red'], ['@', 'gray'], ['Clear', 'brown']].map(num => (
            <Pressable key={num[0]} style={styles.touchpadBtn} onPressIn={() => handleTouch(num[0])}>
              <Text style={{ fontSize: 12,textAlign: 'center', padding: 15, fontWeight: '800', backgroundColor:`${num[1]}` }}>{num[0]}</Text>
            </Pressable>
          ))}
        </View>
      )
    )
  }

  return (
    buildPanel()
  )
}


const styles = StyleSheet.create({
  touchpadBtn: {
    height: 48,
    width: '90%',
    backgroundColor: 'gray',
    marginVertical: 2,
    borderColor: 'blue',
    borderWidth: 2,
    gap: 2,
  }
});
