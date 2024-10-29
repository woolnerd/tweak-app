// import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import ErrorBoundary from "react-native-error-boundary";

import runMigrataions from "../../../scripts/migrations.ts";
import seedDatabase from "../../../scripts/seedDatabase.ts";
import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import SceneModel from "../../models/scene.ts";
import ControlPanel from "../components/ControlPanel/ControlPanel.tsx";
import LayoutArea from "../components/LayoutArea/LayoutArea.tsx";
import { Scene } from "../components/Scene/Scene.tsx";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../store/useFixtureChannelSelectionStore.ts";
import { useOutputValuesStore } from "../store/useOutputValuesStore.ts";
import useUniverseOutput from "../hooks/useUniverseOutput.ts";
import UniverseOutputGenerator from "../../lib/universe-output-generator.ts";
import PacketSender from "../../lib/packets/packet-sender.ts";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

function App() {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [goToOut, setGoToOut] = useState(false);
  const [loadFixtures, setLoadFixtures] = useState(false);
  const [reloadScenes, setReloadScenes] = useState(false);
  const labelRef = useRef<boolean>(false);

  const fetchScenes = async () => {
    const response = await new SceneModel(db).getAllOrdered();
    return !response ? [] : response;
  };

  const { compositeFixturesStore } = useCompositeFixtureStore((state) => state);
  const { outputValuesStore } = useOutputValuesStore();
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const selectedCompositeFixtures = compositeFixturesStore.filter((fixture) =>
    fixtureChannelSelectionStore.has(fixture.channel),
  );

  useUniverseOutput();

  useEffect(() => {
    if (outputValuesStore) {
      const outputGenerator = new UniverseOutputGenerator(
        outputValuesStore,
        new PacketSender(),
      );
      const packets = outputGenerator.generateOutput();
      outputGenerator.sendOutput(packets);
    }
  }, [outputValuesStore]);

  useEffect(() => {
    if (reloadScenes) {
      setReloadScenes(false);
      return;
    }
    fetchScenes()
      .then((response) => setScenes(response))
      .catch((err) => console.log(err));
  }, [reloadScenes]);

  const handleGoToOut = () => {
    const tempSet = new Set<number>();
    compositeFixturesStore
      .map((fixture) => fixture.channel)
      .forEach((channel) => tempSet.add(channel));

    setGoToOut(true);
    updateFixtureChannelSelectionStore(tempSet);
  };

  const bigButtonStyles =
    "border-blue-700 min-h-16 min-w-16 m-4 border-2 rounded-md h-20";
  const textStyles = "text-xl text-white text-center p-5";

  return (
    <ErrorBoundary>
      <ScrollView className="flex-1 flex flex-col space-y-4 m-auto bg-black p-5 border-4 border-yellow-500 w-full">
        <View className="bg-black m-1 border-2 flex-1 border-[#cba601]">
          <View>
            <View className="flex-1 border-yellow-500 h-24" />

            <Pressable className={bigButtonStyles} onPress={handleGoToOut}>
              <Text className={textStyles}>Go to Out</Text>
            </Pressable>

            {scenes?.map((scene, i) => (
              <Scene
                key={scene.id}
                id={scene.id}
                name={scene.name}
                timeRate={scene.timeRate}
                showId={scene.showId}
                order={scene.order}
                setSelectedSceneId={setSelectedSceneId}
                selectedSceneId={selectedSceneId}
                setReloadScenes={setReloadScenes}
                labelRef={labelRef}
              />
            ))}

            <Pressable
              className={bigButtonStyles}
              onPress={() => console.log(FileSystem.documentDirectory)}>
              <Text className={textStyles}>Print DB directory</Text>
            </Pressable>
            <Pressable
              className={bigButtonStyles}
              onPress={() => runMigrataions()}>
              <Text className={textStyles}>Run Migrations</Text>
            </Pressable>
            <Pressable
              className={bigButtonStyles}
              onPress={() => seedDatabase()}>
              <Text className={textStyles}>Seed DB</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-black m-1 border-2 flex-2 border-[#cba601]">
          <LayoutArea
            selectedSceneId={selectedSceneId}
            loadFixtures={loadFixtures}
            setLoadFixtures={setLoadFixtures}
          />
        </View>

        <View className="bg-black m-1 border-2 flex-2 border-[#cba601] flex-row">
          <ControlPanel
            selectedFixtures={selectedCompositeFixtures}
            goToOut={goToOut}
            setGoToOut={setGoToOut}
            setLoadFixtures={setLoadFixtures}
          />
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
}

export default App;
