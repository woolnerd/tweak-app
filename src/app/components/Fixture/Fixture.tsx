import { View, Text } from "react-native";
import { useState } from "react";

import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import { FixtureOutputDetail } from "../FixtureOutputDetail/FixtureOutputDetail.tsx";
import { AddressTuples } from "../../../models/types/scene-to-fixture-assignment.ts";

export type FixtureProps = object &
  ParsedCompositeFixtureInfo & { dbValues: AddressTuples };
export default function Fixture({
  channel,
  fixtureName,
  profileChannels,
  values,
  fixtureAssignmentId,
  is16Bit,
  channelPairs16Bit,
  colorTempLow,
  colorTempHigh,
  dbValues,
  ...props
}: FixtureProps) {
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const fixtureInManualState = fixtureChannelSelectionStore.has(channel);

  const { previousManualFixtureStore, manualFixturesStore } =
    useManualFixtureStore((state) => state);

  let currentValues = manualFixturesStore[channel]?.values ?? values;
  let previousValues = previousManualFixtureStore[channel]?.values || dbValues;

  console.log({ dbValues });

  const removeFixtureFromState = (fixtureChannel: number): void => {
    const dupe = new Set([...fixtureChannelSelectionStore]);
    dupe.delete(fixtureChannel);
    updateFixtureChannelSelectionStore(dupe);
  };

  const addFixtureToState = (fixtureChannel: number): void => {
    const dupe = new Set([...fixtureChannelSelectionStore]);
    dupe.add(fixtureChannel);
    updateFixtureChannelSelectionStore(dupe);
  };

  const handleOutput = (fixtureChannel: number) => {
    console.log("clicked a fixture channel: ", channel);

    if (fixtureInManualState) {
      removeFixtureFromState(fixtureChannel);
    } else {
      addFixtureToState(fixtureChannel);
    }
  };

  const fixtureSelectStyles = fixtureInManualState
    ? "border-yellow-500"
    : "border-green-500";

  const fixtureStyles = `bg-purple-800 w-52 h-52 border-4 rounded-lg m-2 ${fixtureSelectStyles}`;

  if (channel === 1) {
    console.log("--------start render-------");

    console.log("prev", previousValues);
    console.log("cur_values", values);
    console.log("--------end render-------");
  }
  return (
    <View
      key={fixtureAssignmentId}
      testID={`fixture-${fixtureAssignmentId}`}
      className={fixtureStyles}
      onTouchStart={() => handleOutput(channel)}>
      <Text className="text-center text-lg font-extrabold">{channel}</Text>
      <Text className="text-center text-lg font-extrabold">{fixtureName}</Text>
      <FixtureOutputDetail
        channel={channel}
        profileChannels={profileChannels}
        channelPairs16Bit={channelPairs16Bit}
        is16Bit={is16Bit}
        fixtureAssignmentId={fixtureAssignmentId}
        colorTempHigh={colorTempHigh}
        colorTempLow={colorTempLow}
        values={currentValues}
        previousValues={previousValues}
      />
    </View>
  );
}
