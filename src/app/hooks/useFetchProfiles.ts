import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import Profile, { ProfileProcessed } from "../../models/profile.ts";

export default function useFetchProfiles(fixtureSelection: number) {
  const fetchProfiles = async () => {
    const query = new Profile(db);
    return await query.getByFixtureId(fixtureSelection);
  };

  return useFetchData<ProfileProcessed>(fetchProfiles, [fixtureSelection]);
}
