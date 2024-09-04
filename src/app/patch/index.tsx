import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { db } from "../../db/client.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import Fixture from "../../models/fixture.ts";
import Manufacturer from "../../models/manufacturer.ts";
import Profile from "../../models/profile.ts";

export default function Patch() {
  // const [queryText, setQueryText] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fixturesSelection, setFixtureSelection] = useState(0);
  const [manufacturerSelection, setManufacturerSelection] = useState(null);
  const [profileSelection, setProfileSelection] = useState(null);

  const SCENE = 1;

  // once manufacturer selected, only fixtures with that manufacturer id are avail
  const fetchManufacturers = async (
    id?: number,
  ): Promise<(typeof manufacturers)[]> => {
    const response = id
      ? await new Manufacturer(db).getById(id)
      : await new Manufacturer(db).getAll();
    return !response ? [] : response;
  };

  // once fixture is selected, only manufacturer with that fixture id are avail, and profiles for that fixture id
  const fetchFixture = async (): Promise<(typeof manufacturers)[]> => {
    const response = await new Fixture(db).getAll();
    return !response ? [] : response;
  };

  const fetchProfiles = async (): Promise<(typeof manufacturers)[]> => {
    const response = await new Profile(db).getByFixtureId(fixturesSelection);
    return !response ? [] : response;
  };

  const handleManufacturerSelection = (manufacturer) => {
    console.log(manufacturer);
    // setFixtureSelection(manufacturer.id);
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

  useEffect(() => {
    fetchManufacturers()
      .then((res) => setManufacturers(res))
      .catch((err) => console.log(err));

    fetchFixture().then((res) => setFixtures(res));
  }, []);

  useEffect(() => {
    fetchProfiles().then((res) => setProfiles(res));
  }, [fixturesSelection]);

  useEffect(() => {
    fetchManufacturers(manufacturerSelection).then((res) =>
      setManufacturers(res),
    );
  }, [manufacturerSelection]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* First container (takes half of the screen height) */}
      <View className="w-full h-1/2 bg-gray-400 justify-center items-center border-gray-300">
        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Manufacturer</Text>
          {manufacturers.map((m) => (
            <Pressable
              key={m.name}
              onPress={() => handleManufacturerSelection(m)}>
              <Text className="text-white" key={m.name}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="border-red-400 border-2 p-5 w-1/4">
          <Text className="text-white text-xl">Fixture</Text>
          {fixtures.map((m) => (
            <Pressable key={m.name} onPress={() => handleFixtureSelection(m)}>
              <Text className="text-white">{m.name}</Text>
            </Pressable>
          ))}
        </View>
        <View className="border-red-400 border-2 p-5">
          <Text className="text-white text-xl w-1/4">Profile</Text>
          {profiles.map((m) => (
            <Pressable key={m.name} onPress={() => handleProfileSelection(m)}>
              <Text className="text-white">{m.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Second container (divided in half) */}
      <View className="w-full h-1/2 flex-row">
        {/* First half */}
        <View className="w-1/2 h-full bg-red-500 justify-center items-center">
          <Text className="text-white">Bottom Container - Top Half</Text>
        </View>

        {/* Second half */}
        <View className="w-1/2 h-full bg-green-500 justify-center items-center">
          <Text className="text-white">Bottom Container - Bottom Half</Text>
        </View>
      </View>
    </View>
  );
}
