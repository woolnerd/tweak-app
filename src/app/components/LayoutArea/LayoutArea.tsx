import React, { useEffect, useCallback, useState } from "react";
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
  loadFixtures: boolean;
  setLoadFixtures: (arg: boolean) => void;
};

export default function LayoutArea({
  selectedSceneId,
  loadFixtures,
  setLoadFixtures,
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

    if (loadFixtures) setLoadFixtures(false);
  }, [
    selectedSceneId,
    fetchCompositeFixtures,
    updateCompositeFixturesStore,
    loadFixtures,
    setLoadFixtures,
  ]);

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
    <View className="text-center bg-black m-1 h-auto">
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
            startAddress={item.startAddress}
            endAddress={item.endAddress}
            manufacturerName={item.manufacturerName}
          />
        )}
        keyExtractor={(item, idx) => item.fixtureAssignmentId.toString()}
      />
    </View>
  );
}
