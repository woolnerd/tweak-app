import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import ScenesToFixtureAssignments from "@/models/scene-to-fixture-assignments";
import { Fixture as FixtureComponent } from "./fixture";
import { db } from "@/db/client";
import { mergeCacheWithDBFixtures } from "@/util/helpers";

type LayoutAreaProps = {
  selectedSceneId: number;
  goToOut: boolean;
};

export type FixtureAssignmentResponse = {
  fixtureAssignmentId: number;
  channel: number;
  values: string | null;
  title: string | null;
  profileChannels: string | null;
  profileName: string | null;
  fixtureName: string | null;
  fixtureNotes: string | null;
  sceneId: number;
}[];
// inArray method must have at least one value in the array.
//using -1, because we should never have that id.
const DRIZZLE_ARRAY_CHECK_VALUE = -1;

export const LayoutArea = (props: LayoutAreaProps): React.JSX.Element => {
  const [fixtures, setFixtures] = useState<FixtureAssignmentResponse>([]);
  const [selectedFixtureIds, setSelectedFixtureIds] = useState<Set<number>>(
    new Set([DRIZZLE_ARRAY_CHECK_VALUE]),
  );

  const fetchFixtures = useCallback(async () => {
    try {
      const fixturesWithAssignments = await new ScenesToFixtureAssignments(
        db,
      ).getFixturesAndAssignments(props.selectedSceneId, selectedFixtureIds);

      return fixturesWithAssignments;
    } catch (e) {
      console.log(e);
    }
  }, [props.selectedSceneId, selectedFixtureIds]);

  useEffect(() => {
    if (props.goToOut) {
    }
  }, [props.goToOut]);

  useEffect(() => {
    mergeCacheWithDBFixtures(props.selectedSceneId, fetchFixtures, setFixtures);
  }, [props.selectedSceneId, fetchFixtures]);

  return (
    <View
      style={{
        ...styles.container,
        alignItems: "center",
      }}
    >
      {fixtures?.map((fixtureProps) => (
        <FixtureComponent
          key={fixtureProps.fixtureAssignmentId}
          selectedFixtureIds={selectedFixtureIds}
          setSelectedFixtureIds={setSelectedFixtureIds}
          {...fixtureProps}
        />
      ))}
    </View>
  );
};

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
