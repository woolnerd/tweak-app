/* eslint-disable drizzle/enforce-delete-with-where */
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { FixtureControlData } from "./types/fixture.ts";
import { useFixtureChannelSelectionStore } from "../app/store/useFixtureChannelSelectionStore.ts";
import {
  removeManualFixture,
  addManualFixture,
} from "../util/fixture-cache.ts";
import { handleChannelValues, presentValueAsPercent } from "../util/helpers.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";

// type OptionalProps<T> = { [P in keyof T]?: T[P] | null };
type ProfileKey = number;
type Value = number;
type ChannelTuples = [ProfileKey, Value][];

export type FixtureProps = {
  // selectedFixtureIds: Set<number>;
  // setSelectedFixtureIds: (
  //   fixtureIds: (currentState: Set<number>) => Set<number>,
  // ) => void;
} & ParsedCompositeFixtureInfo & {
    values: ChannelTuples;
    profileChannels: { ProfileKey: string }[];
  };
export function Fixture({
  channel,
  fixtureName,
  profileChannels,
  values,
  fixtureAssignmentId,
  is16Bit,
  channelPairs16Bit,
  // selectedFixtureIds,
  // setSelectedFixtureIds,
  sceneId,
  startAddress,
  endAddress,
}: FixtureProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>([150]);
  const [manualHighlight, setManualHighlight] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const fixtureChannelNumbers = useFixtureChannelSelectionStore(
    (state) => state.fixtureChannelNumbers,
  );
  const updateFixtureSelection = useFixtureChannelSelectionStore(
    (state) => state.updateFixtureSelection,
  );

  const fixtureIsCached = fixtureChannelNumbers.has(channel);

  const removeFixtureFromState = (fixture: FixtureControlData): void => {
    const dupe = new Set([...fixtureChannelNumbers]);
    dupe.delete(fixture.channel);
    updateFixtureSelection(dupe);
  };

  const addFixtureToState = (fixture: FixtureControlData): void => {
    const dupe = new Set([...fixtureChannelNumbers]);
    dupe.add(fixture.channel);
    updateFixtureSelection(dupe);
  };

  useEffect(() => {
    if (fixtureIsCached) {
      // setSelectedValue(ctrlPanelCtx);
      setManualHighlight(true);
      setUnsavedChanges(true);
    }
  }, [fixtureIsCached]);

  // useEffect(() => {
  //   if (fixtureIsCached) {
  //     addManualFixture({
  //       channel,
  //       fixtureName,
  //       profileChannels,
  //       values, // here we need the correctly parsed value
  //       fixtureAssignmentId,
  //       sceneId,
  //       startAddress,
  //       endAddress,
  //     });
  //   } else {
  //     removeManualFixture(sceneId, channel);
  //   }
  // }, [
  //   fixtureIsCached,
  //   channel,
  //   fixtureName,
  //   profileChannels,
  //   values, // here we need the correctly parsed value
  //   fixtureAssignmentId,
  //   sceneId,
  //   startAddress,
  //   endAddress,
  // ]);

  const handleOutput = (fixture: FixtureControlData) => {
    // toggles multiple fixtures in and out of set
    if (fixtureIsCached) {
      removeFixtureFromState(fixture);
    } else {
      addFixtureToState(fixture);
    }
  };

  const selectedStyle = (fixtureChannel: number) => {
    const styles: { color?: string; borderColor?: string } = {};

    if (unsavedChanges) {
      styles.color = "rgb(256, 50, 30)";
      styles.color = "rgb(256, 50, 30)";
    }

    if (fixtureIsCached) {
      styles.borderColor = "gold";
      styles.borderColor = "gold";
    } else {
      styles.borderColor = "rgb(100, 256, 100)";
      styles.borderColor = "rgb(100, 256, 100)";
    }
    return styles;
  };

  const buildOutputDetails = () => {
    const details = handleChannelValues(
      profileChannels,
      values,
      channelPairs16Bit,
      is16Bit,
    );

    return Object.keys(details as object).map((profileField) => (
      <Text
        key={`${profileField}+${Math.random()}`}
        style={{ ...styles.text, ...selectedStyle(channel) }}>
        {`${profileField}: ${details ? presentValueAsPercent(details[profileField]) : ""}`}
      </Text>
    ));
  };

  return (
    <View
      key={Math.random()}
      style={{ ...styles.fixtures, ...selectedStyle(channel) }}
      onTouchStart={() =>
        handleOutput({
          channel,
          fixtureName,
          profileChannels,
          values,
          fixtureAssignmentId,
          sceneId,
          startAddress,
          endAddress,
        })
      }>
      <Text style={styles.text}>{channel}</Text>
      <Text style={styles.text}>{fixtureName}</Text>
      {/* <Text style={{ ...styles.text, ...selectedStyle(fixtureAssignmentId) }}>
        {selectedValue}
      </Text> */}
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
  },
  text: {
    fontWeight: "800",
    textAlign: "center",
    fontSize: 20,
  },
});
