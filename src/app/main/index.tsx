import AsyncStorage from "@react-native-async-storage/async-storage";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import dgram from "react-native-udp";

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
import { Buffer } from "buffer";

// const e131 = require("e131");

console.log(Buffer.from([1, 2, 3]));

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, { schema });

const createSACNPacket = (universe: number, data: number[]): Buffer => {
  // Allocate a buffer for the sACN packet
  const packet = Buffer.alloc(638); // The typical maximum length for an sACN packet

  // Fill in Root Layer, Framing Layer, DMP Layer, etc.
  // Here is a simplified version:
  packet.writeUInt16BE(0x0010, 0); // Example: Write some values to the packet
  packet.writeUInt16BE(universe, 2); // Write the universe to the appropriate position
  packet.set(data, 10); // Assume DMX data starts at byte 10

  return packet;
};

const sendSACNPacket = (universe: number, data: number[]) => {
  const packet = createSACNPacket(universe, data);
  const socket = dgram.createSocket({ type: "udp4" });
  // console.log(dgram.createSocket({ type: "udp4" }));
  // socket.bind(5568);
  // socket.setBroadcast(true);

  // Bind the socket to the desired port before using it
  const PORT = 5568;
  socket.bind(PORT);

  // console.log(socket);
  socket.send(packet, 0, packet.length, 5568, "172.20.10.3", (err) => {
    if (err) {
      console.error("Error sending sACN packet:", err);
    } else {
      console.log("sACN packet sent successfully!");
    }
    socket.close();
  });
};

sendSACNPacket(1, [128, 0, 128, 511, 128]);

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
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const selectedCompositeFixtures = compositeFixturesStore.filter((fixture) =>
    fixtureChannelSelectionStore.has(fixture.channel),
  );

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
              <Text
                className="text-xl"
                style={{ ...styles.btnText, fontSize: 18 }}>
                Go to Out
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

            <Pressable
              style={styles.bigButtons}
              onPress={() => console.log(FileSystem.documentDirectory)}>
              <Text
                className="text-xl"
                style={{ ...styles.btnText, fontSize: 18 }}>
                Print DB directory
              </Text>
            </Pressable>
            <Pressable
              style={styles.bigButtons}
              onPress={() => runMigrataions()}>
              <Text
                className="text-xl"
                style={{ ...styles.btnText, fontSize: 18 }}>
                Run Migrations
              </Text>
            </Pressable>
            <Pressable style={styles.bigButtons} onPress={() => seedDatabase()}>
              <Text
                className="text-xl"
                style={{ ...styles.btnText, fontSize: 18 }}>
                Seed DB
              </Text>
            </Pressable>
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
