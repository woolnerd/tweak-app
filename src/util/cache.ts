import AsyncStorage from '@react-native-async-storage/async-storage';
import { FixtureType } from '@/components/fixture';

type Cache = {
  sceneId: {
    fixtureId: FixtureType;
  };
};

function buildKey(sceneId: number, fixtureAssignmentId: number) {
  return `sceneId:${sceneId}#fixtureAssignementId:${fixtureAssignmentId}`;
}

export const getManualFixture = async (
  sceneId: number,
  fixtureAssignmentId: number
) => {
  try {
    const jsonValue = await AsyncStorage.getItem(
      buildKey(sceneId, fixtureAssignmentId)
    );
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }

  // console.log('Done.');
};

export const addManualFixture = async (fixture: FixtureType) => {
  try {
    const jsonValue = JSON.stringify(fixture);
    await AsyncStorage.setItem(
      buildKey(fixture.sceneId, fixture.fixtureAssignmentId),
      jsonValue
    );
  } catch (e) {
    console.log(e);
  }
  console.log('Added.', buildKey(fixture.sceneId, fixture.fixtureAssignmentId));
};

export const removeManualFixture = async (
  sceneId: number,
  fixtureAssignmentId: number
) => {
  try {
    await AsyncStorage.removeItem(buildKey(sceneId, fixtureAssignmentId));
    // remove error
  } catch (e) {
    console.log(e);
  }

  console.log('removed', buildKey(sceneId, fixtureAssignmentId));
};

export const getManualFixtureKeys = async () => {
  let keys;
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    // read key error
    console.log(e);
  }

  // console.log(keys)
  return keys;
};
