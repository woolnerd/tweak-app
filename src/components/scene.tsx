import { View, Pressable, Text, StyleSheet } from "react-native";


export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
}

export const Scene = (props: SceneProps) => {
  const handleScenePress = () => {
    props.setSelectedSceneId(props.id);
    console.log(props);
  }

  const handleRecPress = () => {

  }


  return (
    <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
      <Pressable style={styles.rec} onPress={handleRecPress}>
        <Text style={styles.btnText}>REC</Text>
      </Pressable>
      <Pressable style={styles.scene} onPress={handleScenePress}>
        <Text style={styles.btnText}>{props.name}</Text>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  scene: {
    borderColor: 'purple',
    borderWidth: 2,
    margin: 4,
    height: "100%",
    minWidth: 130,
  },

  rec: {
    borderColor: 'red',
    borderWidth: 2,
    margin: 4,
    color: '#fff',
    textAlign: 'center',
    minWidth: 60,
    padding: 4,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "space-between"
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    margin: "auto"
  },

});
