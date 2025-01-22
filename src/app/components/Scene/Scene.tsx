import { MutableRefObject, useState } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
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
    if (pressLong) return "border-yellow-600";

    return selectedSceneId === id ? "border-purple-600" : "border-purple-900";
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

  const recStyles = `active:bg-red-600 border-2 mr-1 text-white text-center min-w-[60px] min-h-[40px] p-1 rounded-md ${selectedSceneId === id ? "border-red-600" : "border-red-900"}`;
  const sceneCtrlStyles = "flex-row flex-2 h-11 mt-2 mb-2 ml-1 justify-evenly";
  const sceneStyle = `active:bg-blue-600 border-purple-500 border-2 h-full min-w-[130px] rounded-md ${handleLabelBorder()}`;
  const textStyle = "text-white text-center text-xs m-auto";

  return (
    <View className={sceneCtrlStyles}>
      <Pressable
        testID="rec-btn"
        className={recStyles}
        onPress={handleRecPress}
        disabled={selectedSceneId !== id}>
        <Text className={textStyle} testID="rec-text">
          REC
        </Text>
      </Pressable>
      <View
        className={`${selectedSceneId === id ? "bg-blue-800" : "bg-black"}`}>
        <Pressable
          className={sceneStyle}
          onPress={handleSceneChange}
          onLongPress={handleLabelScene}
          testID="label-btn">
          {pressLong ? (
            <TextInput
              className={textStyle}
              onChangeText={handleTextLabel}
              value={newLabelText}
              placeholder="New Label"
              placeholderTextColor="#fff"
              keyboardType="numeric"
              onSubmitEditing={handleEnterBtn}
              autoFocus
              testID="input-label"
            />
          ) : (
            <Text className={textStyle} testID="text-label">
              {name}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
