import React, { useEffect, useCallback } from "react";
import { View, FlatList } from "react-native";

import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
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
  }, [selectedSceneId, fixtureChannelSelection]);

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
  }, [manualFixturesStore]);

  return (
    <View className="text-center bg-black-700 m-1 h-auto">
      <FlatList
        className="flex m-auto"
        data={compositeFixturesStore}
        renderItem={({ item }) => <FixtureComponent {...item} />}
        keyExtractor={(item, idx) => item.fixtureAssignmentId.toString()}
      />
    </View>
  );
}
