import React, { useEffect, useCallback, useState } from "react";
import { View, FlatList } from "react-native";

import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import useCompositeFixtureStore from "../../store/useCompositeFixtureStore.ts";
import useFixtureChannelSelectionStore from "../../store/useFixtureChannelSelectionStore.ts";
import useManualFixtureStore from "../../store/useManualFixtureStore.ts";
import Fixture from "../Fixture/Fixture.tsx";
import { ManualFixtureState } from "../Fixture/types/Fixture.ts";

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

  const [originalFixtures, setOriginalFixtures] = useState<ManualFixtureState>(
    {},
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

  useEffect(() => {
    fetchCompositeFixtures().then((databaseFixtures) => {
      console.log(databaseFixtures);
      setOriginalFixtures(
        Object.fromEntries(
          databaseFixtures.map((dbFixture) => [dbFixture.channel, dbFixture]),
        ),
      );
    });
  }, [selectedSceneId, fetchCompositeFixtures]);

  useEffect(() => {
    console.log({ originalFixtures });

    if (originalFixtures) {
      fetchCompositeFixtures()
        .then((res) => {
          updateCompositeFixturesStore(res);
        })
        .catch((err) => console.log(err));

      if (loadFixtures) setLoadFixtures(false);
    }
  }, [
    selectedSceneId,
    fetchCompositeFixtures,
    updateCompositeFixturesStore,
    loadFixtures,
    setLoadFixtures,
    originalFixtures,
  ]);

  useEffect(() => {
    const updatedCompositeFixtures = compositeFixturesStore.map(
      (compFixtureStateObj) => {
        if (
          manualFixturesStore &&
          compFixtureStateObj.channel in manualFixturesStore
        ) {
          return {
            ...compFixtureStateObj,
            ...manualFixturesStore[compFixtureStateObj.channel],
          };
        }
        return compFixtureStateObj;
      },
    );

    updateCompositeFixturesStore(updatedCompositeFixtures);
  }, [manualFixturesStore, updateCompositeFixturesStore]);

  return (
    <View className="text-center bg-black-700 m-1 h-auto">
      <FlatList
        className="flex m-auto"
        data={compositeFixturesStore}
        renderItem={({ item }) => (
          <Fixture
            {...item}
            dbValues={originalFixtures[item.channel]?.values ?? []}
          />
        )}
        keyExtractor={(item) => item.fixtureAssignmentId.toString()}
      />
    </View>
  );
}
