import { View, Text } from "react-native";
import { uniqueId } from "lodash";

import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import {
  convertDmxValueToPercent,
  percentageToColorTemperature,
  percentageToIntensityLevel,
} from "../../../util/helpers.ts";
import { handleChannelValues } from "./helpers.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import FaderNumbers from "../FaderNumbers/FaderNumbers.tsx";
import { useRef } from "react";

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

  const manualFixturesStore = useManualFixtureStore(
    (state) => state.manualFixturesStore,
  );

  const fixtureInManualState = fixtureChannelSelectionStore.has(channel);

  const outputValue = useRef<string | null>(null);

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

  const isManualFixtureChannel = (testChannel: number) =>
    !!manualFixturesStore[channel]?.manualChannels?.includes(testChannel);

  const fixtureTextDetailStyles = isManualFixtureChannel(channel)
    ? "text-red-600"
    : "text-black";

  const fixtureSelectStyles = fixtureInManualState
    ? "border-yellow-500"
    : "border-green-500";

  const fixtureStyles = `bg-purple-800 w-52 h-52 border-4 rounded-lg m-2 ${fixtureSelectStyles}`;

  const fixtureTextStyles = `text-center text-lg font-extrabold ${fixtureTextDetailStyles}`;

  const buildOutputDetails = () => {
    const { result: details, manualStyleChannels } = handleChannelValues(
      profileChannels,
      values,
      channelPairs16Bit,
      is16Bit,
      isManualFixtureChannel,
    );

    if (!details) return null;

    return Object.keys(details as object).map((profileField) =>
      outputDetail(profileField, details),
    );
  };

  const outputDetail = (
    profileField: string,
    details: Record<string, number>,
    // styleOptions: Record<string, boolean>,
  ) => (
    <Text
      testID={`output-detail-${fixtureAssignmentId}`}
      key={uniqueId(String(fixtureAssignmentId))}
      className={fixtureTextStyles}>
      {`${profileField}:
      ${details ? handleDifferentProfileFields(profileField, details) : ""}`}
    </Text>
  );

  // only handles color temp and intensity right now, needs to handle tint, plus more
  const handleDifferentProfileFields = (
    profileField: string,
    details: Record<string, number>,
  ) => {
    if (
      profileField.toLowerCase().includes("temp") &&
      colorTempHigh &&
      colorTempLow
    ) {
      return percentageToColorTemperature(
        convertDmxValueToPercent(details[profileField]),
        colorTempLow,
        colorTempHigh,
      );
    }
    return `${percentageToIntensityLevel(convertDmxValueToPercent(details[profileField]))}%`;
  };

  return (
    <View
      key={fixtureAssignmentId}
      testID={`fixture-${fixtureAssignmentId}`}
      className={fixtureStyles}
      onTouchStart={() => handleOutput(channel)}>
      <Text className="text-center text-lg font-extrabold">{channel}</Text>
      <Text className="text-center text-lg font-extrabold">{fixtureName}</Text>
      {buildOutputDetails()}
      {/* <FaderNumbers start={100} end={50} duration={5000} /> */}
    </View>
  );
}
