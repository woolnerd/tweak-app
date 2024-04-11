/* eslint-disable drizzle/enforce-delete-with-where */
import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { FixtureControlData } from "./types/fixture.ts";
import { ControlPanelContext } from "../app/contexts/control-panel.ts";
import {
  removeManualFixture,
  addManualFixture,
} from "../util/fixture-cache.ts";

// type OptionalProps<T> = { [P in keyof T]?: T[P] | null };
type ProfileKey = number;
type Value = number;
type ChannelTuples = [ProfileKey, Value][];

export type FixtureProps = {
  selectedFixtureIds: Set<number>;
  setSelectedFixtureIds: (
    fixtureIds: (currentState: Set<number>) => Set<number>,
  ) => void;
} & FixtureControlData & {
    values: ChannelTuples;
    profileChannels: { ProfileKey: string }[];
  };
export function Fixture({
  channel,
  fixtureName,
  profileChannels,
  values,
  fixtureAssignmentId,
  selectedFixtureIds,
  setSelectedFixtureIds,
  sceneId,
}: FixtureProps) {
  const ctrlPanelCtx = useContext(ControlPanelContext);
  const [selectedValue, setSelectedValue] = useState<string | null>([1, 50]);
  const [manualHighlight, setManualHighlight] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const fixtureIsCached = selectedFixtureIds.has(fixtureAssignmentId);

  const removeFixtureFromState = (fixture: FixtureControlData): void => {
    setSelectedFixtureIds((curSet: Set<number>) => {
      const dupe = new Set([...curSet]);
      dupe.delete(fixture.fixtureAssignmentId);
      return dupe;
    });
  };

  const addFixtureToState = (fixture: FixtureControlData): void => {
    setSelectedFixtureIds((curSet: Set<number>) => {
      const dupe = new Set([...curSet]);
      dupe.add(fixture.fixtureAssignmentId);
      return dupe;
    });
  };

  useEffect(() => {
    if (fixtureIsCached) {
      setSelectedValue(ctrlPanelCtx);
      setManualHighlight(true);
      setUnsavedChanges(true);
    }
  }, [ctrlPanelCtx, fixtureIsCached]);

  useEffect(() => {
    if (fixtureIsCached) {
      addManualFixture({
        channel,
        fixtureName,
        profileChannels,
        values, // here we need the correctly parsed value
        fixtureAssignmentId,
        sceneId,
      });
    } else {
      removeManualFixture(sceneId, fixtureAssignmentId);
    }
  }, [selectedFixtureIds, fixtureIsCached]);

  const handleOutput = (fixture: FixtureControlData) => {
    // toggles multiple fixtures in and out of set
    if (fixtureIsCached) {
      removeFixtureFromState(fixture);
    } else {
      addFixtureToState(fixture);
    }
    console.log("ctrlpanelctx", ctrlPanelCtx);
  };

  const selectedStyle = (id: number) => {
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

  return (
    <View
      key={fixtureAssignmentId}
      style={{ ...styles.fixtures, ...selectedStyle(fixtureAssignmentId) }}
      onTouchStart={() =>
        handleOutput({
          channel,
          fixtureName,
          profileChannels,
          values,
          fixtureAssignmentId,
          sceneId,
        })
      }>
      <Text style={styles.text}>{channel}</Text>
      <Text style={styles.text}>{fixtureName}</Text>
      <Text style={{ ...styles.text, ...selectedStyle(fixtureAssignmentId) }}>
        {selectedValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fixtures: {
    backgroundColor: "purple",
    width: 200,
    height: 130,
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
