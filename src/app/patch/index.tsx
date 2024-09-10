import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { db } from "../../db/client.ts";
import {
  fixtureAssignments,
  patches,
  scenes,
  scenesToFixtureAssignments,
} from "../../db/schema.ts";
import Fixture from "../../models/fixture.ts";
// import Manufacturer from "../../models/manufacturer.ts";
import PatchModel from "../../models/patch.ts";
import Profile from "../../models/profile.ts";
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
  // const [manufacturersState, setManufacturersState] = useState([]);
  // const [fixturesState, setFixtures] = useState([]);
  // const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [fixtureSelection, setFixtureSelection] = useState(0);
  const [manufacturerSelection, setManufacturerSelection] = useState(null);
  const [profileSelection, setProfileSelection] = useState<number>(-1);
  const [selectedChannels, setSelectChannels] = useState([]);
  // const [patchData, setPatchObjs] = useState([]);
  const [addressTextInput, setAddressTextInput] = useState("");

  const SHOW = 1;

  // once manufacturer selected, only fixtures with that manufacturer id are avail
  const { data: manufacturers, loading: loadingManufacturers } =
    useFetchManufacturers();
  const { data: fixtures } = useFetchFixtures();
  const { data: profiles } = useFetchProfiles(fixtureSelection);
  const { data: sceneIds } = useFetchScenes();
  const { data: patchData } = useFetchPatches();

  // once fixture is selected, only manufacturer with that fixture id are avail, and profiles for that fixture id
  const fetchFixtures = async (id?: number): Promise<(typeof fixtures)[]> => {
    const query = new Fixture(db);
    const response = id
      ? await query.getByManufacturerId(id)
      : await query.getAll();
    return !response ? [] : response;
  };

  // const fetchPatches = async (id?: number): Promise<(typeof patches)[]> => {
  //   const query = new PatchModel(db);
  //   const response = id ? await query.getById(id) : await query.getAll();
  //   return !response ? [] : response;
  // };

  // const fetchProfiles = async (): Promise<ProfileType[]> => {
  //   const query = new Profile(db);
  //   const response = await query.getByFixtureId(fixtureSelection);
  //   return !response ? [] : response;
  // };

  // const fetchScenes = async () =>
  //   await db
  //     .selectDistinct({ id: scenes.id })
  //     .from(scenes)
  //     .then((res) => res.map((obj) => obj.id));

  const handleManufacturerSelection = (manufacturer) => {
    setManufacturerSelection(manufacturer.id);
    fetchFixtures(manufacturer.id).then((res) => setFixtures(res));
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

  const handleFixtureSelection = (fixture) => {
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
    const endAddress = parseInt(addressTextInput, 10) + profileFootprint - 1;
    const patchPayload = {
      startAddress: parseInt(addressTextInput, 10),
      profileId: profileSelection,
      fixtureId: fixtureSelection,
      showId: SHOW,
    };

    console.log({ patchPayload });
    return;

    if (Object.values(patchPayload).some((field) => field === undefined))
      return;

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
    ? Object.keys(JSON.parse(profile.channels)).length
    : 0;

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
    // fetchFixtures().then((res) => setFixtures(res));
    // TODO Work on this
    fetchPatches().then((res) => {
      res = res.map((obj) => {
        const profileChannels = JSON.parse(obj.profileChannels);
        obj = { ...obj, profileChannels };
        const endAddress =
          Object.values(profileChannels).length > 0
            ? obj.startAddress + Object.values(profileChannels).length - 1
            : obj.startAddress;
        return { ...obj, endAddress };
      });

      setPatchObjs(res);
    });

    // fetchScenes().then((res) => setSceneIds(res));
  }, []);

  // useEffect(() => {
  //   fetchProfiles().then((res) => setProfiles(res));
  // }, [fixtureSelection]);

  useEffect(() => {
    setProfileSelection(null);
  }, [manufacturerSelection, fixtureSelection]);

  useEffect(() => {}, [patchData]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="flex-row w-full h-1/2 bg-gray-400 border-gray-300">
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Manufacturer</Text>
          {!loadingManufacturers &&
            manufacturers.map((m) => (
              <Pressable
                key={m.name}
                onPress={() => handleManufacturerSelection(m)}>
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
