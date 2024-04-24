import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";

import { Fixture as FixtureComponent } from "./fixture.tsx";
import { useCompositeFixtureStore } from "../app/store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../app/store/useFixtureChannelSelectionStore.ts";
import { db } from "../db/client.ts";
import ScenesToFixtureAssignments from "../models/scene-to-fixture-assignments.ts";
import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";
import { mergeCacheWithDBFixtures } from "../util/helpers.ts";

import Profile from "@/models/profile.ts";

// import UniverseDataBuilder from "../lib/universe-data-builder.ts";
// import ValueUniverse, { DmxTuple } from "../util/value-universe.ts";

type LayoutAreaProps = {
  selectedSceneId: number;
  goToOut: boolean;
};

// Drizzle inArray method must have at least one value in the array.
// using -1, because we should never have that id.
// const DRIZZLE_ARRAY_CHECK_VALUE = -1;

export default function LayoutArea({
  selectedSceneId,
  goToOut,
}: LayoutAreaProps): React.JSX.Element {
  // const [compositeFixtures, setCompositeFixtures] = useState<
  //   ParsedCompositeFixtureInfo[]
  // >([]);
  // const [selectedFixtureIds, setSelectedFixtureIds] = useState<Set<number>>(
  //   new Set([DRIZZLE_ARRAY_CHECK_VALUE]),
  // );

  const updateCompositeFixtures = useCompositeFixtureStore(
    (state) => state.updateCompositeFixtures,
  );
  const compositeFixtures = useCompositeFixtureStore(
    (state) => state.compositeFixtures,
  );

  const fixtureChannelSelection = useFixtureChannelSelectionStore(
    (state) => state.fixtureChannelNumbers,
  );

  const fetchCompositeFixtures = useCallback(async () => {
    try {
      const compositeFixtureInfoObjs = await new ScenesToFixtureAssignments(
        db,
      ).getCompositeFixtureInfo(selectedSceneId, fixtureChannelSelection);

      return compositeFixtureInfoObjs;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }, [selectedSceneId, fixtureChannelSelection]);

  // useEffect(() => {
  //   if (compositeFixtures.length > 0) {
  //     const universeObjs = compositeFixtures.map((compFixture) =>
  //       new UniverseDataBuilder(compFixture).toUniverseTuples(),
  //     );
  //     const universe = new ValueUniverse(1);
  //     universeObjs.flat().forEach((uni: DmxTuple) => {
  //       universe.addDmxValues(uni);
  //     });
  //     console.log(universe);
  //   }
  // }, [compositeFixtures]);

  useEffect(() => {
    fetchCompositeFixtures().then((res) => updateCompositeFixtures(res));
    // mergeCacheWithDBFixtures(
    //   selectedSceneId,
    //   fetchCompositeFixtures,
    //   updateCompositeFixtures,
    // );
  }, [selectedSceneId, fetchCompositeFixtures, updateCompositeFixtures]);

  return (
    <View
      style={{
        ...styles.container,
        alignItems: "center",
      }}>
      {/* {compositeFixtures?.map((fixtureProps) => (
        <FixtureComponent
          key={Math.random()}
          // selectedFixtureIds={selectedFixtureIds}
          // setSelectedFixtureIds={setSelectedFixtureIds}
          fixtureAssignmentId={fixtureProps.fixtureAssignmentId}
          channel={fixtureProps.channel}
          profileChannels={fixtureProps.profileChannels}
          profileName={fixtureProps.profileName}
          sceneId={fixtureProps.sceneId}
          fixtureName={fixtureProps.fixtureName}
          fixtureNotes={fixtureProps.fixtureNotes}
          values={fixtureProps.values}
        /> */}
      <FlatList
        data={compositeFixtures}
        renderItem={({ item }) => (
          <FixtureComponent
            // selectedFixtureIds={selectedFixtureIds}
            // setSelectedFixtureIds={setSelectedFixtureIds}
            fixtureAssignmentId={item.fixtureAssignmentId}
            channel={item.channel}
            profileChannels={item.profileChannels}
            profileName={item.profileName}
            sceneId={item.sceneId}
            fixtureName={item.fixtureName}
            fixtureNotes={item.fixtureNotes}
            values={item.values}
            is16Bit={item.is16Bit}
            channelPairs16Bit={item.channelPairs16Bit}
          />
        )}
        keyExtractor={(item, idx) => item.fixtureAssignmentId.toString()}
      />
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

// { "1": "Dimmer", "2": "Dimmer fine", "3": "Color Temp", "4": "Color Temp fine", "5": "Green/Magenta Point", "6": "Green/Magenta Point fine", "7": "Crossfade color", "8": "Crossfade color fine", "9": "Red intensity", "10": "Red intensity fine", "11": "Green intensity", "12": "Green intensity fine", "13": "Blue intensity", "14": "Blue intensity fine", "15": "White intensity", "16": "White intensity fine", "17": "Fan control", "18": "Preset", "19": "Strobe", "20": "Reserved for future use" }
