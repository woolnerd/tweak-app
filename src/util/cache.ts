import AsyncStorage from "@react-native-async-storage/async-storage";
import { FixtureType } from "@/components/fixture";

export const getManualFixture = async (fixtureAssignmentId: number) => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@manual_fixtures_${fixtureAssignmentId}`);
      return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
      console.log(e);
    }

    // if (fixtureIds && fixture.fixtureAssignmentId in fixtureIds) {
    //   // cache is like a shadow list of fixtures with new info merged in.
    //   // it can extend a Fixture as a ManualFixture, could be stored as {id: manualFixtureInstance1, ...}
    // }

    console.log('Done.');
  }

  export const addManualFixture = async (fixture: FixtureType) => {
    try {
      const jsonValue = JSON.stringify(fixture)
      await AsyncStorage.setItem(`@manual_fixtures_${fixture.fixtureAssignmentId}`, jsonValue)
    } catch(e) {
      // save error
      console.log(e);
    }
    console.log('Done.')
  };

  export const removeManualFixture = async (fixtureAssignmentId: number) => {
    try {
      await AsyncStorage.removeItem(`@manual_fixtures_${fixtureAssignmentId}`)
    } catch(e) {
      // remove error
    }

    console.log('Done.')
  }

export const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }

    return keys
    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }
