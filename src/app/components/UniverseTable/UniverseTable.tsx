import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";

type PatchObject = {
  id: string;
  startAddress: number;
  endAddress: number;
};

type Props = {
  patchData: PatchObject[];
};

const UniverseTable: React.FC<Props> = ({ patchData }) => {
  const universeChannels = Array.from({ length: 512 }, (_, i) => i + 1);

  const isAddressTaken = (channel: number): boolean =>
    patchData.some(
      (patchObj) =>
        channel >= patchObj.startAddress && channel <= patchObj.endAddress,
    );

  return (
    <View className="p-4">
      <Text className="text-white text-xl mb-4">Universe Table</Text>
      <ScrollView horizontal={false} style={{ maxHeight: 400 }}>
        <ScrollView horizontal={false}>
          <View className="flex flex-wrap flex-row">
            {universeChannels.map((channel) => (
              <View
                key={channel}
                className={`w-8 h-6 m-0.5 flex justify-center items-center rounded-md ${
                  isAddressTaken(channel) ? "bg-black" : "bg-green-500"
                }`}>
                <Text className="text-white">{channel}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default UniverseTable;
