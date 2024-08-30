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
    const [pressLong, setPressLong] = useState(false);

    const { manualFixturesStore, updateManualFixturesStore } =
      useManualFixtureStore((state) => state);

    const updateFixtureChannelSelectionStore = useFixtureChannelSelectionStore(
      (state) => state.updateFixtureChannelSelectionStore,
    );

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

    const handleKeyPress = (
      e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    ) => {
      e.nativeEvent.text;
      setPressLong(false);
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
            onPress={handleSceneChange}
            onLongPress={handleLabelScene}>
            {pressLong ? (
              <TextInput
                style={styles.btnText}
                onChangeText={handleTextLabel}
                value={newLabelText}
                placeholder="Press to Edit"
                placeholderTextColor={styles.btnText.color}
                keyboardType="numeric"
                onSubmitEditing={handleKeyPress}
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
