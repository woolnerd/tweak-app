import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { db } from "../../db/client.ts";
import {
  fixtureAssignments,
  scenesToFixtureAssignments,
} from "../../db/schema.ts";
import { SelectFixture } from "../../db/types/tables.ts";
import PatchModel from "../../models/patch.ts";
import useFetchFixtures from "../hooks/useFetchFixtures.ts";
import useFetchManufacturers from "../hooks/useFetchManufacturers.ts";
import useFetchPatches from "../hooks/useFetchPatches.ts";
import useFetchProfiles from "../hooks/useFetchProfiles.ts";
import useFetchScenes from "../hooks/useFetchScenes.ts";

type ProfileType = {
  id: number;
  channels: Record<number, string>;
  fixtureId: number;
  channelPairs16Bit: number[][];
};

export default function Patch() {
  const [fixtureSelection, setFixtureSelection] = useState(0);
  const [manufacturerSelection, setManufacturerSelection] = useState<
    number | null
  >(null);
  const [profileSelection, setProfileSelection] = useState<number | null>(null);
  const [selectedChannels, setSelectChannels] = useState<number[]>([]);
  const [addressTextInput, setAddressTextInput] = useState("");

  const SHOW = 1;

  const { data: manufacturers } = useFetchManufacturers();
  const { data: fixtures } = useFetchFixtures(manufacturerSelection);
  const { data: profiles } = useFetchProfiles(fixtureSelection);
  const { data: sceneIds } = useFetchScenes();
  const { data: patchData, error: patchError } = useFetchPatches();

  const handleManufacturerSelection = (manufacturerId: number) => {
    setManufacturerSelection(manufacturerId);
  };

  const batchUpdateScenes = async (fixAssignmentRes: { id: number }[]) => {
    await db.transaction(async (tx) => {
      const promises = sceneIds.map((id) =>
        tx.insert(scenesToFixtureAssignments).values({
          sceneId: id,
          fixtureAssignmentId: fixAssignmentRes[0].id,
        }),
      );

      await Promise.all(promises);
    });
  };

  const handleFixtureSelection = (fixture: SelectFixture) => {
    // update manufacturer
    setManufacturerSelection(fixture.manufacturerId);
    // update profiles available
    setFixtureSelection(fixture.id);
  };

  const handleProfileSelection = (profile: ProfileType) => {
    setProfileSelection(profile.id);
  };

  const handleChannelSelection = (channel: number) => {
    setSelectChannels([...selectedChannels, channel]);
  };

  const handlePatch = async () => {
    if (!(profileSelection && fixtureSelection)) {
      throw new Error("Please select a profile and fixture");
    }

    const endAddress = parseInt(addressTextInput, 10) + profileFootprint - 1;
    const patchPayload = {
      startAddress: parseInt(addressTextInput, 10),
      profileId: profileSelection,
      fixtureId: fixtureSelection,
      showId: SHOW,
    };

    const channel = selectedChannels[0];

    try {
      const patchRes = await new PatchModel(db).create(
        patchPayload,
        endAddress,
      );

      const fixAssignmentRes = await db.transaction(async (tx) =>
        tx
          .insert(fixtureAssignments)
          .values({
            channel,
            fixtureId: fixtureSelection,
            profileId: profileSelection,
            patchId: patchRes[0].id,
          })
          .returning({ id: fixtureAssignments.id }),
      );

      batchUpdateScenes(fixAssignmentRes);
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

  useEffect(() => {
    setProfileSelection(-1);
    setFixtureSelection(-1);
  }, [manufacturerSelection]);
  useEffect(() => {
    setProfileSelection(-1);
  }, [fixtureSelection]);

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
          {[101, 102, 103, 104, 105, 106, 107, 108, 109, 110].map((m) => (
            <Pressable key={m} onPress={() => handleChannelSelection(m)}>
              <Text
                className={
                  selectedChannels.includes(m)
                    ? "text-yellow-400"
                    : "text-white"
                }>
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Address</Text>
          <TextInput
            value={addressTextInput}
            placeholder="Enter Address Start"
            onChangeText={setAddressTextInput}
          />
          <Pressable onPress={handlePatch} className="">
            <Text>Save Patch</Text>
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
