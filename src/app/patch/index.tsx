import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { db } from "../../db/client.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import Fixture from "../../models/fixture.ts";
import Manufacturer from "../../models/manufacturer.ts";
import Profile from "../../models/profile.ts";
import PatchModel from "../../models/patch.ts";
import { patches } from "../../db/schema.ts";
import { profile } from "../../lib/__test__/value-router-utils.ts";
import ScenesToFixtureAssignments from "../../models/scene-to-fixture-assignments.ts";

export default function Patch() {
  const [manufacturers, setManufacturers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fixtureSelection, setFixtureSelection] = useState(0);
  const [manufacturerSelection, setManufacturerSelection] = useState(null);
  const [profileSelection, setProfileSelection] = useState(null);
  const [selectedChannels, setSelectChannels] = useState([]);
  const [patchObjs, setPatchObjs] = useState([]);
  const [addressTextInput, setAddressTextInput] = useState("");

  const SCENE = 1;
  const SHOW = 1;

  // once manufacturer selected, only fixtures with that manufacturer id are avail
  const fetchManufacturers = async (
    id?: number,
  ): Promise<(typeof manufacturers)[]> => {
    const query = new Manufacturer(db);
    const response = id ? await query.getById(id) : await query.getAll();
    return !response ? [] : response;
  };

  // once fixture is selected, only manufacturer with that fixture id are avail, and profiles for that fixture id
  const fetchFixtures = async (id?: number): Promise<(typeof fixtures)[]> => {
    const query = new Fixture(db);
    const response = id
      ? await query.getByManufacturerId(id)
      : await query.getAll();
    return !response ? [] : response;
  };

  const fetchPatches = async (id?: number): Promise<(typeof patches)[]> => {
    const query = new PatchModel(db);
    const response = id ? await query.getById(id) : await query.getAll();
    return !response ? [] : response;
  };

  const fetchProfiles = async (): Promise<(typeof profiles)[]> => {
    const query = new Profile(db);
    const response = await query.getByFixtureId(fixtureSelection);
    return !response ? [] : response;
  };

  const handleManufacturerSelection = (manufacturer) => {
    setManufacturerSelection(manufacturer.id);
    fetchFixtures(manufacturer.id).then((res) => setFixtures(res));
  };

  const handleFixtureSelection = (fixture) => {
    // update manufacturer
    setManufacturerSelection(fixture.manufacturerId);
    // update profiles available
    setFixtureSelection(fixture.id);
  };

  const handleProfileSelection = (profile) => {
    setProfileSelection(profile.id);
  };

  const handleChannelSelection = (channel: number) => {
    setSelectChannels([...selectedChannels, channel]);
  };

  const handlePatch = async () => {
    // create patch, return id, pass to fixture assignment for creation, create scene_to_fixture_assignment
    const calcEndAddress = parseInt(addressTextInput) + profileFootprint - 1;
    const patchPayload = {
      startAddress: addressTextInput,
      endAddress: calcEndAddress,
      profileId: profileSelection,
      fixtureId: fixtureSelection,
      showId: SHOW,
    };
    console.log(patchPayload);
    const channel = selectedChannels[0];

    try {
      await db.transaction(async (tx) => {
        const patchResponse = await new PatchModel(db);
      });

      const res = await new FixtureAssignment(db).create({
        title: "test component",
        channel,
        fixtureId: fixtureSelection,
        profileId: profileSelection,
        patchId: patchResponse.lastInsertRowId,
      });

      const sceneToFixtureUpdate = await new ScenesToFixtureAssignments(
        db,
      ).create({ sceneId: SCENE, fixtureAssignmentId: res.lastInsertRowId });
      console.log({ sceneToFixtureUpdate });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const profile = profiles.find((profile) => profile.id === profileSelection);
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
    fetchManufacturers()
      .then((res) => setManufacturers(res))
      .catch((err) => console.log(err));

    fetchFixtures().then((res) => setFixtures(res));
    fetchPatches().then((res) => setPatchObjs(res));
  }, []);

  useEffect(() => {
    fetchProfiles().then((res) => setProfiles(res));
  }, [fixtureSelection]);

  useEffect(() => {
    setProfileSelection(null);
  }, [manufacturerSelection, fixtureSelection]);

  useEffect(() => {}, [patchObjs]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="flex-row w-full h-1/2 bg-gray-400 border-gray-300">
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Manufacturer</Text>
          {manufacturers.map((m) => (
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
            {patchObjs.map((patchObj) => (
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
