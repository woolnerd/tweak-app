import React, { useEffect, useCallback, useState } from "react";
import { View, FlatList } from "react-native";

import { db } from "../../../db/client.ts";
import ScenesToFixtureAssignments from "../../../models/scene-to-fixture-assignments.ts";
import useUniverseOutput from "../../hooks/useUniverseOutput.ts";
import { useCompositeFixtureStore } from "../../store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../../store/useFixtureChannelSelectionStore.ts";
import { useManualFixtureStore } from "../../store/useManualFixtureStore.ts";
import { Fixture as FixtureComponent } from "../Fixture/Fixture.tsx";
import PacketSender from "../../../lib/packets/packet-sender.ts";
import PacketBuilder from "../../../lib/packets/packet-builder.ts";
import { useOutputValuesStore } from "../../store/useOutputValuesStore.ts";

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
  const { outputValuesStore } = useOutputValuesStore();

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
    const sender = new PacketSender(5568, "172.20.10.3");
    const packetBuilder = new PacketBuilder(1, [128, 128, 0, 0]);
    packetBuilder.build();

    console.log(outputValuesStore);

    sender.sendSACNPacket(packetBuilder.packet);
    sender.closeSocket();
  }, [outputValuesStore]);

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
