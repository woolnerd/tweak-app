import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import ControlPanel from "../../components/control-panel.tsx";
import LayoutArea from "../../components/layout-area.tsx";
import { Scene as SceneComponent } from "../../components/scene.tsx";
import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import Scene from "../../models/scene.ts";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

function App() {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);

  const fetchScenes = async () => {
    const response = await new Scene(db).getAllOrdered();
    return !response ? [] : response;
  };

  useEffect(() => {
    fetchScenes().then((response) => setScenes(response));
  }, []);

  const handleGoToOut = () => {};

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        height: "80%",
        margin: "auto",
        backgroundColor: "black",
        padding: 20,
        borderWidth: 4,
        borderColor: "yellow",
      }}>
      <View style={{ flex: 1, ...styles.container }}>
        <View>
          <View style={{ flex: 1, borderColor: "yellow", height: 100 }} />

          <Pressable style={styles.bigButtons} onPress={handleGoToOut}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Go to Out</Text>
          </Pressable>

          {scenes?.map((scene, i) => (
            <SceneComponent
              key={scene.id}
              id={scene.id}
              name={scene.name}
              setSelectedSceneId={setSelectedSceneId}
            />
          ))}

          <Pressable
            style={styles.bigButtons}
            onPress={() => console.log("Simple Pressable pressed")}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Label</Text>
          </Pressable>

          <Pressable
            style={styles.bigButtons}
            onPress={() => AsyncStorage.clear()}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Clear Cache</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 3,
          ...styles.container,
        }}>
        <LayoutArea selectedSceneId={selectedSceneId} goToOut={false} />
      </View>

      <View style={{ flex: 1.5, flexDirection: "row", ...styles.container }}>
        <ControlPanel />
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    borderColor: "#cba601",
    borderWidth: 2,
    margin: 4,
  },

  bigButtons: {
    borderColor: "blue",
    minHeight: 60,
    padding: 18,
    borderWidth: 2,
    margin: 4,
    height: 30,
    minWidth: 60,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },
});
