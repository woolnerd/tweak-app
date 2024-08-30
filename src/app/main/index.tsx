import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
// import runMigrataions from "scripts/migrations.js";
// import seedDatabase from "scripts/seedDatabase.js";

import { SceneLabelRecords } from "./types/index.ts";
import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import Scene from "../../models/scene.ts";
import ControlPanel from "../components/ControlPanel/ControlPanel.tsx";
import LayoutArea from "../components/LayoutArea/LayoutArea.tsx";
import { Scene as SceneComponent } from "../components/Scene/Scene.tsx";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../store/useFixtureChannelSelectionStore.ts";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

function App() {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [goToOut, setGoToOut] = useState(false);
  const [loadFixtures, setLoadFixtures] = useState(false);
  const [labelScene, setLabelScene] = useState<boolean>(false);
  const [sceneToLabel, setSceneToLabel] = useState<number | null>(null);
  const [newSceneLabels, setNewSceneLabels] = useState<SceneLabelRecords>({});
  const sceneRef = useRef(false);

  const fetchScenes = async () => {
    const response = await new Scene(db).getAllOrdered();
    return !response ? [] : response;
  };

  // const updateScenes = async () => {
  //   try {
  //     await db.transaction(async (tx) => {
  //       await Promise.all(
  //         Object.keys(newSceneLabels).map(async (sceneId) => {
  //           const id = parseInt(sceneId, 10);
  //           const prevSceneData = scenes[id];
  //           const newLabelText = newSceneLabels[id];

  //           const response = await db.update(
  //             {
  //               ...prevSceneData,
  //               name: newLabelText,
  //             },
  //             tx,
  //           ); // Pass transaction object if required

  //           return { [id]: response };
  //         }),
  //       );
  //     });
  //   } catch (error) {
  //     console.error("Transaction error:", error);
  //   }
  // };

  const updateScenes = async () => {
    let tempScenes: any = {};
    const updatePromises = Object.keys(newSceneLabels).map(
      async (sceneId: string) => {
        const id = parseInt(sceneId, 10);
        const prevSceneData = scenes[id];
        const newLabelText = newSceneLabels[id];

        const response = await new Scene(db).update({
          ...prevSceneData,
          name: newLabelText,
        });

        console.log({ response });

        return { [id]: response };
      },
    );

    const results = await Promise.all(updatePromises);
    console.log({ results });

    // Merge results into tempScenes
    results.forEach((result) => {
      tempScenes = { ...tempScenes, ...result };
    });

    console.log({ tempScenes });

    return tempScenes;
  };

  // console.log(FileSystem.documentDirectory);

  const { compositeFixturesStore } = useCompositeFixtureStore((state) => state);
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const selectedCompositeFixtures = compositeFixturesStore.filter((fixture) =>
    fixtureChannelSelectionStore.has(fixture.channel),
  );

  const handleLabelBtn = async () => {
    console.log(newSceneLabels);
    setLabelScene(!labelScene);
  };

  useEffect(() => {
    fetchScenes().then((response) => setScenes(response));
  }, []);

  useEffect(() => {
    if (!labelScene && Object.keys(newSceneLabels).length > 0) {
      console.log("here");

      updateScenes()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    setNewSceneLabels({});
  }, [labelScene]);

  const handleGoToOut = () => {
    const tempSet = new Set<number>();
    compositeFixturesStore
      .map((fixture) => fixture.channel)
      .forEach((channel) => tempSet.add(channel));

    setGoToOut(true);
    updateFixtureChannelSelectionStore(tempSet);
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
                labelScene={labelScene}
                setSceneToLabel={setSceneToLabel}
                sceneToLabel={sceneToLabel}
                newSceneLabels={newSceneLabels}
                setNewSceneLabels={setNewSceneLabels}
                ref={sceneRef}
              />
            ))}

            <Pressable style={styles.bigButtons} onPress={handleLabelBtn}>
              <Text style={{ ...styles.btnText, fontSize: 18 }}>
                {labelScene ? "Update Label" : "Label"}
              </Text>
            </Pressable>

            {/* <Pressable
              style={styles.bigButtons}
              onPress={() => AsyncStorage.clear()}>
              <Text style={{ ...styles.btnText, fontSize: 18 }}>
                Clear Cache
              </Text>
            </Pressable> */}
          </View>
        </View>

        <View
          style={{
            flex: 2,
            ...styles.container,
          }}>
          <LayoutArea
            selectedSceneId={selectedSceneId}
            loadFixtures={loadFixtures}
            setLoadFixtures={setLoadFixtures}
          />
        </View>

        <View style={{ flex: 2, flexDirection: "row", ...styles.container }}>
          <ControlPanel
            selectedFixtures={selectedCompositeFixtures}
            goToOut={goToOut}
            setGoToOut={setGoToOut}
            setLoadFixtures={setLoadFixtures}
          />
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
