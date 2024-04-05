import { View, Pressable, Text, StyleSheet } from "react-native";


export type SceneProps = {
  name: string;
}

export const Scene = ({ name }: SceneProps) => {
  return (
    <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
      <Pressable style={styles.rec} onPress={() => console.log('Simple Pressable pressed')}>
        <Text style={styles.btnText}>REC</Text>
      </Pressable>
      <Pressable style={styles.scene} onPress={() => console.log('Simple Pressable pressed')}>
        <Text style={styles.btnText}>{name}</Text>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#cba601',
    borderWidth: 2,
    margin: 4,
  },

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

  bigButtons: {
    borderColor: "blue",
    minHeight: 60,
    padding: 18,
    borderWidth: 2,
    margin: 4,
    height: 30,
    minWidth: 60
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
