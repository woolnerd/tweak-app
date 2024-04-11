import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { Fixture as FixtureComponent } from "./fixture.tsx";
import { db } from "../db/client.ts";
import ScenesToFixtureAssignments from "../models/scene-to-fixture-assignments.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import { mergeCacheWithDBFixtures } from "../util/helpers.ts";

type LayoutAreaProps = {
  selectedSceneId: number;
  goToOut: boolean;
};

// inArray method must have at least one value in the array.
// using -1, because we should never have that id.
const DRIZZLE_ARRAY_CHECK_VALUE = -1;

export default function LayoutArea({
  selectedSceneId,
  goToOut,
}: LayoutAreaProps): React.JSX.Element {
  const [compositeFixtures, setCompositeFixtures] = useState<
    ParsedCompositeFixtureInfo[]
  >([]);
  const [selectedFixtureIds, setSelectedFixtureIds] = useState<Set<number>>(
    new Set([DRIZZLE_ARRAY_CHECK_VALUE]),
  );

  const fetchCompositeFixtures = useCallback(async () => {
    try {
      const compositeFixtureInfoObjs = await new ScenesToFixtureAssignments(
        db,
      ).getCompositeFixtureInfo(selectedSceneId, selectedFixtureIds);

      return compositeFixtureInfoObjs;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }, [selectedSceneId, selectedFixtureIds]);

  useEffect(() => {
    console.log(compositeFixtures[0]);
  }, [compositeFixtures]);

  useEffect(() => {
    mergeCacheWithDBFixtures(
      selectedSceneId,
      fetchCompositeFixtures,
      setCompositeFixtures,
    );
  }, [selectedSceneId, fetchCompositeFixtures]);

  return (
    <View
      style={{
        ...styles.container,
        alignItems: "center",
      }}>
      {compositeFixtures?.map((fixtureProps) => (
        <FixtureComponent
          key={fixtureProps.fixtureAssignmentId}
          selectedFixtureIds={selectedFixtureIds}
          setSelectedFixtureIds={setSelectedFixtureIds}
          fixtureAssignmentId={fixtureProps.fixtureAssignmentId}
          channel={fixtureProps.channel}
          profileChannels={fixtureProps.profileChannels}
          profileName={fixtureProps.profileName}
          sceneId={fixtureProps.sceneId}
          fixtureName={fixtureProps.fixtureName}
          fixtureNotes={fixtureProps.fixtureNotes}
          values={fixtureProps.values}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    // borderColor: '#cba601',
    // borderWidth: 2,
    margin: 4,
    height: "auto",
  },

  scene: {
    borderColor: "purple",
    borderWidth: 2,
    margin: 4,
    height: "100%",
    minWidth: 130,
  },

  rec: {
    borderColor: "red",
    borderWidth: 2,
    margin: 4,
    color: "#fff",
    textAlign: "center",
    minWidth: 60,
    padding: 4,
    // height: "100%"
  },

  bigButtons: {
    borderColor: "blue",
    minHeight: 60,
    padding: 18,
    borderWidth: 2,
    margin: 4,
    height: 30,
    minWidth: 60,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  btnText: {
    color: "black",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },

  fixtures: {
    backgroundColor: "yellow",
    width: 100,
    height: 100,
    borderColor: "black",
    borderWidth: 4,
    margin: 10,
    textAlign: "center",
  },
});
