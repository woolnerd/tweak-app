/* eslint-disable drizzle/enforce-delete-with-where */
import { View, Text, StyleSheet } from "react-native";

import { ParsedCompositeFixtureInfo } from "../../../models/types/scene-to-fixture-assignment.ts";
import {
  handleChannelValues,
  convertDmxValueToPercent,
  percentageToColorTemperature,
  percentageToIntensityLevel,
} from "../../../util/helpers.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";

export type FixtureProps = object & ParsedCompositeFixtureInfo;
export function Fixture({
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

  const selectedStyle = (isManual: boolean) => {
    const styles: { color?: string; borderColor?: string } = {};

    if (isManual) {
      styles.color = "rgb(256, 50, 30)";
    }

    if (fixtureInManualState) {
      styles.borderColor = "gold";
    } else {
      styles.borderColor = "rgb(100, 256, 100)";
    }
    return styles;
  };

  const fixturesStyles =
    "bg-purple-500 w-50 h-40 border-4 m-2 border-yellow-500 rounded-lg";
  const textStyles = "font-extrabold text-center text-xl";

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
      outputDetail(profileField, details, manualStyleChannels),
    );
  };

  const outputDetail = (
    profileField: string,
    details: Record<string, number>,
    styleOptions: Record<string, boolean>,
  ) => (
    <Text
      key={`${profileField}+${Math.random()}`}
      style={{
        ...styles.text,
        ...selectedStyle(styleOptions[profileField]),
      }}>
      {`${profileField}:
      ${details ? handleDifferentProfileFields(profileField, details) : ""}`}
    </Text>
  );

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
      style={{ ...styles.fixtures, ...selectedStyle(false) }}
      onTouchStart={() => handleOutput(channel)}>
      <Text style={styles.text}>{channel}</Text>
      <Text style={styles.text}>{fixtureName}</Text>
      {buildOutputDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  fixtures: {
    backgroundColor: "purple",
    width: 200,
    height: 160,
    borderWidth: 4,
    margin: 10,
    borderColor: "gold",
    borderRadius: 10,
  },
  text: {
    fontWeight: "800",
    textAlign: "center",
    fontSize: 20,
  },
});
