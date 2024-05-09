import { View, Pressable, Text, StyleSheet } from "react-native";

// import { FixtureControlData } from "../types/fixture.ts";
import { updateFixureAssignmentDb } from "./helpers.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";

export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
  selectedSceneId: number;
};

export function Scene({
  name,
  id,
  setSelectedSceneId,
  selectedSceneId,
}: SceneProps) {
  const { manualFixturesStore, updateManualFixturesStore } =
    useManualFixtureStore((state) => state);

  const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
    (state) => state.updateFixtureChannelSelectionStore,
  );

  const handleScenePress = () => {
    setSelectedSceneId(id);
    updateFixtureChannelSelectionStore(new Set([]));
  };

  const handleRecPress = () => {
    updateFixureAssignmentDb(Object.values(manualFixturesStore));

    updateFixtureChannelSelectionStore(new Set());
    updateManualFixturesStore([]);
  };

  return (
    <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
      <Pressable
        style={styles.rec}
        onPress={handleRecPress}
        disabled={selectedSceneId !== id}>
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
