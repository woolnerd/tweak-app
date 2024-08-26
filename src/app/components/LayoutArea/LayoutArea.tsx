import React, { useEffect, useCallback } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import useUniverseOutput from "../../hooks/useUniverseOutput.ts";
import { useCompositeFixtureStore } from "../../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";
import { Fixture as FixtureComponent } from "../Fixture/Fixture.tsx";

type LayoutAreaProps = {
  selectedSceneId: number;
  goToOut: boolean;
};

export default function LayoutArea({
  selectedSceneId,
  goToOut,
}: LayoutAreaProps): React.JSX.Element {
  const { compositeFixturesStore, updateCompositeFixturesStore } =
    useCompositeFixtureStore((state) => state);

  const fixtureChannelSelection = useFixtureChannelSelectionStore(
    (state) => state.fixtureChannelSelectionStore,
  );

  const { manualFixturesStore } = useManualFixtureStore((state) => state);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId]);

  useUniverseOutput();

  useEffect(() => {
    fetchCompositeFixtures()
      .then((res) => updateCompositeFixturesStore(res))
      .catch((err) => console.log(err));
  }, [selectedSceneId, fetchCompositeFixtures, updateCompositeFixturesStore]);

  useEffect(() => {
    updateCompositeFixturesStore(
      compositeFixturesStore.map((compFixtureStateObj) => {
        if (compFixtureStateObj.channel in manualFixturesStore) {
          return {
            ...compFixtureStateObj,
            ...manualFixturesStore[compFixtureStateObj.channel],
          };
        }
        return compFixtureStateObj;
      }),
    );

    // console.log({ compositeFixturesStore });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualFixturesStore]);

  return (
    <View
      style={{
        ...styles.container,
        alignItems: "center",
      }}>
      <FlatList
        data={compositeFixturesStore}
        renderItem={({ item }) => (
          <FixtureComponent
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
            colorTempHigh={item.colorTempHigh}
            colorTempLow={item.colorTempLow}
            title={item.title}
            startAddress={item.startAddress}
            endAddress={item.endAddress}
            goToOut={goToOut}
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
