import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  FlatList,
  Alert,
  Pressable
} from 'react-native';

const App = () => {
  const [color, setColor] = useState('');

  const handleUpdateColor = () => {
    // Logic to handle updating the color
    console.log('Color:', color);
  };

  const sceneName = "Bedroom Night"
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        height: '80%',
        margin: 'auto',
        backgroundColor: 'black',
      }}
    >
      <View style={{ flex: 1, ...styles.container }}>
        <View>
          <View style={{ flex: 1, borderColor: 'yellow', height: 100 }} />

          <Pressable style={styles.bigButtons} onPress={() => console.log('Simple Pressable pressed')}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Go to Out</Text>
          </Pressable>
          <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
            <Pressable style={styles.rec} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>REC</Text>
            </Pressable>
            <Pressable style={styles.scene} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>Bedroom Night</Text>
            </Pressable>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
            <Pressable style={styles.rec} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>REC</Text>
            </Pressable>
            <Pressable style={styles.scene} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>Bedroom Night</Text>
            </Pressable>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
            <Pressable style={styles.rec} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>REC</Text>
            </Pressable>
            <Pressable style={styles.scene} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>Bedroom Night</Text>
            </Pressable>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', ...styles.sceneCtrl }}>
            <Pressable style={styles.rec} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>REC</Text>
            </Pressable>
            <Pressable style={styles.scene} onPress={() => console.log('Simple Pressable pressed')}>
              <Text style={styles.btnText}>Bedroom Night</Text>
            </Pressable>
          </View>
          <Pressable style={styles.bigButtons} onPress={() => console.log('Simple Pressable pressed')}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Label</Text>
          </Pressable>


        </View>
        <View style={{ flex: 1, borderColor: 'yellow', height: 100 }} />
      </View>
      <View
        style={{
          flex: 3,
          ...styles.container,
        }}
      >
        <Button title="Enter"
          onPress={() => console.log('Simple Button pressed')} />
      </View>
      <View style={{ flex: 1.5, ...styles.container }}>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
      </View>
    </View >
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
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
    height: "100%"
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
  }
});
