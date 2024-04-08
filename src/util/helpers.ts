import { SetStateAction, Dispatch } from "react";
import { getManualFixtureKeys, getAllFixturesFromSceneKeys } from "./fixture-cache";
import { FixtureAssignmentResponse } from "@/components/layout-area";
import { FixtureType } from "@/components/fixture";

type FetchCallback = () => Promise<{
  fixtureAssignmentId: number;
  channel: number;
  values: string | null;
  title: string | null;
  profileChannels: string | null;
  profileName: string | null;
  fixtureName: string | null;
  fixtureNotes: string | null;
  sceneId: number | null;
}[] | undefined>

type SetCallback = (arr: Array<Awaited<FetchCallback> & FixtureType[]>) => Dispatch<SetStateAction<FixtureAssignmentResponse>>

export async function mergeCacheWithDBFixtures(selectedSceneId: number, fetchCallback: FetchCallback, setCallback:  SetCallback) {
  try {
    const keys = await getManualFixtureKeys();
    if (keys) {
      const cachedFixtures = await getAllFixturesFromSceneKeys(keys, selectedSceneId)
      console.log(cachedFixtures);

      const dbFixtures = await fetchCallback();

      if (cachedFixtures instanceof Array && dbFixtures instanceof Array) {
        setCallback([...cachedFixtures, ...dbFixtures]);
      } else {
        throw new Error();
      }

      return;
    }
    throw new Error('Something went wrong');

  } catch (err) {
    console.log(err);
  }
};
