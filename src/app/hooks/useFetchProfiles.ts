import useFetchData from "./useFetchData.ts";
import { db } from "../../db/client.ts";
import Profile, { ProfileProcessed } from "../../models/profile.ts";

export default function useFetchProfiles(fixtureSelection: number | null) {
  const fetchProfiles = async () => {
    if (!fixtureSelection) return [];
    const query = new Profile(db);
    return await query.getByFixtureId(fixtureSelection);
  };

  return useFetchData<ProfileProcessed>(fetchProfiles, [fixtureSelection]);
}
