import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types";

import { ParsedCompositeFixtureInfo } from "../models/types/scene-to-fixture-assignment.ts";

function buildKey(sceneId: number, channel: number) {
  return `sceneId:${sceneId}#fixtureChannel:${channel}`;
}

function keyIncludesScene(key: KeyValuePair | string, sceneId: number) {
  if (key instanceof String) {
    return key.startsWith(`sceneId:${sceneId}`);
  }
  return key[0].startsWith(`sceneId:${sceneId}`);
}

function mapValuesToFixtures(
  keyValuePairs: KeyValuePair[],
): ParsedCompositeFixtureInfo[] {
  return keyValuePairs.map((key) => {
    const value = key[1];
    if (value !== null) {
      return JSON.parse(value);
    }
    return {};
  });
}

export const getManualFixture = async (sceneId: number, channel: number) => {
  try {
    const jsonValue = await AsyncStorage.getItem(buildKey(sceneId, channel));
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    throw new Error("Cache error");
  }
};

export const addManualFixture = async (fixture: ParsedCompositeFixtureInfo) => {
  try {
    const jsonValue = JSON.stringify(fixture);
    await AsyncStorage.setItem(
      buildKey(fixture.sceneId, fixture.channel),
      jsonValue,
    );
  } catch (e) {
    console.log(e);
    throw new Error("Cache error");
  }
  console.log("Added.", buildKey(fixture.sceneId, fixture.channel));
};

export const removeManualFixture = async (sceneId: number, channel: number) => {
  try {
    await AsyncStorage.removeItem(buildKey(sceneId, channel));
  } catch (e) {
    console.log(e);
    throw new Error("Cache error");
  }

  console.log("removed", buildKey(sceneId, channel));
};

export const getManualFixtureKeys = async () => {
  let keys;
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.log(e);
    throw new Error("Cache error");
  }
  return keys;
};

export const getAllFixturesFromSceneKeys = async (
  keys: readonly string[],
  sceneId: number,
) => {
  try {
    const keyValuePairs: readonly KeyValuePair[] =
      await AsyncStorage.multiGet(keys);

    return mapValuesToFixtures(
      keyValuePairs.filter((key) => keyIncludesScene(key, sceneId)),
    );
  } catch (err) {
    console.log(err);
    throw new Error("Cache error");
  }
};

export const clearCacheOnScene = async (
  keys: readonly string[],
  sceneId: number,
) => {
  const keysOnScenes = keys.filter((key) => keyIncludesScene(key, sceneId));

  AsyncStorage.multiRemove(keysOnScenes).then((res) => {
    console.log("Successfully updated DB and removed cached fixtures");
  });
};
