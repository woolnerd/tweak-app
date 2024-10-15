import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Svg, Path } from "react-native-svg";

import { payLoadWithAddresses, generateChannelListDisplay } from "./helpers.ts";
import { ChannelObject, ChannelObjectDisplay } from "./types/index.ts";
import { db } from "../../db/client.ts";
import { SelectFixture } from "../../db/types/tables.ts";
import { ProfileProcessed } from "../../models/profile.ts";
import BatchCreateScenesToFixtureAssignments from "../../services/batch-create-scenes.ts";
import PatchFixtures from "../../services/patch-fixtures.ts";
import useFetchFixtureAssignments from "../hooks/useFetchFixtureAssignments.ts";
import useFetchFixtures from "../hooks/useFetchFixtures.ts";
import useFetchManufacturers from "../hooks/useFetchManufacturers.ts";
import useFetchPatches from "../hooks/useFetchPatches.ts";
import useFetchProfiles from "../hooks/useFetchProfiles.ts";
import useFetchScenes from "../hooks/useFetchScenes.ts";
import UniverseTable from "../components/UniverseTable/UniverseTable.tsx";
import Dropdown from "../components/Dropdowns/Dropdown.tsx";
import { useCompositeFixtureStore } from "../store/useCompositeFixtureStore.ts";
import { ParsedCompositeFixtureInfo } from "../../models/types/scene-to-fixture-assignment.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import PatchModel from "../../models/patch.ts";

const CHANNEL_LIST_COUNT = 50;
type PatchRowData = {
  channelNum: number;
  startAddress: number;
  endAddress: number;
  manufacturerName: string;
  fixtureName: string;
  profileName: string;
};

export default function Patch() {
  const [fixtureSelection, setFixtureSelection] = useState<number | null>(null);
  const [manufacturerSelection, setManufacturerSelection] = useState<
    number | null
  >(null);
  const [profileSelection, setProfileSelection] = useState<number | null>(null);
  const [selectedChannels, setSelectChannels] = useState<number[]>([]);
  const [channelObjsToDisplay, setChannelObjsToDisplay] = useState<
    ChannelObjectDisplay[]
  >([]);
  const [addressStartSelection, setAddressStartSelection] = useState<
    number | null
  >(null);
  const [showDMXUniverseTable, setShowDMXUniverseTable] =
    useState<boolean>(false);
  const [showProfileSelector, setShowProfileSelector] = useState<boolean>(true);
  const [showAllChannels, setShowAllChannels] = useState<boolean>(true);
  const { compositeFixturesStore } = useCompositeFixtureStore();
  const SHOW = 1;

  const { data: manufacturers } = useFetchManufacturers();
  const { data: fixtures, loading: fixturesLoading } = useFetchFixtures(
    manufacturerSelection,
  );
  const { data: profiles, setData: setProfiles } =
    useFetchProfiles(fixtureSelection);
  const { data: sceneIds } = useFetchScenes();
  const { data: patchData, error: patchError } = useFetchPatches();
  const { data: fixtureAssignmentsData } = useFetchFixtureAssignments();
  const tester = useRef(1);
  //  top half of patch screen screen is the patch table
  // this shows channels in use, and empty channels
  // need a way to jump to channel number whether in use or not
  // when channel or address is clicked, the universe populates the bottom half
  // when fixture or manufacturer is selected, the selection table populates the bottom half

  const handleManufacturerSelection = (
    manufacturer: (typeof manufacturers)[number],
  ) => {
    setManufacturerSelection(manufacturer.id);
  };

  console.log((tester.current += 1));

  const channelsInUse = fixtureAssignmentsData.map(
    (assignment) => assignment.channel,
  );

  const handleFixtureSelection = (fixture: SelectFixture) => {
    // update manufacturer
    setFixtureSelection(fixture.id);
    setManufacturerSelection(fixture.manufacturerId);
    // update profiles available
  };

  const handleProfileSelection = (profile: ProfileProcessed) =>
    setProfileSelection(profile.id);

  const handleChannelSelection = (channel: number) => {
    if (channelsInUse.includes(channel)) {
      alert("Channel is in use. To repatch channel, please first delete.");
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
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const handlePatch = () => {
    handlePatchDB().then((res) => {
      setSelectChannels([]);
      setAddressStartSelection(null);
    });
  };

  const handleDeleteFixtureAssignment = async (fixture: PatchRowData) => {
    const id = fixtureAssignmentsData.find(
      (fixtureData) => fixtureData.channel === fixture.channelNum,
    )?.id;

    if (!id) throw new Error("Channel Id not found");

    const response = await new FixtureAssignment(db).delete(id);
    await new PatchModel(db).delete(response[0].patchId);
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

  // const channelStyle = (channelNum: number) => {
  //   if (channelsInUse.includes(channelNum)) {
  //     return "text-black-400";
  //   }

  //   return selectedChannels.includes(channelNum)
  //     ? "text-yellow-400"
  //     : "text-white";
  // };

  // const renderChannelDisplay = ({ item }: { item: ChannelObjectDisplay }) => (
  //   <View className="flex-row">
  //     <Pressable
  //       key={item.channelNum}
  //       onPress={() => handleChannelSelection(item.channelNum)}>
  //       <Text className={channelStyle(item.channelNum)}>{item.channelNum}</Text>
  //     </Pressable>
  //     <Text className="ml-3">
  //       {item.startAddress &&
  //       item.endAddress &&
  //       selectedChannels.includes(item.channelNum)
  //         ? `${item.startAddress} - ${item.endAddress}`
  //         : ""}
  //     </Text>
  //   </View>
  // );

  const buildPatchRowData = () => {
    const channelCount = 100;
    const fixtureMap = compositeFixturesStore.reduce(
      (acc: Record<number, ParsedCompositeFixtureInfo>, fixture) => {
        acc[fixture.channel] = fixture;
        return acc;
      },
      {},
    );

    const patchRows: PatchRowData[] = [];

    let addressGroup = -1;

    // if (!addressStartSelection) return [];

    for (let i = 1; i <= channelCount; i += 1) {
      // channel selection overrides patch display V
      if (i in fixtureMap && !selectedChannels.includes(i)) {
        patchRows.push({ ...fixtureMap[i], channelNum: fixtureMap[i].channel });
      } else if (showAllChannels) {
        if (selectedChannels.includes(i)) addressGroup += 1;
        patchRows.push({
          channelNum: i,
          selected: selectedChannels.includes(i),
          startAddress: selectedChannels.includes(i)
            ? addressGroup * profileFootprint + addressStartSelection
            : 0,
          endAddress: selectedChannels.includes(i)
            ? addressGroup * profileFootprint -
              1 +
              addressStartSelection +
              profileFootprint
            : 0,
          manufacturerName:
            manufacturerSelection && selectedChannels.includes(i)
              ? manufacturers.find(
                  (manuf) => manuf.id === manufacturerSelection,
                )?.name
              : "-",
          fixtureName:
            fixtureSelection && selectedChannels.includes(i)
              ? fixtures.find((fix) => fix.id === fixtureSelection)?.name
              : "-",
          profileName:
            profileSelection && selectedChannels.includes(i)
              ? profiles.find((prof) => prof.id === profileSelection)?.name
              : "-",
        });
      }
    }

    return patchRows.sort((a, b) => a.channelNum - b.channelNum);
  };

  const buildPatchRowDisplay = () =>
    buildPatchRowData().map((fixture, index) => (
      <Pressable
        key={fixture.channelNum}
        className={`flex flex-row p-2 border-2 ${index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"} ${selectedChannels.includes(fixture.channelNum) ? "border-yellow-600" : ""}`}
        onPress={() => handleChannelSelection(fixture.channelNum)}>
        <Text
          className="text-white w-24 text-center"
          onPress={handleAddressOrChannelColumnClick}>
          {fixture.channelNum}
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
        <TouchableOpacity
          onPress={() => handleDeleteFixtureAssignment(fixture)}
          className="p-0.5 bg-gray-300 hover:bg-red-500 active:bg-red-700">
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-black">
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </Svg>
        </TouchableOpacity>
      </Pressable>
    ));

  // useEffect(() => {
  //   if (!fixtureSelection) {
  //     setFixtureSelection(null);
  //   }
  //   setProfileSelection(null);
  //   setProfiles([]);
  // }, [manufacturerSelection, fixtureSelection, setProfiles]);

  useEffect(() => {
    // if (!fixtureSelection) {
    setFixtureSelection(null);
    // }
    setProfileSelection(null);
    // setProfiles([]);
  }, [manufacturerSelection]);

  // When changing fixture selection, manufacturer changes as well, and profile selection is cleared.
  useEffect(() => {
    setProfileSelection(null);
    if (fixtureSelection) {
      const foundFixture = fixtures.find(
        (fixture) => fixture.id === fixtureSelection,
      );

      if (foundFixture) {
        setManufacturerSelection(foundFixture.manufacturerId);
      }
    }
  }, [fixtureSelection, fixtures]);

  useEffect(() => {
    // if (addressStartSelection) {
    // const list = generateChannelListDisplay({
    //   firstAddress: addressStartSelection,
    //   profileSize: profileFootprint,
    //   profileSelection,
    //   addressStartSelection,
    //   selectedChannels,
    //   channelListCount: CHANNEL_LIST_COUNT,
    // });
    const list = buildPatchRowData();
    setChannelObjsToDisplay(list);
    // }
  }, [addressStartSelection, profiles, selectedChannels]);

  return (
    <View className="w-full">
      {/* <View className="flex-row w-full h-1/2 bg-gray-400 border-gray-300"> */}
      <View className=" bg-gray-900 h-1/2 w-full">
        <View className="p-4 bg-gray-900 w-full">
          <ScrollView horizontal className="w-full">
            <View>
              {/* Table Header */}
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

              {/* Table Body */}
              <ScrollView className="h-full">
                {compositeFixturesStore && buildPatchRowDisplay()}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* <View className="border-red-400 border-2 p-5 w-1/8">
          <Text className="text-white text-xl">Channels</Text>
          <FlatList
            data={channelObjsToDisplay}
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
          /> */}
      {/* <Pressable onPress={handlePatch} className="border-2">
            <Text className="text-yellow-500 p-5 text-xl">Save Patch</Text>
          </Pressable>
        </View> */}

      {/* <View className="border-red-400 border-2 p-5 w-1/4">
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
        </View> */}

      {/* <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Fixture</Text>
          {fixtures.map((fix) => (
            <Pressable
              key={fix.name}
              onPress={() => handleFixtureSelection(fix)}>
              <Text
                className={
                  fix.id === fixtureSelection ? "text-yellow-400" : "text-white"
                }>
                {fix.name}
              </Text>
            </Pressable>
          ))}
        </View> */}
      {/* <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Profile</Text>
          {profiles.length === 0 ? (
            <Text>Select a Fixture</Text>
          ) : (
            profiles.map((prof) => (
              <Pressable
                key={prof.id}
                onPress={() => handleProfileSelection(prof)}>
                <Text
                  className={
                    prof.id === profileSelection
                      ? "text-yellow-400"
                      : "text-white"
                  }>
                  {prof.name}
                </Text>
              </Pressable>
            ))
          )}
        </View> */}
      {/* </View> */}

      <View className="w-full h-1/2 flex-row">
        <View className="w-1/3 h-full justify-center items-center  bg-gray-900 ">
          {/* <Text className="text-white">Universe Table</Text>
          <View>
            {patchData.map((patchObj) => (
              <React.Fragment key={patchObj.id}>
                <Text>StartAddres: {patchObj.startAddress}</Text>
                <Text>endAddress: {patchObj.endAddress}</Text>
              </React.Fragment>
            ))}
          </View> */}

          {profileSelection && showDMXUniverseTable && (
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
            <View>{buildProfileDisplay()}</View>
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
            />
            <Dropdown
              selectedItem={fixtureSelection}
              onSelect={handleFixtureSelection}
              items={fixtures}
              getItemKey={(fix: (typeof fixtures)[number]) => fix.id}
              getItemLabel={(item: (typeof fixtures)[number]) => item.name}
              name="Fixture"
            />
            <Dropdown
              selectedItem={profileSelection}
              onSelect={handleProfileSelection}
              items={profiles}
              getItemKey={(prof: (typeof profiles)[number]) => prof.id}
              getItemLabel={(item: (typeof profiles)[number]) => item.name}
              name="Profile"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
