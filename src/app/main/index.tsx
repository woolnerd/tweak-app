import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { LayoutArea } from "@/components/layout-area";
import { Scene as SceneComponent, SceneProps } from "@/components/scene";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
// import migrations from './drizzle/migrations';
// import * as FileSystem from 'expo-file-system';
import * as schema from "@/db/schema";
import Scene from "@/models/scene";
import { SelectScene } from "@/db/types/tables";
// import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { ControlPanel } from "@/components/control-panel";
import { ControlPanelContext } from "../contexts/control-panel";
import AsyncStorage from "@react-native-async-storage/async-storage";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

const App = () => {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [ctrlPanelValue, setControlPanelValue] = useState<string | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  // console.log(FileSystem.documentDirectory);
  // const { success, error } = useMigrations(db, migrations);

  const fetchScenes = async () => {
    const scenes = await new Scene(db).getAllOrdered();
    return !scenes ? [] : scenes;
  };

  useEffect(() => {
    fetchScenes().then((scenes) => setScenes(scenes));
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
      }}
    >
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
            onPress={() => console.log("Simple Pressable pressed")}
          >
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Label</Text>
          </Pressable>

          <Pressable
            style={styles.bigButtons}
            onPress={() => AsyncStorage.clear()}
          >
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Clear Cache</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 3,
          ...styles.container,
        }}
      >
        <ControlPanelContext.Provider value={ctrlPanelValue}>
          <LayoutArea selectedSceneId={selectedSceneId} goToOut={false} />
        </ControlPanelContext.Provider>
      </View>

      <View style={{ flex: 1.5, flexDirection: "row", ...styles.container }}>
        <ControlPanel setControlPanelValue={setControlPanelValue} />
      </View>
    </View>
  );
};

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
