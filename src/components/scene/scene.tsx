import { View, Pressable, Text, StyleSheet } from "react-native";

// import { FixtureControlData } from "../types/fixture.ts";
import { updateFixureAssignmentDb } from "./helpers.ts";
import { useFixtureChannelSelectionStore } from "../../app/store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../app/store/useManualFixtureStore.ts";

export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
};

export function Scene({ name, id, setSelectedSceneId }: SceneProps) {
  const manualFixtures = useManualFixtureStore((state) => state.manualFixtures);

  const updateManualFixtures = useManualFixtureStore(
    (state) => state.updateManualFixtures,
  );

  const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
    (state) => state.updateFixtureChannelSelectionStore,
  );

  const handleScenePress = () => setSelectedSceneId(id);

  const handleRecPress2 = () => {
    updateFixureAssignmentDb(manualFixtures);
    updateFixtureChannelSelectionStore(new Set());
    updateManualFixtures([]);
  };

  return (
    <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
      <Pressable style={styles.rec} onPress={handleRecPress2}>
        <Text style={styles.btnText}>REC</Text>
      </Pressable>
      <Pressable style={styles.scene} onPress={handleScenePress}>
        <Text style={styles.btnText}>{name}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    borderColor: "purple",
    borderWidth: 2,
    margin: 4,
    height: "100%",
    minWidth: 130,
  },

  rec: {
    borderColor: "red",
    borderWidth: 2,
    margin: 4,
    color: "#fff",
    textAlign: "center",
    minWidth: 60,
    padding: 4,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },
});
