import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import runMigrataions from "scripts/migrations.js";
import seedDatabase from "scripts/seedDatabase.js";

import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import Scene from "../../models/scene.ts";
import ControlPanel from "../components/ControlPanel/ControlPanel.tsx";
import LayoutArea from "../components/LayoutArea/LayoutArea.tsx";
import { Scene as SceneComponent } from "../components/Scene/Scene.tsx";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

function App() {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);

  const fetchScenes = async () => {
    const response = await new Scene(db).getAllOrdered();
    return !response ? [] : response;
  };
  // console.log(FileSystem.documentDirectory);

  useEffect(() => {
    fetchScenes().then((response) => setScenes(response));
  }, []);

  const handleGoToOut = () => {
    // runMigrataions();
    // seedDatabase();
  };

  return (
    <ErrorBoundary>
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
                selectedSceneId={selectedSceneId}
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
              <Text style={{ ...styles.btnText, fontSize: 18 }}>
                Clear Cache
              </Text>
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
    </ErrorBoundary>
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
