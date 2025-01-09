/* eslint-disable drizzle/enforce-delete-with-where */
import { View, Text } from "react-native";

import {
  ParsedCompositeFixtureInfo,
  AddressTuples,
} from "../../../models/types/scene-to-fixture-assignment.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import FixtureOutputDetail from "../FixtureOutputDetail/FixtureOutputDetail.tsx";

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

  const currentValues = manualFixturesStore[channel]?.values ?? values;
  const previousValues =
    previousManualFixtureStore[channel]?.values || dbValues;

  // console.log({ dbValues }, { channel });

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

  const handleOutput = () => {
    console.log("clicked a fixture channel: ", channel);

    if (fixtureInManualState) {
      removeFixtureFromState(channel);
    } else {
      addFixtureToState(channel);
    }
  };

  const fixtureSelectStyles = fixtureInManualState
    ? "border-yellow-500"
    : "border-green-500";

  const fixtureStyles = `bg-purple-800 w-52 h-52 border-4 rounded-lg m-2 ${fixtureSelectStyles}`;

  // if (channel === 1) {
  //   console.log("--------start render-------");

  //   console.log("prev", previousValues);
  //   console.log("cur_values", values);
  //   console.log("--------end render-------");
  // }
  return (
    <View
      key={fixtureAssignmentId}
      testID={`fixture-${fixtureAssignmentId}`}
      className={fixtureStyles}
      onTouchStart={handleOutput}>
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
