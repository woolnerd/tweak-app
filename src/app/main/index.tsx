// import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import ErrorBoundary from "react-native-error-boundary";

import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import PacketSender from "../../lib/packets/packet-sender.ts";
import UniverseOutputGenerator from "../../lib/universe-output-generator.ts";
import SceneModel from "../../models/scene.ts";
import ControlPanel from "../components/ControlPanel/ControlPanel.tsx";
import LayoutArea from "../components/LayoutArea/LayoutArea.tsx";
import { Scene } from "../components/Scene/Scene.tsx";
import useInitialize from "../hooks/useInitialize.ts";
import useUniverseOutput from "../hooks/useUniverseOutput.ts";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../store/useFixtureChannelSelectionStore.ts";
import { useOutputValuesStore } from "../store/useOutputValuesStore.ts";

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

function App() {
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [goToOut, setGoToOut] = useState(false);
  const [loadFixtures, setLoadFixtures] = useState(false);
  const [reloadScenes, setReloadScenes] = useState(false);
  const [sacnState, setSacnState] = useState(false);
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

  useInitialize();
  useUniverseOutput();

  useEffect(() => {
    if (outputValuesStore && sacnState) {
      const outputGenerator = new UniverseOutputGenerator(
        outputValuesStore,
        new PacketSender(),
      );
      const packets = outputGenerator.generateOutput();
      const intervalId = setInterval(() => {
        outputGenerator.sendOutput(packets);
      }, 25);

      return () => {
        clearInterval(intervalId);
        outputGenerator.closeSocket();
      };
    }

    return undefined;
  }, [outputValuesStore, sacnState]);

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

            <Pressable
              className={bigButtonStyles}
              onPress={() => setSacnState(!sacnState)}>
              <Text className={textStyles}>
                Sacn is {sacnState ? "On" : "Off"}
              </Text>
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
