// import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ErrorBoundary from "react-native-error-boundary";

import * as schema from "../../db/schema.ts";
import { SelectScene } from "../../db/types/tables.ts";
import { UniverseDataObjectCollection } from "../../lib/universe-data-builder.ts";
import PacketSender from "../../lib/packets/packet-sender.ts";
import UniverseOutputGenerator from "../../lib/universe-output-generator.ts";
import SceneModel from "../../models/scene.ts";
import Container from "../components/Container/Container.tsx";
import ControlPanel from "../components/ControlPanel/ControlPanel.tsx";
import LayoutArea from "../components/LayoutArea/LayoutArea.tsx";
import { Scene } from "../components/Scene/Scene.tsx";
import useInitialize from "../hooks/useInitialize.ts";
import useUniverseOutput from "../hooks/useUniverseOutput.ts";
import useCompositeFixtureStore from "../store/useCompositeFixtureStore.ts";
import useFixtureChannelSelectionStore from "../store/useFixtureChannelSelectionStore.ts";
import useOutputValuesStore from "../store/useOutputValuesStore.ts";
import FaderCalculator from "../../util/fader-calculator.ts";

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
  const prevOutputState = useRef<UniverseDataObjectCollection | null>(null);

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
        // new PacketSender(),
      );
      const packets = outputGenerator.generateOutput();

      // Check if the previous state is different from the current state
      if (
        prevOutputState.current &&
        prevOutputState.current !== outputValuesStore
      ) {
        // Fade between previous and current values over 5000ms (adjust duration as needed)
        outputGenerator.fadeOutputValues(5000);
      }

      // consistent output of sACN values
      const intervalId = setInterval(() => {
        // outputGenerator.sendOutput(packets);
      }, 5000);

      return () => {
        clearInterval(intervalId);
        // outputGenerator.closeSocket();
      };
    }
    prevOutputState.current = outputValuesStore;

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
      <Container>
        <View className="bg-black border-2 border-yellow-500">
          <View className="m-2">
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

            {scenes?.map((scene) => (
              <Scene
                key={scene.id}
                setSelectedSceneId={setSelectedSceneId}
                selectedSceneId={selectedSceneId}
                setReloadScenes={setReloadScenes}
                labelRef={labelRef}
                {...scene}
              />
            ))}
          </View>
        </View>
        <View className="bg-black border-2 flex-1 border-[#cba601]">
          <LayoutArea
            selectedSceneId={selectedSceneId}
            loadFixtures={loadFixtures}
            setLoadFixtures={setLoadFixtures}
          />
        </View>

        <View className="bg-black border-2 flex-1 border-[#cba601] flex-row">
          <ControlPanel
            selectedFixtures={selectedCompositeFixtures}
            goToOut={goToOut}
            setGoToOut={setGoToOut}
            setLoadFixtures={setLoadFixtures}
          />
        </View>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
