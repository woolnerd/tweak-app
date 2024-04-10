import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types";

import { FixtureType } from "@/components/fixture";
function buildKey(sceneId: number, fixtureAssignmentId: number) {
  return `sceneId:${sceneId}#fixtureAssignementId:${fixtureAssignmentId}`;
}

export const getManualFixture = async (sceneId: number, fixtureAssignmentId: number) => {
  try {
    const jsonValue = await AsyncStorage.getItem(buildKey(sceneId, fixtureAssignmentId));
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const addManualFixture = async (fixture: FixtureType) => {
  try {
    const jsonValue = JSON.stringify(fixture);
    await AsyncStorage.setItem(buildKey(fixture.sceneId, fixture.fixtureAssignmentId), jsonValue);
  } catch (e) {
    console.log(e);
  }
  console.log("Added.", buildKey(fixture.sceneId, fixture.fixtureAssignmentId));
};

export const removeManualFixture = async (sceneId: number, fixtureAssignmentId: number) => {
  try {
    await AsyncStorage.removeItem(buildKey(sceneId, fixtureAssignmentId));
  } catch (e) {
    console.log(e);
  }

  console.log("removed", buildKey(sceneId, fixtureAssignmentId));
};

export const getManualFixtureKeys = async () => {
  let keys;
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.log(e);
  }
  return keys;
};

export const getAllFixturesFromSceneKeys = async (keys: readonly string[], sceneId: number) => {
  try {
    const keyValuePairs: readonly KeyValuePair[] = await AsyncStorage.multiGet(keys);

    return mapValuesToFixtures(keyValuePairs.filter((key) => keyIncludesScene(key, sceneId)));
  } catch (err) {
    console.log(err);
  }
};

export const clearCacheOnScene = async (keys: readonly string[], sceneId: number) => {
  const keysOnScenes = keys.filter((key) => keyIncludesScene(key, sceneId));

  AsyncStorage.multiRemove(keysOnScenes).then((res) => {
    console.log("Successfully updated DB and removed cached fixtures");
  });
};

function keyIncludesScene(key: KeyValuePair | string, sceneId: number) {
  if (key instanceof String) {
    return key.startsWith(`sceneId:${sceneId}`);
  }
  return key[0].startsWith(`sceneId:${sceneId}`);
}

function mapValuesToFixtures(keyValuePairs: KeyValuePair[]): FixtureType[] {
  return keyValuePairs.map((key) => {
    const value = key[1];
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return {};
    }
  });
}
