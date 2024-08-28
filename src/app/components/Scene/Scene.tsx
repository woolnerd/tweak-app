import { forwardRef, useEffect, useState } from "react";
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native";

import { updateFixureAssignmentDb } from "./helpers.ts";
import { SceneLabelRecords } from "../../main/types/index.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";

export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
  selectedSceneId: number;
  labelScene: boolean;
  sceneToLabel: number | null;
  setSceneToLabel: (id: number | null) => void;
  newSceneLabels: SceneLabelRecords;
  setNewSceneLabels: (scenes: SceneLabelRecords) => void;
};

export const Scene = forwardRef(
  (
    {
      name,
      id,
      setSelectedSceneId,
      selectedSceneId,
      labelScene,
      setSceneToLabel,
      sceneToLabel,
      newSceneLabels,
      setNewSceneLabels,
    }: SceneProps,
    sceneRef,
  ) => {
    const [newLabelText, setNewLabelText] = useState<string>("");

    const { manualFixturesStore, updateManualFixturesStore } =
      useManualFixtureStore((state) => state);

    const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
      (state) => state.updateFixtureChannelSelectionStore,
    );

    const handleSceneChange = () => {
      setSelectedSceneId(id);
      updateFixtureChannelSelectionStore(new Set([]));
      updateManualFixturesStore([]);
    };

    const handleScenePress = () => {
      console.log({ id });
      console.log({ labelScene });

      if (labelScene) {
        return;
      }
      setNewLabelText("");
      handleSceneChange();
    };

    const handleTextLabel = (text: string) => {
      console.log(text);
      console.log(newLabelText);

      setNewLabelText(text);
    };

    useEffect(() => {
      setNewSceneLabels({ ...newSceneLabels, ...{ [id]: newLabelText } });
    }, [selectedSceneId, newLabelText]);

    const handleRecPress = () => {
      updateFixureAssignmentDb(Object.values(manualFixturesStore));

      updateFixtureChannelSelectionStore(new Set());
      updateManualFixturesStore([]);
    };

    return (
      <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
        <Pressable
          style={{
            ...styles.rec,
            borderColor: selectedSceneId === id ? "#df010f" : "#82000a",
          }}
          onPress={handleRecPress}
          disabled={selectedSceneId !== id}>
          <Text style={styles.btnText}>REC</Text>
        </Pressable>
        <View
          style={{
            backgroundColor: selectedSceneId === id ? "blue" : "#000",
          }}>
          <Pressable
            style={{
              ...styles.scene,
              borderColor: selectedSceneId === id ? "#cb09f1" : "#9806b5",
            }}
            onPress={handleScenePress}>
            {labelScene ? (
              <TextInput
                style={styles.btnText}
                onChangeText={handleTextLabel}
                value={newLabelText}
                placeholder="Press to Edit"
                placeholderTextColor={styles.btnText.color}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.btnText}>{name}</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  scene: {
    borderColor: "purple",
    borderWidth: 2,
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
    marginRight: 4,
    justifyContent: "space-between",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },
});
