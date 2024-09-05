import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { db } from "../../db/client.ts";
import FixtureAssignment from "../../models/fixture-assignment.ts";
import Fixture from "../../models/fixture.ts";
import Manufacturer from "../../models/manufacturer.ts";
import Profile from "../../models/profile.ts";
import { fixturesRelations } from "../../db/schema.ts";

export default function Patch() {
  // const [queryText, setQueryText] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [fixtureSelection, setFixtureSelection] = useState(0);
  const [manufacturerSelection, setManufacturerSelection] = useState(null);
  const [profileSelection, setProfileSelection] = useState(null);

  const SCENE = 1;

  // once manufacturer selected, only fixtures with that manufacturer id are avail
  const fetchManufacturers = async (
    id?: number,
  ): Promise<(typeof manufacturers)[]> => {
    const query = new Manufacturer(db);
    const response = id ? await query.getById(id) : await query.getAll();
    return !response ? [] : response;
  };

  // once fixture is selected, only manufacturer with that fixture id are avail, and profiles for that fixture id
  const fetchFixture = async (id?: number): Promise<(typeof fixtures)[]> => {
    const query = new Fixture(db);
    const response = id
      ? await query.getByManufacturerId(id)
      : await query.getAll();
    return !response ? [] : response;
  };

  const fetchProfiles = async (): Promise<(typeof profiles)[]> => {
    const response = await new Profile(db).getByFixtureId(fixtureSelection);
    return !response ? [] : response;
  };

  const handleManufacturerSelection = (manufacturer) => {
    setManufacturerSelection(manufacturer.id);
    fetchFixture(manufacturer.id).then((res) => setFixtures(res));
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
  }, [fixtureSelection]);

  useEffect(() => {
    setProfileSelection(null);
  }, [manufacturerSelection, fixtureSelection]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="w-full h-1/2 bg-gray-400 justify-center items-center border-gray-300">
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
        <View className="border-red-400 border-2 p-5">
          <Text className="text-white text-xl w-1/4">Profile</Text>
          {profiles.map((m) => (
            <Pressable key={m.name} onPress={() => handleProfileSelection(m)}>
              <Text
                className={
                  m.id === profileSelection ? "text-yellow-400" : "text-white"
                }>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="w-full h-1/2 flex-row">
        <View className="w-1/2 h-full bg-red-500 justify-center items-center">
          <Text className="text-white">Universe Table</Text>
        </View>

        <View className="w-1/2 h-full bg-green-500 justify-center items-center">
          <Text className="text-white">Selected Fixture Details?</Text>
        </View>
      </View>
    </View>
  );
}
