import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Svg, Path } from "react-native-svg";

import {
  payLoadWithAddresses,
  buildPatchRowData,
  buildFixtureMap,
} from "./helpers.ts";
import { PatchRowData } from "./types/index.ts";
import { db } from "../../db/client.ts";
import { SelectFixture } from "../../db/types/tables.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import PatchModel from "../../models/patch.ts";
import { ProfileProcessed } from "../../models/profile.ts";
import BatchCreateScenesToFixtureAssignments from "../../services/batch-create-scenes.ts";
import PatchFixtures from "../../services/patch-fixtures.ts";
import Dropdown from "../components/Dropdowns/Dropdown.tsx";
import UniverseTable from "../components/UniverseTable/UniverseTable.tsx";
import useFetchFixtures from "../hooks/useFetchFixtures.ts";
import useFetchManufacturers from "../hooks/useFetchManufacturers.ts";
import useFetchPatchFixtures from "../hooks/useFetchPatchFixtures.ts";
import useFetchProfiles from "../hooks/useFetchProfiles.ts";
import useFetchScenes from "../hooks/useFetchScenes.ts";

export default function Patch() {
  const [fixtureSelection, setFixtureSelection] = useState<number>(0);
  const [manufacturerSelection, setManufacturerSelection] = useState<number>(0);
  const [profileSelection, setProfileSelection] = useState<number>(0);
  const [selectedChannels, setSelectChannels] = useState<number[]>([]);
  const [channelObjsToDisplay, setChannelObjsToDisplay] = useState<
    PatchRowData[]
  >([]);
  const [addressStartSelection, setAddressStartSelection] = useState<number>(1);
  const [showDMXUniverseTable, setShowDMXUniverseTable] =
    useState<boolean>(false);
  const [showProfileSelector, setShowProfileSelector] = useState<boolean>(true);
  const [selectManThruFix, setSelectManThruFix] = useState<boolean>(false);
  const [showAllChannels, setShowAllChannels] = useState<boolean>(true);

  const SHOW = 1;

  const { data: manufacturers } = useFetchManufacturers();
  const { data: fixtures } = useFetchFixtures(manufacturerSelection);
  const { data: profiles } = useFetchProfiles(fixtureSelection);
  const { data: sceneIds } = useFetchScenes();

  const { data: patchFixturesData, refetch: refetchPatchFixtureData } =
    useFetchPatchFixtures();

  const handleManufacturerSelection = (
    manufacturer: (typeof manufacturers)[number],
  ) => {
    setManufacturerSelection(
      manufacturer.id === manufacturerSelection ? 0 : manufacturer.id,
    );
    setSelectManThruFix(false);
  };

  const channelsInUse = patchFixturesData.map(
    (assignment) => assignment.channel,
  );

  const removeChannelFromState = (channel: number) =>
    setSelectChannels(
      selectedChannels.filter((channelInState) => channelInState !== channel),
    );

  const handleFixtureSelection = (fixture: SelectFixture) => {
    // update manufacturer
    setFixtureSelection(fixture.id === fixtureSelection ? 0 : fixture.id);
    setManufacturerSelection(fixture.manufacturerId ?? 0);
    setSelectManThruFix(true);
    // update profiles available
  };

  const handleProfileSelection = (profile: ProfileProcessed) =>
    setProfileSelection(profile.id === profileSelection ? 0 : profile.id);

  const handleChannelSelection = (channel: number) => {
    if (channelsInUse.includes(channel)) {
      alert("Channel is in use. To repatch channel, please first delete.");
      return;
    }

    if (selectedChannels.includes(channel)) {
      removeChannelFromState(channel);
      return;
    }

    setSelectChannels([...selectedChannels, channel]);
  };

  const handleAddressOrChannelColumnClick = () => {
    setShowDMXUniverseTable(true);
    setShowProfileSelector(false);
  };

  const handleHideDMXTable = () => {
    setShowDMXUniverseTable(false);
    setShowProfileSelector(true);
  };

  const handlePatchDB = async () => {
    if (!(profileSelection && fixtureSelection)) {
      throw new Error("Please select a profile and fixture");
    }

    try {
      const fixtureAssignmentResponses = await new PatchFixtures(db).create(
        payLoadWithAddresses({
          showId: SHOW,
          profileId: profileSelection,
          fixtureId: fixtureSelection,
          channelObjsToDisplay,
        }),
      );

      if (fixtureAssignmentResponses) {
        await new BatchCreateScenesToFixtureAssignments(db).create(
          fixtureAssignmentResponses,
          sceneIds,
        );
        setAddressStartSelection(1);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handlePatch = () => {
    handlePatchDB()
      .then((res) => {
        setAddressStartSelection(1);
        setSelectChannels([]);
      })
      .then(refetchPatchFixtureData);
  };

  const handleDeleteFixtureAssignment = async (fixture: PatchRowData) => {
    const id = patchFixturesData.find(
      (fixtureData) => fixtureData.channel === fixture.channel,
    )?.fixtureAssignmentId;

    if (!id) throw new Error("Channel Id not found");

    const response = await new FixtureAssignment(db).delete(id);

    try {
      await new PatchModel(db)
        .delete(response[0].patchId)
        .then(refetchPatchFixtureData);
    } catch (err) {
      alert(err);
    }
  };

  const profile = profiles.find(
    (profileObj) => profileObj.id === profileSelection,
  );

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

  const patchRowData = buildPatchRowData({
    fixtureMap: buildFixtureMap(patchFixturesData, selectedChannels),
    selectedChannels,
    addressStartSelection,
    profile,
    manufacturers,
    manufacturerSelection,
    fixtures,
    fixtureSelection,
    profiles,
    profileSelection,
    showAllChannels,
  });

  const buildPatchRowDisplay = () =>
    patchRowData.map((fixture, index) => (
      <Pressable
        key={fixture.channel}
        className={`flex flex-row p-2 border-2 ${index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"} ${selectedChannels.includes(fixture.channel) ? "border-yellow-600" : ""}`}
        onPress={() => handleChannelSelection(fixture.channel)}>
        <Text
          className="text-white w-24 text-center"
          onPress={handleAddressOrChannelColumnClick}>
          {fixture.channel}
        </Text>
        <Text
          className="text-white w-24 text-center"
          onPress={handleAddressOrChannelColumnClick}>
          {fixture.startAddress > 0
            ? `${fixture.startAddress} - ${fixture.endAddress}`
            : "-"}
        </Text>
        <Text
          className="text-white w-96 text-center"
          // onPress={handleHideDMXTable}
        >
          {fixture.manufacturerName}
        </Text>
        <Text
          className="text-white w-96 text-center"
          // onPress={handleHideDMXTable}
        >
          {fixture.fixtureName}
        </Text>
        <Text
          className="text-white w-80 text-center"
          // onPress={handleHideDMXTable}
        >
          {fixture.profileName}
        </Text>
        {channelsInUse.includes(fixture.channel) && (
          <TouchableOpacity
            onPress={() => handleDeleteFixtureAssignment(fixture)}
            className="p-0.5 bg-gray-300 hover:bg-red-500 active:bg-red-700">
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-black">
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </Svg>
          </TouchableOpacity>
        )}
      </Pressable>
    ));

  // When changing fixture selection, manufacturer changes as well, and profile selection is cleared.
  useEffect(() => {
    setProfileSelection(0);
    if (fixtureSelection) {
      const foundFixture = fixtures.find(
        (fixture) => fixture.id === fixtureSelection,
      );

      if (foundFixture) {
        setManufacturerSelection(foundFixture.manufacturerId ?? 0);
      }
    }
  }, [fixtureSelection, fixtures]);

  useEffect(() => {
    if (!selectManThruFix) {
      setFixtureSelection(0);
    }
    setProfileSelection(0);
    setSelectManThruFix(false);
  }, [manufacturerSelection]);

  useEffect(() => {
    const updatedPatchRowData = buildPatchRowData({
      fixtureMap: buildFixtureMap(patchFixturesData, selectedChannels),
      selectedChannels,
      addressStartSelection,
      profile,
      manufacturers,
      manufacturerSelection,
      fixtures,
      fixtureSelection,
      profiles,
      profileSelection,
      showAllChannels,
    });
    setChannelObjsToDisplay(updatedPatchRowData);
  }, [
    selectedChannels,
    patchFixturesData,
    addressStartSelection,
    profile,
    manufacturers,
    manufacturerSelection,
    fixtures,
    fixtureSelection,
    profiles,
    profileSelection,
    showAllChannels,
  ]);

  return (
    <View className="w-full">
      {/* <View className="flex-row w-full h-1/2 bg-gray-400 border-gray-300"> */}
      <View className=" bg-gray-900 h-1/2 w-full">
        <View className="p-4 bg-gray-900 w-full">
          <ScrollView horizontal className="w-full">
            <View>
              <View className="flex flex-row bg-gray-800 p-2 rounded-md">
                <Text className="text-white font-bold w-24 text-center">
                  Channels
                </Text>
                <Text className="text-white font-bold w-24 text-center">
                  Address
                </Text>
                <Text className="text-white font-bold w-96 text-center">
                  Manufacturer
                </Text>
                <Text className="text-white font-bold w-96 text-center">
                  Fixture
                </Text>
                <Text className="text-white font-bold w-96 text-center">
                  Profile
                </Text>
              </View>
              <ScrollView className="h-full">
                {patchFixturesData.length > 0 && buildPatchRowDisplay()}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>

      <View className="w-full h-1/2 flex-row">
        <View className="w-1/3 h-full justify-center items-center  bg-gray-900 ">
          {(!!profileSelection || showDMXUniverseTable) && (
            <UniverseTable
              patchData={channelObjsToDisplay}
              handleAddressSelection={setAddressStartSelection}
              profileSelected={profileSelection}
            />
          )}
        </View>
        <View className="w-2/3 h-full bg-slate-600 justify-center items-center flex-col">
          <View className="flex-row">
            <Text className="text-white m-2">Selected Fixture Details</Text>
            {/* <View>{buildProfileDisplay()}</View> */}
            <Pressable onPress={() => setShowAllChannels(!showAllChannels)}>
              <Text className="text-yellow-400 bg-slate-500 p-5 m-2">
                {showAllChannels ? "Only Channels in Use" : "Show All Channels"}
              </Text>
            </Pressable>
            <Pressable onPress={handlePatch}>
              <Text className="text-yellow-400 bg-slate-500 p-5 m-2">
                Patch
              </Text>
            </Pressable>
          </View>
          <View className="flex-row justify-between">
            <Dropdown
              selectedItem={manufacturerSelection}
              onSelect={handleManufacturerSelection}
              items={manufacturers}
              getItemKey={(m: (typeof manufacturers)[number]) => m.id}
              getItemLabel={(item: (typeof manufacturers)[number]) => item.name}
              name="Manufacturer"
              placeholder="Search Manufacturers..."
            />
            <Dropdown
              selectedItem={fixtureSelection}
              onSelect={handleFixtureSelection}
              items={fixtures}
              getItemKey={(fix: (typeof fixtures)[number]) => fix.id}
              getItemLabel={(item: (typeof fixtures)[number]) => item.name}
              name="Fixture"
              placeholder="Search Fixtures..."
            />
            <Dropdown
              selectedItem={profileSelection}
              onSelect={handleProfileSelection}
              items={profiles}
              getItemKey={(prof: (typeof profiles)[number]) => prof.id}
              getItemLabel={(item: (typeof profiles)[number]) => item.name}
              name="Profile"
              placeholder="Search Profiles..."
            />
          </View>
        </View>
      </View>
    </View>
  );
}
