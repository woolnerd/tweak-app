import {
  forwardRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
  GestureResponderEvent,
  NativeSyntheticEvent,
  NativeEventEmitter,
  TextInputSubmitEditingEventData,
} from "react-native";

import { updateFixureAssignmentDb } from "./helpers.ts";
import { SceneLabelRecords } from "../../main/types/index.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";
import Scene from "../../../models/scene.ts";
import { db } from "../../../db/client.ts";

export type SceneProps = {
  name: string;
  id: number;
  showId: number;
  timeRate: number;
  order: number;
  setSelectedSceneId: (id: number) => void;
  selectedSceneId: number;
  labelScene: boolean;
  sceneToLabel: number | null;
  setSceneToLabel: (id: number | null) => void;
  newSceneLabels: SceneLabelRecords;
  setNewSceneLabels: (scenes: SceneLabelRecords) => void;
  fetchScenes: () => Promise<
    {
      name: string;
      id: number;
      showId: number;
      timeRate: number;
      order: number;
    }[]
  >;
};

export const SceneComponent = forwardRef(
  (
    {
      name,
      id,
      showId,
      timeRate,
      order,
      setSelectedSceneId,
      selectedSceneId,
      labelScene,
      setSceneToLabel,
      sceneToLabel,
      newSceneLabels,
      setNewSceneLabels,
      fetchScenes,
    }: SceneProps,
    sceneRef,
  ) => {
    const [newLabelText, setNewLabelText] = useState<string>("");
    const [pressLong, setPressLong] = useState(false);

    const { manualFixturesStore, updateManualFixturesStore } =
      useManualFixtureStore((state) => state);

    const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
      (state) => state.updateFixtureChannelSelectionStore,
    );
    const sceneUpdate = async (newLabel: string) => {
      let response;
      try {
        response = await new Scene(db).update({
          id,
          name: newLabel,
          order,
          timeRate,
          showId,
        });
      } catch (err) {
        console.log("Transaction Error", err);
      }
      fetchScenes();
      // return response;
    };

    const handleSceneChange = () => {
      if (pressLong) return;
      setSelectedSceneId(id);
      updateFixtureChannelSelectionStore(new Set([]));
      updateManualFixturesStore([]);
    };

    const handleLabelScene = () => {
      setPressLong(true);
      setNewLabelText("");
    };

    useEffect(() => {
      console.log({ pressLong });
    }, [pressLong]);

    const handleTextLabel = (text: string) => {
      console.log(text);
      console.log(newLabelText);

      setNewLabelText(text);
    };

    const handleLabelBorder = () => {
      if (pressLong) {
        return "#cba601";
      }
      return selectedSceneId === id ? "#cb09f1" : "#9806b5";
    };

    const handleEnterBtn = (
      e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    ) => {
      setPressLong(false);
      sceneUpdate(e.nativeEvent.text);
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
              borderColor: handleLabelBorder(),
            }}
            onPress={handleSceneChange}
            onLongPress={handleLabelScene}>
            {pressLong ? (
              <TextInput
                style={styles.btnText}
                onChangeText={handleTextLabel}
                value={newLabelText}
                placeholder="New Label"
                placeholderTextColor={styles.btnText.color}
                keyboardType="numeric"
                onSubmitEditing={handleEnterBtn}
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
