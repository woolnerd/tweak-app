import { View, Text } from "react-native";

import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import { useRef } from "react";
import { FixtureOutputDetail } from "../FixtureOutputDetail/FixtureOutputDetail.tsx";

export type FixtureProps = object & ParsedCompositeFixtureInfo;
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
  ...props
}: FixtureProps) {
  const { fixtureChannelSelectionStore, updateFixtureChannelSelectionStore } =
    useFixtureChannelSelectionStore((state) => state);

  const fixtureInManualState = fixtureChannelSelectionStore.has(channel);

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
        values={values}
      />
    </View>
  );
}
