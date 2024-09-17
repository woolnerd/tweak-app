import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";

import { db } from "../../db/client.ts";
import {
  fixtureAssignments,
  scenesToFixtureAssignments,
  patches,
} from "../../db/schema.ts";
import { SelectFixture } from "../../db/types/tables.ts";
import PatchModel from "../../models/patch.ts";
import { ProfileProcessed } from "../../models/profile.ts";
import useFetchFixtureAssignments from "../hooks/useFetchFixtureAssignments.ts";
import useFetchFixtures from "../hooks/useFetchFixtures.ts";
import useFetchManufacturers from "../hooks/useFetchManufacturers.ts";
import useFetchPatches from "../hooks/useFetchPatches.ts";
import useFetchProfiles from "../hooks/useFetchProfiles.ts";
import useFetchScenes from "../hooks/useFetchScenes.ts";

const CHANNEL_LIST_COUNT = 200;

type ChannelObjectPatch = {
  startAddress: number;
  endAddress: number;
  chanNum: number;
  selected: boolean;
};

export default function Patch() {
  const [fixtureSelection, setFixtureSelection] = useState<number | null>(null);
  const [manufacturerSelection, setManufacturerSelection] = useState<
    number | null
  >(null);
  const [profileSelection, setProfileSelection] = useState<number | null>(null);
  const [selectedChannels, setSelectChannels] = useState<number[]>([]);
  const [channelObjsToPatch, setChannelObjsToPatch] = useState<
    ChannelObjectPatch[]
  >([]);
  const [addressTextInput, setAddressTextInput] = useState("");

  const SHOW = 1;

  const { data: manufacturers } = useFetchManufacturers();
  const { data: fixtures, loading: fixturesLoading } = useFetchFixtures(
    manufacturerSelection,
  );
  const { data: profiles } = useFetchProfiles(fixtureSelection);
  const { data: sceneIds } = useFetchScenes();
  const { data: patchData, error: patchError } = useFetchPatches();
  const { data: fixtureAssignmentsData } = useFetchFixtureAssignments();

  const handleManufacturerSelection = (manufacturerId: number) => {
    setManufacturerSelection(manufacturerId);
  };

  const channelsInUse = fixtureAssignmentsData.map(
    (assignment) => assignment.channel,
  );

  const batchUpdateScenes = async (
    fixAssignmentResponses: { id: number }[][],
  ) => {
    await db.transaction(async (tx) => {
      const promises = sceneIds.map((sceneId: number) => {
        const fixturePromises = fixAssignmentResponses.map((response) =>
          tx.insert(scenesToFixtureAssignments).values({
            sceneId,
            fixtureAssignmentId: response[0].id,
          }),
        );

        return Promise.all(fixturePromises);
      });

      await Promise.all(promises);
    });
  };

  const handleFixtureSelection = (fixture: SelectFixture) => {
    // update manufacturer
    setFixtureSelection(fixture.id);
    setManufacturerSelection(fixture.manufacturerId);
    // update profiles available
  };

  const handleProfileSelection = (profile: ProfileProcessed) => {
    setProfileSelection(profile.id);
  };

  const handleChannelSelection = (channel: number) => {
    if (channelsInUse.includes(channel)) {
      alert("Channel is in use");
      return;
    }

    if (selectedChannels.includes(channel)) {
      setSelectChannels(
        selectedChannels.filter((channelInState) => channelInState !== channel),
      );
      return;
    }

    setSelectChannels([...selectedChannels, channel]);
  };

  const handlePatch = async () => {
    if (!(profileSelection && fixtureSelection)) {
      throw new Error("Please select a profile and fixture");
    }

    const payLoadWithAddresses = channelObjsToPatch
      .filter((mixedObjs) => mixedObjs.selected)
      .map((dataObj) => ({
        startAddress: dataObj.startAddress,
        endAddress: dataObj.endAddress,
        channelNum: dataObj.chanNum,
        profileId: profileSelection,
        fixtureId: fixtureSelection,
        showId: SHOW,
      }));

    try {
      const promises = payLoadWithAddresses.map((patchPayload) =>
        new PatchModel(db).create(patchPayload),
      );

      const patchResponses = await Promise.all(promises);

      console.log({ patchResponses });

      const fixtureAssignmentPromises = patchResponses.map((patchRes) => {
        const channel = payLoadWithAddresses.filter(
          (payload) => payload.startAddress === patchRes[0].startAddress,
        )[0].channelNum;
        return db.transaction(async (tx) =>
          tx
            .insert(fixtureAssignments)
            .values({
              channel,
              fixtureId: patchRes[0].fixtureId,
              profileId: patchRes[0].profileId,
              patchId: patchRes[0].id,
            })
            .returning({ id: fixtureAssignments.id }),
        );
      });

      const fixtureAssignmentResponses = await Promise.all(
        fixtureAssignmentPromises,
      );

      console.log({ fixtureAssignmentResponses });
      batchUpdateScenes(fixtureAssignmentResponses);
      setSelectChannels([]);
      setAddressTextInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const profile = profiles.find(
    (profileObj) => profileObj.id === profileSelection,
  );
  const profileFootprint = profile
    ? // either it has a lot of profile channels, or it is a single channel device.
      Object.keys(JSON.parse(profile.channels)).length
    : 1;

  const buildProfileDisplay = () => {
    if (!profileSelection || !profile) return null;

    return (
      <React.Fragment key={profile.id}>
        <Text>Name: {profile.name}</Text>
        <Text>Channel Count: {profile.channelCount}</Text>
        <Text>Channels: {profile.channels}</Text>
        <Text>16Bit: {profile.is16Bit ? "yes" : "no"}</Text>
      </React.Fragment>
    );
  };

  const channelStyle = (chanNum: number) => {
    if (channelsInUse.includes(chanNum)) {
      return "text-black-400";
    }

    return selectedChannels.includes(chanNum)
      ? "text-yellow-400"
      : "text-white";
  };

  const renderChannelDisplay = ({ item }) => (
    <View className="flex-row">
      <Pressable
        key={item.chanNum}
        onPress={() => handleChannelSelection(item.chanNum)}>
        <Text className={channelStyle(item.chanNum)}>{item.chanNum}</Text>
      </Pressable>
      <Text className="ml-3">
        {item.startAddress &&
        item.endAddress &&
        selectedChannels.includes(item.chanNum)
          ? `${item.startAddress} - ${item.endAddress}`
          : ""}
      </Text>
    </View>
  );

  // extractable
  const generateChannelList = (firstAddress: number, profileSize: number) => {
    const channelList = [];
    let startAddress = firstAddress;
    let endAddress = profileSize + firstAddress - 1;

    for (let i = 1; i <= CHANNEL_LIST_COUNT; i += 1) {
      if (
        selectedChannels.includes(i) &&
        profileSelection &&
        addressTextInput
      ) {
        channelList.push({
          chanNum: i,
          selected: true,
          startAddress,
          endAddress,
        });
        startAddress += profileSize;
        endAddress += profileSize;
      } else {
        channelList.push({
          chanNum: i,
          selected: false,
        });
      }
    }
    return channelList;
  };

  useEffect(() => {
    setProfileSelection(null);
    setFixtureSelection(null);
  }, [manufacturerSelection]);

  useEffect(() => {
    setProfileSelection(null);
    // TODO first click of fixture selects both fixture and manufacturer
    if (!fixturesLoading && fixtureSelection) {
      setManufacturerSelection(
        fixtures.find((fixture) => fixture.id === fixtureSelection)!
          .manufacturerId,
      );
    }
  }, [fixtureSelection, fixtures, fixturesLoading]);

  useEffect(() => {
    // TODO we have two needs from this list: Display and Database. For DB creation, we need to remove the unselected.

    setChannelObjsToPatch(
      generateChannelList(
        parseInt(addressTextInput, 10),
        profile?.channelCount,
      ),
    );
  }, [addressTextInput, profiles]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="flex-row w-full h-1/2 bg-gray-400 border-gray-300">
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Manufacturer</Text>
          {manufacturers.map((m) => (
            <Pressable
              key={m.name}
              onPress={() => handleManufacturerSelection(m.id)}>
              <Text
                className={
                  m.id === manufacturerSelection
                    ? "text-yellow-400"
                    : "text-white"
                }
                key={m.name}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Fixture</Text>
          {fixtures.map((m) => (
            <Pressable key={m.name} onPress={() => handleFixtureSelection(m)}>
              <Text
                className={
                  m.id === fixtureSelection ? "text-yellow-400" : "text-white"
                }>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Profile</Text>
          {!fixtureSelection ? (
            <Text>Select a Fixture</Text>
          ) : (
            profiles.map((m) => (
              <Pressable key={m.id} onPress={() => handleProfileSelection(m)}>
                <Text
                  className={
                    m.id === profileSelection ? "text-yellow-400" : "text-white"
                  }>
                  {m.name}
                </Text>
              </Pressable>
            ))
          )}
        </View>
        <View className="border-red-400 border-2 p-5 w-1/8">
          <Text className="text-white text-xl">Channels</Text>
          <FlatList
            data={channelObjsToPatch}
            renderItem={renderChannelDisplay}
          />
        </View>
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Address</Text>
          <TextInput
            value={addressTextInput}
            placeholder="Enter Address Start"
            onChangeText={setAddressTextInput}
            keyboardType="numeric"
          />
          <Pressable onPress={handlePatch} className="border-2">
            <Text className="text-yellow-500 p-5 text-xl">Save Patch</Text>
          </Pressable>
        </View>
      </View>

      <View className="w-full h-1/2 flex-row">
        <View className="w-1/2 h-full bg-red-500 justify-center items-center">
          <Text className="text-white">Universe Table</Text>
          <View>
            {patchData.map((patchObj) => (
              <React.Fragment key={patchObj.id}>
                <Text>StartAddres: {patchObj.startAddress}</Text>
                <Text>endAddress: {patchObj.endAddress}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View className="w-1/2 h-full bg-green-500 justify-center items-center">
          <Text className="text-white">Selected Fixture Details</Text>
          <View>{buildProfileDisplay()}</View>
        </View>
      </View>
    </View>
  );
}
