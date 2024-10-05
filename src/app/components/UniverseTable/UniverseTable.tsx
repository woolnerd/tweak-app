import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { styled } from "nativewind";

type PatchObject = {
  id: string;
  startAddress: number;
  endAddress: number;
  toPatch: boolean;
};

type Props = {
  patchData: PatchObject[];
  handleAddressSelection: (address: number) => void;
  profileSelected: boolean;
};

const UniverseTable: React.FC<Props> = ({
  patchData,
  handleAddressSelection,
  profileSelected,
}) => {
  const universeChannels = Array.from({ length: 512 }, (_, i) => i + 1);

  const isAddressTaken = (channel: number): boolean =>
    patchData.some(
      (patchObj) =>
        channel >= patchObj.startAddress && channel <= patchObj.endAddress,
    );

  const handlePress = (channel: number) => {
    if (!profileSelected) {
      alert("Select a fixture and profile");
      return;
    }
    !isAddressTaken(channel) ? handleAddressSelection(channel) : alert("taken");
  };
  const toHighlight = (channel: number): boolean =>
    patchData.some(
      (patchObj) =>
        channel >= patchObj.startAddress &&
        channel <= patchObj.endAddress &&
        patchObj.toPatch,
    );

  return (
    <View className="p-4">
      <Text className="text-white text-xl mb-4">Universe Table</Text>
      <ScrollView horizontal={false} style={{ maxHeight: 400 }}>
        <ScrollView horizontal={false}>
          <View className="flex flex-wrap flex-row">
            {universeChannels.map((channel) => (
              <Pressable
                key={channel}
                className={`w-8 h-6 m-0.5 flex justify-center items-center rounded-md
                  ${isAddressTaken(channel) ? "bg-black" : "bg-green-500"}
                ${toHighlight(channel) ? "bg-orange-400" : ""}`}
                onPress={() => handlePress(channel)}>
                <Text className="text-white">{channel}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default UniverseTable;
