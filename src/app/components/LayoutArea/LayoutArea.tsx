import React, { useEffect, useCallback } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { Fixture as FixtureComponent } from "../Fixture/Fixture.tsx";
import { useCompositeFixtureStore } from "../../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";
import { useOutputValuesStore } from "../../store/useOutputValuesStore.ts";
import { db } from "../../../db/client.ts";
import UniverseDataBuilder from "../../../lib/universe-data-builder.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import ValueUniverse, { DmxTuple } from "../../../util/value-universe.ts";

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

  const { updateOutputValuesStore } = useOutputValuesStore((state) => state);

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

  useEffect(() => {
    if (compositeFixturesStore.length > 0) {
      const universeObjs = compositeFixturesStore.map((compFixture) => {
        if (compFixture.channel in manualFixturesStore) {
          compFixture.values = manualFixturesStore[compFixture.channel].values;
        }
        return new UniverseDataBuilder(compFixture).toUniverseTuples();
      });

      const universe = new ValueUniverse(1);
      universeObjs.flat().forEach((uni: DmxTuple) => {
        universe.addDmxValues(uni);
      });

      console.log(universe.getDmxValues);
      console.log({ manualFixturesStore });

      updateOutputValuesStore(universe.getDmxValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compositeFixturesStore, manualFixturesStore]);

  useEffect(() => {
    fetchCompositeFixtures().then((res) => updateCompositeFixturesStore(res));
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
