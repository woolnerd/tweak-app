import { MutableRefObject, useState } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";

import batchUpdateFixtureValuesInScene from "./helpers.ts";
import { db } from "../../../db/client.ts";
import SceneModel from "../../../models/scene.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";

export type SceneProps = {
  id: number;
  name: string;
  showId: number;
  timeRate: number;
  order: number;
  setSelectedSceneId: (id: number) => void;
  selectedSceneId: number;
  setReloadScenes: (arg: boolean) => void;
  labelRef: MutableRefObject<boolean>;
};

export const Scene = ({
  id,
  name,
  showId,
  timeRate,
  order,
  setSelectedSceneId,
  selectedSceneId,
  setReloadScenes,
  labelRef,
}: SceneProps) => {
  const [newLabelText, setNewLabelText] = useState<string>("");
  const [pressLong, setPressLong] = useState<boolean>(false);

  const { manualFixturesStore, updateManualFixturesStore } =
    useManualFixtureStore((state) => state);

  const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
    (state) => state.updateFixtureChannelSelectionStore,
  );

  const sceneUpdate = async (newLabel: string) => {
    labelRef.current = false;
    // If no label is typed in, skip DB update and reload previous label.
    if (newLabel.length === 0) return;

    try {
      await new SceneModel(db).update({
        name: newLabel,
        id,
        order,
        timeRate,
        showId,
      });
    } catch (err) {
      console.log("Transaction Error", err);
    }
    setReloadScenes(true);
  };

  const handleSceneChange = () => {
    // Cannot change scene in the middle of labeling.
    if (pressLong || labelRef.current) return;
    setSelectedSceneId(id);
    updateFixtureChannelSelectionStore(new Set([]));
    updateManualFixturesStore([]);
  };

  const handleLabelScene = () => {
    // Can only re-label one scene at a time.
    if (labelRef.current) return;
    labelRef.current = true;
    setPressLong(true);
    setNewLabelText("");
  };

  const handleTextLabel = (text: string) => setNewLabelText(text);

  const handleLabelBorder = () => {
    if (pressLong) return "#cba601";

    return selectedSceneId === id ? "#cb09f1" : "#9806b5";
  };

  const handleEnterBtn = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    setPressLong(false);
    sceneUpdate(e.nativeEvent.text);
  };

  const handleRecPress = () => {
    batchUpdateFixtureValuesInScene(Object.values(manualFixturesStore), id);

    updateFixtureChannelSelectionStore(new Set());
    updateManualFixturesStore([]);
  };

  return (
    <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
      <Pressable
        testID="rec-btn"
        style={{
          ...styles.rec,
          borderColor: selectedSceneId === id ? "#df010f" : "#82000a",
        }}
        onPress={handleRecPress}
        disabled={selectedSceneId !== id}>
        <Text style={styles.btnText} testID="rec-text">
          REC
        </Text>
      </Pressable>
      <View
        style={{
          backgroundColor: selectedSceneId === id ? "blue" : "#000",
        }}>
        <Pressable
          style={{
            ...styles.scene,
            borderColor: handleLabelBorder(),
          }}
          onPress={handleSceneChange}
          onLongPress={handleLabelScene}
          testID="label-btn">
          {pressLong ? (
            <TextInput
              style={styles.btnText}
              onChangeText={handleTextLabel}
              value={newLabelText}
              placeholder="New Label"
              placeholderTextColor={styles.btnText.color}
              keyboardType="numeric"
              onSubmitEditing={handleEnterBtn}
              autoFocus
              testID="input-label"
            />
          ) : (
            <Text style={styles.btnText} testID="text-label">
              {name}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    borderColor: "purple",
    borderWidth: 2,
    height: "100%",
    minWidth: 130,
    borderRadius: 4,
  },

  rec: {
    borderColor: "red",
    borderWidth: 2,
    marginRight: 4,
    color: "#fff",
    textAlign: "center",
    minWidth: 60,
    minHeight: 40,
    padding: 4,
    borderRadius: 4,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
    justifyContent: "space-evenly",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },
});
